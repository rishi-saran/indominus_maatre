import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/admin/pages';

export async function getAdminPages(token: string) {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function getAdminPage(id: string, token: string) {
  return axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function createAdminPage(data: any, token: string) {
  return axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function updateAdminPage(id: string, data: any, token: string) {
  return axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function deleteAdminPage(id: string, token: string) {
  return axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
