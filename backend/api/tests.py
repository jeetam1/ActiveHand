from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Product, CartItem, WishlistItem, Order

class ActiveHandsApiTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testmaker@activehands.com',
            email='testmaker@activehands.com',
            password='testpassword123',
            first_name='Test Maker'
        )
        self.product = Product.objects.create(
            title='Mosaic Art Tray Kit',
            price='₹899.00',
            numeric_price=899.0,
            category='popular',
            sub_category='mosaic',
            img='/assets/b1.avif',
            rating='4.9',
            reviews=142
        )

    def test_user_login(self):
        response = self.client.post('/api/auth/login/', {
            'email': 'testmaker@activehands.com',
            'password': 'testpassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['email'], 'testmaker@activehands.com')

    def test_user_registration(self):
        response = self.client.post('/api/auth/register/', {
            'name': 'New Crafter',
            'email': 'newcrafter@activehands.com',
            'password': 'secretpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['name'], 'New Crafter')

    def test_cart_operations(self):
        # Authenticate
        self.client.force_authenticate(user=self.user)

        # Add to cart
        res_add = self.client.post('/api/cart/add/', {
            'product_id': self.product.id,
            'title': self.product.title,
            'price': self.product.price,
            'numericPrice': self.product.numeric_price,
            'quantity': 2
        }, format='json')
        self.assertEqual(res_add.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res_add.data), 1)
        self.assertEqual(res_add.data[0]['quantity'], 2)

        # Update cart
        res_update = self.client.put(f'/api/cart/update/{self.product.id}/', {
            'quantity': 4
        }, format='json')
        self.assertEqual(res_update.status_code, status.HTTP_200_OK)
        self.assertEqual(res_update.data[0]['quantity'], 4)

        # Remove from cart
        res_del = self.client.delete(f'/api/cart/remove/{self.product.id}/')
        self.assertEqual(res_del.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res_del.data), 0)

    def test_wishlist_toggle(self):
        self.client.force_authenticate(user=self.user)
        
        # Toggle on
        res_toggle1 = self.client.post('/api/wishlist/toggle/', {
            'product_id': self.product.id,
            'title': self.product.title,
            'price': self.product.price,
            'img': self.product.img
        }, format='json')
        self.assertEqual(res_toggle1.status_code, status.HTTP_200_OK)
        self.assertTrue(res_toggle1.data['is_in_wishlist'])

        # Toggle off
        res_toggle2 = self.client.post('/api/wishlist/toggle/', {
            'product_id': self.product.id
        }, format='json')
        self.assertEqual(res_toggle2.status_code, status.HTTP_200_OK)
        self.assertFalse(res_toggle2.data['is_in_wishlist'])

    def test_create_order(self):
        self.client.force_authenticate(user=self.user)

        res_order = self.client.post('/api/orders/create/', {
            'total_amount': '₹899.00',
            'numeric_total': 899.0,
            'name': 'Test Maker',
            'phone': '+91 99999 88888',
            'address': '123 Craft Blvd',
            'city': 'Bengaluru',
            'pincode': '560001',
            'payment_method': 'upi',
            'items': [{
                'id': self.product.id,
                'title': self.product.title,
                'price': self.product.price,
                'numericPrice': self.product.numeric_price,
                'quantity': 1
            }]
        }, format='json')
        self.assertEqual(res_order.status_code, status.HTTP_201_CREATED)
        self.assertIn('order', res_order.data)
        self.assertTrue(res_order.data['order']['order_number'].startswith('AH-'))
