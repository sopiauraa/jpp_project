import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from "react";
import AppLayout from "@/layouts/app-layout";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, LineElement,
    PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

// ─── TYPES ────────────────────────────────────────────────
type KpiItem = {
    label: string;
    val: string;
    sub: string;
    badge: string;
    badgeType: "up" | "dn" | "neu";
    spark: number[];
};

interface TableRow {
    region: string;
    distrik: string;
    ihld: string;
    lop: string;
    nilaiBoq: string;
    nilaiReal: string;
    realPort: number;
    cppAct: number;
    status: '7 GOLIVE' | '0 HOLD' | 'ON PROG';
    subStatus: string;
    detail: string;
}

// ─── DATA ─────────────────────────────────────────────────
const KPI_RAW = [
    { label: "Jumlah Region", values: [3,3,3,3,3,3,3], sub: "Sumbagut · Sumbagsel · Sumbagteng" },
    { label: "Jumlah Distrik", values: [12,13,13,14,14,15,16], sub: "Tersebar di 3 Region" },
    { label: "Jumlah Subcon", values: [35,36,38,38,39,41,42], sub: "Mitra Aktif" },
    { label: "LOP", values: [3100,3050,3020,2980,2970,2965,2961], sub: "Current Value" },
    { label: "BoQ Real", values: [2700,2750,2800,2850,2900,2940,2961], sub: "Actual vs Plan" },
    { label: "Nilai Port", values: [2800,2820,2850,2870,2900,2940,2961], sub: "Current Value" },
    { label: "CPP ACT", values: [2700,2750,2800,2850,2900,2940,2961], sub: "Current Value" },
];

// ─── colour ────────────────────────────────────────────────
const colorMap: Record<string, string> = {
    "Jumlah Region": "#60a5fa",   // biru soft
    "Jumlah Distrik": "#a78bfa",  // ungu soft
    "Jumlah Subcon": "#4ade80",   // hijau soft
    "LOP": "#fbbf24",             // kuning soft
    "BoQ Real": "#fb923c",        // orange soft
    "Nilai Port": "#f472b6",      // pink soft
    "CPP ACT": "#22d3ee",         // cyan soft
};

const TABLE_DATA: TableRow[] = [
    { region: "Sumbagut",    distrik: "Rantau Prapat", ihld: "12029513", lop: "PT Arga Karya Niusa", nilaiBoq: "1.043.544.405", nilaiReal: "965.000.254",  realPort: 688, cppAct: 863446, status: "7 GOLIVE", subStatus: "Teknis - Feeder",      detail: "Kendala putus" },
    { region: "Sumbagsel",   distrik: "Bengkulu",      ihld: "11920101", lop: "PT Bangun Jaya",      nilaiBoq: "890.200.000",   nilaiReal: "820.000.000",  realPort: 740, cppAct: 810000, status: "0 HOLD",   subStatus: "Perizinan",            detail: "Tunggu izin" },
    { region: "Sumbagteng",  distrik: "Padang",        ihld: "10850302", lop: "PT Karya Mandiri",    nilaiBoq: "720.000.000",   nilaiReal: "700.000.000",  realPort: 680, cppAct: 750000, status: "0 HOLD",   subStatus: "Non Teknis",           detail: "CPP tinggi" },
    { region: "Sumbagut",    distrik: "Medan",         ihld: "10120401", lop: "PT Maju Bersama",     nilaiBoq: "250.000.000",   nilaiReal: "240.000.000",  realPort: 780, cppAct: 920000, status: "7 GOLIVE", subStatus: "Go live full",         detail: "Selesai" },
    { region: "Sumbagsel",   distrik: "Palembang",     ihld: "11430502", lop: "PT Nusa Cipta",       nilaiBoq: "180.000.000",   nilaiReal: "175.000.000",  realPort: 870, cppAct: 900000, status: "ON PROG",  subStatus: "Teknis - feeder full", detail: "Proses instalasi" },
    { region: "Sumbagteng",  distrik: "Pekanbaru",     ihld: "10760603", lop: "PT Riau Karya",       nilaiBoq: "320.000.000",   nilaiReal: "310.000.000",  realPort: 730, cppAct: 800000, status: "7 GOLIVE", subStatus: "Go live full",         detail: "Selesai" },
];

// ─── LOGIC KPI ────────────────────────────────────────────
function generateKpi(data: any[]) {
    return data.map(item => {
        const values = item.values;

        if (!values || values.length === 0) {
            return {
                ...item,
                val: "0",
                badge: "Stabil",
                badgeType: "neu",
                spark: [],
            };
        }

        const current = values[values.length - 1];
        const previous = values[values.length - 2] ?? current;

        const diff = current - previous;
        const percent = previous !== 0 ? (diff / previous) * 100 : 0;

        let badge = "Stabil";
        let badgeType: "up" | "dn" | "neu" = "neu";

        if (diff > 0) {
            badge = `▲ ${percent.toFixed(2)}%`;
            badgeType = "up";
        } else if (diff < 0) {
            badge = `▼ ${Math.abs(percent).toFixed(2)}%`;
            badgeType = "dn";
        }

        return {
            ...item,
            val: new Intl.NumberFormat().format(current),
            badge,
            badgeType,
            spark: values,
        };
    });
}
// ─── SPARKLINE ────────────────────────────────────────────
function Sparkline({ data }: { data: number[] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hover, setHover] = useState<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const draw = () => {
            const w = canvas.getBoundingClientRect().width;
            const h = 28;
            canvas.width = w;
            canvas.height = h;

            const min = Math.min(...data);
            const max = Math.max(...data);
            const range = max - min || 1;

            const pts = data.map((v, i) => ({
                x: (i / (data.length - 1)) * w,
                y: h - ((v - min) / range) * (h - 4) - 2,
            }));

            ctx.clearRect(0, 0, w, h);

            ctx.beginPath();
            pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.lineTo(w, h);
            ctx.lineTo(0, h);
            ctx.closePath();
            ctx.fillStyle = "rgba(255,255,255,0.15)";
            ctx.fill();

            if (hover !== null) {
                const p = pts[hover];
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = "#fff";
                ctx.fill();
            }
        };

        draw(); // gambar pertama kali

        // Redraw otomatis saat ukuran berubah (sidebar toggle)
        const observer = new ResizeObserver(draw);
        const parent = canvas.parentElement;
        if (parent) observer.observe(parent);
        return () => observer.disconnect();

    }, [data, hover]);

    const handleMove = (e: any) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const index = Math.round((x / rect.width) * (data.length - 1));
        setHover(index);
    };

    return (
        <div className="relative">
            <canvas
                ref={canvasRef}
                onMouseMove={handleMove}
                onMouseLeave={() => setHover(null)}
                style={{ width: '100%', height: 28 }}
            />

            {/* tooltip ikut titik */}
            {hover !== null && (
                <div
                    className="absolute -top-6 text-[10px] bg-black text-white px-1.5 py-0.5 rounded"
                    style={{
                        left: `${(hover / (data.length - 1)) * 100}%`,
                        transform: "translateX(-50%)"
                    }}
                >
                    {data[hover]}
                </div>
            )}
        </div>
    );
}

// ─── KPI CARD ─────────────────────────────────────────────
function KpiCard({ item }: { item: KpiItem }) {
    const color = colorMap[item.label] || "#6366f1";

    const badgeClass =
        item.badgeType === 'up'
            ? 'bg-white/20 text-white'
            : item.badgeType === 'dn'
            ? 'bg-white/20 text-white'
            : 'bg-white/20 text-white';

    return (
        <div
        className="rounded-lg px-3 py-2 flex flex-col justify-between min-h-[105px] hover:shadow-md transition relative overflow-hidden text-white w-full min-w-0"
        style={{
            background: `linear-gradient(135deg, ${color}, ${color}cc)`
        }}
        >
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <span className="text-[9px] font-semibold tracking-widest uppercase text-white/80">
                    {item.label}
                </span>

                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${badgeClass}`}>
                    {item.badge}
                </span>
            </div>

            {/* VALUE */}
            <div className="font-mono text-lg font-bold leading-tight">
                {item.val}
            </div>

            {/* SUB */}
            <div className="text-[9px] text-white/70">
                {item.sub}
            </div>

            {/* GRAPH */}
            {item.label !== "Jumlah Region" && item.spark.length > 1 && (
            <Sparkline data={item.spark} />
            )}
        </div>
    );
}

// ─── REALISASI BAR ────────────────────────────────────────
function RealisasiBar({ name, pct, plan, actual, gradient }: { name: string; pct: number; plan: string; actual: string; gradient: [string, string] }) {
    return (
        <div className="mb-4 last:mb-0">
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-gray-800">{name}</span>
                <div className="flex gap-4">
                    <span className="font-mono text-[10px] text-gray-400">ACTUAL <span className="text-gray-700 font-semibold">{pct}%</span></span>
                    <span className="font-mono text-[10px] text-gray-400">PLAN <span className="text-gray-700 font-semibold">{plan}</span></span>
                </div>
            </div>
            <div className="h-5 bg-gray-100 rounded-md overflow-hidden">
                <div
                    className="h-full rounded-md flex items-center pl-2 font-mono text-[9px] font-bold text-white"
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${gradient[0]}, ${gradient[1]})` }}
                >
                    {pct}%
                </div>
            </div>
            <div className="flex justify-between mt-0.5">
                <span className="font-mono text-[9px]" style={{ color: gradient[1] }}>{actual}</span>
                <span className="font-mono text-[9px] text-gray-400">Plan: {plan}</span>
            </div>
        </div>
    );
}

// ─── DIST TABLE ───────────────────────────────────────────
function DistTable({ title, rows }: { title: string; rows: [string, number, number, number, string][] }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-800">{title}</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="text-left px-3 py-2 text-[9px] font-semibold uppercase tracking-widest text-gray-400">Nama</th>
                            <th className="text-right px-3 py-2 text-[9px] font-semibold uppercase tracking-widest text-gray-400">IHLD</th>
                            <th className="text-right px-3 py-2 text-[9px] font-semibold uppercase tracking-widest text-gray-400">Real Port</th>
                            <th className="px-3 py-2 text-[9px] font-semibold uppercase tracking-widest text-gray-400">Share</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(([name, ihld, real, pct, color], i) => (
                            <tr key={i} className={`border-t border-gray-50 hover:bg-gray-50 ${i === rows.length - 1 ? 'font-bold text-gray-900' : 'text-gray-500'}`}>
                                <td className="px-3 py-2">{name}</td>
                                <td className="px-3 py-2 text-right font-mono">{ihld.toLocaleString()}</td>
                                <td className="px-3 py-2 text-right font-mono">{real.toLocaleString()}</td>
                                <td className="px-3 py-2">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                                        </div>
                                        <span className="font-mono text-[10px] text-gray-500">{pct}%</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── STATUS CHIP ──────────────────────────────────────────
function StatusChip({ status }: { status: TableRow['status'] }) {
    const map = {
        '7 GOLIVE': 'bg-green-50 text-green-700',
        '0 HOLD':   'bg-red-50 text-red-600',
        'ON PROG':  'bg-yellow-50 text-yellow-700',
    };
    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${map[status]}`}>{status}</span>
    );
}

    // ── 1. HELPER: generate target harian (ramp-up curve, berat di akhir bulan) ──
    function generateDailyTargets(totalTarget: number, daysInMonth: number): number[] {
        // Parabolic ramp: hari awal kecil, makin besar mendekati akhir bulan
        // Mirip pola commit proyek konstruksi nyata
        const weights = Array.from({ length: daysInMonth }, (_, i) => {
            const t = (i + 1) / daysInMonth;
            return Math.pow(t, 1.6); // exponent > 1 = berat di belakang
        });
        const sum = weights.reduce((a, b) => a + b, 0);
        return weights.map(w => Math.round((w / sum) * totalTarget));
    }
    
    // ── 2. KONSTANTA (nanti tinggal swap ke props/API) ────────────────────────────
    const MONTHLY_CONFIG = {
        GO_DEPLOY_TOTAL : 28_544,   // target total bulan ini
        GOLIVE_ACTUAL   : 2_312,    // golive yg sudah tercapai (dari backend nanti)
        NY_GOLIVE_TOTAL : 26_232,   // NY GoLive target
        ACHIEVEMENT_PCT : 8.1,      // persentase capaian (dari backend nanti)
    };
    
    // ── 3. HOOK: useMonthlChartData ───────────────────────────────────────────────
    function useMonthlyChartData() {
        const now            = new Date();
        const today          = now.getDate();                                          // 1-31
        const daysInMonth    = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const dayLabels      = Array.from({ length: daysInMonth }, (_, i) => i + 1); // [1,2,...,31]
    
        // Target harian (ramp-up)
        const dailyTargets   = generateDailyTargets(MONTHLY_CONFIG.GO_DEPLOY_TOTAL, daysInMonth);
    
        // Golive harian: hanya hari yg sudah lewat (≤ today)
        // Aktual = target * faktor realisasi dengan sedikit noise natural
        //   → nanti tinggal replace array ini dari API
        const goliveActual: number[] = dailyTargets.map((target, i) => {
            if (i >= today) return 0;                       // hari belum terjadi → 0
            // Simulasi realisasi: ~70-95% dari target, makin akhir makin baik
            const realizationRate = 0.70 + (i / today) * 0.25;
            const noise           = 1 + (Math.random() - 0.5) * 0.1; // ±5%
            return Math.max(0, Math.round(target * realizationRate * noise));
        });
    
        // NY GoLive (target): hari yg belum lewat
        const nyGolivePlan: number[] = dailyTargets.map((target, i) =>
            i >= today ? target : 0
        );
    
        // Garis rata-rata kumulatif (running avg dari target)
        // Ini yg bikin garisnya makin naik smooth
        const runningAvgLine: number[] = dailyTargets.map((_, i) => {
            const slice = dailyTargets.slice(0, i + 1);
            return Math.round(slice.reduce((a, b) => a + b, 0) / slice.length);
        });
    
        return { dayLabels, goliveActual, nyGolivePlan, runningAvgLine, today };
    }

// ─── CHART OPTIONS HELPERS ────────────────────────────────
const baseScales = {
    x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#9ca3af', font: { size: 9 } } },
    y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#9ca3af', font: { size: 9 } } },
};

// ─── MAIN PAGE ────────────────────────────────────────────
export default function PT3Konstruksi() {
    const [trendTab, setTrendTab] = useState<'1M'|'3M'|'6M'|'YTD'>('1M');
    const [search, setSearch] = useState('');

    const KPI = generateKpi(KPI_RAW);

    const filteredTable = TABLE_DATA.filter(r =>
        [r.region, r.distrik, r.ihld, r.lop, r.status, r.subStatus].some(v =>
            v.toLowerCase().includes(search.toLowerCase())
        )
    );

    // Monthly chart data
    const { dayLabels, goliveActual, nyGolivePlan, runningAvgLine, today } = useMonthlyChartData();
 
    const monthlyData = {
        labels: dayLabels,
        datasets: [
            // Dataset 1: GoLive actual (HIJAU) — bar per hari yg sudah lewat
            {
                type: 'bar' as const,
                label: 'GoLive',
                data: goliveActual,
                backgroundColor: 'rgba(34, 197, 94, 0.75)',   // tailwind green-500
                borderColor   : 'rgba(22, 163, 74, 0.9)',
                borderWidth   : 0,
                borderRadius  : 3,
                borderSkipped : false,
                order         : 2,
            },
            // Dataset 2: NY GoLive / target (UNGU) — bar per hari yang belum lewat
            {
                type: 'bar' as const,
                label: 'NY GoLive (Target)',
                data: nyGolivePlan,
                backgroundColor: 'rgba(139, 92, 246, 0.65)',  // tailwind violet-500
                borderColor   : 'rgba(109, 40, 217, 0.8)',
                borderWidth   : 0,
                borderRadius  : 3,
                borderSkipped : false,
                order         : 2,
            },
            // Dataset 3: Rata-rata (GARIS UNGU TIPIS)
            {
                type     : 'line' as const,
                label    : 'Rata-rata Harian',
                data     : runningAvgLine,
                borderColor  : 'rgba(167, 139, 250, 0.7)',    // violet-400
                borderWidth  : 1.5,
                fill         : false,
                pointRadius  : 0,
                tension      : 0.4,
                order        : 1,
            },
        ],
    };


    const monthlyOptions = {
        responsive          : true,
        maintainAspectRatio : false,
        plugins: {
            legend : { display: false },
            tooltip: {
                mode     : 'index' as const,
                intersect: false,
                callbacks: {
                    title : (items: any[]) => `Hari ke-${items[0].label}`,
                    label : (item: any)    => ` ${item.dataset.label}: ${item.parsed.y.toLocaleString('id-ID')}`,
                },
            },
        },
        scales: {
            x: {
                grid : { display: false },
                ticks: {
                    color       : '#9ca3af',
                    font        : { size: 9 },
                    maxTicksLimit: 10,
                    callback    : (val: any, idx: number) => {

                        return idx === 0 || (idx + 1) % 2 === 1 ? idx + 1 : '';
                    },
                },
            },
            y: {
                grid : { color: 'rgba(0,0,0,0.04)' },
                ticks: {
                    color   : '#9ca3af',
                    font    : { size: 9 },
                    callback: (val: string | number) => {
                        const n = Number(val);
                        if (n === 0)   return '0';
                        if (n >= 1000) return `${n / 1000} rb`;
                        return val;
                    },
                },
            },
        },
    };

    const trendData = {
        labels: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'],
        datasets: [
            {
                label: 'GoLive',
                data: [120,200,180,320,280,400,350],
                borderColor: '#2563eb',
                borderWidth: 2.5,
                fill: true,
                backgroundColor: 'rgba(37,99,235,0.07)',
                pointRadius: 4,
                pointBackgroundColor: '#2563eb',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                tension: 0.4,
            },
            {
                label: 'Rata-rata',
                data: [100,150,160,200,220,280,310],
                borderColor: '#16a34a',
                borderWidth: 2,
                borderDash: [5, 3],
                fill: true,
                backgroundColor: 'rgba(22,163,74,0.05)',
                pointRadius: 4,
                pointBackgroundColor: '#16a34a',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                tension: 0.4,
            },
        ],
    };

    const rankData = {
        labels: ['Medan','Bengkulu','Padang','Palembang','Jambi'],
        datasets: [{
            data: [92,75,57,57,52],
            backgroundColor: ['#2563eb','#3b82f6','#60a5fa','#93c5fd','#bfdbfe'],
            borderRadius: 4,
            borderSkipped: false,
        }],
    };

    const pieData = {
        labels: ['IHLD','Sumbagut','Sumbagteng'],
        datasets: [{
            data: [10000, 3000, 2000],
            backgroundColor: ['#2563eb','#dc2626','#7c3aed'],
            borderColor: '#ffffff',
            borderWidth: 3,
            hoverOffset: 8,
        }],
    };

    const stackedCities = ['MEDAN','BENGKULU','LAMPUNG','BANDA ACEH','PALEMBANG','PADANG','DUMAI','BINJAI','BUKIT TINGGI','RANTAU PRAPAT','PEKANBARU','BATAM','JAMBI','PANGKAL PINANG','P.SIANTAR','PDG SIDEMPUAN'];
    const stackedSeries = [
        { label: 'Go Deploy', color: '#ef4444', data: [28,15,22,18,25,19,12,14,17,10,21,16,13,9,11,8] },
        { label: 'GoLive',    color: '#16a34a', data: [10,7,9,8,11,8,5,6,7,4,9,7,5,4,5,3] },
        { label: 'NY GoLive', color: '#9ca3af', data: [12,8,11,9,13,10,6,7,9,5,11,8,6,5,6,4] },
        { label: 'Propose Drop', color: '#f472b6', data: [6,4,5,4,6,5,3,3,4,2,5,4,3,2,3,2] },
    ];
    const stackedData = {
        labels: stackedCities,
        datasets: stackedSeries.map(s => ({
            label: s.label,
            data: s.data,
            backgroundColor: s.color + 'cc',
            stack: 'stack',
        })),
    };

    const distStatus: [string, number, number, number, string][] = [
        ['Finish Instalasi', 1000, 1000, 100, '#16a34a'],
        ['Go Live',          500,  900,  95,  '#d97706'],
        ['Drop',             800,  800,  90,  '#ea580c'],
        ['Instalasi',        700,  700,  85,  '#2563eb'],
        ['MATDEL',           600,  600,  78,  '#7c3aed'],
        ['Perizinan',        500,  500,  39,  '#db2777'],
        ['Aanwijzing',       400,  400,  30,  '#4338ca'],
        ['Hold',             200,  200,  20,  '#dc2626'],
        ['Total Keseluruhan',4700, 5100, 100, '#111827'],
    ];
    const distSubStatus: [string, number, number, number, string][] = [
        ['Go live full',            1000, 1000, 100, '#16a34a'],
        ['Tidak dapat bin',         900,  900,  95,  '#d97706'],
        ['Teknis - feeder full',    800,  800,  90,  '#ea580c'],
        ['Non Teknis - CPP tinggi', 700,  700,  85,  '#2563eb'],
        ['Izin Kades/Lurah',        600,  600,  78,  '#7c3aed'],
        ['Double Order',            500,  500,  39,  '#db2777'],
        ['Belum Request Material',  400,  400,  30,  '#4338ca'],
        ['Belum Aanwijzing',        300,  300,  20,  '#dc2626'],
        ['Total Keseluruhan',       5200, 5200, 100, '#111827'],
    ];
    const distRegion: [string, number, number, number, string][] = [
        ['Sumbagut',         1000, 1000, 100, '#2563eb'],
        ['Sumbagsel',        900,  900,  95,  '#dc2626'],
        ['Sumbagteng',       800,  800,  93,  '#7c3aed'],
        ['Total Keseluruhan',2700, 2700, 100, '#111827'],
    ];
    

    return (
        <AppLayout>
            <Head title="PT3 Konstruksi — Dashboard" />

            <div className="w-full pb-16 transition-all duration-300 px-5 pt-5 box-border">

                {/* ── TOPBAR ── */}
                <div className="flex items-center mb-5">

                    <div className="flex items-center w-[90%] mx-auto bg-gray-100 border border-gray-200 rounded-lg overflow-hidden">

                        {/* SEARCH */}
                        <div className="flex items-center flex-1 px-3 py-2">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"/>
                                <path d="m21 21-4.35-4.35"/>
                            </svg>

                            <input
                                type="text"
                                placeholder="Cari LOP, IHLD..."
                                className="bg-transparent outline-none text-sm text-gray-700 w-full ml-2 placeholder-gray-400"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        {/* FILTER */}
                        <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition">
                            
                            {/* ICON FILTER (CORONG) */}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z"/>
                            </svg>

                            Filter
                        </button>

                    </div>
                </div>

                {/* ── KPI CARDS ── */}
                <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(148px, 1fr))' }}>
                    {KPI.map((item, i) => <KpiCard key={i} item={item} />)}
                </div>
                {/* ── ROW 1: Monthly | Trend | Rank ── */}
                <div className="grid gap-3 mb-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>

                    {/* Monthly GoLive */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="flex items-start justify-between px-5 pt-4 pb-0">
                            <div>
                                <div className="text-sm font-bold text-gray-800 mb-2">
                                    Monthly GoLive Commitment
                                </div>
                    
                                {/* Stats row */}
                                <div className="flex gap-5">
                                    {[
                                        { l: 'NY GOLIVE', v: MONTHLY_CONFIG.NY_GOLIVE_TOTAL.toLocaleString('id-ID').replace(/,/g, '.') },
                                        { l: 'GOLIVE',    v: MONTHLY_CONFIG.GOLIVE_ACTUAL.toLocaleString('id-ID').replace(/,/g, '.') },
                                        { l: 'GO DEPLOY', v: MONTHLY_CONFIG.GO_DEPLOY_TOTAL.toLocaleString('id-ID').replace(/,/g, '.') },
                                    ].map(s => (
                                        <div key={s.l} className="text-center">
                                            <div className="text-[8px] uppercase tracking-widest text-gray-400 leading-none mb-0.5">
                                                {s.l}
                                            </div>
                                            <div className="font-mono text-[11px] font-semibold text-gray-700">
                                                {s.v}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                    
                            {/* Persentase capaian */}
                            <div className="font-mono text-3xl font-bold text-green-500 leading-none">
                                {MONTHLY_CONFIG.ACHIEVEMENT_PCT.toLocaleString('id-ID')} %
                            </div>
                        </div>
                    
                        {/* Legend mini */}
                        <div className="flex gap-4 px-5 pt-3 pb-0">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-sm bg-green-500" />
                                <span className="text-[10px] text-gray-400">GoLive (tercapai)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-sm bg-violet-400" />
                                <span className="text-[10px] text-gray-400">NY GoLive (target)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-6 h-px bg-violet-300" />
                                <span className="text-[10px] text-gray-400">Rata-rata</span>
                            </div>
                        </div>
                    
                        {/* Chart */}
                        <div className="px-3 pb-4 pt-2" style={{ height: 200 }}>
                            <Bar data={monthlyData as any} options={monthlyOptions} />
                        </div>
                    </div>

                    {/* GoLive Trend */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-4 pt-4 pb-0">
                            <div className="text-xs font-bold text-gray-900 mb-2">GoLive Trend</div>
                        </div>
                        <div className="flex gap-0 border-b border-gray-100 px-3">
                            {(['1M','3M','6M','YTD'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setTrendTab(tab)}
                                    className={`text-[10px] font-semibold uppercase tracking-widest px-3 py-2 border-b-2 transition-colors ${trendTab === tab ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="px-3 pb-4 pt-2" style={{ height: 165 }}>
                            <Line
                                data={trendData}
                                options={{
                                    responsive: true, maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: baseScales,
                                }}
                            />
                        </div>
                    </div>

                    {/* GoLive Rank */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-4 pt-4 pb-2">
                            <div className="text-xs font-bold text-gray-900">GoLive Rank</div>
                        </div>
                        <div className="px-3 pb-4" style={{ height: 185 }}>
                            <Bar
                                data={rankData}
                                options={{
                                    indexAxis: 'y',
                                    responsive: true, maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        x: { ...baseScales.x, max: 100 },
                                        y: { grid: { display: false }, ticks: { color: '#374151', font: { size: 10 } } },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* ── ROW 2: Pie | Realisasi | Scope ── */}
                <div className="grid gap-3 mb-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>

                    {/* Pie — Nilai BoQ */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 pt-4 pb-2">
                            <div className="text-xs font-bold text-gray-900">Nilai BoQ per Wilayah</div>
                            <select className="text-[11px] bg-gray-50 border border-gray-200 text-gray-500 px-2 py-1 rounded-md">
                                <option>Semua Status</option>
                                <option>GoLive</option>
                                <option>On Progress</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-4 px-4 pb-4">
                            <div style={{ height: 140, flex: 1, position: 'relative' }}>
                                <Doughnut
                                    data={pieData}
                                    options={{
                                        responsive: true, maintainAspectRatio: false, cutout: '65%',
                                        plugins: {
                                            legend: { display: false },
                                            tooltip: { callbacks: { label: (c) => ` ${c.label}: ${c.parsed.toLocaleString()}` } },
                                        },
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-2.5">
                                {[{ label: 'IHLD', val: 10000, color: '#2563eb' }, { label: 'Sumbagut', val: 3000, color: '#dc2626' }, { label: 'Sumbagteng', val: 2000, color: '#7c3aed' }].map(p => (
                                    <div key={p.label} className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
                                        <div>
                                            <div className="text-[10px] text-gray-400">{p.label}</div>
                                            <div className="font-mono text-xs font-bold text-gray-800">{p.val.toLocaleString()}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Realisasi */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-4 pt-4 pb-2">
                            <div className="text-xs font-bold text-gray-900">Realisasi Keseluruhan</div>
                        </div>
                        <div className="px-4 pb-4">
                            <RealisasiBar name="BoQ" pct={90} plan="55,000" actual="50,000" gradient={['#4f46e5','#818cf8']} />
                            <RealisasiBar name="CPP" pct={90} plan="30,000" actual="39,000" gradient={['#15803d','#4ade80']} />
                            <RealisasiBar name="ODP" pct={90} plan="20,000" actual="30,000" gradient={['#c2410c','#fb923c']} />
                        </div>
                    </div>

                    {/* Scope & Periode */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-4 pt-4 pb-2">
                            <div className="text-xs font-bold text-gray-900">Scope &amp; Periode</div>
                        </div>
                        <div className="px-4 pb-4 space-y-4">
                            <div>
                                <div className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Range BOQ</div>
                                <div className="flex justify-between text-[9px] text-gray-400 mb-1">
                                    <span>BOQ Min</span><span>Stay High</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ width: '70%', marginLeft: '10%' }} />
                                </div>
                                <div className="flex justify-between font-mono text-[9px] text-gray-400 mt-0.5">
                                    <span>0</span><span className="text-blue-600 font-semibold">10,000 unit</span><span>12,248</span>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <div><div className="text-[9px] text-gray-400">Select (x)</div><div className="font-mono text-xs font-semibold text-gray-800">2,847 item</div></div>
                                    <div className="text-right"><div className="text-[9px] text-gray-400">Distrik Sumbang</div><div className="font-mono text-xs font-semibold text-gray-800">2,847 item</div></div>
                                </div>
                            </div>
                            <div>
                                <div className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Go Live Window</div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 text-center bg-gray-50 border border-gray-200 rounded-lg py-1.5 font-mono text-[10px] text-gray-600">01 Jan 2025</div>
                                    <span className="text-gray-400 text-xs">→</span>
                                    <div className="flex-1 text-center bg-gray-50 border border-gray-200 rounded-lg py-1.5 font-mono text-[10px] text-gray-600">31 Des 2025</div>
                                </div>
                                <div className="flex justify-between mt-2">
                                    <div><div className="text-[9px] text-gray-400">Durasi</div><div className="font-mono text-xs font-semibold text-gray-800">365 hari</div></div>
                                    <div className="text-right"><div className="text-[9px] text-gray-400">Status</div><div className="font-mono text-xs font-semibold text-green-600">Aktif</div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── ROW 3: Dist Tables ── */}
                <div className="grid gap-3 mb-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                    <DistTable title="Distribusi Status"     rows={distStatus} />
                    <DistTable title="Distribusi Sub-Status" rows={distSubStatus} />
                    <DistTable title="Distribusi Region"     rows={distRegion} />
                </div>

                {/* ── STACKED BAR ── */}
                <div className="bg-white border border-gray-200 rounded-xl mb-3 overflow-hidden">
                    <div className="px-4 pt-4 pb-2">
                        <div className="text-xs font-bold text-gray-900">GoLive per Kota — Distribusi Status</div>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center px-4 pb-2">
                        {stackedSeries.map(s => (
                            <div key={s.label} className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                                <span className="text-[11px] text-gray-500">{s.label}</span>
                                <span className="font-mono text-[11px] font-bold text-gray-800">{s.data.reduce((a,b) => a+b, 0)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="px-4 pb-4 overflow-x-auto">
                        <div style={{ minWidth: 600, height: 260 }}>
                            <Bar
                                data={stackedData}
                                options={{
                                    responsive: true, maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        x: {
                                            grid: { display: false },
                                            ticks: { color: '#9ca3af', font: { size: 9 }, maxRotation: 45, autoSkip: false },
                                            stacked: true,
                                        },
                                        y: { ...baseScales.y, stacked: true },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* ── DETAIL TABLE ── */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <div className="text-xs font-bold text-gray-900">Detail Data</div>
                        <button className="flex items-center gap-1.5 bg-blue-600 text-white rounded-lg px-3 py-1.5 text-[11px] font-semibold hover:bg-blue-700 transition-colors">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Export CSV
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-[11px] min-w-[900px]">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    {['Region','Distrik','IHLD','LOP','Nilai BoQ','Nilai Real','Real Port','CPP ACT','Status','Sub-Status Kons','Detail Status'].map(h => (
                                        <th key={h} className="text-left px-3 py-2.5 text-[9px] font-semibold uppercase tracking-widest text-gray-400 whitespace-nowrap border-r border-gray-100 last:border-0">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTable.map((r, i) => (
                                    <tr key={i} className="border-t border-gray-50 hover:bg-gray-50">
                                        <td className="px-3 py-2 font-semibold text-gray-800 whitespace-nowrap">{r.region}</td>
                                        <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{r.distrik}</td>
                                        <td className="px-3 py-2 font-mono text-gray-500 whitespace-nowrap">{r.ihld}</td>
                                        <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{r.lop}</td>
                                        <td className="px-3 py-2 font-mono text-blue-600 whitespace-nowrap">{r.nilaiBoq}</td>
                                        <td className="px-3 py-2 font-mono text-gray-500 whitespace-nowrap">{r.nilaiReal}</td>
                                        <td className="px-3 py-2 font-mono text-gray-500 whitespace-nowrap">{r.realPort}</td>
                                        <td className="px-3 py-2 font-mono text-gray-500 whitespace-nowrap">{r.cppAct.toLocaleString()}</td>
                                        <td className="px-3 py-2 whitespace-nowrap"><StatusChip status={r.status} /></td>
                                        <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{r.subStatus}</td>
                                        <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{r.detail}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}