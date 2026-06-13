import axios from './axios';

export interface EventImage {
  id: string;
  eventId: string;
  url: string;
  key: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppEvent {
  id: string;
  name: string;
  description: string;
  date?: string;
  images?: EventImage[];
  createdAt: string;
  updatedAt: string;
}

export const eventsApi = {
  getAll: async () => {
    const response = await axios.get<AppEvent[]>('/events');
    return response.data;
  },
  
  create: async (data: { name: string; description?: string; date?: string }) => {
    const response = await axios.post<AppEvent>('/events', data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await axios.delete<{ message: string }>(`/events/${id}`);
    return response.data;
  },
  
  getPresignedUrl: async (eventId: string, data: { filename: string; contentType: string }) => {
    const response = await axios.post<{ uploadUrl: string; key: string; url: string }>(
      `/events/${eventId}/images/presigned-url`,
      data
    );
    return response.data;
  },
  
  saveImages: async (eventId: string, images: { url: string; key: string }[]) => {
    const response = await axios.post<EventImage[]>(`/events/${eventId}/images`, { images });
    return response.data;
  },
  
  deleteImagesBulk: async (imageIds: string[]) => {
    const response = await axios.delete<{ message: string }>('/events/images/bulk', {
      data: { imageIds }
    });
    return response.data;
  }
};
