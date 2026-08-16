from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserProfile, Address, Product, CartItem, WishlistItem, Order, OrderItem, PasswordResetCode

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
            'shipping_pincode', 'payment_method', 'razorpay_order_id', 'razorpay_payment_id',
            'points_earned', 'created_at', 'date_formatted', 'items', 'item_titles'
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
        email_or_username = data.get('email', '').strip()
        password = data.get('password', '')

        if not email_or_username or not password:
            raise serializers.ValidationError("Email and password are required.")

        # Fast lookup with prefetching profile, addresses and orders
        user_obj = User.objects.filter(username__iexact=email_or_username).select_related('profile').prefetch_related('addresses', 'orders__items').first()
        if not user_obj and '@' in email_or_username:
            user_obj = User.objects.filter(email__iexact=email_or_username).select_related('profile').prefetch_related('addresses', 'orders__items').first()

        if not user_obj:
            raise serializers.ValidationError("No account found with this email. Please create an account first.")

        if not user_obj.check_password(password):
            raise serializers.ValidationError("Incorrect password. Please try again.")

        data['user'] = user_obj
        return data

class GoogleAuthSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False, allow_blank=True, default='')
    name = serializers.CharField(max_length=150, required=False, allow_blank=True, default='')
    avatar = serializers.CharField(max_length=500, required=False, allow_blank=True, default='')
    google_id = serializers.CharField(max_length=255, required=False, allow_blank=True, default='')
    credential = serializers.CharField(required=False, allow_blank=True, default='')

    def validate(self, data):
        if not data.get('email') and not data.get('credential'):
            raise serializers.ValidationError("Either email or Google credential token is required.")
        if data.get('email'):
            data['email'] = data['email'].strip().lower()
        return data

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        email = value.strip().lower()
        user = User.objects.filter(email__iexact=email).first() or User.objects.filter(username__iexact=email).first()
        if not user:
            raise serializers.ValidationError("No account found with this email. Please create an account first.")
        return email

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=10)
    new_password = serializers.CharField(write_only=True, min_length=4)

    def validate(self, data):
        email = data.get('email', '').strip().lower()
        code = data.get('code', '').strip()
        new_password = data.get('new_password', '')

        user = User.objects.filter(email__iexact=email).first() or User.objects.filter(username__iexact=email).first()
        if not user:
            raise serializers.ValidationError("No account found with this email. Please create an account first.")

        reset_code_obj = PasswordResetCode.objects.filter(user=user, code=code, is_used=False).order_by('-created_at').first()
        if not reset_code_obj or not reset_code_obj.is_valid():
            raise serializers.ValidationError("Invalid or expired reset code. Please request a new one.")

        data['user'] = user
        data['reset_code_obj'] = reset_code_obj
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
