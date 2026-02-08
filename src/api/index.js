import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// User APIs
export const userAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  logout: () => api.post('/users/logout'),
  getProfile: () => api.get('/users/me'),
};

// Item APIs
export const itemAPI = {
  getAll: () => api.get('/items'),
  getById: (id) => api.get(`/items/${id}`),
};

// Cart APIs
export const cartAPI = {
  getCart: () => api.get('/carts'),
  addToCart: (itemId, quantity = 1) => api.post('/carts/add', { itemId, quantity }),
  updateQuantity: (itemId, quantity) => api.put(`/carts/update/${itemId}`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/carts/remove/${itemId}`),
  clearCart: () => api.delete('/carts/clear'),
};

// Order APIs
export const orderAPI = {
  createOrder: () => api.post('/orders'),
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
};

export default api;
