import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const dummyDetail = {
    namaLOP: 'SMU-ODC-PDN-FAC D09 LANBOW S602',
    status: 'GoLive',
    tahun: '2029',
    idPo: '104,384',
    namaLopShort: 'LANBOW',
    area: 'AREA 1',
    region: 'REGIONAL I',
    stg: 'PDN',
    regionFmc: '10886021',
    branchFmc: 'PEMATANG SIANTAR',
    batchProgram: '-',
    namaSubcon: 'PT CAMERAS PEMATANG SIANTAR',
    waspang: 'WASPANG',
    projectAdmin: 'Project Admin',
    boq: '203',
    cpp: '1264,368',
    odp: '24',
    subLop: '162',
    statusProgress: 'GoLive',
    planDatkom: '26/02/2026',
    datkom: '20/02/2026',
    subStatus: '73 Doline Full',
    detailStatus: 'RKS sisa satima 24 odp, ku 10 C1454 selesei ku 24 C4950 selesei, Kang: 48 selesei, RG2 proses termiskan 24 odp, 2 odp sudah odlo material-nya, dan 10 odp pandan',
    tglAgreGolive: 'April',
    tracking: [
        { label: 'Advanced Web Design', desc: 'Assignment: Responsive Website Project', dueDate: 'March 5, 2026', done: true, badge: 'Completed' },
        { label: '3.9 lbIn Kades / Lurah / RTRW', desc: 'Assignment: 3.1 20/02 fedeer ok, 009 ok...', dueDate: 'February 20, 2026', done: 'progress', badge: 'Progress' },
        { label: 'Sub Status 3.1 Submit permohon ke PU', desc: 'Sub Status: 10/3 plan survey bak tgl II...', dueDate: 'February 10, 2026', done: 'progress', badge: 'Progress' },
        { label: 'Graphic Fundamentals', desc: 'Assignment: 03.2 Ongoing Aanwijdzing', dueDate: 'February 01, 2026', done: false, badge: 'Aanwijdzing' },
        { label: 'Graphic Fundamentals', desc: 'Assignment: lanjut', dueDate: 'February 10, 2026', done: false, badge: 'Aanwijdzing' },
        { label: 'Graphic Fundamentals', desc: 'Assignment: lanjut', dueDate: 'February 10, 2026', done: false, badge: 'Aanwijdzing' },
    ],
    lampiran: [
        { nama: 'Responsive Website Project', file: 'Documentasi.jpg', date: 'March 5, 2026' },
        { nama: 'Perizinan kepada RW/RT', file: 'Documentasi.jpg', date: 'February 20, 2026' },
        { nama: 'Graphic Fundamentals', file: 'Documentasi.jpg', date: 'February 10, 2026' },
    ],
    pid: '10/18/2026',
    idSwAro: 'D1001M7W013003',
    reelJmlOdpB: '24',
    reelJmlOdpR: '24',
    out: 'Download DLT',
    niloPrem: '6,000,000',
    boqAnggading: '204,026,805',
    odpAnggading: '24',
    portAnggading: '162',
    persenAnggading: '-0.9%',
    cppAktu: '1,260,177',
};

const statusColor: Record<string, string> = {
    GoLive: 'bg-green-100 text-green-600',
    Inactive: 'bg-gray-100 text-gray-500',
    Proses: 'bg-yellow-100 text-yellow-600',
};

const statusOptions = ['GoLive', 'Inactive', 'Proses'];

// ───────────────────────────────────────────────
// Reusable EditableField: tampil teks atau input
// ───────────────────────────────────────────────
function EditableField({
    label,
    value,
    fieldKey,
    isEditing,
    onChange,
    type = 'text',
    textarea = false,
}: {
    label: string;
    value: string;
    fieldKey: string;
    isEditing: boolean;
    onChange: (key: string, val: string) => void;
    type?: string;
    textarea?: boolean;
}) {
    return (
        <div className="border border-gray-200 rounded-xl p-3 text-left transition-all duration-200"
            style={{ borderColor: isEditing ? '#8b5cf6' : undefined, borderWidth: isEditing ? 1.5 : undefined }}>
            <p className="text-xs font-semibold text-gray-400 mb-1">{label}</p>
            {isEditing ? (
                textarea ? (
                    <textarea
                        className="w-full text-xs text-gray-800 bg-transparent border-none outline-none resize-none leading-relaxed"
                        rows={4}
                        value={value}
                        onChange={(e) => onChange(fieldKey, e.target.value)}
                    />
                ) : (
                    <input
                        type={type}
                        className="w-full text-sm font-bold text-gray-900 bg-transparent border-none outline-none leading-snug"
                        value={value}
                        onChange={(e) => onChange(fieldKey, e.target.value)}
                    />
                )
            ) : (
                <p className="text-sm font-bold text-gray-900 leading-snug break-words">{value}</p>
            )}
        </div>
    );
}

// ───────────────────────────────────────────────
// EditableSelect: untuk field status (dropdown)
// ───────────────────────────────────────────────
function EditableSelect({
    label,
    value,
    fieldKey,
    isEditing,
    onChange,
    options,
    renderValue,
}: {
    label: string;
    value: string;
    fieldKey: string;
    isEditing: boolean;
    onChange: (key: string, val: string) => void;
    options: string[];
    renderValue?: (val: string) => React.ReactNode;
}) {
    return (
        <div className="border border-gray-200 rounded-xl p-3 text-center transition-all duration-200"
            style={{ borderColor: isEditing ? '#8b5cf6' : undefined, borderWidth: isEditing ? 1.5 : undefined }}>
            <p className="text-xs text-gray-400 mb-2">{label}</p>
            {isEditing ? (
                <select
                    className="text-xs font-medium text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none cursor-pointer"
                    value={value}
                    onChange={(e) => onChange(fieldKey, e.target.value)}
                >
                    {options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            ) : (
                renderValue ? renderValue(value) : (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[value] ?? 'bg-gray-100'}`}>
                        {value}
                    </span>
                )
            )}
        </div>
    );
}

export default function LOPDetail() {
    // ── State utama: data form ──
    const [formData, setFormData] = useState(dummyDetail);

    // ── State mode edit ──
    const [isEditing, setIsEditing] = useState(false);

    // ── Simpan snapshot sebelum edit (buat Cancel) ──
    const [snapshot, setSnapshot] = useState(dummyDetail);

    // ── State KML file — independen dari mode edit ──
    const [kmlFile, setKmlFile] = useState<File | null>(null);

    const handleEdit = () => {
        setSnapshot({ ...formData }); // simpan state sekarang
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData({ ...snapshot }); // rollback ke snapshot
        setIsEditing(false);
    };

    const handleSave = () => {
        // Nanti ganti ini dengan: await axios.put('/api/lop/' + id, formData)
        console.log('Data disimpan:', formData);
        setIsEditing(false);
    };

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const d = formData;

    return (
        <>
            <Head title="Detail LOP" />

            <div className="min-h-screen bg-gray-100 p-3 md:p-6 space-y-4">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Link
                            href="/mitraAdmin/MitraManagementPT3"
                            className="p-2 rounded-lg hover:bg-white transition-colors shrink-0"
                        >
                            <ArrowLeftIcon className="w-4 h-4 text-gray-500" />
                        </Link>
                        <h1 className="text-sm md:text-base font-bold text-gray-800 leading-tight">
                            DETAIL LOP {d.namaLOP}
                        </h1>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${statusColor[d.status] ?? 'bg-gray-100 text-gray-500'}`}>
                            {d.status}
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                        {isEditing ? (
                            <>
                                {/* Banner edit mode */}
                                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg font-medium">
                                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                                    Mode Edit Aktif
                                </span>

                                {/* Cancel */}
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-sm bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Batal
                                </button>

                                {/* Save */}
                                <button
                                    onClick={handleSave}
                                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Simpan
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Edit */}
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-sm bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition font-medium"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </button>

                                {/* Ekspor */}
                                <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-sm bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition font-medium">
                                    <ArrowDownTrayIcon className="h-4 w-4" />
                                    Ekspor
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* ── Identitas LOP ── */}
                <div className="mt-3">
                    <div className="flex">
                        <div className="bg-violet-500 text-white text-sm font-semibold px-6 py-2 rounded-t-xl">
                            Identitas LOP
                        </div>
                    </div>
                    <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm p-5">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {[
                                { label: 'Tahun', key: 'tahun' },
                                { label: 'ID - IHLD', key: 'idPo' },
                                { label: 'Nama LOP', key: 'namaLopShort' },
                                { label: 'Area', key: 'area' },
                                { label: 'Region', key: 'region' },
                                { label: 'STO', key: 'stg' },
                                { label: 'Region FMC', key: 'regionFmc' },
                                { label: 'Branch FMC', key: 'branchFmc' },
                                { label: 'Batch Program', key: 'batchProgram' },
                            ].map((item) => (
                                <EditableField
                                    key={item.key}
                                    label={item.label}
                                    value={d[item.key as keyof typeof d] as string}
                                    fieldKey={item.key}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Data Teknis ── */}
                <div className="mt-3">
                    <div className="flex">
                        <div className="bg-violet-500 text-white text-sm font-semibold px-6 py-2 rounded-t-xl">
                            Data Teknis
                        </div>
                    </div>
                    <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm p-5">
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                            {[
                                { label: 'Nama Mitra / Subcon', key: 'namaSubcon' },
                                { label: 'Waspang', key: 'waspang' },
                                { label: 'Project Admin', key: 'projectAdmin' },
                                { label: 'BOQ', key: 'boq' },
                                { label: 'CPP', key: 'cpp' },
                                { label: 'ODP Plan', key: 'odp' },
                                { label: 'Sub-LOP', key: 'subLop' },
                            ].map((item) => (
                                <EditableField
                                    key={item.key}
                                    label={item.label}
                                    value={d[item.key as keyof typeof d] as string}
                                    fieldKey={item.key}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Progress LOP + Tracking + Lampiran ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:h-[600px]">

                    {/* KIRI — Progress LOP */}
                    <div className="mt-3 flex flex-col min-h-0">
                        <div className="flex shrink-0">
                            <div className="bg-violet-500 text-white text-sm font-semibold px-6 py-2 rounded-t-xl">
                                Progres LOP
                            </div>
                        </div>
                        <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm flex-1 min-h-0 overflow-hidden flex flex-col">
                            <div className="p-5 flex flex-col gap-4 overflow-y-auto flex-1 min-h-0 scrollbar-hide">

                                {/* Row 1 — Status, Plan Golive (date), Tgl Agre Golive (dropdown bulan) */}
                                <div className="grid grid-cols-3 gap-3">
                                    <EditableSelect
                                        label="Status"
                                        value={d.statusProgress}
                                        fieldKey="statusProgress"
                                        isEditing={isEditing}
                                        onChange={handleChange}
                                        options={statusOptions}
                                        renderValue={(val) => (
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[val] ?? 'bg-gray-100'}`}>
                                                {val}
                                            </span>
                                        )}
                                    />
                                    {/* Plan Golive — date picker */}
                                    <div className="border border-gray-200 rounded-xl p-3 text-center"
                                        style={{ borderColor: isEditing ? '#8b5cf6' : undefined, borderWidth: isEditing ? 1.5 : undefined }}>
                                        <p className="text-xs text-gray-400 mb-1">Plan Golive</p>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                className="w-full text-center text-xs font-semibold text-gray-800 bg-transparent border-none outline-none cursor-pointer"
                                                value={d.planDatkom}
                                                onChange={(e) => handleChange('planDatkom', e.target.value)}
                                            />
                                        ) : (
                                            <p className="text-sm font-semibold text-gray-800">{d.planDatkom}</p>
                                        )}
                                    </div>
                                    {/* Tgl Agre Golive — dropdown bulan */}
                                    <div className="border border-gray-200 rounded-xl p-3 text-center"
                                        style={{ borderColor: isEditing ? '#8b5cf6' : undefined, borderWidth: isEditing ? 1.5 : undefined }}>
                                        <p className="text-xs text-gray-400 mb-1">Tgl Agre Golive</p>
                                        {isEditing ? (
                                            <select
                                                className="w-full text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none cursor-pointer text-center"
                                                value={d.tglAgreGolive}
                                                onChange={(e) => handleChange('tglAgreGolive', e.target.value)}
                                            >
                                                {['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].map((bln) => (
                                                    <option key={bln} value={bln}>{bln}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p className="text-sm font-semibold text-gray-800">{d.tglAgreGolive}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Row 2 — Sub Status (dropdown), Status Golive (dropdown), Golive real (date) */}
                                <div className="grid grid-cols-3 gap-3">
                                    {/* Sub Status */}
                                    <div className="border border-gray-100 rounded-xl p-3 text-center"
                                        style={{ borderColor: isEditing ? '#8b5cf6' : undefined, borderWidth: isEditing ? 1.5 : undefined }}>
                                        <p className="text-xs text-gray-400 mb-2">Sub Status</p>
                                        {isEditing ? (
                                            <select
                                                className="text-xs font-medium text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none cursor-pointer w-full"
                                                value={d.subStatus}
                                                onChange={(e) => handleChange('subStatus', e.target.value)}
                                            >
                                                <option value="73 Doline Full">73 Doline Full</option>
                                                <option value="Partial">Partial</option>
                                                <option value="Pending">Pending</option>
                                                <option value="On Progress">On Progress</option>
                                            </select>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                                                {d.subStatus}
                                            </span>
                                        )}
                                    </div>
                                    {/* Status Golive */}
                                    <div className="border border-gray-100 rounded-xl p-3 text-center"
                                        style={{ borderColor: isEditing ? '#8b5cf6' : undefined, borderWidth: isEditing ? 1.5 : undefined }}>
                                        <p className="text-xs text-gray-400 mb-2">Status Golive</p>
                                        {isEditing ? (
                                            <select
                                                className="text-xs font-medium text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none cursor-pointer w-full"
                                                value={d.statusProgress}
                                                onChange={(e) => handleChange('statusProgress', e.target.value)}
                                            >
                                                <option value="GoLive">Go Live</option>
                                                <option value="NYGoLive">NY Go Live</option>
                                                <option value="Drop">Drop</option>
                                            </select>
                                        ) : (
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                                d.statusProgress === 'GoLive' ? 'bg-green-100 text-green-600'
                                                : d.statusProgress === 'Drop' ? 'bg-red-100 text-red-500'
                                                : 'bg-yellow-100 text-yellow-600'
                                            }`}>
                                                {d.statusProgress === 'GoLive' ? 'Go Live'
                                                : d.statusProgress === 'NYGoLive' ? 'NY Go Live'
                                                : 'Drop'}
                                            </span>
                                        )}
                                    </div>
                                    {/* Golive real — date picker */}
                                    <div className="border border-gray-100 rounded-xl p-3 text-center"
                                        style={{ borderColor: isEditing ? '#8b5cf6' : undefined, borderWidth: isEditing ? 1.5 : undefined }}>
                                        <p className="text-xs text-gray-400 mb-1">Golive (Real)</p>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                className="w-full text-center text-xs font-semibold text-gray-800 bg-transparent border-none outline-none cursor-pointer"
                                                value={d.datkom}
                                                onChange={(e) => handleChange('datkom', e.target.value)}
                                            />
                                        ) : (
                                            <p className="text-sm font-semibold text-gray-800">{d.datkom}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Detail Status */}
                                <div className="border border-gray-100 rounded-xl p-4 flex flex-col flex-1"
                                    style={{ borderColor: isEditing ? '#8b5cf6' : undefined, borderWidth: isEditing ? 1.5 : undefined }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-semibold text-gray-700">Detail Status</p>
                                        {!isEditing && (
                                            <button className="p-1 rounded-lg hover:bg-gray-100 transition">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                    {isEditing ? (
                                        <textarea
                                            className="flex-1 w-full text-xs text-gray-600 leading-relaxed bg-transparent border-none outline-none resize-none text-justify"
                                            rows={5}
                                            value={d.detailStatus}
                                            onChange={(e) => handleChange('detailStatus', e.target.value)}
                                        />
                                    ) : (
                                        <p className="text-xs text-gray-600 leading-relaxed text-justify">
                                            {d.detailStatus}
                                        </p>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* KANAN — Tracking + Riwayat Lampiran (tidak diedit, tetap sama) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 min-h-0">

                        {/* Tracking Progress */}
                        <div className="flex flex-col min-h-0">
                            <div className="flex shrink-0">
                                <div className="bg-violet-500 text-white text-sm font-semibold px-6 py-2 rounded-t-xl">
                                    Tracking Progres
                                </div>
                            </div>
                            <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm flex-1 min-h-0 overflow-hidden flex flex-col">
                                <div className="flex-1 min-h-0 overflow-y-auto p-5 px-5 py-4 scrollbar-hide">
                                    <div className="relative">
                                        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200 z-0" />
                                        <div className="flex flex-col gap-4 py-1">
                                            {d.tracking.map((item, i) => (
                                                <div key={i} className="relative flex gap-3">
                                                    <div className={`relative z-10 w-6 h-6 rounded-full shrink-0 flex items-center justify-center ring-2 ring-white ${
                                                        item.done === true ? 'bg-green-500'
                                                        : item.done === 'progress' ? 'bg-orange-400'
                                                        : 'bg-gray-300'
                                                    }`}>
                                                        {item.done === true && (
                                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                        {item.done === 'progress' && <div className="w-2 h-2 bg-white rounded-full" />}
                                                    </div>
                                                    <div className="flex-1 border border-gray-100 rounded-xl p-3">
                                                        <div className="flex items-start justify-between gap-1 mb-1">
                                                            <p className="text-xs font-semibold text-gray-800 leading-snug">{item.label}</p>
                                                            {item.badge && (
                                                                <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                                                                    item.badge === 'Completed' ? 'bg-green-100 text-green-600'
                                                                    : item.badge === 'Progress' ? 'bg-orange-100 text-orange-600'
                                                                    : 'bg-gray-100 text-gray-500'
                                                                }`}>{item.badge}</span>
                                                            )}
                                                        </div>
                                                        {item.desc && <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>}
                                                        {item.dueDate && <p className="text-xs text-gray-400 mt-1">Due Date: {item.dueDate}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Riwayat Lampiran */}
                        <div className="flex flex-col min-h-0">
                            <div className="flex shrink-0">
                                <div className="bg-violet-500 text-white text-sm font-semibold px-6 py-2 rounded-t-xl">
                                    Riwayat Lampiran
                                </div>
                            </div>
                            <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm flex-1 min-h-0 overflow-hidden flex flex-col">
                                <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 scrollbar-hide">
                                    <div className="relative">
                                        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200 z-0" />
                                        <div className="flex flex-col gap-4 py-1">
                                            {d.lampiran.map((item, i) => (
                                                <div key={i} className="relative flex gap-3">
                                                    <div className="relative z-10 w-6 h-6 rounded-full bg-violet-500 shrink-0 flex items-center justify-center ring-2 ring-white">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                        </svg>
                                                    </div>
                                                    <div className="flex-1 border border-gray-100 rounded-xl p-3 hover:bg-gray-50 cursor-pointer transition">
                                                        <p className="text-xs font-semibold text-gray-800 mb-1">{item.nama}</p>
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            {item.file ?? 'Documentasi.jpg'}
                                                        </div>
                                                        {item.date && <p className="text-xs text-gray-400 mt-1">{item.date}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ── IT Tools ── */}
                <div className="mt-3">
                    <div className="flex">
                        <div className="bg-violet-500 text-white text-sm font-semibold px-6 py-2 rounded-t-xl">
                            IT Tools
                        </div>
                    </div>
                    <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm p-5">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {[
                                { label: 'PID', key: 'pid' },
                                { label: 'ID SW ARO', key: 'idSwAro' },
                                { label: 'Reel JML ODP B', key: 'reelJmlOdpB' },
                                { label: 'Reel JML ODP R', key: 'reelJmlOdpR' },
                                { label: 'OUT', key: 'out' },
                            ].map((item) => (
                                <EditableField
                                    key={item.key}
                                    label={item.label}
                                    value={d[item.key as keyof typeof d] as string}
                                    fieldKey={item.key}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Aktualisasi Budget ── */}
                <div className="mt-3">
                    <div className="flex">
                        <div className="bg-violet-500 text-white text-sm font-semibold px-6 py-2 rounded-t-xl">
                            Aktualisasi Budget
                        </div>
                    </div>
                    <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm p-5">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                            {[
                                { label: 'Nibo Prem', key: 'niloPrem' },
                                { label: 'BOQ Anggading', key: 'boqAnggading' },
                                { label: 'ODP Anggading', key: 'odpAnggading' },
                                { label: 'PORT Anggading', key: 'portAnggading' },
                                { label: '% Kenalkon Anggading', key: 'persenAnggading' },
                                { label: 'CPP Aktu', key: 'cppAktu' },
                            ].map((item) => (
                                <EditableField
                                    key={item.key}
                                    label={item.label}
                                    value={d[item.key as keyof typeof d] as string}
                                    fieldKey={item.key}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Sebaran LOP ── */}
                <div className="mt-3">
                    <div className="flex">
                        <div className="bg-violet-500 text-white text-sm font-semibold px-6 py-2 rounded-t-xl">
                            Sebaran LOP
                        </div>
                    </div>
                    <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm p-5">

                        {/* Tombol Upload + Download — semua rata kanan */}
                        <div className="flex flex-wrap justify-end items-center gap-2 mb-4">

                            {/* Upload KML */}
                            <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-violet-400 text-violet-600 rounded-lg hover:bg-violet-50 transition cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Upload KML
                                <input
                                    type="file"
                                    accept=".kml,.kmz"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setKmlFile(file);
                                            console.log('File KML dipilih:', file.name);
                                        }
                                    }}
                                />
                            </label>

                            {/* Divider */}
                            <div className="w-px h-5 bg-gray-200" />

                            {/* Download KML */}
                            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition">
                                <ArrowDownTrayIcon className="w-3.5 h-3.5 shrink-0" />
                                Download KML
                            </button>

                            {/* Download KMZ */}
                            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition">
                                <ArrowDownTrayIcon className="w-3.5 h-3.5 shrink-0" />
                                Download KMZ
                            </button>
                        </div>

                        {/* Preview file yang sudah dipilih */}
                        {kmlFile && (
                            <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-violet-50 border border-violet-200 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-xs text-violet-700 font-medium truncate flex-1">{kmlFile.name}</p>
                                <button
                                    onClick={() => setKmlFile(null)}
                                    className="text-xs text-gray-400 hover:text-red-400 transition shrink-0"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {/* Map placeholder */}
                        <div className="w-full h-48 sm:h-64 md:h-80 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                            <div className="text-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                <p className="text-sm font-medium">Peta Sebaran LOP</p>
                                <p className="text-xs mt-1">Integrasi Google Maps / Leaflet</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}