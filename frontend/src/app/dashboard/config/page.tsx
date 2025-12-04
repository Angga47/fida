"use client";

import { useEffect, useState } from "react";
import {
  configService,
  LDAPConfig,
  UpdateLDAPConfigRequest,
} from "@/services/config.service";
import { Save, TestTube, Server, AlertCircle, CheckCircle } from "lucide-react";

export default function ConfigPage() {
  const [config, setConfig] = useState<LDAPConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState<UpdateLDAPConfigRequest>({
    server: "",
    port: 389,
    base_dn: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await configService.getLDAPConfig();
      setConfig(data);
      setFormData({
        server: data.server,
        port: data.port,
        base_dn: data.base_dn,
        username: data.username,
        password: "",
      });
    } catch (error) {
      console.error("Failed to load config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await configService.updateLDAPConfig(formData);
      alert(result.message);
      setConfig(result.config);
      setFormData({ ...formData, password: "" }); // Clear password after save
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to update configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await configService.testLDAPConnection();
      setTestResult(result);
    } catch (error: any) {
      setTestResult({
        success: false,
        message: error.response?.data?.error || "Connection test failed",
      });
    } finally {
      setTesting(false);
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
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Konfigurasi LDAP</h1>
        <p className="mt-2 text-gray-600">
          Manage LDAP server configuration for authentication
        </p>
      </div>

      {/* Current Config Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Server className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              Konfigurasi Saat Ini
            </h3>
            {config && (
              <div className="text-sm text-blue-800 space-y-1">
                <p>
                  <strong>Server:</strong> {config.server}:{config.port}
                </p>
                <p>
                  <strong>Base DN:</strong> {config.base_dn}
                </p>
                <p>
                  <strong>Bind Username:</strong> {config.username}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Test Result */}
      {testResult && (
        <div
          className={`border rounded-lg p-4 mb-6 ${
            testResult.success
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-start">
            {testResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
            )}
            <div>
              <h3
                className={`text-sm font-medium mb-1 ${
                  testResult.success ? "text-green-900" : "text-red-900"
                }`}
              >
                {testResult.success
                  ? "Connection Successful"
                  : "Connection Failed"}
              </h3>
              <p
                className={`text-sm ${
                  testResult.success ? "text-green-800" : "text-red-800"
                }`}
              >
                {testResult.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Form */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">LDAP Settings</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LDAP Server <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.server}
                onChange={(e) =>
                  setFormData({ ...formData, server: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="10.101.32.9"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                IP address or hostname of LDAP server
              </p>
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Port <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.port}
                onChange={(e) =>
                  setFormData({ ...formData, port: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="389"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Default: 389 (LDAP), 636 (LDAPS)
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base DN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.base_dn}
              onChange={(e) =>
                setFormData({ ...formData, base_dn: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="DC=mitrakeluarga,DC=com"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Base Distinguished Name for LDAP searches
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bind Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="admldap@mitrakeluarga.com"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Username for LDAP bind operation
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bind Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="••••••••"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Password for LDAP bind operation
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Peringatan</p>
                <p>
                  Perubahan konfigurasi LDAP akan berlaku setelah server
                  di-restart. Pastikan konfigurasi sudah benar sebelum
                  menyimpan.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleTest}
              disabled={testing}
              className="inline-flex items-center px-4 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50"
            >
              {testing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4 mr-2" />
                  Test Connection
                </>
              )}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Konfigurasi
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Help Section */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Bantuan Konfigurasi
        </h3>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>Pastikan LDAP server dapat diakses dari jaringan ini</li>
          <li>Gunakan Test Connection untuk memverifikasi koneksi</li>
          <li>Base DN harus sesuai dengan struktur Active Directory Anda</li>
          <li>Bind credentials harus memiliki permission untuk search users</li>
        </ul>
      </div>
    </div>
  );
}
