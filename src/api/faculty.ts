import api from "./axios";

export interface Faculty {
  id: string;
  name: string;
  jobTitle: string;
  company: string;
  shortDescription: string;
  avatar: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const facultyApi = {
  getAll: (isAdmin = false): Promise<Faculty[]> =>
    api.get(isAdmin ? "/api/faculty/admin" : "/api/faculty").then((r) => r.data),

  create: (data: Partial<Faculty>): Promise<Faculty> =>
    api.post("/api/faculty/admin", data).then((r) => r.data),

  update: (id: string, data: Partial<Faculty>): Promise<Faculty> =>
    api.put(`/api/faculty/admin/${id}`, data).then((r) => r.data),

  uploadAvatar: (id: string, file: File): Promise<Faculty> => {
    const formData = new FormData();
    formData.append("avatar", file);
    return api.post(`/api/faculty/admin/${id}/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data);
  },

  delete: (id: string): Promise<void> =>
    api.delete(`/api/faculty/admin/${id}`).then((r) => r.data),
};
