import { Link } from '@inertiajs/react';
import { useState } from "react";
import SearchFilter from "@/components/search-filter";
import AddLopMitraAdmin, { ExistingLOPData } from "./AddLopmitraAdmin";

interface LOPItem {
    region: string;
    distrik: string;
    ihld: string;
    lop: string;
    batch: string;
    nilaiBoq: string;
    status: string;
    subStatus: string;
    waspangMitra?: 'belum' | 'sudah';
    sto?: string;
    area?: string;
    branchFmc?: string;
    tahun?: string;
    mitra?: string;
    subcon?: string;
    boqPlan?: string;
    cpp?: string;
    odpPlan?: string;
    projectAdmin?: string;
    portPlan?: string;
}

const dummyData: LOPItem[] = [
    {
        region: 'SUMBAGUT',
        distrik: 'PEMATANG SIANTAR',
        ihld: '10882441',
        lop: 'SMU-ODC-PMS-FBS D BANTAN RESIDEN',
        batch: 'Batch 1',
        nilaiBoq: '133,381,508',
        status: 'GoLive',
        subStatus: 'x4 Non Teknis - CPP Tinggi (acc ED TIF)',
        waspangMitra: 'belum',
    },
    {
        region: 'SUMBAGUT',
        distrik: 'PEMATANG SIANTAR',
        ihld: '10882310',
        lop: 'SMU-ODC-BDG-CIHAMPELAS BLOK C',
        batch: 'Batch 1',
        nilaiBoq: '88,500,000',
        status: 'GoLive',
        subStatus: 'x4 Non Teknis - CPP Tinggi (acc ED TIF)',
        waspangMitra: 'sudah',
    },
    {
        region: 'SUMBAGUT',
        distrik: 'PEMATANG SIANTAR',
        ihld: '10882398',
        lop: 'SMU-ODC-PSR-GDG MERDEKA',
        batch: 'Batch 1',
        nilaiBoq: '98,200,000',
        status: 'GoLive',
        subStatus: 'x4 Non Teknis - CPP Tinggi',
        waspangMitra: 'belum',
    },
];

export default function ManagementPT3() {
    const [search, setSearch] = useState("");
    const [showEntries, setShowEntries] = useState("10");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLOP, setSelectedLOP] = useState<ExistingLOPData | null>(null);

    const data = dummyData;

    const filtered = data.filter(row =>
        row.lop.toLowerCase().includes(search.toLowerCase()) ||
        row.ihld.toLowerCase().includes(search.toLowerCase()) ||
        row.region.toLowerCase().includes(search.toLowerCase()) ||
        row.distrik.toLowerCase().includes(search.toLowerCase())
    );

    const belumDiisiCount = data.filter(row => row.waspangMitra === 'belum').length;

    return (
        <>
            <div className="min-h-screen bg-gray-100 p-4 sm:p-6">

                {/* Page Title + Icon Notifikasi */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        PT3 Konstruksi
                    </h1>
                    <Link
                        href="/mitraAdmin/Notification"
                        className="relative p-2 rounded-xl bg-white shadow hover:bg-violet-50 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {belumDiisiCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-semibold rounded-full ring-2 ring-white flex items-center justify-center">
                                {belumDiisiCount}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Banner peringatan */}
                {belumDiisiCount > 0 && (
                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        </svg>
                        <p className="text-sm text-amber-800 flex-1">
                            <span className="font-semibold">{belumDiisiCount} LOP belum dilengkapi.</span>{' '}
                            Waspang Mitra pada LOP berikut perlu kamu isi sebelum proses dapat dilanjutkan.
                        </p>
                    </div>
                )}

                {/* Card */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow">

                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">

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
                        <SearchFilter
                            placeholder="Cari LOP, IHLD..."
                            searchValue={search}
                            onSearchChange={setSearch}
                            onFilterClick={() => {}}
                        />

                        {/* Buat LOP Button */}
                        <button
                            onClick={() => {
                                setSelectedLOP(null);
                                setModalOpen(true);
                            }}
                            className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition font-medium shrink-0"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Buat LOP
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <div className="min-w-[700px] px-4 sm:px-0">
                            <table className="w-full text-sm border-separate" style={{ borderSpacing: '0 8px' }}>
                                <thead>
                                    <tr className="bg-violet-600 text-white">
                                        <th className="px-4 py-1 text-center font-medium rounded-l-sm whitespace-nowrap">Region FMC</th>
                                        <th className="px-4 py-1 text-center font-medium whitespace-nowrap">Distrik</th>
                                        <th className="px-4 py-1 text-center font-medium whitespace-nowrap">IHLD</th>
                                        <th className="px-4 py-1 text-center font-medium whitespace-nowrap">LOP</th>
                                        <th className="px-4 py-1 text-center font-medium whitespace-nowrap">Batch Program</th>
                                        <th className="px-4 py-1 text-center font-medium whitespace-nowrap">Nilai BOQ</th>
                                        <th className="px-4 py-1 text-center font-medium whitespace-nowrap">Status</th>
                                        <th className="px-4 py-1 text-center font-medium whitespace-nowrap">Sub Status</th>
                                        <th className="px-4 py-1 text-center font-medium rounded-r-sm whitespace-nowrap">Detail LOP</th>
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
                                            <tr
                                                key={i}
                                                className={row.waspangMitra === 'belum' ? 'bg-amber-50' : 'bg-white'}
                                            >
                                                <td className="px-4 py-4 text-center text-gray-700 font-medium border-y border-l border-gray-100 rounded-l-sm">
                                                    {row.region}
                                                </td>
                                                <td className="px-4 py-4 text-center text-gray-600 border-y border-gray-100">
                                                    {row.distrik}
                                                </td>
                                                <td className="px-4 py-4 text-center text-gray-600 border-y border-gray-100">
                                                    {row.ihld}
                                                </td>

                                                {/* Kolom LOP */}
                                                <td className="px-4 py-3 text-center border-y border-gray-100">
                                                    <p className="text-gray-600 text-xs leading-relaxed mb-1">{row.lop}</p>
                                                    {row.waspangMitra === 'belum' ? (
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                                                            <span className="text-[11px] text-amber-700">Waspang Mitra belum diisi</span>
                                                            <span className="text-amber-400 text-[11px]">—</span>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedLOP({
                                                                        idIhld:       row.ihld,
                                                                        lop:          row.lop,
                                                                        sto:          row.sto ?? "",
                                                                        regionTif:    row.region,
                                                                        area:         row.area ?? "",
                                                                        branchFmc:    row.branchFmc ?? "",
                                                                        batchProgram: row.batch,
                                                                        tahun:        row.tahun ?? "",
                                                                        mitra:        row.mitra ?? "",
                                                                        subcon:       row.subcon ?? "",
                                                                        boqPlan:      row.boqPlan ?? "",
                                                                        cpp:          row.cpp ?? "",
                                                                        odpPlan:      row.odpPlan ?? "",
                                                                        projectAdmin: row.projectAdmin ?? "",
                                                                        portPlan:     row.portPlan ?? "",
                                                                    });
                                                                    setModalOpen(true);
                                                                }}
                                                                className="text-[11px] font-medium text-violet-600 hover:underline whitespace-nowrap"
                                                            >
                                                                Isi sekarang
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
                                                            <span className="text-[11px] text-green-700">Waspang Mitra sudah diisi</span>
                                                        </div>
                                                    )}
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
                                                        href="/mitraAdmin/DetailLOP"
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
                        </div>

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

            {/* Modal AddLopMitraAdmin */}
            <AddLopMitraAdmin
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                existingData={selectedLOP}
            />
        </>
    );
}