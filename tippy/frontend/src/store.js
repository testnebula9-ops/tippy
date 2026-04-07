import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from './api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: async (login, password) => {
        const { data } = await api.post('/auth/login', { login, password });
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        set({ user: data.user, token: data.token });
        return data.user;
      },

      register: async (username, email, password, displayName) => {
        const { data } = await api.post('/auth/register', { username, email, password, displayName });
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        set({ user: data.user, token: data.token });
        return data.user;
      },

      logout: () => {
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, token: null });
      },

      fetchMe: async () => {
        const token = get().token;
        if (!token) return;
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.user });
        } catch { get().logout(); }
      },

      updateProfile: async (updates) => {
        const { data } = await api.put('/auth/profile', updates);
        set({ user: data.user });
        return data.user;
      },
    }),
    { name: 'tippy-auth', partialize: (s) => ({ token: s.token, user: s.user }) }
  )
);

export default useAuthStore;
