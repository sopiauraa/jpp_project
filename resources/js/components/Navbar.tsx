import { BellIcon, ChevronDownIcon, UserCircleIcon, Cog6ToothIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';

interface NavbarProps {
    title: string;
}

export default function Navbar({ title }: NavbarProps) {
    const { auth } = usePage().props as any;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Tutup dropdown kalau klik di luar
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userName = auth?.user?.name ?? 'User';
    const userRole = auth?.user?.role ?? 'Admin';
    const avatarUrl = auth?.user?.avatar
        ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=7c3aed&color=fff&bold=true`;

    return (
        <header className="h-16 bg-white border-b border-gray-100 px-6 pl-16 lg:pl-6 flex items-center justify-between sticky top-0 z-30">

            {/* Judul Halaman */}
            <h1 className="text-base lg:text-xl font-bold text-gray-900 truncate max-w-[160px] sm:max-w-xs lg:max-w-none">{title}</h1>

            {/* Kanan */}
            <div className="flex items-center gap-1.5 lg:gap-3">

                {/* Notifikasi — klik ke halaman notifikasi */}
                <Link
                    href="/admin/Notification"
                    className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-violet-50 hover:text-violet-600 transition-all duration-200"
                >
                    <BellIcon className="w-5 h-5" />
                    {/* Badge */}
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2.5 hover:bg-gray-50 rounded-xl px-2 py-1.5 transition-all duration-200"
                    >
                        <img
                            src={avatarUrl}
                            alt={userName}
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-100"
                        />
                        <div className="text-left hidden sm:block">
                            <p className="text-sm font-semibold text-gray-800 leading-tight">{userName}</p>
                            <p className="text-xs text-gray-400 leading-tight">{userRole}</p>
                        </div>
                        <ChevronDownIcon
                            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {/* Dropdown */}
                    <div
                        className={`absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 transition-all duration-200 origin-top-right ${
                            dropdownOpen
                                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                                : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
                        }`}
                    >
                        {/* Header dropdown */}
                        <div className="px-4 py-2.5 border-b border-gray-100 mb-1">
                            <p className="text-sm font-semibold text-gray-800">{userName}</p>
                            <p className="text-xs text-gray-400">{userRole}</p>
                        </div>

                        <Link
                            href="/admin/Profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <UserCircleIcon className="w-4 h-4 text-gray-400" />
                            Profile
                        </Link>

                        <Link
                            href="/admin/Setting"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Cog6ToothIcon className="w-4 h-4 text-gray-400" />
                            Pengaturan
                        </Link>

                        <div className="border-t border-gray-100 my-1" />

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <ArrowLeftStartOnRectangleIcon className="w-4 h-4" />
                            Keluar
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}