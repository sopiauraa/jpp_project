import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

// ──────────────────────────────────────────────────────────────
//  OPTIONS
// ──────────────────────────────────────────────────────────────
const REGIONAL_OPTIONS = ["Regional 1", "Regional 2", "Regional 3", "Regional 4"];
const DISTRIK_OPTIONS  = ["Distrik Medan", "Distrik Bandung", "Distrik Jakarta", "Distrik Surabaya"];
const ROLE_OPTIONS     = ["Admin", "Mitra", "Subcon", "Viewer"];

// ──────────────────────────────────────────────────────────────
//  PROPS & STEPS
// ──────────────────────────────────────────────────────────────
interface AddModalUserProps { isOpen: boolean; onClose: () => void; }

const steps = ["Identitas Pribadi", "Identitas Perusahaan"];

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
//  DROPDOWN
// ──────────────────────────────────────────────────────────────
function Dropdown({ value, onChange, options, placeholder = "" }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !triggerRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <>
      <button ref={triggerRef} type="button"
        onClick={() => { if (!open && triggerRef.current) setRect(triggerRef.current.getBoundingClientRect()); setOpen(o => !o); }}
        className={`w-full flex items-center justify-between border rounded-md px-3 py-2 text-sm bg-gray-50 focus:outline-none transition
          ${open ? "border-violet-400 ring-2 ring-violet-200" : "border-gray-200 hover:border-violet-300"}`}>
        <span className={value ? "text-gray-800" : "text-gray-400"}>{value || placeholder}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-violet-500 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      {open && rect && (
        <Portal>
          <div ref={panelRef} style={{ position: "fixed", top: rect.bottom + 2, left: rect.left, width: rect.width, zIndex: 99999 }}
            className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
            <div className="max-h-48 overflow-y-auto">
              {options.map(opt => (
                <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition ${value === opt ? "bg-violet-50 text-violet-700 font-semibold" : "text-gray-700 hover:bg-violet-50 hover:text-violet-700"}`}>
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
//  MAIN COMPONENT
// ──────────────────────────────────────────────────────────────
type ModalView = "choice" | "form";

export default function AddModalUser({ isOpen, onClose }: AddModalUserProps) {
  const [view, setView]               = useState<ModalView>("choice");
  const [currentStep, setCurrentStep] = useState(0);

  const [form, setForm] = useState({
    namaLengkap: "", username: "", nik: "", noTelp: "", email: "", alamat: "",
    namaPerusahaan: "", regionalTif: "", emailPerusahaan: "", distrik: "",
    noTelpPerusahaan: "", alamatPerusahaan: "", daftarSebagai: "",
    role: "",
  });

  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleNext  = () => { if (currentStep < steps.length - 1) setCurrentStep(s => s + 1); };
  const handleBack  = () => { if (currentStep > 0) setCurrentStep(s => s - 1); };
  const handleClose = () => {
    setView("choice"); setCurrentStep(0);
    setForm({ namaLengkap:"", username:"", nik:"", noTelp:"", email:"", alamat:"",
      namaPerusahaan:"", regionalTif:"", emailPerusahaan:"", distrik:"",
      noTelpPerusahaan:"", alamatPerusahaan:"", daftarSebagai:"", role:"" });
    onClose();
  };

  const inputClass = "w-full border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition";

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose}/>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

        {/* ── CHOICE ── */}
        {view === "choice" && (
          <div style={{
            background: "linear-gradient(160deg, #faf9ff 0%, #f3f0ff 50%, #ede9fe 100%)",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "360px",
            margin: "0 auto",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(139,92,246,0.12), 0 2px 8px rgba(0,0,0,0.06)",
            border: "1px solid rgba(167,139,250,0.2)",
          }}>

            {/* Top accent */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "3px",
              background: "linear-gradient(90deg, #a78bfa, #7c3aed, #a78bfa)",
              borderRadius: "20px 20px 0 0",
            }}/>

            {/* Close */}
            <button onClick={handleClose} style={{
              position: "absolute", top: "14px", right: "14px",
              width: "26px", height: "26px", borderRadius: "50%",
              background: "rgba(139,92,246,0.08)", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#9ca3af", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(139,92,246,0.15)"; e.currentTarget.style.color = "#7c3aed"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(139,92,246,0.08)"; e.currentTarget.style.color = "#9ca3af"; }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            {/* Header */}
            <div style={{ padding: "32px 28px 20px", textAlign: "center" }}>
              <p style={{ color: "#1e1b4b", fontSize: "17px", fontWeight: 700, letterSpacing: "-0.3px", margin: 0 }}>
                Tambahkan Pengguna Baru
              </p>
            </div>

            <div style={{ height: "1px", background: "rgba(139,92,246,0.1)", margin: "0 28px" }}/>

            {/* Buttons */}
            <div style={{ padding: "20px 28px 28px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <button onClick={() => setView("form")} style={{
                width: "100%", padding: "0", border: "1px solid rgba(139,92,246,0.15)",
                borderRadius: "12px", cursor: "pointer", overflow: "hidden",
                background: "white", transition: "all 0.18s", textAlign: "left",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,0.12)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.15)"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "9px", flexShrink: 0,
                    background: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="#7c3aed">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#1e1b4b", fontSize: "13px", fontWeight: 600, margin: 0 }}>Isi Form Pengguna</p>
                    <p style={{ color: "#9ca3af", fontSize: "11px", marginTop: "2px" }}>Input manual langkah demi langkah</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#c4b5fd">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ── FORM ── */}
        {view === "form" && (
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-auto relative flex flex-col" style={{ height: "500px" }}>
            <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <div className="pt-5 px-8 pb-3 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-800 text-center">Tambahkan Pengguna Baru</h2>
            </div>

            <div className="flex-1 flex flex-col px-8 pb-5 min-h-0">
              <div className="relative border border-gray-200 rounded-xl pt-9 px-6 pb-4 mt-4 flex-1 flex flex-col min-h-0">

                {/* Step label */}
                <div className="absolute -top-4 left-6">
                  <span className="bg-violet-500 text-white text-sm font-semibold px-5 py-2 rounded-lg block shadow-sm">
                    {steps[currentStep]}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto pr-1">

                  {/* ── STEP 1: Identitas Pribadi ── */}
                  {currentStep === 0 && (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                      <div>
                        <Label required>Nama Lengkap</Label>
                        <input name="namaLengkap" value={form.namaLengkap} onChange={handleChange} className={inputClass}/>
                      </div>
                      <div>
                        <Label required>Username</Label>
                        <input name="username" value={form.username} onChange={handleChange} className={inputClass}/>
                      </div>
                      <div>
                        <Label required>NIK</Label>
                        <input name="nik" value={form.nik} onChange={handleChange} className={inputClass}/>
                      </div>
                      <div>
                        <Label required>No. Telp</Label>
                        <input name="noTelp" value={form.noTelp} onChange={handleChange} className={inputClass}/>
                      </div>
                      <div>
                        <Label required>Email</Label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass}/>
                      </div>
                      <div>
                        <Label>Alamat</Label>
                        <input name="alamat" value={form.alamat} onChange={handleChange} className={inputClass}/>
                      </div>
                    </div>
                  )}

                  {/* ── STEP 2: Identitas Perusahaan ── */}
                  {currentStep === 1 && (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                      <div>
                        <Label required>Nama Perusahaan</Label>
                        <input name="namaPerusahaan" value={form.namaPerusahaan} onChange={handleChange} className={inputClass}/>
                      </div>
                      <div>
                        <Label required>Regional TIF</Label>
                        <Dropdown value={form.regionalTif} onChange={set("regionalTif")}
                          options={REGIONAL_OPTIONS} placeholder="Pilih Regional"/>
                      </div>
                      <div>
                        <Label>Email Perusahaan</Label>
                        <input name="emailPerusahaan" type="email" value={form.emailPerusahaan} onChange={handleChange} className={inputClass}/>
                      </div>
                      <div>
                        <Label required>Distrik</Label>
                        <Dropdown value={form.distrik} onChange={set("distrik")}
                          options={DISTRIK_OPTIONS} placeholder="Pilih Distrik"/>
                      </div>
                      <div>
                        <Label>No. Telp Perusahaan</Label>
                        <input name="noTelpPerusahaan" value={form.noTelpPerusahaan} onChange={handleChange} className={inputClass}/>
                      </div>
                      <div>
                        <Label>Alamat Perusahaan</Label>
                        <input name="alamatPerusahaan" value={form.alamatPerusahaan} onChange={handleChange} className={inputClass}/>
                      </div>

                      {/* Daftarkan Sebagai toggle */}
                      <div className="col-span-2">
                        <Label required>Daftarkan Sebagai</Label>
                        <div className="flex rounded-md overflow-hidden border border-gray-200 w-full">
                          {["Mitra", "Subcon"].map(opt => (
                            <button key={opt} type="button"
                              onClick={() => setForm(f => ({ ...f, daftarSebagai: opt }))}
                              className={`flex-1 py-2 text-sm font-medium transition ${
                                form.daftarSebagai === opt
                                  ? "bg-violet-500 text-white"
                                  : "bg-gray-50 text-gray-500 hover:bg-violet-50 hover:text-violet-600"
                              }`}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </div>{/* end scroll */}
              </div>{/* end inner box */}

              {/* Footer nav */}
              <div className="flex justify-end gap-3 mt-3 flex-shrink-0">
                {currentStep > 0
                  ? <button onClick={handleBack} className="px-6 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium">Kembali</button>
                  : <button onClick={() => setView("choice")} className="px-6 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium">Batal</button>
                }
                {currentStep < steps.length - 1
                  ? <button onClick={handleNext} className="px-6 py-2 text-sm bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition font-medium">Selanjutnya</button>
                  : <button onClick={handleClose} className="px-6 py-2 text-sm bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition font-medium">Simpan</button>
                }
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}