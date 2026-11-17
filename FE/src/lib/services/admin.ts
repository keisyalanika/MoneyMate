import { apiRequest, apiUpload } from "@/lib/api";

export interface AdminProfileData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: string;
}

export const adminService = {
  getProfile(): Promise<AdminProfileData> {
    return apiRequest<AdminProfileData>("users/me");
  },

  async updateProfile(input: { name: string; phone?: string }): Promise<AdminProfileData> {
    return apiRequest<AdminProfileData>("users/me", {
      method: "PUT",
      body: JSON.stringify(input),
    });
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiRequest("auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  async uploadAvatar(file: File): Promise<AdminProfileData> {
    const formData = new FormData();
    formData.append("avatar", file);
    return apiUpload<AdminProfileData>("users/me/avatar", formData);
  },
};
