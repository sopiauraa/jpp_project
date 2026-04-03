import { useState, useRef, useEffect } from "react";

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
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const openDropdown = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const panelWidth = rect.width;
      const viewportWidth = window.innerWidth;
      let left = rect.left + window.scrollX;
      if (left + panelWidth > viewportWidth - 8) left = viewportWidth - panelWidth - 8;
      setPos({ top: rect.bottom + window.scrollY + 4, left, width: rect.width });
    }
    setOpen(true);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setOpen(false);
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
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-violet-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div ref={panelRef} style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }} className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="max-h-48 overflow-y-auto">
            {options.map((opt) => (
              <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm transition ${value === opt ? "bg-violet-50 text-violet-700 font-semibold" : "text-gray-700 hover:bg-violet-50 hover:text-violet-700"}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

type ModalView = "choice" | "form" | "import";

export default function AddModalLOP({ isOpen, onClose }: AddModalLOPProps) {
  const [view, setView] = useState<ModalView>("choice");
  const [currentStep, setCurrentStep] = useState(0);
  const [showOltExtra, setShowOltExtra] = useState(false);

  const [form, setForm] = useState({
    tahun: "", distrik: "", idIhld: "", sto: "", namaLop: "",
    regionFmc: "", area: "", branchFmc: "", regionalTif: "", batchProgram: "",
    namaMitra: "", boqPlan: "", subcon: "", cpp: "", waspang: "",
    odpPlan: "", projectAdmin: "", portPlan: "",
    status: "", subStatus: "", detailStatus: "", kendalaGolive: "",
    tglGolive: "", tanggalArgeGolive: "",
    // olt default "" — belum ada yang terpilih
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
    onClose();
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

        {/* ── IMPORT & FORM — ukuran fixed sama semua step ── */}
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

                  <div className="flex-1 overflow-y-auto overflow-x-clip pr-1">

                    {/* Step 1 — Identitas LOP */}
                    {currentStep === 0 && (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <div className="min-w-0"><label className={labelClass}>Tahun</label><input name="tahun" value={form.tahun} onChange={handleChange} className={inputClass} /></div>
                        <div className="min-w-0"><label className={labelClass}>Distrik</label><input name="distrik" value={form.distrik} onChange={handleChange} className={inputClass} /></div>
                        <div className="min-w-0"><label className={labelClass}>ID - IHLD</label><input name="idIhld" value={form.idIhld} onChange={handleChange} className={inputClass} /></div>
                        <div className="min-w-0"><label className={labelClass}>STO</label><input name="sto" value={form.sto} onChange={handleChange} className={inputClass} /></div>
                        <div className="min-w-0"><label className={labelClass}>Nama LOP</label><input name="namaLop" value={form.namaLop} onChange={handleChange} className={inputClass} /></div>
                        <div className="min-w-0"><label className={labelClass}>Region FMC</label><Dropdown value={form.regionFmc} onChange={set("regionFmc")} options={["SUMBAGUT","SUMBAGSEL","JABOTABEK","JABAR","JATENG","JATIM","BALI","PAMASUKA"]} /></div>
                        <div className="min-w-0"><label className={labelClass}>Area</label><input name="area" value={form.area} onChange={handleChange} className={inputClass} /></div>
                        <div className="min-w-0"><label className={labelClass}>Branch FMC</label><Dropdown value={form.branchFmc} onChange={set("branchFmc")} options={["Branch 1","Branch 2","Branch 3"]} /></div>
                        <div className="min-w-0"><label className={labelClass}>Regional TIF</label><Dropdown value={form.regionalTif} onChange={set("regionalTif")} options={["Regional 1","Regional 2","Regional 3"]} /></div>
                        <div className="min-w-0"><label className={labelClass}>Batch Program</label><Dropdown value={form.batchProgram} onChange={set("batchProgram")} options={["Batch 1","Batch 2","Batch 3"]} /></div>
                      </div>
                    )}

                    {/* Step 2 — Data Teknisi */}
                    {currentStep === 1 && (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <div className="min-w-0"><label className={labelClass}>Nama mitra</label><Dropdown value={form.namaMitra} onChange={set("namaMitra")} options={["Mitra 1","Mitra 2","Mitra 3"]} /></div>
                        <div className="min-w-0"><label className={labelClass}>BoQ Plan</label><input name="boqPlan" value={form.boqPlan} onChange={handleChange} className={inputClass} /></div>
                        <div className="min-w-0"><label className={labelClass}>Subcon</label><Dropdown value={form.subcon} onChange={set("subcon")} options={["Subcon 1","Subcon 2","Subcon 3"]} /></div>
                        <div className="min-w-0"><label className={labelClass}>CPP</label><input name="cpp" value={form.cpp} onChange={handleChange} className={inputClass} /></div>
                        <div className="min-w-0"><label className={labelClass}>WASPANG</label><input name="waspang" value={form.waspang} onChange={handleChange} className={inputClass} /></div>
                        <div className="min-w-0"><label className={labelClass}>ODP Plan</label><input name="odpPlan" value={form.odpPlan} onChange={handleChange} className={inputClass} /></div>
                        <div className="min-w-0"><label className={labelClass}>Project Admin</label><input name="projectAdmin" value={form.projectAdmin} onChange={handleChange} className={inputClass} /></div>
                        <div className="min-w-0"><label className={labelClass}>Port plan</label><input name="portPlan" value={form.portPlan} onChange={handleChange} className={inputClass} /></div>
                      </div>
                    )}

                    {/* Step 3 — Progres LOP */}
                    {currentStep === 2 && (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <div className="min-w-0"><label className={labelClass}>Status</label><Dropdown value={form.status} onChange={set("status")} options={["GoLive","On Progress","Hold"]} placeholder="Pilih status" /></div>
                        <div className="min-w-0"><label className={labelClass}>Kendala Golive</label><textarea name="kendalaGolive" value={form.kendalaGolive} onChange={handleChange} rows={3} className="w-full border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none transition" /></div>
                        <div className="min-w-0"><label className={labelClass}>Sub status</label><Dropdown value={form.subStatus} onChange={set("subStatus")} options={["Sub 1","Sub 2","Sub 3"]} placeholder="Pilih sub status" /></div>
                        <div className="min-w-0"><label className={labelClass}>Tgl Golive</label><input type="date" name="tglGolive" value={form.tglGolive} onChange={handleChange} className={inputClass} /></div>
                        <div className="min-w-0"><label className={labelClass}>Detail Status</label><textarea name="detailStatus" value={form.detailStatus} onChange={handleChange} rows={3} className="w-full border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none transition" /></div>
                        <div className="min-w-0"><label className={labelClass}>Tanggal arge golive</label><Dropdown value={form.tanggalArgeGolive} onChange={set("tanggalArgeGolive")} placeholder="Pilih bulan" options={["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]} /></div>
                      </div>
                    )}

                    {/* Step 4 — Identitas OLT
                        Layout 2 kolom:
                        Kolom kiri : PID | ID SW ABD | Real JML ODP 8
                        Kolom kanan: Real JML ODP 16 | OLT toggle | (panel export/import kalau Need)

                        Real JML ODP 8 dikunci di kolom kiri baris ke-3,
                        sehingga TIDAK bergeser walau panel Need muncul di kolom kanan.
                    */}
                    {currentStep === 3 && (
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3 items-start">

                        {/* KOLOM KIRI */}
                        <div className="flex flex-col gap-3">
                          {/* PID */}
                          <div>
                            <label className={labelClass}>PID</label>
                            <input name="pid" value={form.pid} onChange={handleChange} className={inputClass} />
                          </div>
                          {/* ID SW ABD */}
                          <div>
                            <label className={labelClass}>ID SW ABD</label>
                            <input name="idSwAbd" value={form.idSwAbd} onChange={handleChange} className={inputClass} />
                          </div>
                          {/* Real JML ODP 8 — tetap di sini, tidak bergerak */}
                          <div>
                            <label className={labelClass}>Real JML ODP 8</label>
                            <input name="realJmlOdp8" value={form.realJmlOdp8} onChange={handleChange} className={inputClass} />
                          </div>
                        </div>

                        {/* KOLOM KANAN */}
                        <div className="flex flex-col gap-3">
                          {/* Real JML ODP 16 */}
                          <div>
                            <label className={labelClass}>Real JML ODP 16</label>
                            <input name="realJmlOdp16" value={form.realJmlOdp16} onChange={handleChange} className={inputClass} />
                          </div>

                          {/* OLT Toggle — default "" (tidak ada yang aktif) */}
                          <div>
                            <label className={labelClass}>OLT</label>
                            <div className="flex rounded-md overflow-hidden border border-gray-200 w-full">
                              <button
                                type="button"
                                onClick={() => { setForm({ ...form, olt: "Need" }); setShowOltExtra(true); }}
                                className={`flex-1 py-2 text-sm font-medium transition ${
                                  form.olt === "Need"
                                    ? "bg-violet-500 text-white"
                                    : "bg-gray-50 text-gray-500 hover:bg-violet-50 hover:text-violet-600"
                                }`}
                              >
                                Need
                              </button>
                              <button
                                type="button"
                                onClick={() => { setForm({ ...form, olt: "No Need" }); setShowOltExtra(false); }}
                                className={`flex-1 py-2 text-sm font-medium transition ${
                                  form.olt === "No Need"
                                    ? "bg-violet-500 text-white"
                                    : "bg-gray-50 text-gray-500 hover:bg-violet-50 hover:text-violet-600"
                                }`}
                              >
                                No Need
                              </button>
                            </div>
                          </div>

                          {/* Panel export/import — muncul di bawah toggle, kolom kanan saja */}
                          {showOltExtra && (
                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 grid grid-cols-2 gap-3">
                              {/* Download */}
                              <div className="flex flex-col items-center gap-1.5 text-center">
                                <p className="text-xs text-gray-500">Download Excel</p>
                                <button
                                  type="button"
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 hover:bg-violet-200 text-violet-700 text-xs font-medium rounded-md transition"
                                  onClick={() => { const l = document.createElement("a"); l.href = "/template-olt.xlsx"; l.download = "excel_olt.xlsx"; l.click(); }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                                  </svg>
                                  excel olt
                                </button>
                              </div>
                              {/* Upload */}
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
                        <div className="min-w-0"><label className={labelClass}>Nilai PRELIM</label><input name="nilaiPrelim" value={form.nilaiPrelim} onChange={handleChange} className={inputClass} /></div>
                        <div className="min-w-0"><label className={labelClass}>PORT Aandwidjzing</label><input name="portAandwidjzing" value={form.portAandwidjzing} onChange={handleChange} className={inputClass} /></div>
                        <div className="min-w-0"><label className={labelClass}>BoQ Aandwidjzing</label><input name="boqAandwidjzing" value={form.boqAandwidjzing} onChange={handleChange} className={inputClass} /></div>
                        <div className="min-w-0"><label className={labelClass}>% Kenaikan Aandwidjzing</label><input name="persenKenaikan" value={form.persenKenaikan} onChange={handleChange} className={inputClass} /></div>
                        <div className="min-w-0"><label className={labelClass}>ODP Aandwidjzing</label><input name="odpAandwidjzing" value={form.odpAandwidjzing} onChange={handleChange} className={inputClass} /></div>
                        <div className="min-w-0"><label className={labelClass}>CPP Akhir</label><input name="cppAkhir" value={form.cppAkhir} onChange={handleChange} className={inputClass} /></div>
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
    </>
  );
}