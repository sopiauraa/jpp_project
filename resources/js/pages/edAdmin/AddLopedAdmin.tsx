import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

// ──────────────────────────────────────────────────────────────
//  DUMMY DATA
// ──────────────────────────────────────────────────────────────
interface STORecord {
  sto: string; regionTif: string; area: string;
  branchFmc: string; batchProgram: string;
}
const STO_DATA: STORecord[] = [
  { sto:"MES", regionTif:"Regional 1", area:"Area Medan",      branchFmc:"Branch Medan",     batchProgram:"Batch 1" },
  { sto:"BDG", regionTif:"Regional 1", area:"Area Bandung",    branchFmc:"Branch Bandung",   batchProgram:"Batch 2" },
  { sto:"JKT", regionTif:"Regional 1", area:"Area Jakarta",    branchFmc:"Branch Jakarta",   batchProgram:"Batch 1" },
  { sto:"SBY", regionTif:"Regional 1", area:"Area Surabaya",   branchFmc:"Branch Surabaya",  batchProgram:"Batch 3" },
];

type LopStatus = "Persiapan"|"Perizinan"|"Material Delivery"|"Instalasi"|"Aandwidjzing"|"Golive";
const STATUS_OPTIONS: LopStatus[] = ["Persiapan","Perizinan","Material Delivery","Instalasi","Aandwidjzing","Golive"];
const SUB_STATUS_MAP: Record<LopStatus, string[]> = {
  Persiapan:           ["Survey Lokasi","Validasi Data","Persiapan Dokumen"],
  Perizinan:           ["Proses Perizinan","Menunggu Izin Warga","Izin Pemda"],
  "Material Delivery": ["PO Material","Pengiriman Material","Material Tiba"],
  Instalasi:           ["Galian","Tarik Kabel","Splicing","Terminasi"],
  Aandwidjzing:        ["Perhitungan Ulang","Revisi BOQ","Approval Aandwidjzing"],
  Golive:              ["Uji Layanan","Aktivasi Port","Serah Terima"],
};
const MITRA_OPTIONS  = ["Mitra Telkom 1","Mitra Telkom 2","CV Cahaya Nusantara","PT Jaya Mandiri"];
const SUBCON_OPTIONS = ["Subcon Alpha","Subcon Beta","PT Konstruksi Jaya","CV Mandiri Teknik"];
const BULAN_OPTIONS  = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const BATCH_OPTIONS  = ["Batch 1","Batch 2","Batch 3"];

// ──────────────────────────────────────────────────────────────
//  TIPE DATA LOP (untuk mode isi waspang ED — dari tabel)
// ──────────────────────────────────────────────────────────────
export interface ExistingLOPDataED {
  idIhld: string;
  lop: string;
  sto: string;
  regionTif: string;
  area: string;
  branchFmc: string;
  batchProgram: string;
  tahun: string;
  mitra: string;
  subcon: string;
  boqPlan: string;
  cpp: string;
  odpPlan: string;
  projectAdmin: string;
  portPlan: string;
  waspangMitra: string; // readonly, hanya tampil sebagai info
}

// ──────────────────────────────────────────────────────────────
//  PROPS
// ──────────────────────────────────────────────────────────────
interface AddLopedAdminProps {
  isOpen: boolean;
  onClose: () => void;
  existingData?: ExistingLOPDataED | null;
}

const steps = ["Identitas LOP","Data Teknisi","Progres LOP","Identitas OLT","Aktualisasi Budget"];

// ──────────────────────────────────────────────────────────────
//  PORTAL
// ──────────────────────────────────────────────────────────────
function Portal({ children }: { children: React.ReactNode }) {
  return ReactDOM.createPortal(children, document.body);
}

// ──────────────────────────────────────────────────────────────
//  LABEL
// ──────────────────────────────────────────────────────────────
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

// ──────────────────────────────────────────────────────────────
//  READ-ONLY INPUT
// ──────────────────────────────────────────────────────────────
function ReadOnlyInput({ value }: { value: string }) {
  return (
    <div className="w-full flex items-center border rounded-md px-3 py-2 text-sm bg-gray-100 border-gray-200 cursor-not-allowed select-none min-h-[38px]">
      <span className="flex-1 text-gray-500">{value || "—"}</span>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
//  DROPDOWN
// ──────────────────────────────────────────────────────────────
function Dropdown({ value, onChange, options, placeholder = "", disabled }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string; disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node) && !triggerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  if (disabled) return <ReadOnlyInput value={value} />;

  return (
    <>
      <button ref={triggerRef} type="button"
        onClick={() => { if (!open && triggerRef.current) setRect(triggerRef.current.getBoundingClientRect()); setOpen(o => !o); }}
        className={`w-full flex items-center justify-between border rounded-md px-3 py-2 text-sm bg-gray-50 focus:outline-none transition
          ${open ? "border-amber-400 ring-2 ring-amber-200" : "border-gray-200 hover:border-amber-300"}`}>
        <span className={value ? "text-gray-800" : "text-gray-400"}>{value || placeholder}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-amber-500 transition-transform ${open?"rotate-180":""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      {open && rect && (
        <Portal>
          <div ref={panelRef} style={{ position:"fixed", top:rect.bottom+2, left:rect.left, width:rect.width, zIndex:99999 }}
            className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
            <div className="max-h-48 overflow-y-auto">
              {options.map(opt => (
                <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition ${value===opt?"bg-amber-50 text-amber-700 font-semibold":"text-gray-700 hover:bg-amber-50 hover:text-amber-700"}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}

// ──────────────────────────────────────────────────────────────
//  SEARCHABLE DROPDOWN
// ──────────────────────────────────────────────────────────────
function SearchableDropdown({ value, onChange, options, placeholder = "", disabled }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string; disabled?: boolean;
}) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const [rect, setRect]     = useState<DOMRect | null>(null);
  const triggerRef   = useRef<HTMLButtonElement>(null);
  const inputWrapRef = useRef<HTMLDivElement>(null);
  const panelRef     = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const h = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !triggerRef.current?.contains(t) && !inputWrapRef.current?.contains(t)) {
        setOpen(false); setSearch("");
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleOpen = () => {
    if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
    setOpen(true); setSearch("");
    setTimeout(() => inputRef.current?.focus(), 30);
  };

  useEffect(() => { if (open && inputWrapRef.current) setRect(inputWrapRef.current.getBoundingClientRect()); }, [open]);

  if (disabled) return <ReadOnlyInput value={value} />;

  return (
    <>
      {!open && (
        <button ref={triggerRef} type="button" onClick={handleOpen}
          className="w-full flex items-center justify-between border rounded-md px-3 py-2 text-sm bg-gray-50 border-gray-200 hover:border-amber-300 focus:outline-none transition">
          <span className={value ? "text-gray-800" : "text-gray-400"}>{value || placeholder}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
      )}
      {open && (
        <div ref={inputWrapRef} className="w-full flex items-center border rounded-md px-3 py-2 text-sm bg-white border-amber-400 ring-2 ring-amber-200">
          <input ref={inputRef} type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari..." className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"/>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      )}
      {open && rect && (
        <Portal>
          <div ref={panelRef} style={{ position:"fixed", top:rect.bottom+2, left:rect.left, width:rect.width, zIndex:99999 }}
            className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
            <div className="max-h-48 overflow-y-auto">
              {filtered.length === 0
                ? <div className="px-4 py-3 text-sm text-gray-400 text-center">Tidak ditemukan</div>
                : filtered.map(opt => (
                    <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); setSearch(""); }}
                      className={`w-full text-left px-4 py-2 text-sm transition ${value===opt?"bg-amber-50 text-amber-700 font-semibold":"text-gray-700 hover:bg-amber-50 hover:text-amber-700"}`}>
                      {opt}
                    </button>
                  ))
              }
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}

// ──────────────────────────────────────────────────────────────
//  MINI MODAL TAMBAH STATUS
// ──────────────────────────────────────────────────────────────
function CreateStatusModal({ isOpen, target, value, currentStatus, onChange, onSave, onClose }: {
  isOpen: boolean; target: "status"|"subStatus"|null; value: string; currentStatus: string;
  onChange: (v: string) => void; onSave: () => void; onClose: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 50); }, [isOpen]);
  if (!isOpen) return null;
  return (
    <Portal>
      <div className="fixed inset-0 bg-black/40 z-[99999] flex items-center justify-center" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-xl p-5 w-72" onClick={e => e.stopPropagation()}>
          <p className="text-sm font-semibold text-gray-800 mb-1">
            {target === "status" ? "Tambah Status Baru" : "Tambah Sub Status Baru"}
          </p>
          {target === "subStatus" && (
            <p className="text-xs text-amber-500 mb-3">untuk status: <span className="font-semibold">{currentStatus}</span></p>
          )}
          <input ref={inputRef} type="text" value={value} onChange={e => onChange(e.target.value)}
            onKeyDown={e => { if (e.key==="Enter") onSave(); if (e.key==="Escape") onClose(); }}
            placeholder={target==="status" ? "Nama status baru..." : "Nama sub status baru..."}
            className="w-full border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 transition"/>
          <div className="flex justify-end gap-2 mt-3">
            <button type="button" onClick={onClose}
              className="px-4 py-1.5 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium">Batal</button>
            <button type="button" onClick={onSave}
              className="px-4 py-1.5 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-medium">Simpan</button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

// ──────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ──────────────────────────────────────────────────────────────
type ModalView = "choice"|"form"|"import";

export default function AddLopedAdmin({ isOpen, onClose, existingData }: AddLopedAdminProps) {
  const isIsiWaspangMode = Boolean(existingData);

  const [view, setView]                 = useState<ModalView>("choice");
  const [currentStep, setCurrentStep]   = useState(0);
  const [showOltExtra, setShowOltExtra] = useState(false);
  const [stoMatched, setStoMatched]     = useState(false);

  const [extraStatusOptions, setExtraStatusOptions] = useState<string[]>([]);
  const [extraSubStatusMap, setExtraSubStatusMap]   = useState<Record<string, string[]>>({});
  const allStatusOptions = [...STATUS_OPTIONS, ...extraStatusOptions] as string[];

  const [createModal, setCreateModal] = useState<{ open:boolean; target:"status"|"subStatus"|null; value:string }>
    ({ open:false, target:null, value:"" });

  const emptyForm = {
    tahun:"", idIhld:"", sto:"", namaLop:"",
    regionTif:"", area:"", branchFmc:"", batchProgram:"",
    mitra:"", subcon:"",
    boqPlan:"", cpp:"", waspangTif:"",
    odpPlan:"", projectAdmin:"", portPlan:"",
    status:"Persiapan" as string, subStatus:"", detailStatus:"",
    tanggalGolive:"", bulanArgeGolive:"",
    portGolive:"", nilaiActual:"", odpGolive:"", idSw:"",
    pid:"", realJmlOdp16:"", idSwAbd:"", olt:"", realJmlOdp8:"",
    nilaiPrelim:"", portAandwidjzing:"", boqAandwidjzing:"",
    persenKenaikan:"", odpAandwidjzing:"", cppAkhir:"",
    portPlanBudget:"",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!isOpen) return;

    if (isIsiWaspangMode && existingData) {
      setForm({
        ...emptyForm,
        idIhld:       existingData.idIhld,
        namaLop:      existingData.lop,
        sto:          existingData.sto,
        regionTif:    existingData.regionTif,
        area:         existingData.area,
        branchFmc:    existingData.branchFmc,
        batchProgram: existingData.batchProgram,
        tahun:        existingData.tahun,
        mitra:        existingData.mitra,
        subcon:       existingData.subcon,
        boqPlan:      existingData.boqPlan,
        cpp:          existingData.cpp,
        odpPlan:      existingData.odpPlan,
        projectAdmin: existingData.projectAdmin,
        portPlan:     existingData.portPlan,
        waspangTif:   "",
      });
      setStoMatched(true);
      setCurrentStep(1);
      setView("form");
    } else {
      setForm(emptyForm);
      setStoMatched(false);
      setCurrentStep(0);
      setView("choice");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isIsiWaspangMode]);

  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleStoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    const found = STO_DATA.find(r => r.sto === val);
    if (found) {
      setStoMatched(true);
      setForm(f => ({ ...f, sto: val, regionTif: found.regionTif, area: found.area, branchFmc: found.branchFmc, batchProgram: found.batchProgram }));
    } else {
      setStoMatched(false);
      setForm(f => ({ ...f, sto: val, regionTif: "", area: "", branchFmc: "", batchProgram: "" }));
    }
  };

  const currentStatus    = form.status as LopStatus;
  const subStatusOptions = [
    ...(STATUS_OPTIONS.includes(currentStatus) ? SUB_STATUS_MAP[currentStatus] : ["Sub 1","Sub 2","Sub 3"]),
    ...(extraSubStatusMap[currentStatus] ?? []),
  ];
  const handleStatusChange = (val: string) => setForm(f => ({ ...f, status: val, subStatus: "" }));

  const isGolive       = form.status === "Golive";
  const isAandwidjzing = form.status === "Aandwidjzing";
  const isPersiapan    = form.status === "Persiapan";

  const handleNext = () => { if (currentStep < steps.length-1) setCurrentStep(s => s+1); };
  const handleBack = () => {
    if (currentStep > 0) {
      if (isIsiWaspangMode && currentStep === 1) return;
      setCurrentStep(s => s-1);
    }
  };

  const handleClose = () => {
    setView("choice"); setCurrentStep(0); setShowOltExtra(false); setStoMatched(false);
    setCreateModal({ open:false, target:null, value:"" });
    onClose();
  };

  const saveCreateModal = () => {
    const val = createModal.value.trim();
    if (!val) return;
    if (createModal.target === "status") {
      setExtraStatusOptions(p => [...p, val]);
      handleStatusChange(val);
    } else if (createModal.target === "subStatus") {
      setExtraSubStatusMap(prev => ({ ...prev, [currentStatus]: [...(prev[currentStatus] ?? []), val] }));
      setForm(f => ({ ...f, subStatus: val }));
    }
    setCreateModal({ open:false, target:null, value:"" });
  };

  const inputClass = "w-full border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition";

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose}/>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

        {/* ── CHOICE ── */}
        {view === "choice" && (
          <div style={{
            background:"linear-gradient(160deg,#fffbf5 0%,#fff7ed 50%,#ffedd5 100%)",
            borderRadius:"20px", width:"100%", maxWidth:"360px",
            position:"relative", overflow:"hidden",
            boxShadow:"0 8px 32px rgba(245,158,11,0.12),0 2px 8px rgba(0,0,0,0.06)",
            border:"1px solid rgba(251,191,36,0.2)",
          }}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:"3px",background:"linear-gradient(90deg,#fbbf24,#f59e0b,#fbbf24)",borderRadius:"20px 20px 0 0" }}/>
            <button onClick={handleClose} style={{
              position:"absolute",top:"14px",right:"14px",width:"26px",height:"26px",borderRadius:"50%",
              background:"rgba(245,158,11,0.08)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",
              cursor:"pointer",color:"#9ca3af",transition:"all 0.2s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(245,158,11,0.15)";e.currentTarget.style.color="#f59e0b";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(245,158,11,0.08)";e.currentTarget.style.color="#9ca3af";}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            <div style={{ padding:"32px 28px 20px",textAlign:"center" }}>
              <p style={{ color:"#431407",fontSize:"17px",fontWeight:700,letterSpacing:"-0.3px",margin:0 }}>Tambahkan LOP Baru</p>
              <p style={{ color:"#9ca3af",fontSize:"12px",marginTop:"5px" }}>Pilih cara input data LOP</p>
            </div>
            <div style={{ height:"1px",background:"rgba(245,158,11,0.1)",margin:"0 28px" }}/>
            <div style={{ padding:"20px 28px 28px",display:"flex",flexDirection:"column",gap:"10px" }}>
              {[
                { label:"Isi Form LOP", desc:"Input manual langkah demi langkah", icon:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>, action:()=>setView("form") },
                { label:"Import Data LOP", desc:"Upload file Excel sekaligus", icon:<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M17 8l-5-5-5 5M12 3v12"/>, action:()=>setView("import") },
              ].map(item => (
                <button key={item.label} onClick={item.action} style={{
                  width:"100%",padding:"0",border:"1px solid rgba(245,158,11,0.15)",
                  borderRadius:"12px",cursor:"pointer",overflow:"hidden",
                  background:"white",transition:"all 0.18s",textAlign:"left",
                  boxShadow:"0 1px 4px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(245,158,11,0.4)";e.currentTarget.style.boxShadow="0 4px 16px rgba(245,158,11,0.12)";e.currentTarget.style.transform="translateY(-1px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(245,158,11,0.15)";e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.04)";e.currentTarget.style.transform="translateY(0)";}}>
                  <div style={{ display:"flex",alignItems:"center",gap:"12px",padding:"14px 16px" }}>
                    <div style={{ width:"36px",height:"36px",borderRadius:"9px",flexShrink:0,background:"linear-gradient(135deg,#fef3c7,#fde68a)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="#f59e0b">{item.icon}</svg>
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ color:"#431407",fontSize:"13px",fontWeight:600,margin:0 }}>{item.label}</p>
                      <p style={{ color:"#9ca3af",fontSize:"11px",marginTop:"2px" }}>{item.desc}</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#fcd34d">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── FORM / IMPORT ── */}
        {view !== "choice" && (
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-auto relative flex flex-col" style={{ height:"500px" }}>
            <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <div className="pt-5 px-8 pb-3 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-800 text-center">
                {isIsiWaspangMode ? "Isi Waspang ED" : "Tambahkan LOP Baru"}
              </h2>
              {isIsiWaspangMode && (
                <div className="mt-2 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
                  </svg>
                  <p className="text-xs text-amber-700">
                    Data LOP sudah terisi. Lengkapi <span className="font-semibold">Waspang ED (TIF)</span> di bawah ini.
                  </p>
                </div>
              )}
            </div>

            {/* ── IMPORT ── */}
            {view === "import" && (
              <div className="flex-1 flex flex-col px-8 pb-5 min-h-0">
                <p className="text-sm text-center text-gray-600 mb-1 flex-shrink-0">
                  Upload Data LOP <span className="text-red-500 font-medium">*harus berbentuk excel</span>
                </p>
                <div className="flex-1 border border-dashed border-gray-300 rounded-xl p-5 mt-3 flex flex-col items-center justify-center gap-4">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <p className="text-xs text-gray-500">Download Template Excel <span className="text-gray-400">*optional</span></p>
                    <button type="button" className="flex items-center gap-2 px-5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 text-sm font-medium rounded-lg transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"/>
                      </svg>
                      Download Excel
                    </button>
                  </div>
                  <div className="w-full border-t border-gray-200"/>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-xs text-gray-500">Upload Data LOP</p>
                    <label className="flex items-center gap-2 px-5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 text-sm font-medium rounded-lg transition cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M17 8l-5-5-5 5M12 3v12"/>
                      </svg>
                      Upload LOP
                      <input type="file" accept=".xlsx,.xls" className="hidden"/>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4 flex-shrink-0">
                  <button onClick={() => setView("choice")} className="px-6 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium">Batal</button>
                  <button onClick={handleClose} className="px-6 py-2 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-medium">Simpan</button>
                </div>
              </div>
            )}

            {/* ── FORM STEPS ── */}
            {view === "form" && (
              <div className="flex-1 flex flex-col px-8 pb-5 min-h-0">
                <div className="relative border border-gray-200 rounded-xl pt-9 px-6 pb-4 mt-4 flex-1 flex flex-col min-h-0">
                  <div className="absolute -top-4 left-6">
                    <span className="bg-amber-500 text-white text-sm font-semibold px-5 py-2 rounded-lg block shadow-sm">
                      {steps[currentStep]}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-1">

                    {/* ── STEP 1: Identitas LOP ── */}
                    {currentStep === 0 && (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <div><Label required>Tahun</Label>
                          <input name="tahun" value={form.tahun} onChange={handleChange} className={inputClass}/></div>
                        <div><Label required>ID - IHLD</Label>
                          <input name="idIhld" value={form.idIhld} onChange={handleChange} className={inputClass}/></div>
                        <div><Label required>STO</Label>
                          <input name="sto" value={form.sto} onChange={handleStoChange} placeholder="Ketik STO (mis. MES, JKT)" className={inputClass}/></div>
                        <div><Label required>Nama LOP</Label>
                          <input name="namaLop" value={form.namaLop} onChange={handleChange} className={inputClass}/></div>
                        <div><Label required>Region FMC</Label><ReadOnlyInput value={form.regionTif}/></div>
                        <div><Label required>Area</Label><ReadOnlyInput value={form.area}/></div>
                        <div><Label required>Branch FMC</Label><ReadOnlyInput value={form.branchFmc}/></div>
                        <div><Label required>Batch Program</Label>
                          {stoMatched
                            ? <ReadOnlyInput value={form.batchProgram}/>
                            : <Dropdown value={form.batchProgram} onChange={set("batchProgram")} options={BATCH_OPTIONS} placeholder="Pilih Batch"/>
                          }
                        </div>
                      </div>
                    )}

                    {/* ── STEP 2: Data Teknisi ── */}
                    {currentStep === 1 && (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <div><Label required>Mitra</Label>
                          <SearchableDropdown value={form.mitra} onChange={set("mitra")}
                            options={MITRA_OPTIONS} placeholder="Pilih Mitra" disabled={isIsiWaspangMode}/></div>
                        <div><Label required>Subcon</Label>
                          <SearchableDropdown value={form.subcon} onChange={set("subcon")}
                            options={SUBCON_OPTIONS} placeholder="Pilih Subcon" disabled={isIsiWaspangMode}/></div>
                        <div><Label required>BoQ Plan</Label>
                          {isIsiWaspangMode
                            ? <ReadOnlyInput value={form.boqPlan}/>
                            : <input name="boqPlan" value={form.boqPlan} onChange={handleChange} className={inputClass}/>}
                        </div>
                        <div><Label required>CPP</Label>
                          {isIsiWaspangMode
                            ? <ReadOnlyInput value={form.cpp}/>
                            : <input name="cpp" value={form.cpp} onChange={handleChange} className={inputClass}/>}
                        </div>

                        {/* ─ WASPANG TIF: ini yang diisi ED ─ */}
                        <div className={isIsiWaspangMode ? "col-span-2 bg-amber-50 border border-amber-200 rounded-lg p-3" : ""}>
                          {isIsiWaspangMode && (
                            <p className="text-xs font-semibold text-amber-700 mb-2">Isi Waspang ED (TIF) di sini</p>
                          )}
                          <Label required>Waspang ED (TIF)</Label>
                          <input name="waspangTif" value={form.waspangTif} onChange={handleChange}
                            placeholder="Nama waspang ED..."
                            className={`${inputClass} ${isIsiWaspangMode ? "border-amber-300 focus:ring-amber-300 focus:border-amber-400 bg-white" : ""}`}/>
                        </div>

                        <div><Label required>ODP Plan</Label>
                          {isIsiWaspangMode
                            ? <ReadOnlyInput value={form.odpPlan}/>
                            : <input name="odpPlan" value={form.odpPlan} onChange={handleChange} className={inputClass}/>}
                        </div>
                        <div><Label required>Project Admin</Label>
                          {isIsiWaspangMode
                            ? <ReadOnlyInput value={form.projectAdmin}/>
                            : <input name="projectAdmin" value={form.projectAdmin} onChange={handleChange} className={inputClass}/>}
                        </div>
                        <div><Label required>Port Plan</Label>
                          {isIsiWaspangMode
                            ? <ReadOnlyInput value={form.portPlan}/>
                            : <input name="portPlan" value={form.portPlan} onChange={handleChange} className={inputClass}/>}
                        </div>
                      </div>
                    )}

                    {/* ── STEP 3: Progres LOP ── */}
                    {currentStep === 2 && (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3 items-start">
                        <div>
                          <Label required>Status</Label>
                          <div className="flex gap-2 items-center">
                            <div className="flex-1 min-w-0">
                              <SearchableDropdown value={form.status} onChange={handleStatusChange} options={allStatusOptions} placeholder="Pilih status"/>
                            </div>
                            <button type="button" onClick={() => setCreateModal({ open:true, target:"status", value:"" })}
                              className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-md border border-amber-400 bg-amber-50 text-amber-600 text-lg font-medium hover:bg-amber-100 transition">+</button>
                          </div>
                        </div>
                        <div>
                          <Label required>Sub Status</Label>
                          <div className="flex gap-2 items-center">
                            <div className="flex-1 min-w-0">
                              <SearchableDropdown value={form.subStatus} onChange={set("subStatus")} options={subStatusOptions} placeholder="Pilih sub status"/>
                            </div>
                            <button type="button" onClick={() => setCreateModal({ open:true, target:"subStatus", value:"" })}
                              className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-md border border-amber-400 bg-amber-50 text-amber-600 text-lg font-medium hover:bg-amber-100 transition">+</button>
                          </div>
                        </div>
                        <div>
                          <Label>Bulan Arge Golive</Label>
                          <SearchableDropdown value={form.bulanArgeGolive} onChange={set("bulanArgeGolive")} options={BULAN_OPTIONS} placeholder="Pilih bulan"/>
                        </div>
                        <div className="col-span-2">
                          <Label>Detail Status</Label>
                          <textarea name="detailStatus" value={form.detailStatus} onChange={handleChange} rows={2}
                            className="w-full border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none transition"/>
                        </div>
                        {isGolive && (
                          <div className="col-span-2">
                            <div className="border border-amber-200 bg-amber-50 rounded-lg px-4 pt-3 pb-2">
                              <p className="text-xs font-semibold text-amber-600 mb-2 uppercase tracking-wide">Data Golive</p>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                <div className="col-span-2"><Label>Tanggal Golive</Label>
                                  <input type="date" name="tanggalGolive" value={form.tanggalGolive} onChange={handleChange} className={inputClass}/></div>
                                <div><Label>Port Golive</Label><input name="portGolive" value={form.portGolive} onChange={handleChange} className={inputClass}/></div>
                                <div><Label>Nilai Actual</Label><input name="nilaiActual" value={form.nilaiActual} onChange={handleChange} className={inputClass}/></div>
                                <div><Label>ODP Golive</Label><input name="odpGolive" value={form.odpGolive} onChange={handleChange} className={inputClass}/></div>
                                <div><Label>ID SW</Label><input name="idSw" value={form.idSw} onChange={handleChange} className={inputClass}/></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── STEP 4: Identitas OLT ── */}
                    {currentStep === 3 && (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3 items-start">
                        <div className="flex flex-col gap-3">
                          <div><Label>PID</Label><input name="pid" value={form.pid} onChange={handleChange} className={inputClass}/></div>
                          <div><Label>ID SW ABD</Label><input name="idSwAbd" value={form.idSwAbd} onChange={handleChange} className={inputClass}/></div>
                          <div><Label>Real JML ODP 8</Label><input name="realJmlOdp8" value={form.realJmlOdp8} onChange={handleChange} className={inputClass}/></div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <div><Label>Real JML ODP 16</Label><input name="realJmlOdp16" value={form.realJmlOdp16} onChange={handleChange} className={inputClass}/></div>
                          <div>
                            <Label>OLT</Label>
                            <div className="flex rounded-md overflow-hidden border border-gray-200 w-full">
                              <button type="button" onClick={() => { setForm(f=>({...f,olt:"Need"})); setShowOltExtra(true); }}
                                className={`flex-1 py-2 text-sm font-medium transition ${form.olt==="Need"?"bg-amber-500 text-white":"bg-gray-50 text-gray-500 hover:bg-amber-50 hover:text-amber-600"}`}>Need</button>
                              <button type="button" onClick={() => { setForm(f=>({...f,olt:"No Need"})); setShowOltExtra(false); }}
                                className={`flex-1 py-2 text-sm font-medium transition ${form.olt==="No Need"?"bg-amber-500 text-white":"bg-gray-50 text-gray-500 hover:bg-amber-50 hover:text-amber-600"}`}>No Need</button>
                            </div>
                          </div>
                          {showOltExtra && (
                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 grid grid-cols-2 gap-3">
                              <div className="flex flex-col items-center gap-1.5 text-center">
                                <p className="text-xs text-gray-500">Download Excel</p>
                                <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-medium rounded-md transition">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"/></svg>
                                  excel olt
                                </button>
                              </div>
                              <div className="flex flex-col items-center gap-1.5 text-center">
                                <p className="text-xs text-gray-500">Upload Data OLT</p>
                                <label className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs font-medium rounded-md transition cursor-pointer">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M17 8l-5-5-5 5M12 3v12"/></svg>
                                  upload olt
                                  <input type="file" accept=".xlsx,.xls" className="hidden"/>
                                </label>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ── STEP 5: Aktualisasi Budget ── */}
                    {currentStep === 4 && (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <div><Label>Nilai PRELIM</Label><input name="nilaiPrelim" value={form.nilaiPrelim} onChange={handleChange} className={inputClass}/></div>
                        <div><Label>CPP Akhir</Label><input name="cppAkhir" value={form.cppAkhir} onChange={handleChange} className={inputClass}/></div>
                        {isPersiapan && (
                          <div className="col-span-2">
                            <div className="border border-blue-200 bg-blue-50 rounded-lg px-4 pt-3 pb-3">
                              <p className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">Budget Persiapan</p>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                <div><Label>Port Plan</Label><input name="portPlanBudget" value={form.portPlanBudget} onChange={handleChange} className={inputClass}/></div>
                                <div><Label>BOQ Plan</Label><input name="boqPlan" value={form.boqPlan} onChange={handleChange} className={inputClass}/></div>
                                <div><Label>ODP Plan</Label><input name="odpPlan" value={form.odpPlan} onChange={handleChange} className={inputClass}/></div>
                              </div>
                            </div>
                          </div>
                        )}
                        {isAandwidjzing && (
                          <div className="col-span-2">
                            <div className="border border-amber-200 bg-amber-50 rounded-lg px-4 pt-3 pb-3">
                              <p className="text-xs font-semibold text-amber-600 mb-2 uppercase tracking-wide">Budget Aandwidjzing</p>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                <div><Label>PORT Aandwidjzing</Label><input name="portAandwidjzing" value={form.portAandwidjzing} onChange={handleChange} className={inputClass}/></div>
                                <div><Label>BoQ Aandwidjzing</Label><input name="boqAandwidjzing" value={form.boqAandwidjzing} onChange={handleChange} className={inputClass}/></div>
                                <div><Label>% Kenaikan</Label><input name="persenKenaikan" value={form.persenKenaikan} onChange={handleChange} className={inputClass}/></div>
                                <div><Label>ODP Aandwidjzing</Label><input name="odpAandwidjzing" value={form.odpAandwidjzing} onChange={handleChange} className={inputClass}/></div>
                              </div>
                            </div>
                          </div>
                        )}
                        {isGolive && (
                          <div className="col-span-2">
                            <div className="border border-green-200 bg-green-50 rounded-lg px-4 pt-3 pb-3">
                              <p className="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">Budget Golive</p>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                <div><Label>Port Golive</Label><input name="portGolive" value={form.portGolive} onChange={handleChange} className={inputClass}/></div>
                                <div><Label>ODP Golive</Label><input name="odpGolive" value={form.odpGolive} onChange={handleChange} className={inputClass}/></div>
                                <div><Label>Nilai Actual</Label><input name="nilaiActual" value={form.nilaiActual} onChange={handleChange} className={inputClass}/></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>{/* end scroll */}
                </div>{/* end inner box */}

                {/* Footer nav */}
                <div className="flex justify-end gap-3 mt-3 flex-shrink-0">
                  {currentStep > 0 && !(isIsiWaspangMode && currentStep === 1)
                    ? <button onClick={handleBack} className="px-6 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium">Kembali</button>
                    : <button onClick={isIsiWaspangMode ? handleClose : () => setView("choice")} className="px-6 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium">
                        {isIsiWaspangMode ? "Batal" : "Kembali"}
                      </button>
                  }
                  {currentStep < steps.length-1
                    ? <button onClick={handleNext} className="px-6 py-2 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-medium">Selanjutnya</button>
                    : <button onClick={handleClose} className="px-6 py-2 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-medium">Simpan</button>
                  }
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateStatusModal
        isOpen={createModal.open}
        target={createModal.target}
        value={createModal.value}
        currentStatus={currentStatus}
        onChange={val => setCreateModal(s => ({ ...s, value: val }))}
        onSave={saveCreateModal}
        onClose={() => setCreateModal({ open:false, target:null, value:"" })}
      />
    </>
  );
}