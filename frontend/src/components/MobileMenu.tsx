"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  FileText,
  Users,
  Settings,
  Shield,
  Grid3x3,
  Clock,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/proposals", label: "Usulan Investasi", icon: FileText },
  ];

  // Add admin menu
  if (user?.role === "admin") {
    menuItems.push(
      { href: "/dashboard/users", label: "Kelola User", icon: Users },
      { href: "/dashboard/roles", label: "Assign User ke Role", icon: Shield },
      {
        href: "/dashboard/role-features",
        label: "Kelola Role & Fitur",
        icon: Grid3x3,
      },
      { href: "/dashboard/login-logs", label: "Log Login", icon: Clock },
      { href: "/dashboard/config", label: "Konfigurasi LDAP", icon: Settings }
    );
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-br from-primary-50 to-white">
          <div className="flex flex-col items-center">
            <img
              src="/logo.png"
              alt="Mitra Keluarga Logo"
              className="h-16 w-auto object-contain mb-2"
            />
            <p className="text-xs font-semibold text-primary-700 text-center">
              Form Usulan Investasi
            </p>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
