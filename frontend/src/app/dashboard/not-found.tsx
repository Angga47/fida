"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";

export default function NotFoundDashboard() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <AlertCircle className="w-20 h-20 mx-auto text-yellow-500 mb-4" />
          <h1 className="text-5xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Data Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-8">
            Data yang Anda cari tidak ditemukan. Mungkin sudah dihapus atau Anda
            tidak memiliki akses.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali
          </button>

          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
