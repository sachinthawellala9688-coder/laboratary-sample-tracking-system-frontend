import React, { useEffect, useState } from "react";
import api from "../../api";
import {
  CheckCircle,
  AlertCircle,
  Package,
  FileText,
  Eye,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Samples = () => {
  const [samples, setSamples] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    try {
      const res = await api.get("/sample/samples"); // ✅ leading slash
      setSamples(res.data.samples || []);
    } catch (err) {
      console.error("Error loading samples:", err);
    }
  };

  const handleAddSample = () => {
    // go to AddSample page
    navigate("/admin/addsample");
  };

  const handleUpdateResult = (id) => {
    // go to AddResult page with sample id
    navigate(`/admin/result/${id}`);
  };

  const handleViewSample = (id) => {
    // go to SampleOverview page
    navigate(`/admin/sample/${id}`);
  };

  const renderStatusBadge = (status) => {
    const normalized = (status || "").toLowerCase();
    const isTested = normalized === "tested" || normalized === "completed";
    const isRejected = normalized === "reject" || normalized === "rejected";

    if (isRejected) {
      return (
        <span className="flex items-center gap-2 px-3 py-1 rounded-full w-fit text-sm font-medium bg-red-100 text-red-800">
          <AlertCircle size={14} />
          {status?.toUpperCase() || "REJECTED"}
        </span>
      );
    }

    if (isTested) {
      return (
        <span className="flex items-center gap-2 px-3 py-1 rounded-full w-fit text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle size={14} />
          {status?.toUpperCase() || "TESTED"}
        </span>
      );
    }

    return (
      <span className="flex items-center gap-2 px-3 py-1 rounded-full w-fit text-sm font-medium bg-yellow-100 text-yellow-800">
        <AlertCircle size={14} />
        {(status || "PENDING").toUpperCase()}
      </span>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1 text-gray-800 flex items-center gap-2">
            <Package className="text-indigo-600" />
            Samples Action Center
          </h2>
          <p className="text-sm text-gray-500">
            View all samples, add new ones, and update test results.
          </p>
        </div>

        <button
          onClick={handleAddSample}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 text-sm font-semibold"
        >
          <Plus size={16} />
          Register New Sample
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600">
                Code
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600">
                Type
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600">
                Production Line
              </th>
              {/* 🔁 Replaced Weight with Created By */}
              <th className="p-4 text-sm font-semibold text-gray-600">
                Created By
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600">
                Status
              </th>
              <th className="p-4 text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {samples.map((sample) => (
              <tr
                key={sample.sample_id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4 font-mono font-bold text-gray-900">
                  {sample.sample_code}
                </td>
                <td className="p-4 text-sm text-gray-700">
                  {sample.sample_type_name || "-"}
                </td>
                <td className="p-4 text-sm text-gray-700">
                  {sample.line_name || "-"}
                </td>
                {/* 👇 New Created By cell */}
                <td className="p-4 text-sm text-gray-700">
                {sample.created_by_first_name || sample.created_by_last_name
                ? `${sample.created_by_first_name || ""} ${
                    sample.created_by_last_name || ""
                }`.trim()
                : "-"}
                </td>
                <td className="p-4">
                  {renderStatusBadge(sample.status)}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewSample(sample.sample_id)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded border text-xs text-gray-700 hover:bg-gray-100"
                    >
                      <Eye size={14} />
                      View
                    </button>
                    <button
                      onClick={() => handleUpdateResult(sample.sample_id)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded border border-indigo-500 text-xs text-indigo-600 hover:bg-indigo-50"
                    >
                      <FileText size={14} />
                      Result
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {samples.length === 0 && (
              <tr>
                {/* still 6 columns */}
                <td
                  colSpan="6"
                  className="p-8 text-center text-gray-500 text-sm"
                >
                  No samples in the system yet. Click{" "}
                  <span className="font-semibold">“Register New Sample”</span> to
                  add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Samples;
