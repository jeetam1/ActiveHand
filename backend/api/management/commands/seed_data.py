from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from api.models import UserProfile, Address, Product, Order, OrderItem, CartItem, WishlistItem

class Command(BaseCommand):
    help = 'Seeds initial products, demo user, orders, and addresses into PostgreSQL (Supabase).'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('Starting Supabase database seeding...'))

        # 1. Create or get Demo User
        demo_email = 'artlover@activehands.com'
        demo_password = 'password123'
        user, created = User.objects.get_or_create(
            username=demo_email,
            defaults={
                'email': demo_email,
                'first_name': 'Art Lover',
            }
        )
        user.set_password(demo_password)
        user.save()

        # Update profile
        if hasattr(user, 'profile'):
            user.profile.display_name = 'Art Lover'
            user.profile.points = 120
            user.profile.tier = 'Master Crafter ⭐'
            user.profile.avatar = '/assets/4.png'
            user.profile.save()

        token, _ = Token.objects.get_or_create(user=user)
        self.stdout.write(self.style.SUCCESS(f"Demo user ready: {demo_email} (Token: {token.key})"))

        # 2. Seed User Saved Address
        Address.objects.get_or_create(
            user=user,
            pincode='560034',
            defaults={
                'name': 'Art Lover',
                'phone': '+91 98765 43210',
                'address': '42, Craft Lane, Green Park',
                'city': 'Bengaluru',
                'is_default': True
            }
        )

        # 3. Seed Products Catalog
        products_data = [
            {
                "id": 1,
                "category": "popular",
                "sub_category": "mosaic",
                "title": "Mosaic Art Tray Kit",
                "price": "₹899.00",
                "numeric_price": 899.0,
                "url": "https://rzp.io/l/B8kcvpZv",
                "img": "/assets/b1.avif",
                "tag": "⭐ BESTSELLER",
                "tag_color": "orange",
                "tape_color": "orange",
                "rating": "4.9",
                "reviews": 142,
                "perk": "Includes wooden base & colorful tiles"
            },
            {
                "id": 2,
                "category": "popular",
                "sub_category": "paper",
                "title": "Book Binding DIY Kit",
                "price": "₹799.00",
                "numeric_price": 799.0,
                "url": "https://rzp.io/l/MZMgvJT",
                "img": "/assets/b2.avif",
                "tag": "📚 CLASSIC CRAFT",
                "tag_color": "blue",
                "tape_color": "yellow",
                "rating": "4.8",
                "reviews": 98,
                "perk": "Traditional Japanese stitch binding"
            },
            {
                "id": 3,
                "category": "popular",
                "sub_category": "traditional",
                "title": "Block Printing DIY Kit",
                "price": "₹1099.00",
                "numeric_price": 1099.0,
                "url": "https://rzp.io/l/vpyraESL",
                "img": "/assets/b3.avif",
                "tag": "🎨 HERITAGE ART",
                "tag_color": "green",
                "tape_color": "blue",
                "rating": "5.0",
                "reviews": 215,
                "perk": "Authentic Sheesham wooden blocks"
            },
            {
                "id": 4,
                "category": "popular",
                "sub_category": "paper",
                "title": "Hand-made Paper Making DIY Kit",
                "price": "₹899.00",
                "numeric_price": 899.0,
                "url": "https://rzp.io/l/YP2hIiawf",
                "img": "/assets/b4.avif",
                "tag": "🌿 ECO-FRIENDLY",
                "tag_color": "green",
                "tape_color": "green",
                "rating": "4.9",
                "reviews": 180,
                "perk": "Make deckle edge seed paper at home"
            },
            {
                "id": 5,
                "category": "popular",
                "sub_category": "traditional",
                "title": "Weaving Loom DIY Kit",
                "price": "₹899.00",
                "numeric_price": 899.0,
                "url": "https://rzp.io/l/sqT408WeA",
                "img": "/assets/b5.avif",
                "tag": "🧶 HANDS-ON FUN",
                "tag_color": "orange",
                "tape_color": "orange",
                "rating": "4.8",
                "reviews": 110,
                "perk": "Wooden frame & vibrant wool yarn"
            },
            {
                "id": 6,
                "category": "popular",
                "sub_category": "nature",
                "title": "Dried Press Flower Kit",
                "price": "₹699.00",
                "numeric_price": 699.0,
                "url": "https://rzp.io/l/7pvBCVAs",
                "img": "/assets/b6.avif",
                "tag": "🌸 BOTANICAL",
                "tag_color": "pink",
                "tape_color": "yellow",
                "rating": "4.9",
                "reviews": 87,
                "perk": "Wooden press with straps & blotting sheets"
            },
            {
                "id": 7,
                "category": "popular",
                "sub_category": "sculpt",
                "title": "Paper Mache Clay DIY Kit",
                "price": "₹699.00",
                "numeric_price": 699.0,
                "url": "https://rzp.io/l/7pvBCVAs",
                "img": "/assets/b7.avif",
                "tag": "✨ SENSORY PLAY",
                "tag_color": "purple",
                "tape_color": "blue",
                "rating": "4.7",
                "reviews": 64,
                "perk": "Air-dry non-toxic clay powder"
            },
            {
                "id": 8,
                "category": "popular",
                "sub_category": "nature",
                "title": "Natural Soap Making Kit",
                "price": "₹699.00",
                "numeric_price": 699.0,
                "url": "https://rzp.io/l/7pvBCVAs",
                "img": "/assets/b8.avif",
                "tag": "🧼 100% ORGANIC",
                "tag_color": "green",
                "tape_color": "green",
                "rating": "4.9",
                "reviews": 156,
                "perk": "Pure melt & pour base with essential oils"
            },
            {
                "id": 9,
                "category": "popular",
                "sub_category": "paper",
                "title": "Paper Décor Making Kit",
                "price": "₹699.00",
                "numeric_price": 699.0,
                "url": "https://rzp.io/l/7pvBCVAs",
                "img": "/assets/b9.avif",
                "tag": "✂️ FESTIVE CRAFT",
                "tag_color": "orange",
                "tape_color": "orange",
                "rating": "4.8",
                "reviews": 92,
                "perk": "Pre-cut origami & 3D hanging templates"
            },
            {
                "id": 10,
                "category": "intermediate",
                "sub_category": "traditional",
                "title": "Indigo Shibori Dyeing DIY Kit",
                "price": "₹949.00",
                "numeric_price": 949.0,
                "url": "https://rzp.io/l/B8kcvpZv",
                "img": "/assets/b10.jpg",
                "tag": "🌊 JAPANESE RESIST",
                "tag_color": "blue",
                "tape_color": "blue",
                "rating": "5.0",
                "reviews": 73,
                "perk": "Authentic indigo vat dye & wood clamp blocks"
            },
            {
                "id": 11,
                "category": "intermediate",
                "sub_category": "traditional",
                "title": "Natural Dye Bag: Manjistha",
                "price": "₹799.00",
                "numeric_price": 799.0,
                "url": "https://rzp.io/l/MZMgvJT",
                "img": "/assets/b2.avif",
                "tag": "🍁 PLANT DYES",
                "tag_color": "orange",
                "tape_color": "yellow",
                "rating": "4.8",
                "reviews": 58,
                "perk": "Pure Indian Madder root herbal dye & tote"
            },
            {
                "id": 12,
                "category": "intermediate",
                "sub_category": "traditional",
                "title": "Bead Loom DIY Kit",
                "price": "₹899.00",
                "numeric_price": 899.0,
                "url": "https://rzp.io/l/sqT408WeA",
                "img": "/assets/b5.avif",
                "tag": "💎 PRECISION WEAVE",
                "tag_color": "purple",
                "tape_color": "green",
                "rating": "4.9",
                "reviews": 84,
                "perk": "Sturdy loom, glass seed beads & thread"
            },
            {
                "id": 13,
                "category": "intermediate",
                "sub_category": "paper",
                "title": "Origami Cloth Bags Kit",
                "price": "₹799.00",
                "numeric_price": 799.0,
                "url": "https://rzp.io/l/YP2hIiawf",
                "img": "/assets/b4.avif",
                "tag": "🎒 SEW & FOLD",
                "tag_color": "green",
                "tape_color": "orange",
                "rating": "4.7",
                "reviews": 49,
                "perk": "Fabric origami folding without complex stitching"
            }
        ]

        for p_data in products_data:
            p_id = p_data.pop("id")
            Product.objects.update_or_create(id=p_id, defaults=p_data)

        self.stdout.write(self.style.SUCCESS(f"Seeded {len(products_data)} products into database."))

        # 4. Seed Initial Orders for demo user if none exist
        if not Order.objects.filter(user=user).exists():
            ord1 = Order.objects.create(
                user=user,
                order_number='AH-84920',
                total_amount='₹899.00',
                numeric_total=899.0,
                status='Delivered',
                shipping_name='Art Lover',
                shipping_phone='+91 98765 43210',
                shipping_address='42, Craft Lane, Green Park',
                shipping_city='Bengaluru',
                shipping_pincode='560034',
                payment_method='upi',
                points_earned=50
            )
            OrderItem.objects.create(
                order=ord1,
                product_id=1,
                title='Mosaic Art Tray Kit',
                price='₹899.00',
                numeric_price=899.0,
                quantity=1,
                img='/assets/b1.avif'
            )

            ord2 = Order.objects.create(
                user=user,
                order_number='AH-71829',
                total_amount='₹1,698.00',
                numeric_total=1698.0,
                status='In Transit 🚚',
                shipping_name='Art Lover',
                shipping_phone='+91 98765 43210',
                shipping_address='42, Craft Lane, Green Park',
                shipping_city='Bengaluru',
                shipping_pincode='560034',
                payment_method='card',
                points_earned=50
            )
            OrderItem.objects.create(
                order=ord2,
                product_id=2,
                title='Book Binding DIY Kit',
                price='₹799.00',
                numeric_price=799.0,
                quantity=1,
                img='/assets/b2.avif'
            )
            OrderItem.objects.create(
                order=ord2,
                product_id=5,
                title='Weaving Loom DIY Kit',
                price='₹899.00',
                numeric_price=899.0,
                quantity=1,
                img='/assets/b5.avif'
            )
            self.stdout.write(self.style.SUCCESS("Seeded demo orders."))

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
