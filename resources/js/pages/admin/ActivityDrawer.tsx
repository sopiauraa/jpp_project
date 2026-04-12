import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const activityColors: Record<string, string> = {
    'Input Data':  'bg-blue-100 text-blue-600',
    'Edit Data':   'bg-amber-100 text-amber-600',
    'Hapus Data':  'bg-red-100 text-red-600',
};

interface ActivityLog {
    name: string;
    time: string;
    activity: string;
}

interface ActivityDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    activityLog: ActivityLog[];
    onlineUsers: { name: string; avatar: string }[];
}

export default function ActivityDrawer({ isOpen, onClose, activityLog, onlineUsers }: ActivityDrawerProps) {

    // close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    // lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            />

            {/* Drawer */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-base font-semibold text-gray-800">Activity Log</h2>
                        <p className="text-xs text-gray-400 mt-0.5">{activityLog.length} aktivitas tercatat</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Online Users */}
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                            Sedang Online
                        </span>
                        <span className="ml-auto text-xs font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                            {onlineUsers.length} user
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {onlineUsers.map((u) => (
                            <div key={u.name} className="flex items-center gap-1.5 bg-gray-50 rounded-full px-2.5 py-1 border border-gray-100">
                                <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full" />
                                <span className="text-xs text-gray-600 font-medium">{u.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Log List */}
                <div className="flex-1 overflow-y-auto px-6 py-4">

                    {/* Table Header */}
                    <div className="grid grid-cols-3 text-xs font-semibold text-gray-400 uppercase tracking-wider pb-2 mb-2 border-b border-gray-100">
                        <span>Pengguna</span>
                        <span>Waktu</span>
                        <span>Aktivitas</span>
                    </div>

                    {/* Rows */}
                    <div className="flex flex-col gap-1">
                        {activityLog.map((log, i) => (
                            <div
                                key={i}
                                className="grid grid-cols-3 items-center py-2.5 border-b border-gray-50 hover:bg-gray-50 rounded-lg px-1 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${log.name}&background=7c3aed&color=fff&size=28`}
                                        alt={log.name}
                                        className="w-6 h-6 rounded-full"
                                    />
                                    <span className="text-sm text-gray-700 font-medium">{log.name}</span>
                                </div>
                                <span className="text-sm text-gray-500">{log.time}</span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium w-fit ${
                                    activityColors[log.activity] ?? 'bg-gray-100 text-gray-500'
                                }`}>
                                    {log.activity}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-400 text-center">
                        Menampilkan {activityLog.length} aktivitas terakhir
                    </p>
                </div>
            </div>
        </>
    );
}