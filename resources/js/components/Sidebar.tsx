import {
    ChartPieIcon,
    WrenchScrewdriverIcon,
    ShoppingCartIcon,
    UsersIcon,
    Cog6ToothIcon,
    ArrowLeftStartOnRectangleIcon,
    ChevronDownIcon,
    // ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// Ganti dengan path logo kamu
import logo from '@/assets/images/cakra logo.png';

const menuItems = [
    {
        label: 'Exclusive Reports',
        icon: ChartPieIcon,
        href: '/admin/ExclusiveReports',
    },
    {
        label: 'PT3 Konstruksi',
        icon: WrenchScrewdriverIcon,
        href: '/admin/DashboardPT3',
        children: [
            { label: 'Manajemen PT3', href: '/admin/ManagementPT3' },
            { label: 'Eval Subcon PT3', href: '/admin/EvalSubconPT3' },
        ],
    },
    {
        label: 'PT2 Operasional',
        icon: ShoppingCartIcon,
        href: '/admin/DashboardPT2',
        children: [
            { label: 'Manajemen PT2', href: '/admin/ManagementPT2' },
        ],
    },
    {
        label: 'Manajemen Pengguna',
        icon: UsersIcon,
        href: '/admin/UserManagement',
    },
    {
        label: 'Pengaturan',
        icon: Cog6ToothIcon,
        href: '/admin/Setting',
    },
];
export default function Sidebar() {
const { url } = usePage();

    const [openMenus, setOpenMenus] = useState<string[]>(() => {
        return menuItems
            .filter(item =>
                item.children?.some(child => url.startsWith(child.href)) ||
                url.startsWith(item.href)
            )
            .map(item => item.label);
    });

    useEffect(() => {
        const activeParents = menuItems
            .filter(item =>
                item.children?.some(child => url.startsWith(child.href)) ||
                url.startsWith(item.href)
            )
            .map(item => item.label);

        setOpenMenus(prev => [...new Set([...prev, ...activeParents])]);
    }, [url]);

    const toggleMenu = (label: string) => {
        setOpenMenus((prev) =>
            prev.includes(label)
                ? prev.filter((m) => m !== label)
                : [...prev, label]
        );
    };

    const isActive = (href: string) => url.startsWith(href);

    return (
        <aside className="w-56 h-screen bg-white border-r border-gray-100 flex flex-col px-3 py-5">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-2 mb-8">
                <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
                <span className="text-lg font-bold text-gray-900 tracking-wide">CAKRA</span>
            </div>

            {/* Menu */}
            <nav className="flex-1 flex flex-col gap-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const hasChildren = !!item.children;
                    const isOpen = openMenus.includes(item.label);
                    const active = isActive(item.href);

                    return (
                        <div key={item.label}>
                            {hasChildren ? (
                                <Link
                                    href={item.href}
                                    onClick={() => toggleMenu(item.label)}  // ← toggle submenu
                                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        active
                                            ? 'bg-violet-100 text-violet-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Icon className="w-5 h-5" />
                                        {item.label}
                                    </div>
                                    <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                        <ChevronDownIcon className="w-4 h-4" />
                                    </span>
                                </Link>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                        active
                                            ? 'bg-violet-100 text-violet-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            )}

                            {/* Submenu dengan animasi */}
                            {hasChildren && (
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                        isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className="ml-4 mt-1 flex flex-col gap-1 border-l-2 border-violet-100 pl-3">
                                        {item.children!.map((child) => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                className={`text-sm py-2 px-2 rounded-lg transition-all duration-200 ${
                                                    isActive(child.href)
                                                        ? 'text-violet-700 font-semibold bg-violet-50'
                                                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                                }`}
                                            >
                                                {child.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Keluar */}
            <Link
                href="/logout"
                method="post"
                as="button"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 mt-2"
            >
                <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
                Keluar
            </Link>
        </aside>
    );
}