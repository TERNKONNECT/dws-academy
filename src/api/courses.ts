import api from "./axios";
import type { AdminCourse } from "@/types/admin";
import { uploadToCloudinary } from "@/lib/cloudinary";

export const coursesApi = {
  getAll: () => api.get<AdminCourse[]>("/api/courses").then((r) => r.data),

  getById: (id: string) =>
    api.get<AdminCourse>(`/api/courses/${id}`).then((r) => r.data),

  create: (data: Partial<AdminCourse>) =>
    api.post<AdminCourse>("/api/courses", data).then((r) => r.data),

  update: (id: string, data: Partial<AdminCourse>) =>
    api.put<AdminCourse>(`/api/courses/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/api/courses/${id}`).then((r) => r.data),

  saveIntroVideoUrl: (id: string, introVideoUrl: string): Promise<AdminCourse> =>
    api
      .post<AdminCourse>(`/api/courses/${id}/intro-video-url`, {
        introVideoUrl,
        introVideoCloudinaryId: "",
      })
      .then((r) => r.data),

  uploadThumbnail: async (
    id: string,
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<AdminCourse> => {
    const { url, publicId } = await uploadToCloudinary(file, "lms/thumbnails", "image", onProgress);
    const res = await api.post<AdminCourse>(`/api/courses/${id}/thumbnail-url`, {
      thumbnail: url,
      thumbnailCloudinaryId: publicId,
    });
    return res.data;
  },

  uploadIntroVideo: async (
    id: string,
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<AdminCourse> => {
    const { url, publicId } = await uploadToCloudinary(file, "lms/intro-videos", "video", onProgress);
    const res = await api.post<AdminCourse>(`/api/courses/${id}/intro-video-url`, {
      introVideoUrl: url,
      introVideoCloudinaryId: publicId,
    });
    return res.data;
  },
};
