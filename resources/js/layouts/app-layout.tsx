import { usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

interface Props {
    title?: string;
}

export default function AppLayout({ children, title = 'Dashboard' }: PropsWithChildren<Props>) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div
                className="flex flex-col min-h-screen"
                style={{
                    width: 'calc(100% - var(--sidebar-width, 224px))',
                    marginLeft: 'var(--sidebar-width, 224px)',
                    transition: 'width 350ms cubic-bezier(0.4, 0, 0.2, 1), margin-left 350ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <Navbar title={title} />
                <main className="flex-1 min-w-0 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}