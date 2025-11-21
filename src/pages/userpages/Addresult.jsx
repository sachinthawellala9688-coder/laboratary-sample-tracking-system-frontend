import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, Search, AlertCircle, CheckCircle } from "lucide-react";

const API_BASE = "http://localhost:3000";

export default function AddResult({ user }) {
  const { id: routeId } = useParams();
  const navigate = useNavigate();

  const [sampleId, setSampleId] = useState(routeId || "");
  const [codeInput, setCodeInput] = useState("");
  const [loadingSample, setLoadingSample] = useState(false);

  const [formData, setFormData] = useState({
    sample_code: "",
    status: "pending",
    dimensions: "",
    colour: "",
    weight: "",
    water_absorption: "",
    breaking_strength: "",
    test_results: "",
  });

  const fetchSampleById = (sid) => {
    setLoadingSample(true);
    fetch(`${API_BASE}/sample/samples/${sid}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error || "Sample not found");
          setLoadingSample(false);
          return;
        }

        setSampleId(data.sample_id);
        setFormData({
          sample_code: data.sample_code || "",
          status: data.status || "pending",
          dimensions: data.dimensions || "",
          colour: data.colour || "",
          weight: data.weight ?? "",
          water_absorption: data.water_absorption ?? "",
          breaking_strength: data.breaking_strength ?? "",
          test_results: data.test_results || "",
        });
        setLoadingSample(false);
      })
      .catch((err) => {
        console.error("Error fetching sample by id", err);
        alert("Failed to load sample");
        setLoadingSample(false);
      });
  };

  const fetchSampleByCode = () => {
    if (!codeInput.trim()) {
      alert("Please enter a sample code");
      return;
    }

    setLoadingSample(true);
    fetch(
      `${API_BASE}/sample/samples-by-code/${encodeURIComponent(
        codeInput.trim()
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error || "Sample not found");
          setLoadingSample(false);
          return;
        }

        setSampleId(data.sample_id);
        setFormData({
          sample_code: data.sample_code || "",
          status: data.status || "pending",
          dimensions: data.dimensions || "",
          colour: data.colour || "",
          weight: data.weight ?? "",
          water_absorption: data.water_absorption ?? "",
          breaking_strength: data.breaking_strength ?? "",
          test_results: data.test_results || "",
        });
        setLoadingSample(false);
      })
      .catch((err) => {
        console.error("Error fetching sample by code", err);
        alert("Failed to load sample");
        setLoadingSample(false);
      });
  };

  useEffect(() => {
    if (routeId) {
      fetchSampleById(routeId);
    }
  }, [routeId]);

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!sampleId) {
      alert("Please load a sample first (by ID URL or by sample code).");
      return;
    }

    const payload = {
      status: formData.status,
      dimensions: formData.dimensions || null,
      colour: formData.colour || null,
      weight: formData.weight === "" ? null : parseFloat(formData.weight),
      water_absorption:
        formData.water_absorption === ""
          ? null
          : parseFloat(formData.water_absorption),
      breaking_strength:
        formData.breaking_strength === ""
          ? null
          : parseFloat(formData.breaking_strength),
      test_results: formData.test_results || null,
    };

    fetch(`${API_BASE}/sample/samples/${sampleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error || "Update failed");
          return;
        }
        alert("Result Updated Successfully");
        navigate("/user/sample");
      })
      .catch((err) => {
        console.error(err);
        alert("Update failed");
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "reject":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white mb-1">
              Update Sample Result
            </h2>
            <p className="text-indigo-100 text-sm">
              Manage and update test results for quality control samples
            </p>
          </div>

          {/* Sample Info Section */}
          {sampleId && (
            <div className="px-8 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-indigo-600" size={20} />
                  <span className="text-sm font-medium text-gray-600">
                    Sample ID:
                  </span>
                  <span className="font-mono font-bold text-lg text-indigo-700 bg-white px-3 py-1 rounded-lg shadow-sm">
                    {sampleId}
                  </span>
                </div>
                {formData.sample_code && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                      Code:
                    </span>
                    <span className="font-mono font-bold text-lg text-purple-700 bg-white px-3 py-1 rounded-lg shadow-sm">
                      {formData.sample_code}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Load by Code Section */}
          {!routeId && (
            <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-indigo-100">
              <div className="flex items-center gap-2 mb-3">
                <Search className="text-indigo-600" size={20} />
                <label className="text-base font-bold text-gray-800">
                  Load Sample by Code
                </label>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white text-gray-800 placeholder-gray-400"
                  placeholder="Enter Sample Code (e.g., SMP-2024-001)"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={fetchSampleByCode}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
                  disabled={loadingSample}
                >
                  <Search size={18} />
                  {loadingSample ? "Loading..." : "Load"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <AlertCircle size={12} />
                Copy the sample code from the sample list and paste it here
              </p>
            </div>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-8">
          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Status */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Test Status
              </label>
              <select
                className={`w-full px-4 py-3 border-2 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium ${getStatusColor(
                  formData.status
                )}`}
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                disabled={loadingSample || !sampleId}
              >
                <option value="pending">⏳ Pending</option>
                <option value="completed">✅ Completed</option>
                <option value="reject">❌ Rejected</option>
              </select>
            </div>

            {/* Dimensions & Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Dimensions
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="e.g., 300 x 300 mm"
                  value={formData.dimensions}
                  onChange={(e) =>
                    setFormData({ ...formData, dimensions: e.target.value })
                  }
                  disabled={loadingSample || !sampleId}
                />
              </div>
              <div className="group">
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  Design
                </label>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
                  value={formData.colour}
                  onChange={(e) =>
                    setFormData({ ...formData, colour: e.target.value })
                  }
                  disabled={loadingSample || !sampleId}
                >
                  <option value="">Select Result</option>
                  <option value="Pass">✓ Pass</option>
                  <option value="Fail">✗ Fail</option>
                </select>
              </div>
            </div>

            {/* Numeric Values Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                Test Measurements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group">
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Weight
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-3 pr-12 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="0.00"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      disabled={loadingSample || !sampleId}
                    />
                    <span className="absolute right-4 top-3.5 text-gray-500 font-medium text-sm">
                      kg
                    </span>
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Water Absorption
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-3 pr-12 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="0.00"
                      value={formData.water_absorption}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          water_absorption: e.target.value,
                        })
                      }
                      disabled={loadingSample || !sampleId}
                    />
                    <span className="absolute right-4 top-3.5 text-gray-500 font-medium text-sm">
                      %
                    </span>
                  </div>
                </div>
                <div className="group">
                  <label className="block text-sm font-bold text-gray-800 mb-3">
                    Breaking Strength
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-3 pr-12 border-2 border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="0.00"
                      value={formData.breaking_strength}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          breaking_strength: e.target.value,
                        })
                      }
                      disabled={loadingSample || !sampleId}
                    />
                    <span className="absolute right-4 top-3.5 text-gray-500 font-medium text-sm">
                      N
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Results */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Test Results / Remarks
              </label>
              <textarea
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                placeholder="Enter detailed test results, observations, and remarks..."
                value={formData.test_results}
                onChange={(e) =>
                  setFormData({ ...formData, test_results: e.target.value })
                }
                disabled={loadingSample || !sampleId}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex justify-center items-center gap-3 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              disabled={!sampleId || loadingSample}
            >
              <Save size={22} />
              <span className="text-lg">Update Result</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}