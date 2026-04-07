import {
    ChartPieIcon,
    WrenchScrewdriverIcon,
    ClipboardDocumentListIcon,
    UsersIcon,
    Cog6ToothIcon,
    ArrowLeftStartOnRectangleIcon,
    ChevronDownIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
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
        icon: ClipboardDocumentListIcon,
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

    const [collapsed, setCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebar-collapsed');
        if (saved !== null) return saved === 'true';
        return window.innerWidth < 1024;
    });

    const [openMenus, setOpenMenus] = useState<string[]>(() =>
        menuItems
            .filter(item =>
                item.children?.some(child => url.startsWith(child.href)) ||
                url.startsWith(item.href)
            )
            .map(item => item.label)
    );

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setCollapsed(true);
                localStorage.setItem('sidebar-collapsed', 'true');
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        localStorage.setItem('sidebar-collapsed', String(collapsed));
    }, [collapsed]);

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
        setOpenMenus(prev =>
            prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label]
        );
    };

    const isActive = (href: string) => url.startsWith(href);

    return (
        <aside
            style={{ transition: 'width 350ms cubic-bezier(0.4, 0, 0.2, 1)' }}
            className={`relative h-screen bg-white border-r border-gray-100 flex flex-col py-5 ${
                collapsed ? 'w-16 px-2' : 'w-56 px-3'
            }`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setCollapsed(prev => !prev)}
                className="absolute -right-3 top-6 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-violet-50 hover:border-violet-300 transition-all duration-200"
            >
                <span
                    style={{ transition: 'transform 350ms cubic-bezier(0.4, 0, 0.2, 1)' }}
                    className={`flex items-center justify-center ${collapsed ? 'rotate-0' : 'rotate-180'}`}
                >
                    <ChevronDoubleRightIcon className="w-3 h-3 text-gray-500" />
                </span>
            </button>

            {/* Logo */}
            <div className={`flex items-center mb-8 overflow-hidden ${collapsed ? 'justify-center' : 'gap-2.5 px-2'}`}>
                <img
                    src={logo}
                    alt="Logo"
                    style={{ transition: 'transform 350ms cubic-bezier(0.4, 0, 0.2, 1)' }}
                    className={`w-8 h-8 object-contain shrink-0 ${collapsed ? 'scale-110' : 'scale-100'}`}
                />
                <span
                    style={{ transition: 'opacity 250ms ease, max-width 350ms cubic-bezier(0.4, 0, 0.2, 1)' }}
                    className={`text-lg font-bold text-gray-900 tracking-wide whitespace-nowrap overflow-hidden ${
                        collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'
                    }`}
                >
                    CAKRA
                </span>
            </div>

            {/* Menu */}
            <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden scrollbar-hide">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const hasChildren = !!item.children;
                    const isOpen = openMenus.includes(item.label);
                    const active = isActive(item.href);

                    return (
                        <div key={item.label}>

                            {/* Menu Item */}
                            <Link
                                href={item.href}
                                title={collapsed ? item.label : undefined}
                                onClick={() => {
                                    if (hasChildren) toggleMenu(item.label);
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                                    collapsed ? 'justify-center' : 'justify-between'
                                } ${
                                    active
                                        ? 'bg-violet-100 text-violet-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <div className="relative flex items-center gap-2.5 min-w-0">
                                    <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'}`} />

                                    {/* Dot penanda ada submenu saat collapsed */}
                                    {hasChildren && collapsed && (
                                        <span
                                            style={{ transition: 'transform 200ms ease, opacity 200ms ease' }}
                                            className={`absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full ${
                                                isOpen ? 'bg-violet-500 scale-110' : 'bg-violet-300'
                                            }`}
                                        />
                                    )}

                                    <span
                                        style={{ transition: 'opacity 200ms ease, max-width 350ms cubic-bezier(0.4, 0, 0.2, 1)' }}
                                        className={`whitespace-nowrap overflow-hidden ${
                                            collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                </div>

                                {hasChildren && !collapsed && (
                                    <ChevronDownIcon
                                        style={{ transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
                                        className={`w-4 h-4 shrink-0 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                                    />
                                )}
                            </Link>

                            {/* Submenu expanded */}
                            {hasChildren && !collapsed && (
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateRows: isOpen ? '1fr' : '0fr',
                                        transition: 'grid-template-rows 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                >
                                    <div className="overflow-hidden">
                                        <div className="ml-4 mt-1 mb-1 flex flex-col gap-0.5 border-l-2 border-violet-100 pl-3">
                                            {item.children!.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className={`text-sm py-2 px-2 rounded-lg transition-all duration-200 ${
                                                        isActive(child.href)
                                                            ? 'text-violet-700 font-semibold bg-violet-50 translate-x-0.5'
                                                            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50 hover:translate-x-0.5'
                                                    }`}
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submenu collapsed — pill/dash */}
                            {hasChildren && collapsed && (
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateRows: isOpen ? '1fr' : '0fr',
                                        transition: 'grid-template-rows 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                >
                                    <div className="overflow-hidden">
                                        <div className="flex flex-col items-center gap-1.5 mt-1 mb-1 py-0.5">
                                            {item.children!.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    title={child.label}
                                                    className="flex items-center justify-center w-full py-1 group"
                                                >
                                                    <span
                                                        style={{ transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms ease' }}
                                                        className={`block h-1 rounded-full ${
                                                            isActive(child.href)
                                                                ? 'w-5 bg-violet-500'
                                                                : 'w-3 bg-gray-300 group-hover:w-5 group-hover:bg-violet-400'
                                                        }`}
                                                    />
                                                </Link>
                                            ))}
                                        </div>
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
                title={collapsed ? 'Keluar' : undefined}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 mt-2 ${
                    collapsed ? 'justify-center' : ''
                }`}
            >
                <ArrowLeftStartOnRectangleIcon className="w-5 h-5 shrink-0" />
                <span
                    style={{ transition: 'opacity 200ms ease, max-width 350ms cubic-bezier(0.4, 0, 0.2, 1)' }}
                    className={`whitespace-nowrap overflow-hidden ${
                        collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'
                    }`}
                >
                    Keluar
                </span>
            </Link>
        </aside>
    );
}