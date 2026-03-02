import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL + '/admin/reports';

export async function getReportsSummary(token: string) {
  return axios.get(`${API_URL}/summary`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
