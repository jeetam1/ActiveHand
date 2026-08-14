import random
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import UserProfile, Address, Product, CartItem, WishlistItem, Order, OrderItem
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    AddressSerializer, ProductSerializer, CartItemSerializer,
    WishlistItemSerializer, OrderSerializer
)

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            user_data = UserSerializer(user).data
            return Response({
                'token': token.key,
                'user': user_data,
                'message': 'Registration successful!'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            user_data = UserSerializer(user).data
            return Response({
                'token': token.key,
                'user': user_data,
                'message': 'Login successful!'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Exception:
            pass
        return Response({'message': 'Logged out successfully!'}, status=status.HTTP_200_OK)

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_data = UserSerializer(request.user).data
        return Response(user_data, status=status.HTTP_200_OK)

class ProductListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        category = request.query_params.get('category')
        if category and category != 'all':
            products = Product.objects.filter(category=category)
        else:
            products = Product.objects.all().order_by('id')
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CartListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        items = CartItem.objects.filter(user=request.user).order_by('-updated_at')
        serializer = CartItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AddToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id') or request.data.get('id')
        title = request.data.get('title', 'Craft Kit')
        price = str(request.data.get('price', '₹0.00'))
        numeric_price = float(request.data.get('numericPrice', 0.0) or 0.0)
        img = request.data.get('img', '')
        url = request.data.get('url', '')
        quantity = int(request.data.get('quantity', 1))

        if not product_id:
            return Response({'error': 'product_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        cart_item, created = CartItem.objects.get_or_create(
            user=request.user,
            product_id=product_id,
            defaults={
                'title': title,
                'price': price,
                'numeric_price': numeric_price,
                'img': img,
                'url': url,
                'quantity': quantity
            }
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        items = CartItem.objects.filter(user=request.user).order_by('-updated_at')
        serializer = CartItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UpdateCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, product_id):
        quantity = int(request.data.get('quantity', 1))
        try:
            cart_item = CartItem.objects.get(user=request.user, product_id=product_id)
            if quantity <= 0:
                cart_item.delete()
            else:
                cart_item.quantity = quantity
                cart_item.save()
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)

        items = CartItem.objects.filter(user=request.user).order_by('-updated_at')
        serializer = CartItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class RemoveCartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, product_id):
        CartItem.objects.filter(user=request.user, product_id=product_id).delete()
        items = CartItem.objects.filter(user=request.user).order_by('-updated_at')
        serializer = CartItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ClearCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        CartItem.objects.filter(user=request.user).delete()
        return Response({'message': 'Cart cleared', 'cart': []}, status=status.HTTP_200_OK)

class SyncCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        local_items = request.data.get('items', [])
        for item in local_items:
            product_id = item.get('id') or item.get('product_id')
            if not product_id:
                continue
            cart_item, created = CartItem.objects.get_or_create(
                user=request.user,
                product_id=product_id,
                defaults={
                    'title': item.get('title', 'Craft Kit'),
                    'price': str(item.get('price', '₹0.00')),
                    'numeric_price': float(item.get('numericPrice', 0.0) or 0.0),
                    'img': item.get('img', ''),
                    'url': item.get('url', ''),
                    'quantity': int(item.get('quantity', 1))
                }
            )
            if not created:
                # Merge quantities
                cart_item.quantity = max(cart_item.quantity, int(item.get('quantity', 1)))
                cart_item.save()

        items = CartItem.objects.filter(user=request.user).order_by('-updated_at')
        serializer = CartItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class WishlistListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        items = WishlistItem.objects.filter(user=request.user).order_by('-created_at')
        serializer = WishlistItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ToggleWishlistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id') or request.data.get('id')
        title = request.data.get('title', '')
        price = str(request.data.get('price', ''))
        img = request.data.get('img', '')
        category = request.data.get('category', '')

        if not product_id:
            return Response({'error': 'product_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        existing = WishlistItem.objects.filter(user=request.user, product_id=product_id).first()
        if existing:
            existing.delete()
            is_in_wishlist = False
        else:
            WishlistItem.objects.create(
                user=request.user,
                product_id=product_id,
                title=title,
                price=price,
                img=img,
                category=category
            )
            is_in_wishlist = True

        items = WishlistItem.objects.filter(user=request.user).order_by('-created_at')
        serializer = WishlistItemSerializer(items, many=True)
        return Response({
            'is_in_wishlist': is_in_wishlist,
            'wishlist': serializer.data
        }, status=status.HTTP_200_OK)

class OrderListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CreateOrderView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user = request.user if request.user.is_authenticated else None
        data = request.data

        order_number = f"AH-{random.randint(10000, 99999)}"
        total_amount = data.get('total_amount', '₹0.00')
        numeric_total = float(data.get('numeric_total', 0.0) or 0.0)
        shipping_name = data.get('name', '')
        shipping_phone = data.get('phone', '')
        shipping_address = data.get('address', '')
        shipping_city = data.get('city', '')
        shipping_pincode = data.get('pincode', '')
        payment_method = data.get('payment_method', 'upi')
        items = data.get('items', [])

        order = Order.objects.create(
            user=user,
            order_number=order_number,
            total_amount=total_amount,
            numeric_total=numeric_total,
            status='Confirmed ✅',
            shipping_name=shipping_name,
            shipping_phone=shipping_phone,
            shipping_address=shipping_address,
            shipping_city=shipping_city,
            shipping_pincode=shipping_pincode,
            payment_method=payment_method,
            points_earned=50
        )

        for item in items:
            if isinstance(item, dict):
                p_id = item.get('id') or item.get('product_id')
                p_title = item.get('title', 'DIY Kit')
                p_price = str(item.get('price', '₹0.00'))
                p_numeric = float(item.get('numericPrice', 0.0) or 0.0)
                p_qty = int(item.get('quantity', 1))
                p_img = item.get('img', '')
            else:
                p_id = None
                p_title = str(item)
                p_price = '₹0.00'
                p_numeric = 0.0
                p_qty = 1
                p_img = ''

            OrderItem.objects.create(
                order=order,
                product_id=p_id,
                title=p_title,
                price=p_price,
                numeric_price=p_numeric,
                quantity=p_qty,
                img=p_img
            )

        # Update user profile Maker Points & Tier and Address if authenticated
        if user:
            # Clear user's DB cart
            CartItem.objects.filter(user=user).delete()

            # Save address if not already present
            if shipping_address and shipping_pincode:
                addr_exists = Address.objects.filter(user=user, pincode=shipping_pincode, address=shipping_address).exists()
                if not addr_exists:
                    # Set previous default to False if this is marked default
                    Address.objects.create(
                        user=user,
                        name=shipping_name or user.first_name or user.username,
                        phone=shipping_phone,
                        address=shipping_address,
                        city=shipping_city,
                        pincode=shipping_pincode,
                        is_default=True
                    )

            if hasattr(user, 'profile'):
                user.profile.points += 50
                if user.profile.points >= 200:
                    user.profile.tier = 'Legendary Artisan 🏆'
                elif user.profile.points >= 100:
                    user.profile.tier = 'Master Crafter ⭐'
                user.profile.save()

        serializer = OrderSerializer(order)
        user_data = UserSerializer(user).data if user else None

        return Response({
            'order': serializer.data,
            'user': user_data,
            'message': 'Order placed successfully!'
        }, status=status.HTTP_201_CREATED)

class AddressListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        addresses = Address.objects.filter(user=request.user).order_by('-created_at')
        serializer = AddressSerializer(addresses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = AddressSerializer(data=request.data)
        if serializer.is_valid():
            if serializer.validated_data.get('is_default', False):
                Address.objects.filter(user=request.user).update(is_default=False)
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
