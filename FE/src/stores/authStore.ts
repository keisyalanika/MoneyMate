import { create } from "zustand";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
}

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clear: () => set({ user: null }),
}));
