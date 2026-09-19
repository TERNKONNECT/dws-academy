import axios from './axios';

export interface PreorderInput {
  fullName: string;
  email: string;
  whatsapp: string;
  quantity: number;
  deliveryDetails?: string;
}

export interface PreorderInitializeResponse {
  reference: string;
  authorizationUrl: string;
  amount: number;
  currency: string;
}

export interface PreorderRecord {
  bookTitle: string;
  fullName: string;
  email: string;
  quantity: number;
  amount: number;
  currency: string;
  reference: string;
  status: "pending" | "success" | "failed" | "abandoned";
}

export interface PreorderVerifyResponse {
  status: string;
  preorder: PreorderRecord;
}

export interface PreorderAdminRecord {
  id: string;
  bookSlug: string;
  bookTitle: string;
  fullName: string;
  email: string;
  whatsapp: string;
  quantity: number;
  deliveryDetails: string;
  reference: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed" | "abandoned";
  paidAt: string | null;
  createdAt: string;
}

export const preordersApi = {
  initialize: async (data: PreorderInput) => {
    const response = await axios.post<PreorderInitializeResponse>('/api/preorders/initialize', data);
    return response.data;
  },
  verify: async (reference: string) => {
    const response = await axios.get<PreorderVerifyResponse>(`/api/preorders/verify/${reference}`);
    return response.data;
  },
  getAllAdmin: async () => {
    const response = await axios.get<PreorderAdminRecord[]>('/api/preorders/admin');
    return response.data;
  },
  delete: async (id: string) => {
    const response = await axios.delete(`/api/preorders/admin/${id}`);
    return response.data;
  },
};
