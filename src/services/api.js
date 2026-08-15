const getApiBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://activehand.onrender.com/api' : 'http://localhost:8000/api');
  url = url.trim().replace(/\/+$/, '');
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

const API_BASE_URL = getApiBaseUrl();

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
        let errorMsg = '';
        if (data.error) {
          errorMsg = data.error;
        } else if (data.detail) {
          errorMsg = data.detail;
        } else if (data.message) {
          errorMsg = data.message;
        } else if (data.non_field_errors) {
          errorMsg = Array.isArray(data.non_field_errors) ? data.non_field_errors.join(' ') : data.non_field_errors;
        } else if (typeof data === 'object' && Object.keys(data).length > 0) {
          const firstKey = Object.keys(data)[0];
          if (Array.isArray(data[firstKey])) {
            errorMsg = `${firstKey}: ${data[firstKey].join(', ')}`;
          } else if (typeof data[firstKey] === 'string') {
            errorMsg = data[firstKey];
          }
        }

        if (!errorMsg) {
          if (response.status === 404) {
            errorMsg = 'Backend endpoint not found. Please verify your Render backend URL.';
          } else if (response.status === 502 || response.status === 503) {
            errorMsg = 'Backend server is waking up on Render. Please wait 15 seconds and try again.';
          } else if (response.status === 500) {
            errorMsg = 'Internal server error on backend. Please check server logs.';
          } else {
            errorMsg = `Server error (${response.status}). Please try again.`;
          }
        }

        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err);
      if (err.name === 'TypeError' && err.message && err.message.toLowerCase().includes('fetch')) {
        throw new Error('Cannot connect to backend server. The Render service may be starting up or sleeping. Please wait 15 seconds and try again.');
      }
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

  async loginWithGoogle({ email, name, avatar, google_id }) {
    const data = await this.request('/auth/google/', {
      method: 'POST',
      body: JSON.stringify({ email, name, avatar, google_id }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async forgotPassword(email) {
    return await this.request('/auth/forgot-password/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(email, code, new_password) {
    return await this.request('/auth/reset-password/', {
      method: 'POST',
      body: JSON.stringify({ email, code, new_password }),
    });
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
