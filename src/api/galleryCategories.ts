import axios from './axios';

export interface GalleryCategory {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  date?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryCategoryInput {
  name: string;
  description?: string;
  isActive?: boolean;
  date?: string | null;
}

export const galleryCategoriesApi = {
  // Public: active categories only
  getAll: async () => {
    const response = await axios.get<GalleryCategory[]>('/api/gallery-categories');
    return response.data;
  },

  // Admin: every category, including inactive ones
  getAllAdmin: async () => {
    const response = await axios.get<GalleryCategory[]>('/api/gallery-categories/admin');
    return response.data;
  },

  create: async (data: GalleryCategoryInput) => {
    const response = await axios.post<GalleryCategory>('/api/gallery-categories', data);
    return response.data;
  },

  update: async (id: number, data: GalleryCategoryInput) => {
    const response = await axios.put<GalleryCategory>(`/api/gallery-categories/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axios.delete<{ message: string; deletedImages: number }>(
      `/api/gallery-categories/${id}`
    );
    return response.data;
  },
};
