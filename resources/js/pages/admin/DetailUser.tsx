import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface UserProps {
    id: number;
    namaLengkap: string;
    username: string;
    nik: string;
    noTelp: string;
    email: string;
    alamat: string;
    namaPerusahaan: string;
    regionalTif: string;
    emailPerusahaan: string;
    distrik: string;
    noTelpPerusahaan: string;
    alamatPerusahaan: string;
    tipe: 'Mitra' | 'Subcon';
}

// Nanti hapus dummyUser ini dan pakai props dari Laravel:
// export default function DetailUser({ user }: { user: UserProps }) { ... }
const dummyUser: UserProps = {
    id: 1,
    namaLengkap: 'Budi Nugroho',
    username: 'budi.nugroho',
    nik: '1271081234560001',
    noTelp: '+62 812-3456-7890',
    email: 'budi.nugroho@email.com',
    alamat: 'Jl. Merdeka No. 12, Medan',
    namaPerusahaan: 'PT Cameras Pematang Siantar',
    regionalTif: 'Regional I',
    emailPerusahaan: 'cameras.siantar@email.com',
    distrik: 'Pematang Siantar',
    noTelpPerusahaan: '+62 622-123456',
    alamatPerusahaan: 'Jl. Sutomo No. 45, Pematang Siantar',
    tipe: 'Mitra',
};

function EditableField({
    label,
    value,
    fieldKey,
    isEditing,
    onChange,
}: {
    label: string;
    value: string;
    fieldKey: string;
    isEditing: boolean;
    onChange: (key: string, val: string) => void;
}) {
    return (
        <div
            className="border rounded-xl p-3 transition-all duration-200"
            style={{
                borderColor: isEditing ? '#7c3aed' : undefined,
                borderWidth: isEditing ? 1.5 : undefined,
            }}
        >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
            {isEditing ? (
                <input
                    type="text"
                    className="w-full text-sm font-semibold text-gray-900 bg-transparent border-none outline-none"
                    value={value}
                    onChange={(e) => onChange(fieldKey, e.target.value)}
                />
            ) : (
                <p className="text-sm font-semibold text-gray-900 break-words">{value}</p>
            )}
        </div>
    );
}

function EditableSelect({
    label,
    value,
    fieldKey,
    isEditing,
    onChange,
    options,
}: {
    label: string;
    value: string;
    fieldKey: string;
    isEditing: boolean;
    onChange: (key: string, val: string) => void;
    options: string[];
}) {
    return (
        <div
            className="border rounded-xl p-3 transition-all duration-200"
            style={{
                borderColor: isEditing ? '#7c3aed' : undefined,
                borderWidth: isEditing ? 1.5 : undefined,
            }}
        >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
            {isEditing ? (
                <select
                    className="w-full text-sm font-semibold text-gray-900 bg-transparent border-none outline-none cursor-pointer"
                    value={value}
                    onChange={(e) => onChange(fieldKey, e.target.value)}
                >
                    {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            ) : (
                <p className="text-sm font-semibold text-gray-900">{value}</p>
            )}
        </div>
    );
}

export default function DetailUser({ user = dummyUser }: { user?: UserProps }) {
    const [formData, setFormData] = useState<UserProps>(user);
    const [isEditing, setIsEditing] = useState(false);
    const [snapshot, setSnapshot] = useState<UserProps>(user);

    const handleEdit = () => {
        setSnapshot({ ...formData });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData({ ...snapshot });
        setIsEditing(false);
    };

    const handleSave = () => {
        // Nanti ganti dengan: await axios.put('/api/users/' + id, formData)
        console.log('Data disimpan:', formData);
        setIsEditing(false);
    };

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const initials = formData.namaLengkap
        .trim()
        .split(' ')
        .filter(Boolean)
        .reduce((acc, w, i, arr) =>
            arr.length >= 2 ? (i === 0 || i === arr.length - 1 ? acc + w[0] : acc) : w.slice(0, 2),
            ''
        )
        .toUpperCase()
        .slice(0, 2);

    const d = formData;

    return (
        <AppLayout title="Detail Pengguna">
            <Head title="Detail Pengguna" />

            <div className="min-h-screen bg-gray-100 p-4 md:p-6 space-y-4">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Link
                            href="/admin/UserManagement"
                            className="p-2 rounded-lg hover:bg-white transition-colors shrink-0"
                        >
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-sm md:text-base font-bold text-gray-800">Detail Pengguna</h1>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 shrink-0">
                            Aktif
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <>
                                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg font-medium">
                                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                                    Mode Edit Aktif
                                </span>
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Batal
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Simpan
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 px-4 py-2 text-sm bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition font-medium"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                            </button>
                        )}
                    </div>
                </div>

                {/* Avatar Card */}
                <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-violet-100 border-2 border-violet-300 flex items-center justify-center text-violet-600 text-xl font-bold shrink-0">
                        {initials}
                    </div>
                    <div>
                        <p className="text-base font-bold text-gray-900">{d.namaLengkap}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{d.tipe} &bull; {d.regionalTif}</p>
                    </div>
                </div>

                {/* Identitas Pribadi */}
                <div>
                    <div className="flex">
                        <div className="bg-violet-500 text-white text-sm font-semibold px-6 py-2 rounded-t-xl">
                            Identitas Pribadi
                        </div>
                    </div>
                    <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm p-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <EditableField label="Nama Lengkap *" value={d.namaLengkap} fieldKey="namaLengkap" isEditing={isEditing} onChange={handleChange} />
                            <EditableField label="Username *" value={d.username} fieldKey="username" isEditing={isEditing} onChange={handleChange} />
                            <EditableField label="NIK *" value={d.nik} fieldKey="nik" isEditing={isEditing} onChange={handleChange} />
                            <EditableField label="No. Telp *" value={d.noTelp} fieldKey="noTelp" isEditing={isEditing} onChange={handleChange} />
                            <EditableField label="Email *" value={d.email} fieldKey="email" isEditing={isEditing} onChange={handleChange} />
                            <EditableField label="Alamat" value={d.alamat} fieldKey="alamat" isEditing={isEditing} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* Identitas Perusahaan */}
                <div>
                    <div className="flex">
                        <div className="bg-violet-500 text-white text-sm font-semibold px-6 py-2 rounded-t-xl">
                            Identitas Perusahaan
                        </div>
                    </div>
                    <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm p-5 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <EditableField label="Nama Perusahaan *" value={d.namaPerusahaan} fieldKey="namaPerusahaan" isEditing={isEditing} onChange={handleChange} />
                            <EditableSelect
                                label="Regional TIF *"
                                value={d.regionalTif}
                                fieldKey="regionalTif"
                                isEditing={isEditing}
                                onChange={handleChange}
                                options={['Regional I', 'Regional II', 'Regional III', 'Regional IV']}
                            />
                            <EditableField label="Email Perusahaan" value={d.emailPerusahaan} fieldKey="emailPerusahaan" isEditing={isEditing} onChange={handleChange} />
                            <EditableSelect
                                label="Distrik *"
                                value={d.distrik}
                                fieldKey="distrik"
                                isEditing={isEditing}
                                onChange={handleChange}
                                options={['Pematang Siantar', 'Medan Kota', 'Binjai', 'Tebing Tinggi']}
                            />
                            <EditableField label="No. Telp Perusahaan" value={d.noTelpPerusahaan} fieldKey="noTelpPerusahaan" isEditing={isEditing} onChange={handleChange} />
                            <EditableField label="Alamat Perusahaan" value={d.alamatPerusahaan} fieldKey="alamatPerusahaan" isEditing={isEditing} onChange={handleChange} />
                        </div>

                        {/* Tipe */}
                        <div
                            className="border rounded-xl p-3 transition-all duration-200"
                            style={{
                                borderColor: isEditing ? '#7c3aed' : undefined,
                                borderWidth: isEditing ? 1.5 : undefined,
                            }}
                        >
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Tipe</p>
                            {isEditing ? (
                                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                                    {(['Mitra', 'Subcon'] as const).map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => handleChange('tipe', opt)}
                                            className={`flex-1 py-2 text-sm font-medium transition-colors ${
                                                d.tipe === opt
                                                    ? 'bg-violet-500 text-white'
                                                    : 'bg-white text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm font-semibold text-gray-900">{d.tipe}</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}