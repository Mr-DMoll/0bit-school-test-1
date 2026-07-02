import apiClient from "@/api/client";
import { endpoints } from "@/api/endpoints";

export interface LoginCredentials {
  email: string;
  password: string;
}

// Single-tenant site, two roles (Admin/Manager). No self-registration —
// accounts are created via Team invite, and accepted with setPassword below.
export const authService = {
  async login(credentials: LoginCredentials) {
    const { data } = await apiClient.post(endpoints.auth.login, credentials);
    return data;
  },

  async getMe() {
    const { data } = await apiClient.get(endpoints.auth.me);
    return data;
  },

  async logout() {
    const { data } = await apiClient.post(endpoints.auth.logout);
    return data;
  },

  async setPassword(payload: { token: string; email: string; password: string }) {
    const { data } = await apiClient.post(endpoints.auth.setPassword, payload);
    return data;
  },
};
