import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/admin/priests';

export async function getAdminPriests(token: string) {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function getAdminPriest(id: string, token: string) {
  return axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function createAdminPriest(data: any, token: string) {
  return axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function updateAdminPriest(id: string, data: any, token: string) {
  return axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function deleteAdminPriest(id: string, token: string) {
  return axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
