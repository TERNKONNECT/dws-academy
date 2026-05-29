import api from "./axios";
import type { Course } from "@/types";
import { uploadToCloudinary } from "@/lib/cloudinary";

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

  // Upload thumbnail directly to Cloudinary then save URL
  uploadThumbnail: async (
    id: string,
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<Course> => {
    const { url, publicId } = await uploadToCloudinary(
      file,
      "lms/thumbnails",
      "image",
      onProgress,
    );
    const res = await api.post<Course>(`/api/courses/${id}/thumbnail-url`, {
      thumbnail: url,
      thumbnailCloudinaryId: publicId,
    });
    return res.data;
  },

  // Upload intro video directly to Cloudinary then save URL
  uploadIntroVideo: async (
    id: string,
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<Course> => {
    const { url, publicId } = await uploadToCloudinary(
      file,
      "lms/intro-videos",
      "video",
      onProgress,
    );
    const res = await api.post<Course>(`/api/courses/${id}/intro-video-url`, {
      introVideoUrl: url,
      introVideoCloudinaryId: publicId,
    });
    return res.data;
  },
};
