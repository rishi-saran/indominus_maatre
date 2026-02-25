import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/admin/dashboard';

export async function getDashboardSummary(token: string) {
  return axios.get(`${API_URL}/summary`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
