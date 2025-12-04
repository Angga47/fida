"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  GripVertical,
  Edit,
  Trash2,
  X,
  Save,
  Shield,
  Grid3x3,
} from "lucide-react";

interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  displayName: string;
  color: string;
  features: Feature[];
}

const AVAILABLE_FEATURES: Feature[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Akses dashboard utama",
    category: "General",
  },
  {
    id: "proposals_view",
    name: "Lihat Usulan",
    description: "Melihat daftar usulan investasi",
    category: "Proposals",
  },
  {
    id: "proposals_create",
    name: "Buat Usulan",
    description: "Membuat usulan investasi baru",
    category: "Proposals",
  },
  {
    id: "proposals_edit",
    name: "Edit Usulan",
    description: "Mengedit usulan investasi",
    category: "Proposals",
  },
  {
    id: "proposals_delete",
    name: "Hapus Usulan",
    description: "Menghapus usulan investasi",
    category: "Proposals",
  },
  {
    id: "proposals_approve",
    name: "Approve Usulan",
    description: "Menyetujui usulan investasi",
    category: "Proposals",
  },
  {
    id: "proposals_reject",
    name: "Reject Usulan",
    description: "Menolak usulan investasi",
    category: "Proposals",
  },
  {
    id: "comments_add",
    name: "Tambah Komentar",
    description: "Menambahkan komentar pada usulan",
    category: "Comments",
  },
  {
    id: "comments_view",
    name: "Lihat Komentar",
    description: "Melihat komentar pada usulan",
    category: "Comments",
  },
  {
    id: "attachments_upload",
    name: "Upload File",
    description: "Upload attachment file",
    category: "Attachments",
  },
  {
    id: "attachments_download",
    name: "Download File",
    description: "Download attachment file",
    category: "Attachments",
  },
  {
    id: "users_view",
    name: "Lihat User",
    description: "Melihat daftar user",
    category: "Admin",
  },
  {
    id: "users_create",
    name: "Tambah User",
    description: "Menambahkan user baru",
    category: "Admin",
  },
  {
    id: "users_edit",
    name: "Edit User",
    description: "Mengedit data user",
    category: "Admin",
  },
  {
    id: "users_delete",
    name: "Hapus User",
    description: "Menghapus user",
    category: "Admin",
  },
  {
    id: "roles_manage",
    name: "Kelola Role",
    description: "Mengelola role dan permission",
    category: "Admin",
  },
  {
    id: "config_ldap",
    name: "Konfigurasi LDAP",
    description: "Mengatur konfigurasi LDAP",
    category: "Admin",
  },
  {
    id: "reports_view",
    name: "Lihat Laporan",
    description: "Melihat laporan dan statistik",
    category: "Reports",
  },
  {
    id: "reports_export",
    name: "Export Laporan",
    description: "Export laporan ke file",
    category: "Reports",
  },
];

const COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
];

export default function RoleManagementPage() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "admin",
      name: "admin",
      displayName: "Administrator",
      color: "bg-red-500",
      features: AVAILABLE_FEATURES.filter(
        (f) => f.category === "Admin" || f.category === "General"
      ),
    },
    {
      id: "corp_fa",
      name: "Corp FA",
      displayName: "Corp FA",
      color: "bg-blue-500",
      features: AVAILABLE_FEATURES.filter(
        (f) => f.category === "Proposals" || f.category === "General"
      ),
    },
    {
      id: "direktur",
      name: "Direktur",
      displayName: "Direktur",
      color: "bg-purple-500",
      features: AVAILABLE_FEATURES.filter((f) =>
        ["Proposals", "General", "Reports"].includes(f.category)
      ),
    },
  ]);

  const [showAddRole, setShowAddRole] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    displayName: "",
    color: "bg-gray-500",
  });
  const [draggedFeature, setDraggedFeature] = useState<{
    feature: Feature;
    fromRole: string | null;
  } | null>(null);
  const [editingRole, setEditingRole] = useState<string | null>(null);

  const handleAddRole = () => {
    if (!newRole.name || !newRole.displayName) {
      alert("Nama role dan display name harus diisi!");
      return;
    }

    const roleExists = roles.some(
      (r) => r.name.toLowerCase() === newRole.name.toLowerCase()
    );
    if (roleExists) {
      alert("Role sudah ada!");
      return;
    }

    const role: Role = {
      id: newRole.name.toLowerCase().replace(/\s+/g, "_"),
      name: newRole.name,
      displayName: newRole.displayName,
      color: newRole.color,
      features: [],
    };

    setRoles([...roles, role]);
    setNewRole({ name: "", displayName: "", color: "bg-gray-500" });
    setShowAddRole(false);
  };

  const handleDeleteRole = (roleId: string) => {
    if (roleId === "admin") {
      alert("Role Admin tidak bisa dihapus!");
      return;
    }

    const confirmed = confirm("Yakin ingin menghapus role ini?");
    if (confirmed) {
      setRoles(roles.filter((r) => r.id !== roleId));
    }
  };

  const handleDragStart = (feature: Feature, fromRole: string | null) => {
    setDraggedFeature({ feature, fromRole });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, toRoleId: string) => {
    e.preventDefault();

    if (!draggedFeature) return;

    const { feature, fromRole } = draggedFeature;

    setRoles((prevRoles) => {
      const updatedRoles = prevRoles.map((role) => {
        // Remove feature from source role
        if (role.id === fromRole) {
          return {
            ...role,
            features: role.features.filter((f) => f.id !== feature.id),
          };
        }

        // Add feature to target role (if not already present)
        if (role.id === toRoleId) {
          const hasFeature = role.features.some((f) => f.id === feature.id);
          if (!hasFeature) {
            return {
              ...role,
              features: [...role.features, feature],
            };
          }
        }

        return role;
      });

      return updatedRoles;
    });

    setDraggedFeature(null);
  };

  const getUnassignedFeatures = () => {
    const assignedFeatureIds = new Set(
      roles.flatMap((role) => role.features.map((f) => f.id))
    );
    return AVAILABLE_FEATURES.filter((f) => !assignedFeatureIds.has(f.id));
  };

  const groupFeaturesByCategory = (features: Feature[]) => {
    const grouped: { [key: string]: Feature[] } = {};
    features.forEach((feature) => {
      if (!grouped[feature.category]) {
        grouped[feature.category] = [];
      }
      grouped[feature.category].push(feature);
    });
    return grouped;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manajemen Role & Fitur
          </h1>
          <p className="mt-2 text-gray-600">
            Kelola role dan assign fitur dengan drag & drop
          </p>
        </div>
        <button
          onClick={() => setShowAddRole(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Role
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Grid3x3 className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Cara Menggunakan:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Drag fitur dari "Fitur Tersedia" atau dari role lain</li>
              <li>Drop ke role card yang diinginkan untuk assign fitur</li>
              <li>Drag fitur keluar dari role untuk unassign</li>
              <li>Klik "Tambah Role" untuk membuat role baru</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Add Role Modal */}
      {showAddRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Tambah Role Baru
              </h3>
              <button
                onClick={() => setShowAddRole(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="contoh: Manager"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newRole.displayName}
                  onChange={(e) =>
                    setNewRole({ ...newRole, displayName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="contoh: Manager Operasional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warna
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewRole({ ...newRole, color })}
                      className={`${color} h-10 rounded-lg ${
                        newRole.color === color
                          ? "ring-2 ring-offset-2 ring-primary-600"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddRole(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleAddRole}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Available Features Pool */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md border-2 border-dashed border-gray-300 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-gray-600" />
          Fitur Tersedia ({getUnassignedFeatures().length})
        </h3>

        {getUnassignedFeatures().length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Semua fitur sudah di-assign ke role
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(
              groupFeaturesByCategory(getUnassignedFeatures())
            ).map(([category, features]) => (
              <div key={category}>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  {category}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {features.map((feature) => (
                    <div
                      key={feature.id}
                      draggable
                      onDragStart={() => handleDragStart(feature, null)}
                      className="flex items-center space-x-2 p-3 bg-white rounded-lg cursor-move hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
                    >
                      <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {feature.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, role.id)}
            className={`bg-white rounded-lg shadow-md border-2 transition-all ${
              draggedFeature
                ? "border-primary-400 border-dashed"
                : "border-gray-200"
            }`}
          >
            {/* Role Header */}
            <div className={`${role.color} text-white px-4 py-3 rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{role.displayName}</h3>
                  <p className="text-xs opacity-90">{role.name}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-white bg-opacity-30 px-2 py-1 rounded text-sm font-medium">
                    {role.features.length}
                  </div>
                  {role.id !== "admin" && (
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="p-4 space-y-2 min-h-[200px] max-h-[400px] overflow-y-auto">
              {role.features.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Grid3x3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Belum ada fitur</p>
                  <p className="text-xs mt-1">Drag fitur ke sini</p>
                </div>
              ) : (
                Object.entries(groupFeaturesByCategory(role.features)).map(
                  ([category, features]) => (
                    <div key={category} className="mb-3">
                      <h4 className="text-xs font-semibold text-gray-500 mb-1 uppercase">
                        {category}
                      </h4>
                      <div className="space-y-1">
                        {features.map((feature) => (
                          <div
                            key={feature.id}
                            draggable
                            onDragStart={() =>
                              handleDragStart(feature, role.id)
                            }
                            className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors border border-gray-200"
                          >
                            <GripVertical className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate">
                                {feature.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Simpan Perubahan
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Klik tombol simpan untuk menyimpan konfigurasi role dan fitur
            </p>
          </div>
          <button
            onClick={() => {
              console.log("Saving roles:", JSON.stringify(roles, null, 2));
              alert("Konfigurasi role berhasil disimpan!");
            }}
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Save className="w-5 h-5 mr-2" />
            Simpan Konfigurasi
          </button>
        </div>
      </div>
    </div>
  );
}
