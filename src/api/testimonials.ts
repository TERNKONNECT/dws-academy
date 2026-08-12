import api from "./axios";

export interface Testimonial {
  id: string;
  name: string;
  jobTitle: string;
  companyName: string;
  content: string;
  date: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const testimonialsApi = {
  // Public - get active testimonials
  getAll: (): Promise<Testimonial[]> => 
    api.get("/api/testimonials").then((r) => r.data),

  // Admin - get all testimonials
  getAdminAll: (): Promise<Testimonial[]> => 
    api.get("/api/testimonials/admin").then((r) => r.data),

  // Admin - create
  create: (data: Partial<Testimonial>): Promise<Testimonial> => 
    api.post("/api/testimonials/admin", data).then((r) => r.data),

  // Admin - update
  update: (id: string, data: Partial<Testimonial>): Promise<Testimonial> => 
    api.put(`/api/testimonials/admin/${id}`, data).then((r) => r.data),

  // Admin - delete
  delete: (id: string): Promise<{ message: string }> => 
    api.delete(`/api/testimonials/admin/${id}`).then((r) => r.data),
};
