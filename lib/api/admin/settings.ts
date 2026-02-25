import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/admin/settings';

export async function getAdminSettings(token: string) {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function getAdminSetting(key: string, token: string) {
  return axios.get(`${API_URL}/${key}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function updateAdminSetting(key: string, value: any, token: string) {
  return axios.put(`${API_URL}/${key}`, { value }, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
