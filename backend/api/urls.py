from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, CurrentUserView,
    ProductListView, CartListView, AddToCartView, UpdateCartItemView,
    RemoveCartItemView, ClearCartView, SyncCartView,
    WishlistListView, ToggleWishlistView,
    OrderListView, CreateOrderView, AddressListCreateView
)

urlpatterns = [
    # Auth Endpoints
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('auth/me/', CurrentUserView.as_view(), name='auth-me'),

    # Products Catalog
    path('products/', ProductListView.as_view(), name='product-list'),

    # Cart Endpoints
    path('cart/', CartListView.as_view(), name='cart-list'),
    path('cart/add/', AddToCartView.as_view(), name='cart-add'),
    path('cart/update/<int:product_id>/', UpdateCartItemView.as_view(), name='cart-update'),
    path('cart/remove/<int:product_id>/', RemoveCartItemView.as_view(), name='cart-remove'),
    path('cart/clear/', ClearCartView.as_view(), name='cart-clear'),
    path('cart/sync/', SyncCartView.as_view(), name='cart-sync'),

    # Wishlist / Likes Endpoints
    path('wishlist/', WishlistListView.as_view(), name='wishlist-list'),
    path('wishlist/toggle/', ToggleWishlistView.as_view(), name='wishlist-toggle'),

    # Orders & Checkout
    path('orders/', OrderListView.as_view(), name='order-list'),
    path('orders/create/', CreateOrderView.as_view(), name='order-create'),

    # Addresses
    path('addresses/', AddressListCreateView.as_view(), name='address-list-create'),
]
