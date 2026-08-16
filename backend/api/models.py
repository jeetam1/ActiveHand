from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    display_name = models.CharField(max_length=150, blank=True)
    points = models.IntegerField(default=50)
    tier = models.CharField(max_length=100, default='Junior Maker 🌱')
    avatar = models.CharField(max_length=255, default='/assets/4.png')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} Profile ({self.points} pts)"

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(
            user=instance,
            display_name=instance.first_name or instance.username
        )
    else:
        if hasattr(instance, 'profile'):
            instance.profile.save()

class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20)
    address = models.TextField()
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=20)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.city} ({self.pincode})"

class Product(models.Model):
    title = models.CharField(max_length=255)
    price = models.CharField(max_length=50)
    numeric_price = models.FloatField(default=0.0)
    category = models.CharField(max_length=100, default='popular')
    sub_category = models.CharField(max_length=100, default='traditional')
    img = models.CharField(max_length=255, default='/assets/b1.avif')
    url = models.CharField(max_length=255, blank=True, default='')
    tag = models.CharField(max_length=100, blank=True, default='')
    tag_color = models.CharField(max_length=50, blank=True, default='orange')
    tape_color = models.CharField(max_length=50, blank=True, default='orange')
    rating = models.CharField(max_length=20, default='4.9')
    reviews = models.IntegerField(default=100)
    perk = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    product_id = models.IntegerField()
    title = models.CharField(max_length=255)
    price = models.CharField(max_length=50)
    numeric_price = models.FloatField(default=0.0)
    img = models.CharField(max_length=255, blank=True, default='')
    url = models.CharField(max_length=255, blank=True, default='')
    quantity = models.IntegerField(default=1)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'product_id')

    def __str__(self):
        return f"{self.user.username} - {self.title} x {self.quantity}"

class WishlistItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist_items')
    product_id = models.IntegerField()
    title = models.CharField(max_length=255, blank=True, default='')
    price = models.CharField(max_length=50, blank=True, default='')
    img = models.CharField(max_length=255, blank=True, default='')
    category = models.CharField(max_length=100, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product_id')

    def __str__(self):
        return f"{self.user.username} likes {self.title or self.product_id}"

class Order(models.Model):
    STATUS_CHOICES = [
        ('Delivered', 'Delivered'),
        ('In Transit 🚚', 'In Transit 🚚'),
        ('Processing 📦', 'Processing 📦'),
        ('Confirmed ✅', 'Confirmed ✅'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    order_number = models.CharField(max_length=50, unique=True)
    total_amount = models.CharField(max_length=50)
    numeric_total = models.FloatField(default=0.0)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Confirmed ✅')
    shipping_name = models.CharField(max_length=150)
    shipping_phone = models.CharField(max_length=50)
    shipping_address = models.TextField()
    shipping_city = models.CharField(max_length=100)
    shipping_pincode = models.CharField(max_length=20)
    payment_method = models.CharField(max_length=50, default='upi')
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)
    points_earned = models.IntegerField(default=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.order_number} ({self.total_amount})"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product_id = models.IntegerField(null=True, blank=True)
    title = models.CharField(max_length=255)
    price = models.CharField(max_length=50)
    numeric_price = models.FloatField(default=0.0)
    quantity = models.IntegerField(default=1)
    img = models.CharField(max_length=255, blank=True, default='')

    def __str__(self):
        return f"{self.title} x {self.quantity}"

class PasswordResetCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reset_codes')
    code = models.CharField(max_length=10)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        from django.utils import timezone
        import datetime
        return not self.is_used and (timezone.now() - self.created_at) < datetime.timedelta(minutes=15)

    def __str__(self):
        return f"Reset code for {self.user.email} ({self.code})"
