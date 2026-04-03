import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import AddModalLOP from "@/pages/admin/AddModalLOP";

export default function ManagementPT3() {
  const [search, setSearch] = useState("");
  const [showEntries, setShowEntries] = useState("10");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <AppLayout title="Manajemen PT3">
        <div className="min-h-screen bg-gray-100 p-6">

          {/* Page Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            PT3 Konstruksi
          </h1>

          {/* Card */}
          <div className="bg-white p-6 rounded-xl shadow">

            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-6">

              {/* Show X entries */}
              <div className="flex items-center gap-2 text-sm text-gray-600 shrink-0">
                <span>Show</span>
                <select
                  value={showEntries}
                  onChange={(e) => setShowEntries(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span>entries</span>
              </div>

              {/* Search + Filter — menyatu dalam satu border */}
              <div className="flex items-center flex-1 border border-gray-300 rounded-lg overflow-hidden">
                {/* Search Icon + Input */}
                <span className="pl-3 text-gray-400 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Cari LOP, IHLD..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm focus:outline-none bg-transparent"
                />
                {/* Divider */}
                <div className="w-px h-6 bg-gray-200 shrink-0" />
                {/* Filter Button — menyatu di kanan */}
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-violet-500 hover:bg-violet-600 transition font-medium shrink-0">
                  Filter
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 .707 1.707L13 12.414V19a1 1 0 0 1-1.447.894l-4-2A1 1 0 0 1 7 17v-4.586L3.293 5.707A1 1 0 0 1 3 5V4z" />
                  </svg>
                </button>
              </div>

              {/* Buat LOP Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2 text-sm bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition font-medium shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Buat LOP
              </button>
            </div>

            {/* Table Placeholder */}
            <div className="border border-dashed border-gray-300 rounded-lg flex items-center justify-center min-h-[320px] bg-gray-50">
              <div className="text-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 6h18M3 14h18M3 18h18" />
                </svg>
                <p className="text-sm font-medium">Tabel Data PT3</p>
                <p className="text-xs mt-1 text-gray-400">Tabel akan ditampilkan di sini</p>
              </div>
            </div>

          </div>
        </div>

        {/* Modal */}
        <AddModalLOP isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      </AppLayout>
    </>
  );
}