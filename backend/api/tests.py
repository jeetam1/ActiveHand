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

    def test_user_login_no_account(self):
        response = self.client.post('/api/auth/login/', {
            'email': 'nonexistent@activehands.com',
            'password': 'somepassword'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'No account found with this email. Please create an account first.')

    def test_user_login_wrong_password(self):
        response = self.client.post('/api/auth/login/', {
            'email': 'testmaker@activehands.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Incorrect password. Please try again.')

    def test_user_registration(self):
        response = self.client.post('/api/auth/register/', {
            'name': 'New Crafter',
            'email': 'newcrafter@activehands.com',
            'password': 'secretpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['name'], 'New Crafter')

    def test_google_auth_new_and_existing_user(self):
        # New Google user
        response = self.client.post('/api/auth/google/', {
            'email': 'googlemaker@activehands.com',
            'name': 'Google Maker',
            'avatar': 'https://example.com/avatar.jpg'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['name'], 'Google Maker')
        self.assertEqual(response.data['user']['points'], 50)

        # Existing Google user
        response2 = self.client.post('/api/auth/google/', {
            'email': 'googlemaker@activehands.com',
            'name': 'Google Maker Updated'
        })
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertIn('token', response2.data)

    def test_forgot_and_reset_password_flow(self):
        # Forgot password for non-existent email
        res_nonexistent = self.client.post('/api/auth/forgot-password/', {
            'email': 'nobody@activehands.com'
        })
        self.assertEqual(res_nonexistent.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('No account found with this email', res_nonexistent.data['error'])

        # Forgot password for existing email
        res_forgot = self.client.post('/api/auth/forgot-password/', {
            'email': 'testmaker@activehands.com'
        })
        self.assertEqual(res_forgot.status_code, status.HTTP_200_OK)
        self.assertTrue(res_forgot.data['success'])
        code = res_forgot.data['reset_code']
        self.assertEqual(len(code), 6)

        # Reset password with invalid code
        res_invalid = self.client.post('/api/auth/reset-password/', {
            'email': 'testmaker@activehands.com',
            'code': '000000',
            'new_password': 'brandnewpassword456'
        })
        self.assertEqual(res_invalid.status_code, status.HTTP_400_BAD_REQUEST)

        # Reset password with valid code
        res_reset = self.client.post('/api/auth/reset-password/', {
            'email': 'testmaker@activehands.com',
            'code': code,
            'new_password': 'brandnewpassword456'
        })
        self.assertEqual(res_reset.status_code, status.HTTP_200_OK)
        self.assertTrue(res_reset.data['success'])

        # Verify user can log in with new password
        res_login = self.client.post('/api/auth/login/', {
            'email': 'testmaker@activehands.com',
            'password': 'brandnewpassword456'
        })
        self.assertEqual(res_login.status_code, status.HTTP_200_OK)
        self.assertIn('token', res_login.data)

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
