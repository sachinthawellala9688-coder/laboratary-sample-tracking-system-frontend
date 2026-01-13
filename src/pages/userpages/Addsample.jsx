import { useState, useEffect } from "react";
import { Package, MapPin, FileText, Sparkles, Factory, Layers, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:3000";

export default function AddSample({ user }) {
  const [lines, setLines] = useState([]);
  const [types, setTypes] = useState([]);
  const [existingCodes, setExistingCodes] = useState([]); // Store existing codes
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    sample_code: "",
    production_id: "",
    sample_type_id: "",
    storage_location: "",
    note: "",
  });

  useEffect(() => {
    if (!user) return;

    // 1. Load Production Lines
    fetch(`${API_BASE}/production/production-lines`)
      .then((res) => res.json())
      .then((data) => setLines(data.production_lines || []))
      .catch((err) => console.error("Error loading lines:", err));

    // 2. Load Sample Types
    fetch(`${API_BASE}/sampletype/sample-types`)
      .then((res) => res.json())
      .then((data) => setTypes(data.sample_types || []))
      .catch((err) => console.error("Error loading types:", err));

    // 3. Load Existing Samples to handle Auto-Increment & Validation
    fetch(`${API_BASE}/sample/samples`)
      .then((res) => res.json())
      .then((data) => {
        const codes = data.samples.map(s => s.sample_code);
        setExistingCodes(codes);
        
        // Auto-increment logic: Find highest number in LAB-2026-XXX format
        const nextCode = generateNextCode(codes);
        setFormData(prev => ({ ...prev, sample_code: nextCode }));
      })
      .catch((err) => console.error("Error loading existing samples:", err));
  }, [user]);

  // Helper function to generate next code
  const generateNextCode = (codes) => {
    const prefix = `SAMP-${new Date().getFullYear()}-`;
    const numericParts = codes
      .filter(code => code.startsWith(prefix))
      .map(code => parseInt(code.replace(prefix, "")) || 0);

    const maxId = numericParts.length > 0 ? Math.max(...numericParts) : 0;
    return `${prefix}${(maxId + 1).toString().padStart(3, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 4. Duplicate Check Validation
    if (existingCodes.includes(formData.sample_code)) {
      alert("Error: This Sample Code already exists in the database. Please use a unique code.");
      return;
    }

    if (!user || !user.user_id) {
      alert("Please log in again.");
      return;
    }

    const payload = {
      sample_code: formData.sample_code,
      production_id: parseInt(formData.production_id),
      sample_type_id: parseInt(formData.sample_type_id),
      status: "Pending",
      created_by: user.user_id,
      storage_location: formData.storage_location || null,
      note: formData.note || null,
    };

    fetch(`${API_BASE}/sample/samples`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Sample Registered Successfully!");
        navigate("/user/sample");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to create sample");
      });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
      </div>
    );
  }

  // Determine if current code is a duplicate
  const isDuplicate = existingCodes.includes(formData.sample_code);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <Package className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Register New Sample
          </h1>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <div className="p-8 md:p-10">
            <form className="space-y-8">
              {/* Sample Code Input */}
              <div className="relative">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                  <Sparkles className="text-indigo-600" size={18} />
                  Sample Code <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    required
                    type="text"
                    disabled
                    className={`w-full px-5 py-4 text-lg border-2 rounded-xl focus:ring-2 outline-none transition-all bg-gradient-to-br from-white to-gray-50 
                      ${isDuplicate 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-gray-200 focus:ring-indigo-500 group-hover:border-indigo-300"}`}
                    placeholder="SAMP-2026-001"
                    value={formData.sample_code}
                    onChange={(e) => setFormData({ ...formData, sample_code: e.target.value })}
                  />
                </div>
                {isDuplicate ? (
                  <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                    <AlertCircle size={14} /> This code already exists. Please change it.
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-2 ml-1">
                    Automatically generated. You can customize it if needed.
                  </p>
                )}
              </div>

              {/* ... Rest of your form fields (Production Line, Sample Type, etc.) ... */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                    <Factory className="text-blue-600" size={18} /> Production Line <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                    value={formData.production_id}
                    onChange={(e) => setFormData({ ...formData, production_id: e.target.value })}
                  >
                    <option value="">Select Line</option>
                    {lines.map((l) => (
                      <option key={l.production_id} value={l.production_id}>{l.line_name}</option>
                    ))}
                  </select>
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                    <Layers className="text-purple-600" size={18} /> Sample Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all appearance-none cursor-pointer"
                    value={formData.sample_type_id}
                    onChange={(e) => setFormData({ ...formData, sample_type_id: e.target.value })}
                  >
                    <option value="">Select Type</option>
                    {types.map((t) => (
                      <option key={t.sample_type_id} value={t.sample_type_id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-100">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                  <MapPin className="text-emerald-600" size={18} /> Storage Location
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3.5 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white"
                  placeholder="Rack A-3"
                  value={formData.storage_location}
                  onChange={(e) => setFormData({ ...formData, storage_location: e.target.value })}
                />
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-100">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                  <FileText className="text-amber-600" size={18} /> Additional Notes
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3.5 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none bg-white"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                ></textarea>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  disabled={isDuplicate}
                  onClick={handleSubmit}
                  className={`w-full font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 text-lg 
                    ${isDuplicate 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:shadow-xl transform hover:scale-[1.02]"}`}
                >
                  <Package size={24} />
                  <span>{isDuplicate ? "Duplicate Code - Fix to Save" : "Save & Register Sample"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}