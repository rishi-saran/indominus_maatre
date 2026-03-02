import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/admin/bookings';

export async function getAdminBookings(token: string) {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function getAdminBooking(id: string, token: string) {
  return axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function createAdminBooking(data: any, token: string) {
  return axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function updateAdminBooking(id: string, data: any, token: string) {
  return axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function assignPriestsToBooking(
  bookingId: string,
  data: { priests: { priest_id: string; commission_percent: number }[] },
  token: string
) {
  return axios.post(`${API_URL}/${bookingId}/assign-priests`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function cancelAdminBooking(id: string, token: string) {
  return axios.patch(`${API_URL}/${id}/cancel`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function deleteAdminBooking(id: string, token: string) {
  return axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
