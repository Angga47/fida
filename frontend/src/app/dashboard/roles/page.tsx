"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import { User } from "@/types";
import { Users, GripVertical, ChevronRight, Shield } from "lucide-react";

interface RoleGroup {
  role: string;
  displayName: string;
  color: string;
  users: User[];
}

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleGroup[]>([
    {
      role: "admin",
      displayName: "Administrator",
      color: "bg-red-500",
      users: [],
    },
    {
      role: "Corp FA",
      displayName: "Corp FA",
      color: "bg-blue-500",
      users: [],
    },
    {
      role: "Direktur",
      displayName: "Direktur",
      color: "bg-purple-500",
      users: [],
    },
    {
      role: "CEO",
      displayName: "Chief Executive Officer",
      color: "bg-green-500",
      users: [],
    },
    {
      role: "CFO",
      displayName: "Chief Financial Officer",
      color: "bg-yellow-500",
      users: [],
    },
    {
      role: "Sourcing dan Procurement",
      displayName: "Sourcing & Procurement",
      color: "bg-indigo-500",
      users: [],
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [draggedUser, setDraggedUser] = useState<{
    user: User;
    fromRole: string;
  } | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const users = await userService.getUsers();

      // Group users by role
      const updatedRoles = roles.map((roleGroup) => ({
        ...roleGroup,
        users: users.filter((u) => u.role === roleGroup.role),
      }));

      setRoles(updatedRoles);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (user: User, fromRole: string) => {
    setDraggedUser({ user, fromRole });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, toRole: string) => {
    e.preventDefault();

    if (!draggedUser || draggedUser.fromRole === toRole) {
      setDraggedUser(null);
      return;
    }

    // Confirm role change
    const confirmed = confirm(
      `Ubah role ${draggedUser.user.full_name} dari "${draggedUser.fromRole}" ke "${toRole}"?`
    );

    if (!confirmed) {
      setDraggedUser(null);
      return;
    }

    setUpdating(true);
    try {
      await userService.updateUser(draggedUser.user.id, {
        email: draggedUser.user.email,
        full_name: draggedUser.user.full_name,
        role: toRole as import("@/types").UserRole,
        department: draggedUser.user.department,
        is_active: draggedUser.user.is_active,
      });

      // Reload users to reflect changes
      await loadUsers();
      alert("Role berhasil diubah!");
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to update role");
    } finally {
      setUpdating(false);
      setDraggedUser(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Role</h1>
          <p className="mt-2 text-gray-600">
            Drag dan drop user untuk mengubah role
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <GripVertical className="w-4 h-4" />
          <span>Drag untuk pindah role</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Cara Menggunakan:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Klik dan tahan pada user yang ingin dipindah</li>
              <li>Drag (seret) user ke role card yang diinginkan</li>
              <li>Drop (lepas) untuk mengubah role user tersebut</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {updating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span className="text-gray-700">Mengubah role...</span>
          </div>
        </div>
      )}

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((roleGroup) => (
          <div
            key={roleGroup.role}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, roleGroup.role)}
            className={`bg-white rounded-lg shadow-md border-2 transition-all ${
              draggedUser && draggedUser.fromRole !== roleGroup.role
                ? "border-primary-400 border-dashed bg-primary-50"
                : "border-gray-200"
            }`}
          >
            {/* Role Header */}
            <div
              className={`${roleGroup.color} text-white px-4 py-3 rounded-t-lg`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{roleGroup.displayName}</h3>
                <div className="bg-white bg-opacity-30 px-2 py-1 rounded text-sm font-medium">
                  {roleGroup.users.length}
                </div>
              </div>
            </div>

            {/* Users List */}
            <div className="p-4 space-y-2 min-h-[200px]">
              {roleGroup.users.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Belum ada user</p>
                </div>
              ) : (
                roleGroup.users.map((user) => (
                  <div
                    key={user.id}
                    draggable
                    onDragStart={() => handleDragStart(user, roleGroup.role)}
                    className={`flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors border border-gray-200 ${
                      !user.is_active ? "opacity-50" : ""
                    }`}
                  >
                    <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {user.full_name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.username}
                      </p>
                      {user.department && (
                        <p className="text-xs text-gray-400 truncate">
                          {user.department}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      {user.is_ldap_user ? (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                          LDAP
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                          Manual
                        </span>
                      )}
                      {!user.is_active && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Statistik Role
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {roles.map((roleGroup) => (
            <div key={roleGroup.role} className="text-center">
              <div
                className={`${roleGroup.color} text-white rounded-lg py-3 mb-2`}
              >
                <p className="text-2xl font-bold">{roleGroup.users.length}</p>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                {roleGroup.displayName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
