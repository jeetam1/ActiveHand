from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserProfile, Address, Product, CartItem, WishlistItem, Order, OrderItem

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['display_name', 'points', 'tier', 'avatar', 'created_at']

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'name', 'phone', 'address', 'city', 'pincode', 'is_default', 'created_at']
        read_only_fields = ['id', 'created_at']

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_id', 'title', 'price', 'numeric_price', 'quantity', 'img']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    item_titles = serializers.SerializerMethodField()
    date_formatted = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'total_amount', 'numeric_total', 'status',
            'shipping_name', 'shipping_phone', 'shipping_address', 'shipping_city',
            'shipping_pincode', 'payment_method', 'points_earned', 'created_at',
            'date_formatted', 'items', 'item_titles'
        ]

    def get_item_titles(self, obj):
        return [item.title for item in obj.items.all()]

    def get_date_formatted(self, obj):
        return obj.created_at.strftime("%d %b %Y")

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    savedAddresses = AddressSerializer(source='addresses', many=True, read_only=True)
    orders = OrderSerializer(many=True, read_only=True)
    name = serializers.SerializerMethodField()
    points = serializers.SerializerMethodField()
    tier = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    joinedDate = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'points', 'tier', 'avatar', 'joinedDate', 'profile', 'savedAddresses', 'orders']

    def get_name(self, obj):
        if hasattr(obj, 'profile') and obj.profile.display_name:
            return obj.profile.display_name
        return obj.first_name or obj.username

    def get_points(self, obj):
        return obj.profile.points if hasattr(obj, 'profile') else 50

    def get_tier(self, obj):
        return obj.profile.tier if hasattr(obj, 'profile') else 'Junior Maker 🌱'

    def get_avatar(self, obj):
        return obj.profile.avatar if hasattr(obj, 'profile') else '/assets/4.png'

    def get_joinedDate(self, obj):
        return obj.date_joined.strftime("%B %Y")

class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=4)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists() or User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def create(self, validated_data):
        email = validated_data['email']
        name = validated_data['name']
        username = email.lower()
        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data['password'],
            first_name=name
        )
        if hasattr(user, 'profile'):
            user.profile.display_name = name
            user.profile.points = 50
            user.profile.tier = 'Junior Maker 🌱'
            user.profile.avatar = '/assets/9.png'
            user.profile.save()
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email_or_username = data.get('email')
        password = data.get('password')

        # Find user by email or username
        user = None
        if '@' in email_or_username:
            user_obj = User.objects.filter(email__iexact=email_or_username).first()
            if user_obj:
                user = authenticate(username=user_obj.username, password=password)
        else:
            user = authenticate(username=email_or_username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password.")
        data['user'] = user
        return data

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['id', 'product_id', 'title', 'price', 'numeric_price', 'img', 'url', 'quantity', 'updated_at']
        read_only_fields = ['id', 'updated_at']

class WishlistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WishlistItem
        fields = ['id', 'product_id', 'title', 'price', 'img', 'category', 'created_at']
        read_only_fields = ['id', 'created_at']
