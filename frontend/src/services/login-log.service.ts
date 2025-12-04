import api from "@/lib/axios";

export interface LoginLog {
  id: number;
  user_id: number | null;
  username: string;
  full_name: string;
  ip_address: string;
  user_agent: string;
  success: boolean;
  fail_reason?: string;
  login_at: string;
}

export interface LoginStats {
  total_logins: number;
  successful_logins: number;
  failed_logins: number;
}

export const loginLogService = {
  async getLoginLogs(): Promise<LoginLog[]> {
    const response = await api.get("/admin/logs/login");
    return response.data;
  },

  async getLoginStats(): Promise<LoginStats> {
    const response = await api.get("/admin/logs/login/stats");
    return response.data;
  },

  async getUserLoginHistory(username: string): Promise<LoginLog[]> {
    const response = await api.get(`/admin/logs/login/user/${username}`);
    return response.data;
  },
};
