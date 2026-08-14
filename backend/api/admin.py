from django.contrib import admin
from .models import UserProfile, Address, Product, CartItem, WishlistItem, Order, OrderItem

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'display_name', 'points', 'tier', 'created_at')
    search_fields = ('user__username', 'user__email', 'display_name')

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'phone', 'city', 'pincode', 'is_default')
    search_fields = ('user__username', 'name', 'city', 'pincode')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'price', 'category', 'sub_category', 'rating', 'reviews')
    list_filter = ('category', 'sub_category')
    search_fields = ('title', 'perk')

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'price', 'quantity', 'updated_at')
    search_fields = ('user__username', 'title')

@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'product_id', 'created_at')
    search_fields = ('user__username', 'title')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'user', 'total_amount', 'status', 'payment_method', 'created_at')
    list_filter = ('status', 'payment_method')
    search_fields = ('order_number', 'user__username', 'shipping_name', 'shipping_phone')
    inlines = [OrderItemInline]
