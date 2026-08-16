import os
import logging
import requests
from django.core.mail import send_mail
from django.conf import settings

logger = logging.getLogger(__name__)

def send_order_notification(order, items=None):
    """
    Sends multi-channel notifications (Telegram Bot, Discord Webhook, Admin Email)
    whenever a customer places an order.
    """
    try:
        order_num = getattr(order, 'order_number', 'N/A')
        total = getattr(order, 'total_amount', '₹0.00')
        name = getattr(order, 'shipping_name', 'Customer')
        phone = getattr(order, 'shipping_phone', 'N/A')
        city = getattr(order, 'shipping_city', 'N/A')
        address = getattr(order, 'shipping_address', 'N/A')
        pincode = getattr(order, 'shipping_pincode', 'N/A')
        pay_method = getattr(order, 'payment_method', 'N/A')
        rzp_id = getattr(order, 'razorpay_payment_id', None)

        items_text = ""
        if items:
            for itm in items:
                if isinstance(itm, dict):
                    title = itm.get('title', 'DIY Kit')
                    qty = itm.get('quantity', 1)
                    price = itm.get('price', '')
                    items_text += f"\n  • {title} (x{qty}) - {price}"
                else:
                    items_text += f"\n  • {str(itm)}"
        elif hasattr(order, 'items'):
            for itm in order.items.all():
                items_text += f"\n  • {itm.title} (x{itm.quantity}) - {itm.price}"

        # ----------------------------------------------------
        # 1. TELEGRAM BOT NOTIFICATION (Recommended: 100% Free & Instant)
        # ----------------------------------------------------
        telegram_token = os.getenv('TELEGRAM_BOT_TOKEN')
        telegram_chat_id = os.getenv('TELEGRAM_CHAT_ID')

        if telegram_token and telegram_chat_id:
            payment_info = f"{pay_method}" + (f" (Payment ID: <code>{rzp_id}</code>)" if rzp_id else "")
            message = (
                f"🎉 <b>NEW ORDER RECEIVED!</b>\n\n"
                f"🆔 <b>Order ID:</b> #{order_num}\n"
                f"💰 <b>Total Amount:</b> {total}\n"
                f"💳 <b>Payment:</b> {payment_info}\n\n"
                f"👤 <b>Customer:</b> {name}\n"
                f"📞 <b>Phone:</b> {phone}\n"
                f"📍 <b>City:</b> {city} ({pincode})\n"
                f"🏠 <b>Address:</b> {address}\n\n"
                f"📦 <b>Items Ordered:</b>{items_text or ' DIY Kits'}\n\n"
                f"🌐 <i>ActiveHands Store Manager</i>"
            )
            try:
                requests.post(
                    f"https://api.telegram.org/bot{telegram_token}/sendMessage",
                    json={
                        "chat_id": telegram_chat_id,
                        "text": message,
                        "parse_mode": "HTML"
                    },
                    timeout=5
                )
            except Exception as e:
                logger.warning(f"Telegram notification error: {e}")

        # ----------------------------------------------------
        # 2. DISCORD WEBHOOK NOTIFICATION (Instant & Free)
        # ----------------------------------------------------
        discord_webhook = os.getenv('DISCORD_WEBHOOK_URL')
        if discord_webhook:
            try:
                embed = {
                    "title": f"🎉 New Order #{order_num} Received!",
                    "color": 41258,
                    "fields": [
                        {"name": "Total Amount", "value": str(total), "inline": True},
                        {"name": "Payment Method", "value": str(pay_method), "inline": True},
                        {"name": "Customer", "value": f"{name} ({phone})", "inline": False},
                        {"name": "Shipping Address", "value": f"{address}, {city} - {pincode}", "inline": False},
                        {"name": "Items", "value": items_text.strip() or "DIY Kits", "inline": False},
                    ],
                    "footer": {"text": "ActiveHands E-Commerce Notifications"}
                }
                requests.post(discord_webhook, json={"embeds": [embed]}, timeout=5)
            except Exception as e:
                logger.warning(f"Discord notification error: {e}")

        # ----------------------------------------------------
        # 3. ADMIN EMAIL NOTIFICATION
        # ----------------------------------------------------
        admin_email = os.getenv('ADMIN_NOTIFICATION_EMAIL')
        if admin_email and getattr(settings, 'EMAIL_HOST_USER', None):
            try:
                subject = f"🎉 New ActiveHands Order #{order_num} ({total})"
                body = (
                    f"Hello Admin,\n\n"
                    f"A new order #{order_num} has been placed!\n\n"
                    f"Total: {total}\n"
                    f"Payment: {pay_method}\n"
                    f"Customer: {name} ({phone})\n"
                    f"Address: {address}, {city} - {pincode}\n\n"
                    f"Items:\n{items_text}\n"
                )
                from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', None) or 'noreply@activehands.com'
                send_mail(subject, body, from_email, [admin_email], fail_silently=True)
            except Exception as e:
                logger.warning(f"Admin email notification error: {e}")

    except Exception as general_err:
        logger.error(f"General notification failure: {general_err}")
