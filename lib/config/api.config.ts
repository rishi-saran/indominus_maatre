// All requests go through Next.js API routes
const BASE_URL = '/api';

export const API_ENDPOINTS = {
  cart: {
    get: `${BASE_URL}/cart`,
    addItem: `${BASE_URL}/cart/items`,
    removeItem: (itemId: string) => `${BASE_URL}/cart/items/${itemId}`,
  },

  orders: {
    create: `${BASE_URL}/orders`,
    getById: (orderId: string) => `${BASE_URL}/orders/${orderId}`,
    list: `${BASE_URL}/orders`,
  },

  payments: {
    getById: (paymentId: string) => `${BASE_URL}/payments/${paymentId}`,
    list: `${BASE_URL}/payments`,
  },

  addresses: {
    list: `${BASE_URL}/addresses`,
    create: `${BASE_URL}/addresses`,
    getById: (addressId: string) => `${BASE_URL}/addresses/${addressId}`,
  },

  serviceAddons: {
    list: `${BASE_URL}/service-addons`,
    getById: (addonId: string) => `${BASE_URL}/service-addons/${addonId}`,
  },

  serviceCategories: {
    list: `${BASE_URL}/categories`,
  },

  servicePackages: {
    list: `${BASE_URL}/service-packages`,
    getById: (packageId: string) => `${BASE_URL}/service-packages/${packageId}`,
  },

  serviceProviders: {
    list: `${BASE_URL}/service-providers`,
    getById: (providerId: string) => `${BASE_URL}/service-providers/${providerId}`,
  },

  services: {
    list: `${BASE_URL}/services`,
    getById: (serviceId: string) => `${BASE_URL}/services/${serviceId}`,
  },

  pages: {
    getBySlug: (slug: string) => `${BASE_URL}/pages/${slug}`,
  },
} as const;