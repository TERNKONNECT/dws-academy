import api from "./axios";
import type { AdminLesson } from "@/types/admin";

export const lessonsApi = {
  createText: (
    courseId: string,
    moduleId: string,
    data: { title: string; content: string; order: number },
  ) =>
    api
      .post<AdminLesson>(`/api/courses/${courseId}/modules/${moduleId}/lessons/text`, data)
      .then((r) => r.data),

  createVideo: async (
    courseId: string,
    moduleId: string,
    file: File,
    title: string,
    duration: string,
    order: number,
    onProgress?: (pct: number) => void,
  ): Promise<AdminLesson> => {
    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("duration", duration);
    formData.append("order", String(order));

    const res = await api.post<AdminLesson>(
      `/api/courses/${courseId}/modules/${moduleId}/lessons/video`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (event.total && onProgress) {
            onProgress(Math.round((event.loaded / event.total) * 100));
          }
        },
      },
    );
    return res.data;
  },

  createYoutube: (
    courseId: string,
    moduleId: string,
    data: { title: string; videoUrl: string; duration: string; order: number },
  ) =>
    api
      .post<AdminLesson>(
        `/api/courses/${courseId}/modules/${moduleId}/lessons/video-url`,
        { ...data, cloudinaryId: "" },
      )
      .then((r) => r.data),

  update: (courseId: string, moduleId: string, lessonId: string, data: Partial<AdminLesson>) =>
    api
      .put<AdminLesson>(`/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, data)
      .then((r) => r.data),

  delete: (courseId: string, moduleId: string, lessonId: string) =>
    api
      .delete(`/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`)
      .then((r) => r.data),
};
