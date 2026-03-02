import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/admin/services';

export async function getAdminServices(token: string) {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function getAdminService(id: string, token: string) {
  return axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function createAdminService(data: any, token: string) {
  return axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function updateAdminService(id: string, data: any, token: string) {
  return axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function deleteAdminService(id: string, token: string) {
  return axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
