import { create } from "zustand";
import { api } from "./api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPERADMIN";
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    set({ user: res.data.data.user, isAuthenticated: true });
  },

  logout: async () => {
    await api.post("/api/auth/logout");
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get("/api/auth/me");
      set({ user: res.data.data.user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
