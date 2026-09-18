import axios from './axios';

export const newsletterApi = {
  subscribe: async (email: string) => {
    const response = await axios.post<{ message: string }>('/api/newsletter', { email });
    return response.data;
  },
  getSubscribers: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await axios.get<{ id: string; email: string; createdAt: string }[]>('/api/newsletter/admin', { params });
    return response.data;
  },
  updateSubscriber: async (id: string, data: { email: string }) => {
    const response = await axios.put<{ id: string; email: string; createdAt: string }>(`/api/newsletter/admin/${id}`, data);
    return response.data;
  },
  deleteSubscriber: async (id: string) => {
    const response = await axios.delete<{ message: string }>(`/api/newsletter/admin/${id}`);
    return response.data;
  },
};
