import api from "@/lib/axios";

export interface LDAPConfig {
  server: string;
  port: number;
  base_dn: string;
  username: string;
}

export interface UpdateLDAPConfigRequest {
  server: string;
  port: number;
  base_dn: string;
  username: string;
  password: string;
}

export const configService = {
  async getLDAPConfig(): Promise<LDAPConfig> {
    const response = await api.get<LDAPConfig>("/admin/config/ldap");
    return response.data;
  },

  async updateLDAPConfig(
    data: UpdateLDAPConfigRequest
  ): Promise<{ message: string; config: LDAPConfig }> {
    const response = await api.put<{ message: string; config: LDAPConfig }>(
      "/admin/config/ldap",
      data
    );
    return response.data;
  },

  async testLDAPConnection(): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>(
      "/admin/config/ldap/test"
    );
    return response.data;
  },
};
