import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

interface AddModalLOPProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  "Identitas LOP",
  "Data Teknisi",
  "Progres LOP",
  "Identitas OLT",
  "Aktualisasi Budget",
];

/* ─────────────────────────────────────────────
   Portal — render ke document.body supaya tidak
   terpotong oleh overflow:hidden / scroll container
───────────────────────────────────────────── */
function Portal({ children }: { children: React.ReactNode }) {
  return ReactDOM.createPortal(children, document.body);
}

/* ─────────────────────────────────────────────
   Dropdown biasa (tanpa search) — Region FMC
───────────────────────────────────────────── */
function Dropdown({
  value,
  onChange,
  options,
  placeholder = "",
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const openDropdown = () => {
    if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
    setOpen(true);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !triggerRef.current?.contains(t))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openDropdown())}
        className={`w-full flex items-center justify-between border rounded-md px-3 py-2 text-sm bg-gray-50 focus:outline-none transition
          ${open ? "border-violet-400 ring-2 ring-violet-200" : "border-gray-200 hover:border-violet-300"}`}
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>{value || placeholder}</span>
        <svg xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 text-violet-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && rect && (
        <Portal>
          <div
            ref={panelRef}
            style={{
              position: "fixed",
              top: rect.bottom + 2,
              left: rect.left,
              width: rect.width,
              zIndex: 99999,
            }}
            className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
          >
            <div className="max-h-48 overflow-y-auto">
              {options.map((opt) => (
                <button key={opt} type="button"
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition ${
                    value === opt
                      ? "bg-violet-50 text-violet-700 font-semibold"
                      : "text-gray-700 hover:bg-violet-50 hover:text-violet-700"
                  }`}>
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

/* ─────────────────────────────────────────────
   SearchableDropdown — bisa ketik untuk filter
───────────────────────────────────────────── */
function SearchableDropdown({
  value,
  onChange,
  options,
  placeholder = "",
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [rect, setRect] = useState<DOMRect | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputWrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        !panelRef.current?.contains(t) &&
        !triggerRef.current?.contains(t) &&
        !inputWrapRef.current?.contains(t)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
    setOpen(true);
    setSearch("");
    setTimeout(() => inputRef.current?.focus(), 30);
  };

  useEffect(() => {
    if (open && inputWrapRef.current) {
      setRect(inputWrapRef.current.getBoundingClientRect());
    }
  }, [open]);

  return (
    <>
      {!open && (
        <button
          ref={triggerRef}
          type="button"
          onClick={handleOpen}
          className="w-full flex items-center justify-between border rounded-md px-3 py-2 text-sm bg-gray-50 border-gray-200 hover:border-violet-300 focus:outline-none transition"
        >
          <span className={value ? "text-gray-800" : "text-gray-400"}>{value || placeholder}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-500"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {open && (
        <div
          ref={inputWrapRef}
          className="w-full flex items-center border rounded-md px-3 py-2 text-sm bg-white border-violet-400 ring-2 ring-violet-200"
        >
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-500 rotate-180"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      )}

      {open && rect && (
        <Portal>
          <div
            ref={panelRef}
            style={{
              position: "fixed",
              top: rect.bottom + 2,
              left: rect.left,
              width: rect.width,
              zIndex: 99999,
            }}
            className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
          >
            <div className="max-h-48 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-400 text-center">Tidak ditemukan</div>
              ) : (
                filtered.map((opt) => (
                  <button key={opt} type="button"
                    onClick={() => { onChange(opt); setOpen(false); setSearch(""); }}
                    className={`w-full text-left px-4 py-2 text-sm transition ${
                      value === opt
                        ? "bg-violet-50 text-violet-700 font-semibold"
                        : "text-gray-700 hover:bg-violet-50 hover:text-violet-700"
                    }`}>
                    {opt}
                  </button>
                ))
              )}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   Regional TIF — read-only, otomatis "Regional 1"
───────────────────────────────────────────── */
function RegionalTIFInput() {
  return (
    <div className="w-full flex items-center border rounded-md px-3 py-2 text-sm bg-gray-100 border-gray-200 cursor-not-allowed select-none">
      <span className="flex-1 text-gray-500">Regional 1</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CreateStatusModal — mini modal untuk tambah
   status / sub status baru
───────────────────────────────────────────── */
interface CreateStatusModalProps {
  isOpen: boolean;
  target: "status" | "subStatus" | null;
  value: string;
  onChange: (val: string) => void;
  onSave: () => void;
  onClose: () => void;
}

function CreateStatusModal({
  isOpen,
  target,
  value,
  onChange,
  onSave,
  onClose,
}: CreateStatusModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [isOpen]);

  if (!isOpen) return null;

  const title = target === "status" ? "Tambah Status Baru" : "Tambah Sub Status Baru";
  const placeholder = target === "status" ? "Nama status baru..." : "Nama sub status baru...";

  return (
    <Portal>
      <div
        className="fixed inset-0 bg-black/40 z-[99999] flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-xl shadow-xl p-5 w-72"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-sm font-semibold text-gray-800 mb-3">{title}</p>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onSave(); if (e.key === "Escape") onClose(); }}
            placeholder={placeholder}
            className="w-full border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition"
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onSave}
              className="px-4 py-1.5 text-sm bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition font-medium"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
type ModalView = "choice" | "form" | "import";

export default function AddModalLOP({ isOpen, onClose }: AddModalLOPProps) {
  const [view, setView] = useState<ModalView>("choice");
  const [currentStep, setCurrentStep] = useState(0);
  const [showOltExtra, setShowOltExtra] = useState(false);

  // "mitra" | "subcon" | null — hanya bisa pilih salah satu
  const [teknisiMode, setTeknisiMode] = useState<"mitra" | "subcon" | null>(null);

  // Dynamic options untuk Status & Sub Status
  const [statusOptions, setStatusOptions] = useState(["GoLive", "On Progress", "Hold"]);
  const [subStatusOptions, setSubStatusOptions] = useState(["Sub 1", "Sub 2", "Sub 3"]);

  // State mini modal create
  const [createModal, setCreateModal] = useState<{
    open: boolean;
    target: "status" | "subStatus" | null;
    value: string;
  }>({ open: false, target: null, value: "" });

  const [form, setForm] = useState({
    tahun: "", distrik: "", idIhld: "", sto: "", namaLop: "",
    regionFmc: "", area: "", branchFmc: "", regionalTif: "Regional 1", batchProgram: "",
    namaMitra: "", boqPlan: "", subcon: "", cpp: "", waspang: "",
    odpPlan: "", projectAdmin: "", portPlan: "",
    status: "", subStatus: "", detailStatus: "",
    tanggalGolive: "", tanggalArgeGolive: "",
    pid: "", realJmlOdp16: "", idSwAbd: "", olt: "", realJmlOdp8: "",
    nilaiPrelim: "", portAandwidjzing: "", boqAandwidjzing: "",
    persenKenaikan: "", odpAandwidjzing: "", cppAkhir: "",
  });

  const set = (key: string) => (val: string) => setForm((f) => ({ ...f, [key]: val }));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleNext = () => { if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1); };
  const handleBack = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };
  const handleClose = () => {
    setView("choice");
    setCurrentStep(0);
    setShowOltExtra(false);
    setTeknisiMode(null);
    setCreateModal({ open: false, target: null, value: "" });
    onClose();
  };

  const handleTeknisiMode = (mode: "mitra" | "subcon") => {
    setTeknisiMode(mode);
    setForm((f) => ({ ...f, namaMitra: "", subcon: "" }));
  };

  // Handler mini modal create status / sub status
  const openCreateModal = (target: "status" | "subStatus") => {
    setCreateModal({ open: true, target, value: "" });
  };

  const saveCreateModal = () => {
    const val = createModal.value.trim();
    if (!val) return;
    if (createModal.target === "status") {
      setStatusOptions((prev) => [...prev, val]);
      set("status")(val);
    } else if (createModal.target === "subStatus") {
      setSubStatusOptions((prev) => [...prev, val]);
      set("subStatus")(val);
    }
    setCreateModal({ open: false, target: null, value: "" });
  };

  const closeCreateModal = () => {
    setCreateModal({ open: false, target: null, value: "" });
  };

  const inputClass = "w-full border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

        {/* ── CHOICE ── */}
        {view === "choice" && (
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs mx-auto relative flex flex-col">
            <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="pt-6 px-6 pb-2">
              <h2 className="text-lg font-bold text-gray-800 text-center">Tambahkan LOP Baru</h2>
            </div>
            <div className="flex flex-col px-6 pb-6 pt-4 gap-3">
              <button onClick={() => setView("form")} className="w-full py-2.5 bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-xl transition text-sm">
                Isi Form LOP
              </button>
              <button onClick={() => setView("import")} className="w-full py-2.5 bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-xl transition text-sm">
                Import Data LOP
              </button>
            </div>
          </div>
        )}

        {/* ── IMPORT & FORM ── */}
        {view !== "choice" && (
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-auto relative flex flex-col" style={{ height: "500px" }}>

            <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="pt-5 px-8 pb-3 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-800 text-center">Tambahkan LOP Baru</h2>
            </div>

            {/* ── IMPORT ── */}
            {view === "import" && (
              <div className="flex-1 flex flex-col px-8 pb-5 min-h-0">
                <p className="text-sm text-center text-gray-600 mb-1 flex-shrink-0">
                  Upload Data LOP{" "}
                  <span className="text-red-500 font-medium">*data yang diupload harus berbentuk excel</span>
                </p>
                <div className="flex-1 border border-dashed border-gray-300 rounded-xl p-5 mt-3 flex flex-col items-center justify-center gap-4">
                  <div className="w-full flex flex-col items-center gap-2 text-center">
                    <p className="text-xs text-gray-500">Download Excel dibawah <span className="text-gray-400">*optional</span></p>
                    <button type="button"
                      className="flex items-center gap-2 px-5 py-2 bg-violet-100 hover:bg-violet-200 text-violet-700 text-sm font-medium rounded-lg transition"
                      onClick={() => { const l = document.createElement("a"); l.href = "/template-lop.xlsx"; l.download = "template_lop.xlsx"; l.click(); }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                      </svg>
                      Download Excel
                    </button>
                  </div>
                  <div className="w-full border-t border-gray-200" />
                  <div className="w-full flex flex-col items-center gap-2">
                    <p className="text-xs text-gray-500">Upload Data LOP</p>
                    <label className="flex items-center gap-2 px-5 py-2 bg-violet-100 hover:bg-violet-200 text-violet-700 text-sm font-medium rounded-lg transition cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M17 8l-5-5-5 5M12 3v12" />
                      </svg>
                      Upload LOP
                      <input type="file" accept=".xlsx,.xls" className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) console.log("File:", f.name); }} />
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4 flex-shrink-0">
                  <button onClick={() => setView("choice")} className="px-6 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium">Batal</button>
                  <button onClick={handleClose} className="px-6 py-2 text-sm bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition font-medium">Simpan</button>
                </div>
              </div>
            )}

            {/* ── FORM ── */}
            {view === "form" && (
              <div className="flex-1 flex flex-col px-8 pb-5 min-h-0">
                <div className="relative border border-gray-200 rounded-xl pt-9 px-6 pb-4 mt-4 flex-1 flex flex-col min-h-0">
                  <div className="absolute -top-4 left-6">
                    <span className="bg-violet-500 text-white text-sm font-semibold px-5 py-2 rounded-lg block shadow-sm">
                      {steps[currentStep]}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-1">

                    {/* Step 1 — Identitas LOP */}
                    {currentStep === 0 && (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <div><label className={labelClass}>Tahun</label><input name="tahun" value={form.tahun} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Distrik</label><input name="distrik" value={form.distrik} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>ID - IHLD</label><input name="idIhld" value={form.idIhld} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>STO</label><input name="sto" value={form.sto} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Nama LOP</label><input name="namaLop" value={form.namaLop} onChange={handleChange} className={inputClass} /></div>
                        <div>
                          <label className={labelClass}>Region FMC</label>
                          <Dropdown value={form.regionFmc} onChange={set("regionFmc")}
                            options={["SUMBAGUT","SUMBAGSEL","JABOTABEK","JABAR","JATENG","JATIM","BALI","PAMASUKA"]} />
                        </div>
                        <div><label className={labelClass}>Area</label><input name="area" value={form.area} onChange={handleChange} className={inputClass} /></div>
                        <div>
                          <label className={labelClass}>Branch FMC</label>
                          <SearchableDropdown value={form.branchFmc} onChange={set("branchFmc")}
                            options={["Branch 1","Branch 2","Branch 3"]} placeholder="Pilih Branch FMC" />
                        </div>
                        <div>
                          <label className={labelClass}>Regional TIF</label>
                          <RegionalTIFInput />
                        </div>
                        <div>
                          <label className={labelClass}>Batch Program</label>
                          <SearchableDropdown value={form.batchProgram} onChange={set("batchProgram")}
                            options={["Batch 1","Batch 2","Batch 3"]} placeholder="Pilih Batch Program" />
                        </div>
                      </div>
                    )}

                    {/* Step 2 — Data Teknisi */}
                    {currentStep === 1 && (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">

                        {/* Toggle Mitra / Subcon — eksklusif */}
                        <div className="col-span-2">
                          <label className={labelClass}>Tipe Teknisi</label>
                          <div className="flex rounded-md overflow-hidden border border-gray-200 w-full">
                            <button
                              type="button"
                              onClick={() => handleTeknisiMode("mitra")}
                              className={`flex-1 py-2 text-sm font-medium transition ${
                                teknisiMode === "mitra"
                                  ? "bg-violet-500 text-white"
                                  : "bg-gray-50 text-gray-500 hover:bg-violet-50 hover:text-violet-600"
                              }`}
                            >
                              Mitra
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTeknisiMode("subcon")}
                              className={`flex-1 py-2 text-sm font-medium transition ${
                                teknisiMode === "subcon"
                                  ? "bg-violet-500 text-white"
                                  : "bg-gray-50 text-gray-500 hover:bg-violet-50 hover:text-violet-600"
                              }`}
                            >
                              Subcon
                            </button>
                          </div>
                        </div>

                        {/* Input Nama Mitra — muncul jika pilih Mitra */}
                        {teknisiMode === "mitra" && (
                          <div className="col-span-2">
                            <label className={labelClass}>Nama Mitra</label>
                            <SearchableDropdown
                              value={form.namaMitra}
                              onChange={set("namaMitra")}
                              options={["Mitra 1", "Mitra 2", "Mitra 3"]}
                              placeholder="Pilih Mitra"
                            />
                          </div>
                        )}

                        {/* Input Subcon — muncul jika pilih Subcon */}
                        {teknisiMode === "subcon" && (
                          <div className="col-span-2">
                            <label className={labelClass}>Subcon</label>
                            <SearchableDropdown
                              value={form.subcon}
                              onChange={set("subcon")}
                              options={["Subcon 1", "Subcon 2", "Subcon 3"]}
                              placeholder="Pilih Subcon"
                            />
                          </div>
                        )}

                        {/* Field lainnya */}
                        <div><label className={labelClass}>BoQ Plan</label><input name="boqPlan" value={form.boqPlan} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>CPP</label><input name="cpp" value={form.cpp} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>WASPANG</label><input name="waspang" value={form.waspang} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>ODP Plan</label><input name="odpPlan" value={form.odpPlan} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Project Admin</label><input name="projectAdmin" value={form.projectAdmin} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>Port plan</label><input name="portPlan" value={form.portPlan} onChange={handleChange} className={inputClass} /></div>
                      </div>
                    )}

                    {/* Step 3 — Progres LOP */}
                    {currentStep === 2 && (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3 items-start">

                        {/* Status + tombol + */}
                        <div>
                          <label className={labelClass}>Status</label>
                          <div className="flex gap-2 items-center">
                            <div className="flex-1 min-w-0">
                              <SearchableDropdown
                                value={form.status}
                                onChange={set("status")}
                                options={statusOptions}
                                placeholder="Pilih status"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => openCreateModal("status")}
                              className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-md border border-violet-400 bg-violet-50 text-violet-600 text-lg font-medium hover:bg-violet-100 transition"
                              title="Tambah status baru"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Tgl Golive */}
                        <div>
                          <label className={labelClass}>Tanggal Golive</label>
                          <input
                            type="date"
                            name="tanggalGolive"
                            value={form.tanggalGolive}
                            onChange={handleChange}
                            className={inputClass}
                          />
                        </div>

                        {/* Sub Status + tombol + */}
                        <div>
                          <label className={labelClass}>Sub status</label>
                          <div className="flex gap-2 items-center">
                            <div className="flex-1 min-w-0">
                              <SearchableDropdown
                                value={form.subStatus}
                                onChange={set("subStatus")}
                                options={subStatusOptions}
                                placeholder="Pilih sub status"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => openCreateModal("subStatus")}
                              className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-md border border-violet-400 bg-violet-50 text-violet-600 text-lg font-medium hover:bg-violet-100 transition"
                              title="Tambah sub status baru"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Tanggal Arge Golive */}
                        <div>
                          <label className={labelClass}>Bulan arge golive</label>
                          <SearchableDropdown
                            value={form.tanggalArgeGolive}
                            onChange={set("tanggalArgeGolive")}
                            placeholder="Pilih bulan"
                            options={["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]}
                          />
                        </div>

                        {/* Detail Status — full width */}
                        <div className="col-span-2">
                          <label className={labelClass}>Detail Status</label>
                          <textarea
                            name="detailStatus"
                            value={form.detailStatus}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none transition"
                          />
                        </div>

                      </div>
                    )}

                    {/* Step 4 — Identitas OLT */}
                    {currentStep === 3 && (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3 items-start">
                        <div className="flex flex-col gap-3">
                          <div><label className={labelClass}>PID</label><input name="pid" value={form.pid} onChange={handleChange} className={inputClass} /></div>
                          <div><label className={labelClass}>ID SW ABD</label><input name="idSwAbd" value={form.idSwAbd} onChange={handleChange} className={inputClass} /></div>
                          <div><label className={labelClass}>Real JML ODP 8</label><input name="realJmlOdp8" value={form.realJmlOdp8} onChange={handleChange} className={inputClass} /></div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <div><label className={labelClass}>Real JML ODP 16</label><input name="realJmlOdp16" value={form.realJmlOdp16} onChange={handleChange} className={inputClass} /></div>
                          <div>
                            <label className={labelClass}>OLT</label>
                            <div className="flex rounded-md overflow-hidden border border-gray-200 w-full">
                              <button type="button"
                                onClick={() => { setForm({ ...form, olt: "Need" }); setShowOltExtra(true); }}
                                className={`flex-1 py-2 text-sm font-medium transition ${form.olt === "Need" ? "bg-violet-500 text-white" : "bg-gray-50 text-gray-500 hover:bg-violet-50 hover:text-violet-600"}`}>
                                Need
                              </button>
                              <button type="button"
                                onClick={() => { setForm({ ...form, olt: "No Need" }); setShowOltExtra(false); }}
                                className={`flex-1 py-2 text-sm font-medium transition ${form.olt === "No Need" ? "bg-violet-500 text-white" : "bg-gray-50 text-gray-500 hover:bg-violet-50 hover:text-violet-600"}`}>
                                No Need
                              </button>
                            </div>
                          </div>
                          {showOltExtra && (
                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 grid grid-cols-2 gap-3">
                              <div className="flex flex-col items-center gap-1.5 text-center">
                                <p className="text-xs text-gray-500">Download Excel</p>
                                <button type="button"
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 hover:bg-violet-200 text-violet-700 text-xs font-medium rounded-md transition"
                                  onClick={() => { const l = document.createElement("a"); l.href = "/template-olt.xlsx"; l.download = "excel_olt.xlsx"; l.click(); }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                                  </svg>
                                  excel olt
                                </button>
                              </div>
                              <div className="flex flex-col items-center gap-1.5 text-center">
                                <p className="text-xs text-gray-500">Upload Data OLT</p>
                                <label className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 hover:bg-violet-200 text-violet-700 text-xs font-medium rounded-md transition cursor-pointer">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M17 8l-5-5-5 5M12 3v12" />
                                  </svg>
                                  upload olt
                                  <input type="file" accept=".xlsx,.xls" className="hidden"
                                    onChange={(e) => { const f = e.target.files?.[0]; if (f) console.log("File:", f.name); }} />
                                </label>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 5 — Aktualisasi Budget */}
                    {currentStep === 4 && (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <div><label className={labelClass}>Nilai PRELIM</label><input name="nilaiPrelim" value={form.nilaiPrelim} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>PORT Aandwidjzing</label><input name="portAandwidjzing" value={form.portAandwidjzing} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>BoQ Aandwidjzing</label><input name="boqAandwidjzing" value={form.boqAandwidjzing} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>% Kenaikan Aandwidjzing</label><input name="persenKenaikan" value={form.persenKenaikan} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>ODP Aandwidjzing</label><input name="odpAandwidjzing" value={form.odpAandwidjzing} onChange={handleChange} className={inputClass} /></div>
                        <div><label className={labelClass}>CPP Akhir</label><input name="cppAkhir" value={form.cppAkhir} onChange={handleChange} className={inputClass} /></div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 mt-3 flex-shrink-0">
                  {currentStep > 0 ? (
                    <button onClick={handleBack} className="px-6 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium">Kembali</button>
                  ) : (
                    <button onClick={() => setView("choice")} className="px-6 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium">Batal</button>
                  )}
                  {currentStep < steps.length - 1 ? (
                    <button onClick={handleNext} className="px-6 py-2 text-sm bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition font-medium">Selanjutnya</button>
                  ) : (
                    <button onClick={handleClose} className="px-6 py-2 text-sm bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition font-medium">Simpan</button>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Mini Modal Create Status / Sub Status */}
      <CreateStatusModal
        isOpen={createModal.open}
        target={createModal.target}
        value={createModal.value}
        onChange={(val) => setCreateModal((s) => ({ ...s, value: val }))}
        onSave={saveCreateModal}
        onClose={closeCreateModal}
      />
    </>
  );
}