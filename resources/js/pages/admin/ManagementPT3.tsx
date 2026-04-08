import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import AddModalLOP from "@/pages/admin/AddModalLOP";

// ✅ Tipe data — nanti tinggal sesuaikan sama response API
interface LOPItem {
    region: string;
    ihld: string;
    lop: string;
    batch: string;
    nilaiBoq: string;
    status: string;
    subStatus: string;
}

// ✅ Dummy data — nanti hapus ini & ganti dengan usePage().props
const dummyData: LOPItem[] = [
    {
        region: 'SUMBAGUT',
        ihld: '10882441',
        lop: 'SMU-ODC-PMS-FBS D BANTAN RESIDEN',
        batch: 'Batch 1',
        nilaiBoq: '133,381,508',
        status: 'GoLive',
        subStatus: 'x4 Non Teknis - CPP Tinggi (acc ED TIF)',
    },
];

export default function ManagementPT3() {
    const [search, setSearch] = useState("");
    const [showEntries, setShowEntries] = useState("10");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ✅ Nanti ganti baris ini dengan:
    // const { data } = usePage().props as { data: LOPItem[] };
    const data = dummyData;

    const filtered = data.filter(row =>
        row.lop.toLowerCase().includes(search.toLowerCase()) ||
        row.ihld.toLowerCase().includes(search.toLowerCase()) ||
        row.region.toLowerCase().includes(search.toLowerCase()) 
    );

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
                                    className="border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <span>entries</span>
                            </div>

                            {/* Search + Filter */}
                            <div className="flex items-center flex-1 border border-gray-300 rounded-lg overflow-hidden">
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
                                <div className="w-px h-6 bg-gray-200 shrink-0" />
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

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-separate" style={{ borderSpacing: '0 8px' }}>
                                <thead>
                                    <tr className="bg-violet-600 text-white">
                                        <th className="px-4 py-1 text-center font-medium rounded-l-sm">Region FMC</th>
                                        <th className="px-4 py-1 text-center font-medium">IHLD</th>
                                        <th className="px-4 py-1 text-center font-medium">LOP</th>
                                        <th className="px-4 py-1 text-center font-medium">Batch Program</th>
                                        <th className="px-4 py-1 text-center font-medium">Nilai BOQ</th>
                                        <th className="px-4 py-1 text-center font-medium">Status</th>
                                        <th className="px-4 py-1 text-center font-medium">Sub Status</th>
                                        <th className="px-4 py-1 text-center font-medium rounded-r-sm">Detail LOP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="text-center py-10 text-gray-400 text-sm">
                                                Tidak ada data yang cocok dengan pencarian.
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map((row, i) => (
                                            <tr key={i} className="bg-white">
                                                <td className="px-4 py-4 text-center text-gray-700 font-medium border-y border-l border-gray-100 rounded-l-sm">
                                                    {row.region}
                                                </td>
                                                <td className="px-4 py-4 text-center text-gray-600 border-y border-gray-100">
                                                    {row.ihld}
                                                </td>
                                                <td className="px-4 py-4 text-center text-gray-600 border-y border-gray-100 text-xs leading-relaxed">
                                                    {row.lop}
                                                </td>
                                                <td className="px-4 py-4 text-center text-gray-600 border-y border-gray-100">
                                                    {row.batch}
                                                </td>
                                                <td className="px-4 py-4 text-center text-gray-600 border-y border-gray-100">
                                                    {row.nilaiBoq}
                                                </td>
                                                <td className="px-4 py-4 text-center border-y border-gray-100">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                        row.status === 'GoLive'
                                                            ? 'bg-green-100 text-green-600'
                                                            : row.status === 'Inactive'
                                                            ? 'bg-gray-100 text-gray-500'
                                                            : 'bg-yellow-100 text-yellow-600'
                                                    }`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center text-gray-600 border-y border-gray-100 text-xs">
                                                    {row.subStatus}
                                                </td>
                                                <td className="px-4 py-4 text-center border-y border-r border-gray-100 rounded-r-sm">
                                                    <Link
                                                        href="/admin/DetailLOP"
                                                        className="p-1.5 rounded-lg bg-violet-500 hover:bg-violet-600 text-white transition-colors inline-flex"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                                        </svg>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div className="flex items-center justify-center gap-1.5 py-4">
                                <button className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-all">
                                    Previous
                                </button>
                                {[1, 2, 3].map(page => (
                                    <button
                                        key={page}
                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                                            page === 1
                                                ? 'bg-violet-600 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-all">
                                    Next
                                </button>
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