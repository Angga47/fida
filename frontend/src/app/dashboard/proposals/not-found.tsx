"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, ArrowLeft, AlertCircle } from "lucide-react";

export default function ProposalNotFound() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8 bg-white rounded-lg shadow-lg p-8">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Usulan Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-6">
            Usulan investasi yang Anda cari tidak ditemukan. Mungkin sudah
            dihapus atau Anda tidak memiliki akses untuk melihatnya.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Kemungkinan penyebab:</strong>
            </p>
            <ul className="text-sm text-yellow-700 mt-2 space-y-1 text-left">
              <li>• Usulan sudah dihapus oleh pembuat</li>
              <li>• Anda tidak memiliki akses ke usulan ini</li>
              <li>• Link yang Anda gunakan sudah tidak valid</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali
          </button>

          <Link
            href="/dashboard/proposals"
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FileText className="w-5 h-5 mr-2" />
            Lihat Semua Usulan
          </Link>
        </div>
      </div>
    </div>
  );
}
