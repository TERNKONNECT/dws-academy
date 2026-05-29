import api from "./axios";
import { uploadToCloudinary } from "@/lib/cloudinary";

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  title: string;
  bio: string;
  avatar: string;
  role: string;
  createdAt: string;
}

export const profileApi = {
  get: (): Promise<AdminProfile> => api.get("/api/profile").then((r) => r.data),

  update: (data: {
    name: string;
    title: string;
    bio: string;
  }): Promise<AdminProfile> =>
    api.put("/api/profile", data).then((r) => r.data),

  // Upload avatar directly to Cloudinary then save URL
  uploadAvatar: async (
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<{ avatar: string }> => {
    const { url, publicId } = await uploadToCloudinary(
      file,
      "lms/avatars",
      "image",
      onProgress,
    );
    const res = await api.post("/api/profile/avatar-url", {
      avatar: url,
      avatarCloudinaryId: publicId,
    });
    return res.data;
  },
};
