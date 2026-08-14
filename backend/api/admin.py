from django.contrib import admin
from django.utils.html import format_html
from django.contrib import messages
from django.db.models import Sum
from .models import UserProfile, Address, Product, CartItem, WishlistItem, Order, OrderItem

class ActiveHandAdminSite(admin.AdminSite):
    site_header = "ActiveHand 🎨 Craft Studio Console"
    site_title = "ActiveHand Admin"
    index_title = "Store Operations & Live Dispatch Console"

    def index(self, request, extra_context=None):
        from django.contrib.auth.models import User
        total_orders = Order.objects.count()
        total_revenue = Order.objects.aggregate(total=Sum('numeric_total'))['total'] or 0.0
        pending_orders = Order.objects.exclude(status='Delivered').count()
        total_products = Product.objects.count()
        total_makers = User.objects.count()
        recent_orders = Order.objects.order_by('-created_at')[:6]

        metrics = {
            'total_orders': total_orders,
            'total_revenue': f"₹{total_revenue:,.2f}",
            'pending_orders': pending_orders,
            'total_products': total_products,
            'total_makers': total_makers,
            'recent_orders': recent_orders,
        }

        extra_context = extra_context or {}
        extra_context['metrics'] = metrics
        return super().index(request, extra_context=extra_context)

# Instantiate the custom admin site
admin_site = ActiveHandAdminSite(name='activehand_admin')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_preview', 'title', 'price', 'quantity', 'subtotal')
    fields = ('product_preview', 'title', 'price', 'quantity', 'subtotal')
    can_delete = False

    def product_preview(self, obj):
        if obj.img:
            return format_html(
                '<img src="{}" style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover; border: 1.5px solid #CBD5E0;" />',
                obj.img
            )
        return "📦"
    product_preview.short_description = "Kit Photo"

    def subtotal(self, obj):
        amt = (obj.numeric_price or 0.0) * obj.quantity
        return format_html('<strong style="color:#00676A;">₹{:,.2f}</strong>', amt)
    subtotal.short_description = "Subtotal"

@admin.register(Order, site=admin_site)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'order_badge',
        'status_pill',
        'customer_info',
        'items_count',
        'formatted_total',
        'payment_pill',
        'formatted_date',
        'quick_actions'
    )
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('order_number', 'shipping_name', 'shipping_phone', 'shipping_city', 'shipping_pincode', 'user__email')
    readonly_fields = ('order_number', 'created_at', 'points_earned', 'whatsapp_direct_link', 'google_maps_link')
    inlines = [OrderItemInline]
    actions = ['mark_delivered', 'mark_in_transit', 'mark_processing', 'mark_confirmed']
    list_per_page = 20

    fieldsets = (
        ("📦 Order & Payment Summary", {
            'fields': ('order_number', 'status', 'total_amount', 'numeric_total', 'payment_method', 'points_earned', 'created_at')
        }),
        ("📍 Customer & Delivery Dispatch Details", {
            'fields': (
                'user',
                'shipping_name',
                'shipping_phone',
                'whatsapp_direct_link',
                'shipping_address',
                'shipping_city',
                'shipping_pincode',
                'google_maps_link'
            )
        }),
    )

    def order_badge(self, obj):
        return format_html(
            '<strong style="font-family: \'Outfit\', sans-serif; font-size: 1.05rem; color: #00676A;">#{}</strong>',
            obj.order_number
        )
    order_badge.short_description = "Order ID"

    def status_pill(self, obj):
        st = obj.status or 'Confirmed ✅'
        if 'Delivered' in st:
            css_class = 'badge-delivered'
        elif 'Transit' in st:
            css_class = 'badge-transit'
        elif 'Processing' in st:
            css_class = 'badge-processing'
        else:
            css_class = 'badge-confirmed'
        return format_html('<span class="badge-status {}">{}</span>', css_class, st)
    status_pill.short_description = "Order Status"

    def customer_info(self, obj):
        clean_phone = obj.shipping_phone.replace(' ', '').replace('+', '').replace('-', '')
        return format_html(
            '<div>'
            '<strong>{}</strong><br/>'
            '<span style="color:#718096; font-size:0.85rem;">📞 {}</span> '
            '<a href="https://wa.me/{}" target="_blank" style="color:#25D366; font-weight:700; text-decoration:none; margin-left:4px;" title="Chat on WhatsApp">💬</a>'
            '<br/><span style="color:#4A5568; font-size:0.85rem;">📍 {}, {}</span>'
            '</div>',
            obj.shipping_name,
            obj.shipping_phone,
            clean_phone,
            obj.shipping_city,
            obj.shipping_pincode
        )
    customer_info.short_description = "Customer Details"

    def items_count(self, obj):
        count = obj.items.count()
        return format_html('<span style="font-weight:700; color:#2D3748;">{} Kit(s)</span>', count)
    items_count.short_description = "Items"

    def formatted_total(self, obj):
        return format_html(
            '<strong style="color:#ED612B; font-size:1.1rem; font-family:\'Outfit\', sans-serif;">{}</strong>',
            obj.total_amount
        )
    formatted_total.short_description = "Total Amount"

    def payment_pill(self, obj):
        pm = obj.payment_method.upper()
        return format_html('<span class="badge-pay">{}</span>', pm)
    payment_pill.short_description = "Payment"

    def formatted_date(self, obj):
        return obj.created_at.strftime("%d %b %Y, %I:%M %p")
    formatted_date.short_description = "Ordered At"

    def quick_actions(self, obj):
        return format_html(
            '<a class="button" href="/admin/api/order/{}/change/" style="padding: 4px 10px; font-size: 0.8rem; background: #00676A !important; color:#FFF; text-decoration:none; border-radius:6px;">View 👁️</a>',
            obj.id
        )
    quick_actions.short_description = "Action"

    def whatsapp_direct_link(self, obj):
        clean_phone = obj.shipping_phone.replace(' ', '').replace('+', '').replace('-', '')
        return format_html(
            '<a href="https://wa.me/{}" target="_blank" style="background:#25D366; color:#FFF; padding:6px 14px; border-radius:8px; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">'
            '💬 Open Customer WhatsApp Chat ({})</a>',
            clean_phone,
            obj.shipping_phone
        )
    whatsapp_direct_link.short_description = "WhatsApp Instant Chat"

    def google_maps_link(self, obj):
        full_query = f"{obj.shipping_address}, {obj.shipping_city}, {obj.shipping_pincode}"
        import urllib.parse
        encoded = urllib.parse.quote(full_query)
        return format_html(
            '<a href="https://www.google.com/maps/search/?api=1&query={}" target="_blank" style="background:#4285F4; color:#FFF; padding:6px 14px; border-radius:8px; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">'
            '🗺️ Open Address on Google Maps</a>',
            encoded
        )
    google_maps_link.short_description = "Delivery Navigation"

    # Custom Admin Actions
    @admin.action(description="🚚 Mark selected orders as In Transit")
    def mark_in_transit(self, request, queryset):
        count = queryset.update(status='In Transit 🚚')
        self.message_user(request, f"Updated {count} order(s) to 'In Transit 🚚'", messages.SUCCESS)

    @admin.action(description="✅ Mark selected orders as Delivered")
    def mark_delivered(self, request, queryset):
        count = queryset.update(status='Delivered')
        self.message_user(request, f"Updated {count} order(s) to 'Delivered'", messages.SUCCESS)

    @admin.action(description="📦 Mark selected orders as Processing")
    def mark_processing(self, request, queryset):
        count = queryset.update(status='Processing 📦')
        self.message_user(request, f"Updated {count} order(s) to 'Processing 📦'", messages.SUCCESS)

    @admin.action(description="🎉 Mark selected orders as Confirmed")
    def mark_confirmed(self, request, queryset):
        count = queryset.update(status='Confirmed ✅')
        self.message_user(request, f"Updated {count} order(s) to 'Confirmed ✅'", messages.SUCCESS)

@admin.register(Product, site=admin_site)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('image_thumbnail', 'title', 'formatted_price', 'category_tag', 'rating_stars', 'reviews_display')
    list_filter = ('category', 'sub_category')
    search_fields = ('title', 'perk', 'tag')
    list_per_page = 20

    def image_thumbnail(self, obj):
        if obj.img:
            return format_html(
                '<img src="{}" style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover; border: 1.5px solid #CBD5E0;" />',
                obj.img
            )
        return "🖼️"
    image_thumbnail.short_description = "Image"

    def formatted_price(self, obj):
        return format_html('<strong style="color:#00676A; font-size:1rem;">{}</strong>', obj.price)
    formatted_price.short_description = "Price"

    def category_tag(self, obj):
        return format_html(
            '<span style="background:#FFF0EB; color:#ED612B; padding:3px 8px; border-radius:12px; font-weight:700; font-size:0.8rem;">{} / {}</span>',
            obj.category.upper(),
            obj.sub_category.capitalize()
        )
    category_tag.short_description = "Category"

    def rating_stars(self, obj):
        return format_html('⭐ <strong>{}</strong>', obj.rating)
    rating_stars.short_description = "Rating"

    def reviews_display(self, obj):
        return f"{obj.reviews} reviews"
    reviews_display.short_description = "Reviews"

@admin.register(UserProfile, site=admin_site)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('avatar_preview', 'user_email', 'display_name', 'points_badge', 'tier_pill', 'created_at')
    search_fields = ('user__username', 'user__email', 'display_name')

    def avatar_preview(self, obj):
        if obj.avatar:
            return format_html(
                '<img src="{}" style="width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid #00676A;" />',
                obj.avatar
            )
        return "👤"
    avatar_preview.short_description = "Avatar"

    def user_email(self, obj):
        return obj.user.email or obj.user.username
    user_email.short_description = "User Account"

    def points_badge(self, obj):
        return format_html(
            '<span style="background:#FFF3E0; color:#E65100; font-weight:800; padding:3px 10px; border-radius:12px;">🌟 {} Pts</span>',
            obj.points
        )
    points_badge.short_description = "Maker Points"

    def tier_pill(self, obj):
        return format_html(
            '<span style="background:#E0F2F1; color:#00695C; font-weight:700; padding:3px 8px; border-radius:8px;">{}</span>',
            obj.tier
        )
    tier_pill.short_description = "Tier"

@admin.register(Address, site=admin_site)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'phone', 'formatted_address', 'city', 'pincode', 'is_default')
    list_filter = ('city', 'is_default')
    search_fields = ('user__username', 'name', 'phone', 'address', 'city', 'pincode')

    def formatted_address(self, obj):
        return obj.address[:50] + ("..." if len(obj.address) > 50 else "")
    formatted_address.short_description = "Street Address"

@admin.register(CartItem, site=admin_site)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'price', 'quantity', 'updated_at')
    list_filter = ('updated_at',)
    search_fields = ('user__username', 'user__email', 'title')

@admin.register(WishlistItem, site=admin_site)
class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'product_id', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'user__email', 'title')

# Also register standard User and Group models for user management
from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import UserAdmin, GroupAdmin
admin_site.register(User, UserAdmin)
admin_site.register(Group, GroupAdmin)
