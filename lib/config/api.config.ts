// Use relative URLs so requests go through Next.js API routes
// Next.js will proxy them to the backend
const BASE_URL = '/api';

export const API_ENDPOINTS = {
  auth: {
    signup: `${BASE_URL}/auth/signup`,
    login: `${BASE_URL}/auth/login`,
    refresh: `${BASE_URL}/auth/refresh`,
    logout: `${BASE_URL}/auth/logout`,
  },
  cart: {
    createOrGet: `${BASE_URL}/cart/`,
    get: `${BASE_URL}/cart/`,
    addItem: `${BASE_URL}/cart/items`,
    removeItem: (itemId: string) => `${BASE_URL}/cart/items/${itemId}`,
  },
  orders: {
    create: `${BASE_URL}/orders/`,
    getById: (orderId: string) => `${BASE_URL}/orders/${orderId}`,
    list: `${BASE_URL}/orders/`,
  },
  payments: {
    create: `${BASE_URL}/payments/`,
    getById: (paymentId: string) => `${BASE_URL}/payments/${paymentId}`,
    list: `${BASE_URL}/payments/`,
  },
  serviceAddons: {
    list: `${BASE_URL}/service-addons/`,
    getById: (addonId: string) => `${BASE_URL}/service-addons/${addonId}`,
  },
  serviceCategories: {
    list: `${BASE_URL}/service-categories/`,
  },
  servicePackages: {
    list: `${BASE_URL}/service-packages/`,
    getById: (packageId: string) => `${BASE_URL}/service-packages/${packageId}`,
  },
  serviceProviders: {
    list: `${BASE_URL}/service-providers/`,
    getById: (providerId: string) => `${BASE_URL}/service-providers/${providerId}`,
  },
  services: {
    list: `${BASE_URL}/services/`,
    getById: (serviceId: string) => `${BASE_URL}/services/${serviceId}`,
  },
} as const;
