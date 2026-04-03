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
            <div className="flex-1 flex flex-col">
                <Navbar title={title} />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}