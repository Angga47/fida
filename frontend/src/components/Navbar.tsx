"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { LogOut, User } from "lucide-react";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MobileMenu />
            <img
              src="/logo.png"
              alt="Mitra Keluarga Logo"
              className="h-10 md:h-12 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-primary-600">
                Form Usulan Investasi
              </h1>
              <p className="text-xs text-gray-500">Mitra Keluarga</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              <div className="text-xs md:text-sm">
                <p className="font-medium text-gray-900 truncate max-w-[120px] md:max-w-none">
                  {user?.full_name || user?.username}
                </p>
                <p className="text-gray-500 hidden md:block">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
