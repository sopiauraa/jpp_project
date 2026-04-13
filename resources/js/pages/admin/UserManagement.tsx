import { useState } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SearchFilter from "@/components/search-filter";
import AddModalUser from '@/pages/admin/AddModalUser';
import ActivityDrawer from '@/pages/admin/ActivityDrawer';
import {
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';

const users = [
    {
        id: 1,
        name: 'Alfonso',
        email: 'alfonso@gmail.com',
        wilayah: 'Medan',
        role: 'Admin',
        joinedDate: '1 Jan 2024',
        lastActive: '1 menit lalu',
        status: 'Active',
        avatar: 'https://ui-avatars.com/api/?name=Alfonso&background=7c3aed&color=fff',
    }
];

const onlineUsers = [
    { name: 'Alfonso', avatar: 'https://ui-avatars.com/api/?name=Alfonso&background=7c3aed&color=fff' },
    { name: 'Calzoni', avatar: 'https://ui-avatars.com/api/?name=Calzoni&background=f97316&color=fff' },
    { name: 'Budi',    avatar: 'https://ui-avatars.com/api/?name=Budi&background=0ea5e9&color=fff' },
    { name: 'Dewi',    avatar: 'https://ui-avatars.com/api/?name=Dewi&background=ec4899&color=fff' },
    { name: 'Eko',     avatar: 'https://ui-avatars.com/api/?name=Eko&background=10b981&color=fff' },
    { name: 'Fani',    avatar: 'https://ui-avatars.com/api/?name=Fani&background=f59e0b&color=fff' },
];

const activityLog = [
    { name: 'Alfonso', time: '07.30', activity: 'Input Data' },
    { name: 'Calzoni', time: '07.32', activity: 'Input Data' },
    { name: 'Budi',    time: '07.35', activity: 'Edit Data' },
    { name: 'Dewi',    time: '07.40', activity: 'Input Data' },
    { name: 'Eko',     time: '07.45', activity: 'Hapus Data' },
    { name: 'Fani',    time: '07.50', activity: 'Input Data' },
    { name: 'Alfonso', time: '08.00', activity: 'Edit Data' },
    { name: 'Calzoni', time: '08.05', activity: 'Input Data' },
    { name: 'Budi',    time: '08.10', activity: 'Input Data' },
    { name: 'Dewi',    time: '08.15', activity: 'Edit Data' },
];

const ITEMS_PER_PAGE = 8;
const MAX_AVATAR = 4;
const MAX_LOG = 10;

export default function UserManagement() {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showPanel, setShowPanel] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <AppLayout title="Manajemen Pengguna">
            <div className="px-6 pb-6 pt-4">
                <div className="flex flex-col lg:flex-row gap-3">

                    {/* Kiri — Card putih konten utama */}
                    <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
                            <SearchFilter
                                placeholder="Cari nama, email..."
                                searchValue={search}
                                onSearchChange={(val) => { setSearch(val); setCurrentPage(1); }}
                                onFilterClick={() => {}}
                            />

                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-all shrink-0"
                            >
                                <PlusIcon className="w-4 h-4" />
                                Pengguna
                            </button>

                            <button
                                onClick={() => setShowPanel(!showPanel)}
                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-all shrink-0 lg:hidden"
                            >
                                <span className="w-2 h-2 bg-green-400 rounded-full" />
                                User Online
                            </button>
                        </div>

                        {/* User Online Panel — mobile (collapsible) */}
                        {showPanel && (
                            <div className="lg:hidden mb-4 bg-gray-50 rounded-xl border border-gray-100 p-4">
                                <OnlinePanel
                                    onlineUsers={onlineUsers}
                                    activityLog={activityLog}
                                    maxAvatar={MAX_AVATAR}
                                    maxLog={MAX_LOG}
                                    onViewAll={() => setShowDrawer(true)}
                                />
                            </div>
                        )}

                        {/* Tabel */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-separate" style={{ borderSpacing: '0 8px' }}>
                                <thead>
                                    <tr className="bg-violet-600 text-white">
                                        <th className="px-4 py-2 text-center font-medium rounded-l-lg whitespace-nowrap">Full Name</th>
                                        <th className="px-4 py-2 text-center font-medium whitespace-nowrap">Email</th>
                                        <th className="px-4 py-2 text-center font-medium whitespace-nowrap">Subcon</th>
                                        <th className="px-4 py-2 text-center font-medium whitespace-nowrap">Role</th>
                                        <th className="px-4 py-2 text-center font-medium whitespace-nowrap">Joined Date</th>
                                        <th className="px-4 py-2 text-center font-medium whitespace-nowrap">Last Active</th>
                                        <th className="px-4 py-2 text-center font-medium whitespace-nowrap">Status</th>
                                        <th className="px-4 py-2 text-center font-medium rounded-r-lg whitespace-nowrap">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginated.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="text-center py-10 text-gray-400 text-sm">
                                                Tidak ada data yang cocok.
                                            </td>
                                        </tr>
                                    ) : (
                                        paginated.map((user) => (
                                            <tr key={user.id} className="bg-gray-50 hover:bg-violet-50 transition-colors">
                                                <td className="px-4 py-3.5 text-center text-gray-800 font-medium rounded-l-lg whitespace-nowrap">
                                                    {user.name}
                                                </td>
                                                <td className="px-4 py-3.5 text-center text-gray-500 whitespace-nowrap">
                                                    {user.email}
                                                </td>
                                                <td className="px-4 py-3.5 text-center text-gray-500 whitespace-nowrap">
                                                    {user.wilayah}
                                                </td>
                                                <td className="px-4 py-3.5 text-center text-gray-500 whitespace-nowrap">
                                                    {user.role}
                                                </td>
                                                <td className="px-4 py-3.5 text-center text-gray-500 whitespace-nowrap">
                                                    {user.joinedDate}
                                                </td>
                                                <td className="px-4 py-3.5 text-center text-gray-500 whitespace-nowrap">
                                                    {user.lastActive}
                                                </td>
                                                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                        user.status === 'Active'
                                                            ? 'bg-green-100 text-green-600'
                                                            : 'bg-gray-200 text-gray-500'
                                                    }`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-center rounded-r-lg whitespace-nowrap">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {/* Detail icon — sama persis dengan ManagementPT3 */}
                                                        <Link
                                                            href={`/admin/DetailUser/${user.id}`}
                                                            className="p-1.5 rounded-lg bg-violet-500 hover:bg-violet-600 text-white transition-colors inline-flex"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                                            </svg>
                                                        </Link>
                                                        <button className="p-1.5 rounded-lg text-red-400 hover:bg-red-100 transition-colors">
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-1.5 pt-4">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-all disabled:opacity-40"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                                            page === currentPage
                                                ? 'bg-violet-600 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-all disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Kanan — User Online Panel (desktop only) */}
                    <div className="hidden lg:block w-56 shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-4">
                            <OnlinePanel
                                onlineUsers={onlineUsers}
                                activityLog={activityLog}
                                maxAvatar={MAX_AVATAR}
                                maxLog={MAX_LOG}
                                onViewAll={() => setShowDrawer(true)}
                            />
                        </div>
                    </div>

                </div>
            </div>

            <AddModalUser
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />

            <ActivityDrawer
                isOpen={showDrawer}
                onClose={() => setShowDrawer(false)}
                activityLog={activityLog}
                onlineUsers={onlineUsers}
            />
        </AppLayout>
    );
}

function OnlinePanel({
    onlineUsers,
    activityLog,
    maxAvatar = 4,
    maxLog = 10,
    onViewAll,
}: {
    onlineUsers: { name: string; avatar: string }[];
    activityLog: { name: string; time: string; activity: string }[];
    maxAvatar?: number;
    maxLog?: number;
    onViewAll?: () => void;
}) {
    const visibleAvatars = onlineUsers.slice(0, maxAvatar);
    const remainingCount = onlineUsers.length - maxAvatar;

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-gray-500 tracking-widest uppercase">User Online</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>

            <div className="grid grid-cols-5 gap-1 mb-4">
                {visibleAvatars.map((u) => (
                    <div key={u.name} className="flex flex-col items-center gap-1">
                        <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full ring-2 ring-white shadow-sm"
                        />
                        <span className="text-[9px] text-gray-500 truncate w-full text-center">{u.name}</span>
                    </div>
                ))}
                {remainingCount > 0 && (
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center ring-2 ring-white shadow-sm">
                            <span className="text-xs text-violet-600 font-semibold">+{remainingCount}</span>
                        </div>
                        <span className="text-[9px] text-gray-400 w-full text-center">lainnya</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-3 text-xs font-medium text-gray-500 border-b border-gray-100 pb-2 mb-2">
                <span>Pengguna</span>
                <span>Login</span>
                <span>Aktivitas</span>
            </div>

            <div className="flex flex-col gap-1.5 max-h-96 overflow-y-auto pr-1">
                {activityLog.slice(0, maxLog).map((log, i) => (
                    <div key={i} className="grid grid-cols-3 text-xs text-gray-600 py-0.5">
                        <span className="truncate">{log.name}</span>
                        <span>{log.time}</span>
                        <span className="truncate">{log.activity}</span>
                    </div>
                ))}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
                <button
                    onClick={onViewAll}
                    className="text-xs text-violet-600 hover:underline w-full text-right"
                >
                    Lihat Semua →
                </button>
            </div>
        </>
    );
}