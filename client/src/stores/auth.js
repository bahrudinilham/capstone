import { defineStore } from "pinia";
import api from "../services/api";

const TOKEN_KEY = "learntrack_token";
const USER_KEY = "learntrack_user";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || "",
    user: JSON.parse(localStorage.getItem(USER_KEY) || "null"),
    loading: false,
    error: "",
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    setSession(payload) {
      this.token = payload.token;
      this.user = payload.user;
      localStorage.setItem(TOKEN_KEY, this.token);
      localStorage.setItem(USER_KEY, JSON.stringify(this.user));
    },
    clearSession() {
      this.token = "";
      this.user = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
    async login(credentials) {
      this.loading = true;
      this.error = "";
      try {
        const { data } = await api.post("/api/auth/login", credentials);
        this.setSession(data);
        return data;
      } catch (error) {
        this.error = error.response?.data?.message || "Gagal masuk";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.clearSession();
    },
  },
});
