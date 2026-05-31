import api from "./axios";
import type { Course } from "@/types";

export const coursesApi = {
  getAll: () => api.get<Course[]>("/api/courses").then((r) => r.data),

  getById: (id: string) =>
    api.get<Course>(`/api/courses/${id}`).then((r) => r.data),

  create: (data: Partial<Course>) =>
    api.post<Course>("/api/courses", data).then((r) => r.data),

  saveIntroVideoUrl: (id: string, introVideoUrl: string): Promise<Course> =>
    api
      .post<Course>(`/api/courses/${id}/intro-video-url`, {
        introVideoUrl,
        introVideoCloudinaryId: "",
      })
      .then((r) => r.data),

  update: (id: string, data: Partial<Course>) =>
    api.put<Course>(`/api/courses/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/api/courses/${id}`).then((r) => r.data),

  uploadThumbnail: async (
    id: string,
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<Course> => {
    const formData = new FormData();
    formData.append("thumbnail", file);

    const res = await api.post<Course>(`/api/courses/${id}/thumbnail`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (event.total && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    });
    return res.data;
  },

  uploadIntroVideo: async (
    id: string,
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<Course> => {
    const formData = new FormData();
    formData.append("video", file);

    const res = await api.post<Course>(`/api/courses/${id}/intro-video`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (event.total && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      },
    });
    return res.data;
  },
};
