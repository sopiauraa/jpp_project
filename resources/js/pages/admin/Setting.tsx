import { Head } from '@inertiajs/react';
import AppLayout from "@/layouts/app-layout";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type SettingTab = "Profil" | "Keamanan" | "Notifikasi" | "Tampilan";

// ─── Icons ───────────────────────────────────────────────────────────────────
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);
const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);
const PaletteIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);
const CameraIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const EyeIcon = ({ show }: { show: boolean }) => show ? (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
) : (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? "bg-purple-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ─── Input Field ──────────────────────────────────────────────────────────────
function InputField({
  label, value, onChange, type = "text", placeholder = "", hint = "", disabled = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; hint?: string; disabled?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2.5 text-sm rounded-lg border transition-colors outline-none
            ${disabled
              ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white border-gray-200 text-gray-800 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            } ${isPassword ? "pr-10" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <EyeIcon show={show} />
          </button>
        )}
      </div>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="px-6 py-5 flex flex-col gap-5">{children}</div>
    </div>
  );
}

// ─── Notif Row ────────────────────────────────────────────────────────────────
function NotifRow({ label, desc, checked, onChange }: {
  label: string; desc: string; checked: boolean; onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

// ─── Tab content: Profil ──────────────────────────────────────────────────────
function ProfilTab() {
  const [form, setForm] = useState({
    nama: "Cortis F",
    email: "cortis@cakra.id",
    telepon: "08123456789",
    jabatan: "Admin",
    unit: "PT3 Konstruksi",
  });
  const set = (k: string) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="flex flex-col gap-5">
      {/* Avatar */}
      <SectionCard title="Foto Profil">
        <div className="flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-bold select-none">
              CF
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 text-gray-500">
              <CameraIcon />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Cortis F</p>
            <p className="text-xs text-gray-400 mt-0.5">JPG atau PNG, maks 2MB</p>
            <button className="mt-2 text-xs text-purple-600 font-medium hover:underline">Ganti Foto</button>
          </div>
        </div>
      </SectionCard>

      {/* Info pribadi */}
      <SectionCard title="Informasi Pribadi">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Nama Lengkap" value={form.nama} onChange={set("nama")} placeholder="Nama lengkap" />
          <InputField label="Email" value={form.email} onChange={set("email")} type="email" placeholder="email@domain.com" />
          <InputField label="No. Telepon" value={form.telepon} onChange={set("telepon")} placeholder="08xx" />
          <InputField label="Jabatan" value={form.jabatan} onChange={set("jabatan")} disabled />
        </div>
        <InputField label="Unit / Divisi" value={form.unit} onChange={set("unit")} disabled hint="Hubungi admin untuk mengubah unit." />
      </SectionCard>

      <div className="flex justify-end">
        <button className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors">
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}

// ─── Tab content: Keamanan ────────────────────────────────────────────────────
function KeamananTab() {
  const [pass, setPass] = useState({ current: "", new: "", confirm: "" });
  const set = (k: string) => (v: string) => setPass((p) => ({ ...p, [k]: v }));

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Ganti Password">
        <InputField label="Password Saat Ini" value={pass.current} onChange={set("current")} type="password" placeholder="••••••••" />
        <InputField label="Password Baru" value={pass.new} onChange={set("new")} type="password" placeholder="Min. 8 karakter" hint="Gunakan kombinasi huruf besar, kecil, angka, dan simbol." />
        <InputField label="Konfirmasi Password Baru" value={pass.confirm} onChange={set("confirm")} type="password" placeholder="Ulangi password baru" />
        <div className="flex justify-end">
          <button className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors">
            Perbarui Password
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Sesi Aktif">
        {[
          { device: "Chrome · Windows 11", loc: "Medan, Indonesia", time: "Sekarang", current: true },
          { device: "Safari · iPhone 14", loc: "Medan, Indonesia", time: "2 hari lalu", current: false },
        ].map((s, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.current ? "bg-green-500" : "bg-gray-300"}`} />
              <div>
                <p className="text-sm font-medium text-gray-800">{s.device}</p>
                <p className="text-xs text-gray-400">{s.loc} · {s.time}</p>
              </div>
            </div>
            {!s.current && (
              <button className="text-xs text-red-500 hover:text-red-600 font-medium">Cabut Akses</button>
            )}
            {s.current && (
              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Aktif</span>
            )}
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

// ─── Tab content: Notifikasi ──────────────────────────────────────────────────
function NotifikasiTab() {
  const [notifs, setNotifs] = useState({
    golive: true,
    budget: true,
    progress: true,
    izin: false,
    export: true,
    email: false,
    // whatsapp: false,
  });
  const toggle = (k: keyof typeof notifs) => () => setNotifs((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Notifikasi Aplikasi">
        <NotifRow label="GoLive LOP" desc="Notifikasi saat LOP berhasil GoLive" checked={notifs.golive} onChange={toggle("golive")} />
        <div className="border-t border-gray-50" />
        <NotifRow label="Budget Melebihi Toleransi" desc="Alert saat anggaran melewati batas CAPEX" checked={notifs.budget} onChange={toggle("budget")} />
        <div className="border-t border-gray-50" />
        <NotifRow label="Progress Terhenti" desc="Notifikasi jika LOP tidak ada progres 3+ hari" checked={notifs.progress} onChange={toggle("progress")} />
        <div className="border-t border-gray-50" />
        <NotifRow label="Izin Kades / Lurah" desc="Update status dokumen perizinan desa" checked={notifs.izin} onChange={toggle("izin")} />
        <div className="border-t border-gray-50" />
        <NotifRow label="Export Selesai" desc="Notifikasi saat file PDF/laporan siap diunduh" checked={notifs.export} onChange={toggle("export")} />
      </SectionCard>

      <SectionCard title="Notifikasi Eksternal">
        <NotifRow label="Email" desc="Kirim ringkasan notifikasi ke email" checked={notifs.email} onChange={toggle("email")} />
        <div className="border-t border-gray-50" />
        {/* <NotifRow label="WhatsApp" desc="Terima alert penting via WhatsApp" checked={notifs.whatsapp} onChange={toggle("whatsapp")} /> */}
      </SectionCard>
    </div>
  );
}

// ─── Tab content: Tampilan ────────────────────────────────────────────────────
function TampilanTab() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [lang, setLang] = useState("id");
  const [density, setDensity] = useState<"normal" | "compact">("normal");

  return (
    <div className="flex flex-col gap-5">
      <SectionCard title="Tema">
        <div className="grid grid-cols-3 gap-3">
          {(["light", "dark", "system"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                theme === t ? "border-purple-500 bg-purple-50" : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className={`w-10 h-7 rounded-md border ${
                t === "light" ? "bg-white border-gray-200" :
                t === "dark" ? "bg-gray-800 border-gray-700" :
                "bg-gradient-to-r from-white to-gray-800 border-gray-200"
              }`} />
              <span className={`text-xs font-medium capitalize ${theme === t ? "text-purple-700" : "text-gray-500"}`}>
                {t === "light" ? "Terang" : t === "dark" ? "Gelap" : "Sistem"}
              </span>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Bahasa & Wilayah">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Bahasa</label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 text-gray-800 bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
          >
            <option value="id">Bahasa Indonesia</option>
            <option value="en">English</option>
          </select>
        </div>
      </SectionCard>

      <SectionCard title="Kepadatan Tampilan">
        <div className="flex gap-3">
          {(["normal", "compact"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDensity(d)}
              className={`flex-1 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                density === d ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-100 text-gray-500 hover:border-gray-200"
              }`}
            >
              {d === "normal" ? "Normal" : "Kompak"}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">Atur jarak antar elemen pada tampilan tabel dan daftar.</p>
      </SectionCard>

      <div className="flex justify-end">
        <button className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors">
          Simpan Tampilan
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Setting() {
  const [activeTab, setActiveTab] = useState<SettingTab>("Profil");

  const tabs: { id: SettingTab; icon: React.ReactNode; label: string }[] = [
    { id: "Profil",      icon: <UserIcon />,    label: "Profil" },
    { id: "Keamanan",    icon: <LockIcon />,    label: "Keamanan" },
    { id: "Notifikasi",  icon: <BellIcon />,    label: "Notifikasi" },
    { id: "Tampilan",    icon: <PaletteIcon />, label: "Tampilan" },
  ];

  return (
    <>
      <Head title="Pengaturan" />
      <AppLayout title="Pengaturan">
        <div className="min-h-screen bg-gray-50 pt-4 pb-10 px-4 sm:px-6">

          {/* Layout: sidebar tabs + content */}
          <div className="flex flex-col sm:flex-row gap-6 max-w-5xl">

            {/* Sidebar nav */}
            <aside className="sm:w-48 flex-shrink-0">
              <nav className="flex sm:flex-col gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                      activeTab === tab.id
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                  >
                    <span className={activeTab === tab.id ? "text-purple-600" : "text-gray-400"}>
                      {tab.icon}
                    </span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Content area */}
            <div className="flex-1 min-w-0">
              {activeTab === "Profil"     && <ProfilTab />}
              {activeTab === "Keamanan"   && <KeamananTab />}
              {activeTab === "Notifikasi" && <NotifikasiTab />}
              {activeTab === "Tampilan"   && <TampilanTab />}
            </div>

          </div>
        </div>
      </AppLayout>
    </>
  );
}