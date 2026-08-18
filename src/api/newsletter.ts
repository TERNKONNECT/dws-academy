import axios from './axios';

export const newsletterApi = {
  subscribe: async (email: string) => {
    const response = await axios.post<{ message: string }>('/api/newsletter', { email });
    return response.data;
  },
};
