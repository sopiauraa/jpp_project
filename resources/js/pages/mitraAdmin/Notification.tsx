import { Link } from '@inertiajs/react';

import { useState } from "react";

// ─── Icons ───────────────────────────────────────────────────────────────────
const CheckCircleIcon = () => (
  <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path fill="white" d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L1.5 21h21L12 2zm0 3.5L20.5 19h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z" />
  </svg>
);

const RedDotIcon = () => (
  <span className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
    <span className="text-white text-xs font-bold">!</span>
  </span>
);

const DocumentIcon = () => (
  <span className="w-6 h-6 rounded bg-purple-600 flex items-center justify-center text-white text-xs font-bold">Iz</span>
);

const RecalcIcon = () => (
  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const TerminationIcon = () => (
  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const NewLOPIcon = () => (
  <span className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  </span>
);

// ─── Types ────────────────────────────────────────────────────────────────────
type NotifCategory = "Semua" | "Update LOP";

interface Notification {
  id: number;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  description: string;
  time: string;
  action: { label: string; href?: string };
  category: ("Update LOP")[];
  isNew?: boolean;
  isRead?: boolean;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const notifications: Notification[] = [
  {
    id: 0,
    icon: <NewLOPIcon />,
    title: "LOP Baru Ditambahkan",
    subtitle: "FBS D12 MEDAN BARU",
    description: "Admin telah menambahkan LOP baru. Segera lengkapi data identitas, teknis, dan progres LOP agar proses dapat berjalan.",
    time: "Baru saja",
    action: { label: "Lengkapi Data", href: "/edAdmin/DetailLOP" },
    category: ["Update LOP"],
    isNew: true,
  },
  {
    id: 1,
    icon: <CheckCircleIcon />,
    title: "GoLive Berhasil",
    subtitle: "FBS D10 BANTAN RESIDEN",
    description: "LOP berhasil GoLive pada 02/02/2026. Semua 288 ODP telah tervalidasi dan aktif.",
    time: "2 menit lalu",
    action: { label: "Lihat Detail LOP", href: "/edAdmin/DetailLOP" },
    category: ["Update LOP"],
    isRead: true,
  },
  {
    id: 2,
    icon: <WarningIcon />,
    title: "Progress Terhenti",
    subtitle: "FBS D05 SUNGGAL",
    description: "Progress LOP terhenti sejak 3 hari terakhir. Harap segera cek kendala di lapangan.",
    time: "1 jam lalu",
    action: { label: "Cek Progres", href: "/edAdmin/DetailLOP" },
    category: ["Update LOP"],
    isNew: true,
  },
  {
    id: 3,
    icon: <RedDotIcon />,
    title: "Budget Melebihi Toleransi",
    subtitle: "FBS D03 PADANG BULAN",
    description: "Kenaikan anggaran mencapai 16.2%, melewati batas CAPEX Telkom 15%. Perlu approval.",
    time: "3 jam lalu",
    action: { label: "Tinjau Budget", href: "/edAdmin/DetailLOP" },
    category: ["Update LOP"],
    isRead: true,
  },
  {
    id: 4,
    icon: <DocumentIcon />,
    title: "Izin Kades Disetujui",
    subtitle: "FBS D11 HELVETIA",
    description: "Dokumen perizinan Kepala Desa / Lurah telah ditandatangani dan diarsipkan di sistem.",
    time: "5 jam lalu",
    action: { label: "Cek Progres", href: "/edAdmin/DetailLOP" },
    category: ["Update LOP"],
    isRead: true,
  },
  {
    id: 5,
    icon: <RecalcIcon />,
    title: "Rekalkulasi BoQ",
    subtitle: "FBS D07 PULO BRAYAN",
    description: "BoQ Aandwijzing diperbarui. Selisih Rp 85.000.000 dari nilai PRELIM awal.",
    time: "Kemarin",
    action: { label: "Detail Budget", href: "/edAdmin/DetailLOP" },
    category: ["Update LOP"],
    isRead: true,
  },
  {
    id: 6,
    icon: <TerminationIcon />,
    title: "Terminasi Selesai",
    subtitle: "FBS D08 SIMPANG KANTOR",
    description: "288 ODP telah menyelesaikan proses terminasi. Tahap validasi akhir sedang berjalan.",
    time: "Kemarin",
    action: { label: "Lihat Detail", href: "/edAdmin/DetailLOP" },
    category: ["Update LOP"],
    isRead: true,
  },
];

// ─── Notification Card ─────────────────────────────────────────────────────────
function NotifCard({ notif }: { notif: Notification }) {
  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 px-5 py-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 mt-0.5">{notif.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 text-sm leading-snug">
              {notif.title}
              {notif.subtitle && (
                <span className="text-gray-500 font-normal"> — {notif.subtitle}</span>
              )}
            </p>
            <p className="text-gray-500 text-sm mt-1 leading-relaxed">{notif.description}</p>
          </div>
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap pt-0.5">{notif.time}</span>
      </div>
      <div>
        <Link
          href={notif.action.href ?? '#'}
          className="text-sm px-4 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium inline-block"
        >
          {notif.action.label}
        </Link>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Notification() {
  const [activeTab, setActiveTab] = useState<NotifCategory>("Semua");

  const tabs: NotifCategory[] = ["Semua", "Update LOP"];

  const filtered = notifications.filter((n) => {
    if (activeTab === "Semua") return true;
    return n.category.includes(activeTab as "Update LOP");
  });

  const newNotifs = filtered.filter((n) => n.isNew);
  const readNotifs = filtered.filter((n) => !n.isNew);

  return (
    <>
      
        <div className="min-h-screen bg-gray-50 pt-4 pb-6">

          {/* Header — Back + Title */}
          <div className="flex items-center gap-3 px-4 sm:px-6 mb-5">
            <Link
              href="/mitraAdmin/MitraManagementPT3"
              className="p-2 rounded-lg hover:bg-white transition-colors shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-base font-bold text-gray-800">Notifikasi</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-5 flex-wrap px-4 sm:px-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                  activeTab === tab
                    ? "bg-purple-100 text-purple-700 border-purple-200"
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Notification list */}
          <div className="flex flex-col gap-3 w-full px-4 sm:px-6">

            {/* Notif Baru */}
            {newNotifs.length > 0 && (
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Baru</p>
                {newNotifs.map((n) => (
                  <NotifCard key={n.id} notif={n} />
                ))}
              </>
            )}

            {/* Sudah Dibaca */}
            {readNotifs.length > 0 && (
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2 mb-1">Sudah Dibaca</p>
                {readNotifs.map((n) => (
                  <NotifCard key={n.id} notif={n} />
                ))}
              </>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400 text-sm">
                Tidak ada notifikasi.
              </div>
            )}
          </div>
        </div>
      
    </>
  );
}