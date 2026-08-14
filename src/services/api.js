const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://activehand.onrender.com/api' : 'http://localhost:8000/api');

class ApiService {
  getToken() {
    try {
      return localStorage.getItem('activehands_token') || null;
    } catch {
      return null;
    }
  }

  setToken(token) {
    try {
      if (token) {
        localStorage.setItem('activehands_token', token);
      } else {
        localStorage.removeItem('activehands_token');
      }
    } catch (e) {
      console.error('Failed to store auth token', e);
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Token ${token}` } : {}),
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Extract error message
        let errorMsg = 'An error occurred';
        if (data.error) errorMsg = data.error;
        else if (data.message) errorMsg = data.message;
        else if (data.non_field_errors) errorMsg = data.non_field_errors.join(' ');
        else if (typeof data === 'object') {
          const firstKey = Object.keys(data)[0];
          if (firstKey && Array.isArray(data[firstKey])) {
            errorMsg = `${firstKey}: ${data[firstKey].join(', ')}`;
          } else if (firstKey) {
            errorMsg = `${firstKey}: ${data[firstKey]}`;
          }
        }
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err);
      throw err;
    }
  }

  // --- Authentication ---
  async register(name, email, password) {
    const data = await this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async logout() {
    try {
      if (this.getToken()) {
        await this.request('/auth/logout/', { method: 'POST' });
      }
    } catch (e) {
      console.warn('Logout request warning:', e);
    } finally {
      this.setToken(null);
    }
  }

  async getCurrentUser() {
    if (!this.getToken()) return null;
    return await this.request('/auth/me/');
  }

  // --- Cart ---
  async getCart() {
    if (!this.getToken()) return [];
    return await this.request('/cart/');
  }

  async addToCart(product, quantity = 1) {
    if (!this.getToken()) return null;
    return await this.request('/cart/add/', {
      method: 'POST',
      body: JSON.stringify({
        product_id: product.id,
        title: product.title,
        price: product.price,
        numericPrice: product.numericPrice,
        img: product.img,
        url: product.url,
        quantity,
      }),
    });
  }

  async updateCartItem(productId, quantity) {
    if (!this.getToken()) return null;
    return await this.request(`/cart/update/${productId}/`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeCartItem(productId) {
    if (!this.getToken()) return null;
    return await this.request(`/cart/remove/${productId}/`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    if (!this.getToken()) return null;
    return await this.request('/cart/clear/', {
      method: 'POST',
    });
  }

  async syncCart(items) {
    if (!this.getToken() || !items || items.length === 0) return null;
    return await this.request('/cart/sync/', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  }

  // --- Wishlist / Likes ---
  async getWishlist() {
    if (!this.getToken()) return [];
    return await this.request('/wishlist/');
  }

  async toggleWishlist(product) {
    if (!this.getToken()) return null;
    return await this.request('/wishlist/toggle/', {
      method: 'POST',
      body: JSON.stringify({
        product_id: product.id,
        title: product.title,
        price: product.price,
        img: product.img,
        category: product.category,
      }),
    });
  }

  // --- Orders ---
  async getOrders() {
    if (!this.getToken()) return [];
    return await this.request('/orders/');
  }

  async createOrder(orderData) {
    return await this.request('/orders/create/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // --- Addresses ---
  async getAddresses() {
    if (!this.getToken()) return [];
    return await this.request('/addresses/');
  }

  async createAddress(addressData) {
    return await this.request('/addresses/', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  // --- Products Catalog ---
  async getProducts(category = '') {
    const query = category && category !== 'all' ? `?category=${category}` : '';
    return await this.request(`/products/${query}`);
  }
}

export const api = new ApiService();
export default api;
