import api from "@/lib/axios";
import { User, UserRole } from "@/types";

export interface CreateUserRequest {
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  department: string;
  password?: string;
  is_ldap_user: boolean;
}

export interface UpdateUserRequest {
  email: string;
  full_name: string;
  role: UserRole;
  department: string;
  is_active: boolean;
}

export const userService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>("/admin/users");
    return response.data;
  },

  async getUser(id: number): Promise<User> {
    const response = await api.get<User>(`/admin/users/${id}`);
    return response.data;
  },

  async createUser(data: CreateUserRequest): Promise<User> {
    const response = await api.post<User>("/admin/users", data);
    return response.data;
  },

  async updateUser(id: number, data: UpdateUserRequest): Promise<User> {
    const response = await api.put<User>(`/admin/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },

  async toggleUserStatus(id: number): Promise<User> {
    const response = await api.post<User>(`/admin/users/${id}/toggle-status`);
    return response.data;
  },
};
