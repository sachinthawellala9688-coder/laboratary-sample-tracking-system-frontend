import { useState, useEffect } from "react";
import { Package, MapPin, FileText, Sparkles, Factory, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:3000";

export default function AddSample({ user }) {
  const [lines, setLines] = useState([]);
  const [types, setTypes] = useState([]);
  const navigate=useNavigate();

  const [formData, setFormData] = useState({
    sample_code: "",
    production_id: "",
    sample_type_id: "",
    storage_location: "",
    note: "",
  });

  useEffect(() => {
    if (!user) return;

    fetch(`${API_BASE}/production/production-lines`)
      .then((res) => res.json())
      .then((data) => setLines(data.production_lines || []))
      .catch((err) => console.error("Error loading production lines:", err));

    fetch(`${API_BASE}/sampletype/sample-types`)
      .then((res) => res.json())
      .then((data) => setTypes(data.sample_types || []))
      .catch((err) => console.error("Error loading sample types:", err));
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();

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
      .then((data) => {
        alert("Sample Registered Successfully!");
        navigate("/admin/sample");
        return
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to create sample");
      });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading user info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <Package className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Register New Sample
          </h1>
          <p className="text-gray-600 text-lg">
            Add a new quality control sample to the system
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden">
          {/* Decorative Header Bar */}
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <div className="p-8 md:p-10">
            <div className="space-y-8">
              {/* Sample Code - Featured Input */}
              <div className="relative">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                  <Sparkles className="text-indigo-600" size={18} />
                  Sample Code
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <input
                    required
                    type="text"
                    className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gradient-to-br from-white to-gray-50 group-hover:border-indigo-300"
                    placeholder="LAB-2025-001"
                    value={formData.sample_code}
                    onChange={(e) =>
                      setFormData({ ...formData, sample_code: e.target.value })
                    }
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-focus-within:opacity-10 transition-opacity pointer-events-none"></div>
                </div>
                <p className="text-xs text-gray-500 mt-2 ml-1">
                  Enter a unique identifier for this sample
                </p>
              </div>

              {/* Production & Type Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Production Line */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                    <Factory className="text-blue-600" size={18} />
                    Production Line
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer hover:border-blue-300"
                      value={formData.production_id}
                      onChange={(e) =>
                        setFormData({ ...formData, production_id: e.target.value })
                      }
                    >
                      <option value="">Select Line</option>
                      {lines.map((l) => (
                        <option key={l.production_id} value={l.production_id}>
                          {l.line_name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Sample Type */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                    <Layers className="text-purple-600" size={18} />
                    Sample Type
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all appearance-none cursor-pointer hover:border-purple-300"
                      value={formData.sample_type_id}
                      onChange={(e) =>
                        setFormData({ ...formData, sample_type_id: e.target.value })
                      }
                    >
                      <option value="">Select Type</option>
                      {types.map((t) => (
                        <option key={t.sample_type_id} value={t.sample_type_id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Storage Location */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-100">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                  <MapPin className="text-emerald-600" size={18} />
                  Storage Location
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3.5 border-2 border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                  placeholder="Rack A-3 / Shelf 2"
                  value={formData.storage_location}
                  onChange={(e) =>
                    setFormData({ ...formData, storage_location: e.target.value })
                  }
                />
                <p className="text-xs text-gray-600 mt-2 ml-1">
                  Specify where this sample will be stored
                </p>
              </div>

              {/* Notes Section */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-100">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
                  <FileText className="text-amber-600" size={18} />
                  Additional Notes
                  <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3.5 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all resize-none bg-white"
                  placeholder="Add any additional information about this sample..."
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
                >
                  <Package size={24} />
                  <span>Save & Register Sample</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            All fields marked with <span className="text-red-500">*</span> are required
          </p>
        </div>
      </div>
    </div>
  );
}