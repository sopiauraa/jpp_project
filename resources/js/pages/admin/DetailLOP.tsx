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
    distrik: 'PEMATANG SIANTAR',
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
    kendalaSolusi: 'Dalam proses',
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

// Komponen reusable biar DRY
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-5">
            <h2 className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-4">
                {title}
            </h2>
            {children}
        </div>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div className="min-w-0">
            <p className="text-xs text-gray-400 mb-0.5 truncate">{label}</p>
            <p className="text-sm font-medium text-gray-800 break-words">{value}</p>
        </div>
    );
}

export default function LOPDetail() {
    const d = dummyDetail;

    // const { detail } = usePage().props as { detail: typeof dummyDetail };
    // const d = detail;

    return (
        <>
            <Head title="Detail LOP" />

            <div className="min-h-screen bg-gray-100 p-3 md:p-6 space-y-4">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Link
                            href="/admin/ManagementPT3"
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
                    <div className="flex items-center gap-2 shrink-0">
                        <button className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition">
                            <ArrowDownTrayIcon className="h-4 w-4 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Identitas LOP */}
                <div className="mt-3">
                    {/* Tab folder */}
                    <div className="flex">
                        <div className="bg-violet-500 text-white text-sm font-semibold px-6 py-2 rounded-t-xl">
                            Identitas LOP
                        </div>
                    </div>

                    {/* Card — nyambung ke tab */}
                    <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm p-5">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {[
                                { label: 'Tahun', value: d.tahun },
                                { label: 'ID - IHLD', value: d.idPo },
                                { label: 'Nama LOP', value: d.namaLopShort },
                                { label: 'Area', value: d.area },
                                { label: 'Region', value: d.region },
                                { label: 'Distrik', value: d.distrik },
                                { label: 'STO', value: d.stg },
                                { label: 'Region FMC', value: d.regionFmc },
                                { label: 'Branch FMC', value: d.branchFmc },
                                { label: 'Batch Program', value: d.batchProgram },
                            ].map((item) => (
                                <div key={item.label} className="border border-gray-200 rounded-xl p-3 text-left">
                                    <p className="text-xs font-semibold text-gray-400 mb-1">{item.label}</p>
                                    <p className="text-sm font-bold text-gray-900 leading-snug">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Data Teknis */}
                <div className="mt-3">
                    <div className="flex">
                        <div className="bg-violet-500 text-white text-sm font-semibold px-6 py-2 rounded-t-xl">
                            Data Teknis
                        </div>
                    </div>
                    <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm p-5">
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                            {[
                                { label: 'Nama Mitra / Subcon', value: d.namaSubcon },
                                { label: 'Waspang', value: d.waspang },
                                { label: 'Project Admin', value: d.projectAdmin },
                                { label: 'BOQ', value: d.boq },
                                { label: 'CPP', value: d.cpp },
                                { label: 'ODP Plan', value: d.odp },
                                { label: 'Sub-LOP', value: d.subLop },
                            ].map((item) => (
                                <div key={item.label} className="border border-gray-200 rounded-xl p-3 text-left">
                                    <p className="text-xs font-semibold text-gray-400 mb-1">{item.label}</p>
                                    <p className="text-sm font-bold text-gray-900 leading-snug">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Progress LOP + Tracking + Lampiran */}
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

                                {/* Row 1 — Status, Plan Golive, Tgl Agre Golive */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="border border-gray-200 rounded-xl p-3 text-center">
                                        <p className="text-xs text-gray-400 mb-2">Status</p>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[d.statusProgress] ?? 'bg-gray-100'}`}>
                                            {d.statusProgress}
                                        </span>
                                    </div>
                                    <div className="border border-gray-200 rounded-xl p-3 text-center">
                                        <p className="text-xs text-gray-400 mb-1">Plan Golive</p>
                                        <p className="text-sm font-semibold text-gray-800">{d.planDatkom}</p>
                                    </div>
                                    <div className="border border-gray-200 rounded-xl p-3 text-center">
                                        <p className="text-xs text-gray-400 mb-1">Tgl Agre Golive</p>
                                        <p className="text-sm font-semibold text-gray-800">{d.tglAgreGolive}</p>
                                    </div>
                                </div>

                                {/* Row 2 — Status Golive, Golive (tanggal), Kendala Golive */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="border border-gray-100 rounded-xl p-3 text-center">
                                        <p className="text-xs text-gray-400 mb-2">Status Golive</p>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                            d.statusProgress === 'GoLive'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-red-100 text-red-500'
                                        }`}>
                                            {d.statusProgress === 'GoLive' ? 'GoLive' : 'Belum GoLive'}
                                        </span>
                                    </div>
                                    <div className="border border-gray-100 rounded-xl p-3 text-center">
                                        <p className="text-xs text-gray-400 mb-1">Golive</p>
                                        <p className="text-sm font-semibold text-gray-800">{d.datkom}</p>
                                    </div>
                                    <div className="border border-gray-100 rounded-xl p-3 text-center">
                                        <p className="text-xs text-gray-400 mb-2">Kendala Golive</p>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                            d.kendalaSolusi === 'Tidak Ada'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-orange-100 text-orange-500'
                                        }`}>
                                            {d.kendalaSolusi}
                                        </span>
                                    </div>
                                </div>

                                {/* Detail Status */}
                                <div className="border border-gray-100 rounded-xl p-4 flex flex-col flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-semibold text-gray-700">Detail Status</p>
                                        <button className="p-1 rounded-lg hover:bg-gray-100 transition">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed text-justify">
                                        {d.detailStatus}
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* KANAN — Tracking + Riwayat Lampiran */}
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

                {/* IT Tools */}
                <div className="mt-3">
                    <div className="flex">
                        <div className="bg-violet-500 text-white text-sm font-semibold px-6 py-2 rounded-t-xl">
                            IT Tools
                        </div>
                    </div>
                    <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm p-5">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {[
                                { label: 'PID', value: d.pid },
                                { label: 'ID SW ARO', value: d.idSwAro },
                                { label: 'Reel JML ODP B', value: d.reelJmlOdpB },
                                { label: 'Reel JML ODP R', value: d.reelJmlOdpR },
                                { label: 'OUT', value: d.out },
                            ].map((item) => (
                                <div key={item.label} className="border border-gray-200 rounded-xl p-3 text-left">
                                    <p className="text-xs font-semibold text-gray-400 mb-1">{item.label}</p>
                                    <p className="text-sm font-bold text-gray-900 leading-snug">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Aktualisasi Budget */}
                <div className="mt-3">
                    <div className="flex">
                        <div className="bg-violet-500 text-white text-sm font-semibold px-6 py-2 rounded-t-xl">
                            Aktualisasi Budget
                        </div>
                    </div>
                    <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm p-5">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                            {[
                                { label: 'Nibo Prem', value: d.niloPrem },
                                { label: 'BOQ Anggading', value: d.boqAnggading },
                                { label: 'ODP Anggading', value: d.odpAnggading },
                                { label: 'PORT Anggading', value: d.portAnggading },
                                { label: '% Kenalkon Anggading', value: d.persenAnggading },
                                { label: 'CPP Aktu', value: d.cppAktu },
                            ].map((item) => (
                                <div key={item.label} className="border border-gray-200 rounded-xl p-3 text-left">
                                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                                    <p className="text-sm font-semibold text-gray-800 leading-snug">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sebaran LOP */}
                <div className="mt-3">
                    <div className="flex">
                        <div className="bg-violet-500 text-white text-sm font-semibold px-6 py-2 rounded-t-xl">
                            Sebaran LOP
                        </div>
                    </div>
                    <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm p-5">
                        {/* Tombol download */}
                        <div className="flex justify-end gap-2 mb-4">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition">
                                <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                                Download KML
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition">
                                <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                                Download KMZ
                            </button>
                        </div>

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