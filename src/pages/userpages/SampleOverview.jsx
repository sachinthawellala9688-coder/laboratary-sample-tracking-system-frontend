import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

const API_BASE = "http://localhost:3000";

export default function SampleOverview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sample, setSample] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`${API_BASE}/sample/samples/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // ✅ data is already the sample object
        setSample(data);
        setLoading(false);
        console.log("Sample loaded:", data);
      })
      .catch((err) => {
        console.error("Error fetching sample:", err);
        setError("Failed to load sample details.");
        setLoading(false);
      });
  }, [id]);

  const renderStatusBadge = (status) => {
    if (!status) return <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">N/A</span>;

    const normalized = status.toLowerCase();
    let classes = "bg-gray-100 text-gray-700";

    if (normalized === "tested") {
      classes = "bg-green-100 text-green-700";
    } else if (normalized === "untested" || normalized === "intesting" || normalized === "in test") {
      classes = "bg-yellow-100 text-yellow-700";
    } else if (normalized === "reject" || normalized === "rejected") {
      classes = "bg-red-100 text-red-700";
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${classes}`}>
        {status}
      </span>
    );
  };

  const formatDateTime = (dt) => {
    if (!dt) return "-";
    return new Date(dt).toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10 text-gray-500 gap-2">
          <Loader2 className="animate-spin" size={20} />
          Loading sample details...
        </div>
      ) : error || !sample ? (
        <div className="text-center text-red-500 py-10">
          {error || "Sample not found."}
        </div>
      ) : (
        <>
          {/* Header section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sample: {sample.sample_code}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Sample ID: {sample.sample_id}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {renderStatusBadge(sample.status)}
              <p className="text-xs text-gray-500">
                Created: {formatDateTime(sample.created_at)}
              </p>
            </div>
          </div>

          {/* Main details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-gray-500 uppercase">
                Basic Info
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <DetailRow label="Sample Code" value={sample.sample_code} />
                <DetailRow label="Sample Type ID" value={sample.sample_type_id ?? "-"} />
                <DetailRow label="Dimensions" value={sample.dimensions || "-"} />
                <DetailRow label="Design" value={sample.colour || "-"} />
                <DetailRow label="Weight" value={sample.weight || "-"} />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-gray-500 uppercase">
                Production Line
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <DetailRow label="Production ID" value={sample.production_id ?? "-"} />
                <DetailRow label="Storage Location" value={sample.storage_location || "-"} />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-gray-500 uppercase">
                Test Parameters
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <DetailRow
                  label="Water Absorption"
                  value={sample.water_absorption ?? "-"}
                />
                <DetailRow
                  label="Breaking Strength"
                  value={sample.breaking_strength ?? "-"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-gray-500 uppercase">
                Ownership
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <DetailRow
                  label="Created By (User ID)"
                  value={sample.created_by ?? "-"}
                />
                <DetailRow
                  label="Last Updated"
                  value={formatDateTime(sample.updated_at)}
                />
              </div>
            </div>
          </div>

          {/* Notes & Test Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Note
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 min-h-[80px]">
                {sample.note ? sample.note : <span className="text-gray-400">No notes added.</span>}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Test Results (Raw)
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 text-xs font-mono text-gray-700 min-h-[80px] overflow-auto max-h-60">
                {sample.test_results ? (
                  <pre className="whitespace-pre-wrap">
                    {typeof sample.test_results === "string"
                      ? sample.test_results
                      : JSON.stringify(sample.test_results, null, 2)}
                  </pre>
                ) : (
                  <span className="text-gray-400">No test results recorded.</span>
                )}
              </div>
            </div>
          </div>

          {/* Actions footer */}
          
        </>
      )}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 text-right break-all">
        {value}
      </span>
    </div>
  );
}
