import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { AUTH_STORAGE_KEY, clearSession } from "@/lib/session";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string) => Promise<string>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          const error = new Error(data.error || "Login failed") as Error & { code?: string };
          error.code = data.code;
          throw error;
        }

        const user: User = {
          id: data.user._id ?? data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role ?? "user",
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.name}`,
          joinedAt: data.user.createdAt,
        };

        // The persisted store below is the only place the token lives now.
        set({ user, token: data.token, isAuthenticated: true });

        if (user.role === "user") {
          const { useEnrollmentStore } = await import("./enrollmentStore");
          useEnrollmentStore.getState().initForUser(user.id);
        }

        return user;
      },

      signup: async (name: string, email: string, password: string) => {
        const res = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Signup failed");

        return data.message || "Check your email to verify your account.";
      },

      logout: () => {
        import("./enrollmentStore").then(({ useEnrollmentStore }) => {
          useEnrollmentStore.getState().clearEnrollments();
        });
        set({ user: null, token: null, isAuthenticated: false });
        // Wipes the persisted blob and every legacy key in one place, so no path
        // can leave half a session behind.
        clearSession();
      },

      setUser: (user: User) => set({ user }),
    }),
    { name: AUTH_STORAGE_KEY },
  ),
);
