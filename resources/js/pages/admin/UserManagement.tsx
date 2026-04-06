import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    PlusIcon,
    PencilSquareIcon,
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

];

const activityLog = [
    { name: 'Alfonso', time: '07.30', activity: 'Input Data' },
    { name: 'Calzoni', time: '07.30', activity: 'Input Data' },

];

const ITEMS_PER_PAGE = 8;

export default function UserManagement() {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

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
            <div className="flex gap-5">

                {/* Kiri — Tabel */}
                <div className="flex-1 min-w-0">

                    {/* Toolbar */}
                    <div className="flex items-center gap-3 mb-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari LOP, IHLD..."
                                value={search}
                                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filter */}
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-all">
                            Filter
                            <FunnelIcon className="w-4 h-4" />
                        </button>

                        {/* Tambah */}
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-all">
                            <PlusIcon className="w-4 h-4" />
                            Pengguna
                        </button>
                    </div>

                  {/* Tabel user */}
                  <table className="w-full text-sm border-separate" style={{ borderSpacing: '0 6px' }}>
                      <thead>
                          <tr className="bg-violet-600 text-white">
                              <th className="px-4 py-1 text-center font-medium text-sm rounded-l-sm">Full Name</th>
                              <th className="px-4 py-1 text-center font-medium text-sm">Email</th>
                              <th className="px-4 py-1 text-center font-medium text-sm">Subcon</th>
                              <th className="px-4 py-1 text-center font-medium text-sm">Role</th>
                              <th className="px-4 py-1 text-center font-medium text-sm">Joined<br/>Date</th>
                              <th className="px-4 py-1 text-center font-medium text-sm">Last Active</th>
                              <th className="px-4 py-1 text-center font-medium text-sm">Status</th>
                              <th className="px-4 py-1 text-center font-medium text-sm rounded-r-sm">Action</th>
                          </tr>
                      </thead>
                      <tbody>
                          {paginated.map((user) => (
                              <tr key={user.id} className="bg-white">
                                  <td className="px-4 py-4 text-center text-gray-800 font-medium border-y border-l border-gray-100 rounded-l-sm">
                                      {user.name}
                                  </td>
                                  <td className="px-4 py-4 text-center text-gray-500 border-y border-gray-100">
                                      {user.email}
                                  </td>
                                  <td className="px-4 py-4 text-center text-gray-500 border-y border-gray-100 text-xs leading-relaxed whitespace-pre-line">
                                      {user.wilayah}
                                  </td>
                                  <td className="px-4 py-4 text-center text-gray-500 border-y border-gray-100">
                                      {user.role}
                                  </td>
                                  <td className="px-4 py-4 text-center text-gray-500 border-y border-gray-100">
                                      {user.joinedDate}
                                  </td>
                                  <td className="px-4 py-4 text-center text-gray-500 border-y border-gray-100">
                                      {user.lastActive}
                                  </td>
                                  <td className="px-4 py-4 text-center border-y border-gray-100">
                                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                          user.status === 'Active'
                                              ? 'bg-green-100 text-green-600'
                                              : user.status === 'Inactive'
                                              ? 'bg-gray-200 text-gray-500'
                                              : 'bg-green-100 text-green-600'
                                      }`}>
                                          {user.status}
                                      </span>
                                  </td>
                                  <td className="px-4 py-4 text-center border-y border-r border-gray-100 rounded-r-sm">
                                      <div className="flex items-center justify-center gap-2">
                                          <button className="p-1.5 rounded-lg text-violet-500 hover:bg-violet-50 transition-colors">
                                              <PencilSquareIcon className="w-4 h-4" />
                                          </button>
                                          <button className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                                              <TrashIcon className="w-4 h-4" />
                                          </button>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                </div>

                {/* Kanan — User Online Panel */}
                <div className="w-56 shrink-0">
                    <div className="bg-white rounded-2xl border border-gray-100 p-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-semibold text-gray-500 tracking-widest uppercase">User Online</span>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        </div>

                        {/* Avatar online */}
                        <div className="flex items-center justify-between mb-4">
                            {onlineUsers.map((u) => (
                                <div key={u.name} className="flex flex-col items-center gap-1">
                                    <img
                                        src={u.avatar}
                                        alt={u.name}
                                        className="w-10 h-10 rounded-full ring-2 ring-white"
                                    />
                                    <span className="text-xs text-gray-500">{u.name}</span>
                                </div>
                            ))}
                        </div>

                        {/* Activity log header */}
                        <div className="grid grid-cols-3 text-xs font-medium text-gray-500 border-b border-gray-100 pb-2 mb-2">
                            <span>Pengguna</span>
                            <span>Login</span>
                            <span>Aktivitas</span>
                        </div>

                        {/* Activity list */}
                        <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto">
                            {activityLog.map((log, i) => (
                                <div key={i} className="grid grid-cols-3 text-xs text-gray-600">
                                    <span className="truncate">{log.name}</span>
                                    <span>{log.time}</span>
                                    <span className="truncate">{log.activity}</span>
                                </div>
                            ))}
                        </div>

                        {/* Lihat semua */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <button className="text-xs text-violet-600 hover:underline w-full text-right">
                                Lihat Semua →
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}