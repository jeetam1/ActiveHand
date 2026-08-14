from django.contrib import admin
from django.utils.html import format_html
from django.contrib import messages
from django.db.models import Sum
from .models import UserProfile, Address, Product, CartItem, WishlistItem, Order, OrderItem

class ActiveHandAdminSite(admin.AdminSite):
    site_header = "ActiveHand Administration"
    site_title = "ActiveHand Admin"
    index_title = "Dashboard"

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
                '<img src="{}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover; border: 1px solid #E2E8F0;" />',
                obj.img
            )
        return "-"
    product_preview.short_description = "Image"

    def subtotal(self, obj):
        amt = (obj.numeric_price or 0.0) * obj.quantity
        return f"₹{amt:,.2f}"
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
        ("Order Summary", {
            'fields': ('order_number', 'status', 'total_amount', 'numeric_total', 'payment_method', 'points_earned', 'created_at')
        }),
        ("Customer & Shipping Details", {
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
        return format_html('<strong>#{}</strong>', obj.order_number)
    order_badge.short_description = "Order ID"

    def status_pill(self, obj):
        st = obj.status or 'Confirmed'
        if 'Delivered' in st:
            css_class = 'badge-delivered'
        elif 'Transit' in st:
            css_class = 'badge-transit'
        elif 'Processing' in st:
            css_class = 'badge-processing'
        else:
            css_class = 'badge-confirmed'
        return format_html('<span class="badge-status {}">{}</span>', css_class, st)
    status_pill.short_description = "Status"

    def customer_info(self, obj):
        clean_phone = obj.shipping_phone.replace(' ', '').replace('+', '').replace('-', '')
        return format_html(
            '<div>'
            '<div style="font-weight:600; color:#0F172A;">{}</div>'
            '<div style="font-size:0.8rem; color:#64748B;">{} &bull; {}, {}</div>'
            '</div>',
            obj.shipping_name,
            obj.shipping_phone,
            obj.shipping_city,
            obj.shipping_pincode
        )
    customer_info.short_description = "Customer"

    def items_count(self, obj):
        count = obj.items.count()
        return f"{count} item{'s' if count != 1 else ''}"
    items_count.short_description = "Items"

    def formatted_total(self, obj):
        return format_html('<strong>{}</strong>', obj.total_amount)
    formatted_total.short_description = "Total"

    def payment_pill(self, obj):
        pm = obj.payment_method.upper()
        return format_html('<span class="badge-pay">{}</span>', pm)
    payment_pill.short_description = "Payment"

    def formatted_date(self, obj):
        return obj.created_at.strftime("%d %b %Y, %I:%M %p")
    formatted_date.short_description = "Date"

    def quick_actions(self, obj):
        return format_html(
            '<a href="/admin/api/order/{}/change/" style="color:#2563EB; font-weight:500; text-decoration:none; font-size:0.85rem;">View &rarr;</a>',
            obj.id
        )
    quick_actions.short_description = "Action"

    def whatsapp_direct_link(self, obj):
        clean_phone = obj.shipping_phone.replace(' ', '').replace('+', '').replace('-', '')
        return format_html(
            '<a href="https://wa.me/{}" target="_blank" style="display:inline-block; padding:5px 12px; background:#10B981; color:#FFFFFF; border-radius:6px; font-weight:500; font-size:0.85rem; text-decoration:none;">'
            'Chat on WhatsApp ({})</a>',
            clean_phone,
            obj.shipping_phone
        )
    whatsapp_direct_link.short_description = "WhatsApp"

    def google_maps_link(self, obj):
        full_query = f"{obj.shipping_address}, {obj.shipping_city}, {obj.shipping_pincode}"
        import urllib.parse
        encoded = urllib.parse.quote(full_query)
        return format_html(
            '<a href="https://www.google.com/maps/search/?api=1&query={}" target="_blank" style="display:inline-block; padding:5px 12px; background:#2563EB; color:#FFFFFF; border-radius:6px; font-weight:500; font-size:0.85rem; text-decoration:none;">'
            'View on Google Maps</a>',
            encoded
        )
    google_maps_link.short_description = "Maps Navigation"

    # Custom Admin Actions
    @admin.action(description="Mark selected orders as In Transit")
    def mark_in_transit(self, request, queryset):
        count = queryset.update(status='In Transit 🚚')
        self.message_user(request, f"Updated {count} order(s) to 'In Transit'", messages.SUCCESS)

    @admin.action(description="Mark selected orders as Delivered")
    def mark_delivered(self, request, queryset):
        count = queryset.update(status='Delivered')
        self.message_user(request, f"Updated {count} order(s) to 'Delivered'", messages.SUCCESS)

    @admin.action(description="Mark selected orders as Processing")
    def mark_processing(self, request, queryset):
        count = queryset.update(status='Processing 📦')
        self.message_user(request, f"Updated {count} order(s) to 'Processing'", messages.SUCCESS)

    @admin.action(description="Mark selected orders as Confirmed")
    def mark_confirmed(self, request, queryset):
        count = queryset.update(status='Confirmed ✅')
        self.message_user(request, f"Updated {count} order(s) to 'Confirmed'", messages.SUCCESS)

@admin.register(Product, site=admin_site)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('image_thumbnail', 'title', 'price', 'category_display', 'rating_display', 'reviews')
    list_filter = ('category', 'sub_category')
    search_fields = ('title', 'perk', 'tag')
    list_per_page = 20

    def image_thumbnail(self, obj):
        if obj.img:
            return format_html(
                '<img src="{}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover; border: 1px solid #E2E8F0;" />',
                obj.img
            )
        return "-"
    image_thumbnail.short_description = "Image"

    def category_display(self, obj):
        return f"{obj.category.capitalize()} ({obj.sub_category})"
    category_display.short_description = "Category"

    def rating_display(self, obj):
        return f"★ {obj.rating}"
    rating_display.short_description = "Rating"

@admin.register(UserProfile, site=admin_site)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'display_name', 'points', 'tier', 'created_at')
    search_fields = ('user__username', 'user__email', 'display_name')

    def user_email(self, obj):
        return obj.user.email or obj.user.username
    user_email.short_description = "Email / User"

@admin.register(Address, site=admin_site)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'phone', 'formatted_address', 'city', 'pincode', 'is_default')
    list_filter = ('city', 'is_default')
    search_fields = ('user__username', 'name', 'phone', 'address', 'city', 'pincode')

    def formatted_address(self, obj):
        return obj.address[:45] + ("..." if len(obj.address) > 45 else "")
    formatted_address.short_description = "Address"

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

from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import UserAdmin, GroupAdmin
admin_site.register(User, UserAdmin)
admin_site.register(Group, GroupAdmin)
