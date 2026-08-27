import axios from './axios';

export const newsletterApi = {
  subscribe: async (email: string) => {
    const response = await axios.post<{ message: string }>('/api/newsletter', { email });
    return response.data;
  },
  getSubscribers: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await axios.get<{ email: string; createdAt: string }[]>('/api/newsletter/admin', { params });
    return response.data;
  },
};
