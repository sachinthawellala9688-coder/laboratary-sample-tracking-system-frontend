import React, { useState } from "react";
import {
  Printer,
  Calendar,
  Filter,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const API_BASE = "http://localhost:3000";

export default function UserReports({ user }) {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("all");
  const [showFilters] = useState(true);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [downloading, setDownloading] = useState(false);

  const fetchReport = async () => {
    if (!startDate) {
      alert("Please select a start date");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        user_id: user?.user_id,
        start: startDate,
        ...(endDate && { end: endDate }),
      });

      // Adjust this URL if your backend route is different
      const response = await fetch(`${API_BASE}/report/reportsdate?${params}`);
      const data = await response.json();

      // Backend should return { samples: [...] }
      let filtered = data.samples || [];

      // Apply report type filter
      if (reportType !== "all") {
        filtered = filtered.filter(
          (s) => s.status?.toLowerCase() === reportType.toLowerCase()
        );
      }

      setReportData(filtered);
    } catch (error) {
      console.error("Error fetching report:", error);
      alert("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById("printable-report");
    if (!printContent) {
      alert("Nothing to print");
      return;
    }

    const printWindow = window.open("", "", "width=800,height=600");

    printWindow.document.write(`
      <html>
        <head>
          <title>Lab Report - ${user?.first_name || ""} ${
      user?.last_name || ""
    }</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px;
              color: #000;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0;
              page-break-inside: auto;
            }
            th, td { 
              border: 1px solid #000; 
              padding: 8px; 
              text-align: left;
              font-size: 10pt;
            }
            th { 
              background-color: #f0f0f0; 
              font-weight: bold;
            }
            tr { 
              page-break-inside: avoid; 
              page-break-after: auto; 
            }
            .header { 
              margin-bottom: 20px; 
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }
            .header h1 { 
              margin: 0 0 10px 0; 
              font-size: 24pt;
            }
            .details-section {
              background: #f9f9f9;
              padding: 15px;
              margin: 10px 0;
              border: 1px solid #ddd;
              page-break-inside: avoid;
            }
            .details-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-top: 10px;
            }
            .detail-item {
              margin: 5px 0;
            }
            .detail-label {
              font-weight: bold;
              display: inline-block;
              width: 150px;
            }
            .section-title {
              font-weight: bold;
              color: #333;
              border-bottom: 1px solid #ccc;
              padding-bottom: 5px;
              margin-bottom: 10px;
            }
            @media print {
              @page { size: A4; margin: 15mm; }
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDownloadPDF = async () => {
    if (reportData.length === 0) {
      alert("No data to download");
      return;
    }

    setDownloading(true);

    const printContent = document.getElementById("printable-report");
    if (!printContent) {
      alert("Nothing to download");
      setDownloading(false);
      return;
    }

    const printWindow = window.open("", "", "width=800,height=600");

    printWindow.document.write(`
      <html>
        <head>
          <title>Lab Report - ${user?.first_name || ""} ${
      user?.last_name || ""
    }</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px;
              color: #000;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0;
              page-break-inside: auto;
            }
            th, td { 
              border: 1px solid #000; 
              padding: 8px; 
              text-align: left;
              font-size: 10pt;
            }
            th { 
              background-color: #f0f0f0; 
              font-weight: bold;
            }
            tr { 
              page-break-inside: avoid; 
              page-break-after: auto; 
            }
            .header { 
              margin-bottom: 20px; 
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }
            .header h1 { 
              margin: 0 0 10px 0; 
              font-size: 24pt;
            }
            .details-section {
              background: #f9f9f9;
              padding: 15px;
              margin: 10px 0;
              border: 1px solid #ddd;
              page-break-inside: avoid;
            }
            .details-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-top: 10px;
            }
            .detail-item {
              margin: 5px 0;
            }
            .detail-label {
              font-weight: bold;
              display: inline-block;
              width: 150px;
            }
            .section-title {
              font-weight: bold;
              color: #333;
              border-bottom: 1px solid #ccc;
              padding-bottom: 5px;
              margin-bottom: 10px;
            }
            @media print {
              @page { size: A4; margin: 15mm; }
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 100);
            }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();

    setTimeout(() => {
      setDownloading(false);
    }, 1000);
  };

  const toggleRow = (sampleId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(sampleId)) {
      newExpanded.delete(sampleId);
    } else {
      newExpanded.add(sampleId);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "tested":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "failed":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-600 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <FileText size={32} />
              <h1 className="text-3xl font-bold">Lab Technician Report</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-slate-200 text-xs uppercase tracking-wide">
                  Technician
                </p>
                <p className="font-semibold text-lg">
                  {user?.first_name} {user?.last_name}
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-slate-200 text-xs uppercase tracking-wide">
                  User ID
                </p>
                <p className="font-semibold text-lg">{user?.user_id}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-slate-200 text-xs uppercase tracking-wide">
                  Report Date
                </p>
                <p className="font-semibold text-lg">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          {showFilters && (
            <div className="p-6 border-b border-gray-200 bg-slate-50">
              <div className="flex items-center gap-2 mb-4">
                <Filter size={20} className="text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-800">
                  Report Filters
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Report Type
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="all">All Samples</option>
                    <option value="tested">Tested Only</option>
                    <option value="pending">Pending Only</option>
                    <option value="failed">Failed Only</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={fetchReport}
                    disabled={loading}
                    className="w-full bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? "Generating..." : "Generate Report"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Report Results Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Action Buttons */}
          <div className="p-4 bg-slate-50 border-b border-gray-200 flex justify-between items-center">
            <div className="text-sm text-slate-600">
              {reportData.length > 0 && (
                <span className="font-semibold">
                  Total Records:{" "}
                  <span className="text-slate-900">{reportData.length}</span>
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadPDF}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-50"
                disabled={reportData.length === 0 || downloading}
              >
                <Download size={18} />{" "}
                {downloading ? "Preparing..." : "Download PDF"}
              </button>
              <button
                onClick={handlePrint}
                className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 flex items-center gap-2 transition-colors disabled:opacity-50"
                disabled={reportData.length === 0}
              >
                <Printer size={18} /> Print
              </button>
            </div>
          </div>

          {/* Main Table View */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-300">
                  <th className="p-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Details
                  </th>
                  <th className="p-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Sample ID
                  </th>
                  <th className="p-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Sample Code
                  </th>
                  <th className="p-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Type
                  </th>
                  <th className="p-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Production Line
                  </th>
                  <th className="p-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="p-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wide">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mb-4"></div>
                        <p className="text-slate-600 font-medium">
                          Generating Report...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : reportData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-500">
                        <FileText size={48} className="mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">
                          No Records Found
                        </p>
                        <p className="text-sm">
                          Select date range and generate report to view data
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reportData.map((item, idx) => (
                    <React.Fragment key={item.sample_id}>
                      <tr
                        className={
                          idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                        }
                      >
                        <td className="p-4 border-b border-gray-200">
                          <button
                            onClick={() => toggleRow(item.sample_id)}
                            className="text-slate-600 hover:text-slate-900 transition-colors"
                          >
                            {expandedRows.has(item.sample_id) ? (
                              <ChevronUp size={20} />
                            ) : (
                              <ChevronDown size={20} />
                            )}
                          </button>
                        </td>
                        <td className="p-4 border-b border-gray-200 text-sm font-medium text-slate-900">
                          #{item.sample_id}
                        </td>
                        <td className="p-4 border-b border-gray-200 text-sm font-semibold text-slate-800">
                          {item.sample_code}
                        </td>
                        <td className="p-4 border-b border-gray-200 text-sm text-slate-700">
                          {item.sample_type_name || "N/A"}
                        </td>
                        <td className="p-4 border-b border-gray-200 text-sm text-slate-700">
                          {item.line_name || "N/A"}
                        </td>
                        <td className="p-4 border-b border-gray-200">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {item.status?.toUpperCase() || "UNKNOWN"}
                          </span>
                        </td>
                        <td className="p-4 border-b border-gray-200 text-sm text-slate-700">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                      </tr>

                      {expandedRows.has(item.sample_id) && (
                        <tr
                          className={
                            idx % 2 === 0 ? "bg-slate-50" : "bg-white"
                          }
                        >
                          <td
                            colSpan="7"
                            className="p-6 border-b-2 border-slate-200"
                          >
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                              <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">
                                Complete Sample Details - {item.sample_code}
                              </h3>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Basic Information */}
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-3">
                                    Basic Information
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="text-slate-500">
                                        Sample ID:
                                      </span>
                                      <span className="ml-2 font-medium text-slate-900">
                                        #{item.sample_id}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500">
                                        Sample Code:
                                      </span>
                                      <span className="ml-2 font-medium text-slate-900">
                                        {item.sample_code}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500">
                                        Type:
                                      </span>
                                      <span className="ml-2 font-medium text-slate-900">
                                        {item.sample_type_name || "N/A"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500">
                                        Status:
                                      </span>
                                      <span
                                        className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                                          item.status
                                        )}`}
                                      >
                                        {item.status?.toUpperCase() ||
                                          "UNKNOWN"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Physical Properties */}
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-3">
                                    Physical Properties
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="text-slate-500">
                                        Dimensions:
                                      </span>
                                      <span className="ml-2 font-medium text-slate-900">
                                        {item.dimensions || "N/A"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500">
                                        Weight:
                                      </span>
                                      <span className="ml-2 font-medium text-slate-900">
                                        {item.weight
                                          ? `${item.weight}g`
                                          : "N/A"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500">
                                        Colour:
                                      </span>
                                      <span className="ml-2 font-medium text-slate-900">
                                        {item.colour || "N/A"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500">
                                        Storage Location:
                                      </span>
                                      <span className="ml-2 font-medium text-slate-900">
                                        {item.storage_location || "N/A"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Test Results */}
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-3">
                                    Test Results
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="text-slate-500">
                                        Water Absorption:
                                      </span>
                                      <span className="ml-2 font-medium text-slate-900">
                                        {item.water_absorption || "N/A"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500">
                                        Breaking Strength:
                                      </span>
                                      <span className="ml-2 font-medium text-slate-900">
                                        {item.breaking_strength || "N/A"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500">
                                        Test Results:
                                      </span>
                                      <span className="ml-2 font-medium text-slate-900">
                                        {item.test_results || "N/A"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Production Details */}
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-3">
                                    Production Details
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="text-slate-500">
                                        Production ID:
                                      </span>
                                      <span className="ml-2 font-medium text-slate-900">
                                        {item.production_id || "N/A"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500">
                                        Line Code:
                                      </span>
                                      <span className="ml-2 font-medium text-slate-900">
                                        {item.line_code || "N/A"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500">
                                        Line Name:
                                      </span>
                                      <span className="ml-2 font-medium text-slate-900">
                                        {item.line_name || "N/A"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500">
                                        Line Type:
                                      </span>
                                      <span className="ml-2 font-medium text-slate-900">
                                        {item.line_type || "N/A"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Technician Details */}
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-3">
                                    Technician Details
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="text-slate-500">
                                        Created By:
                                      </span>
                                      <span className="ml-2 font-medium text-slate-900">
                                        {item.created_by_first_name}{" "}
                                        {item.created_by_last_name}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500">
                                        Role:
                                      </span>
                                      <span className="ml-2 font-medium text-slate-900">
                                        {item.created_by_role || "N/A"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-500">
                                        Created At:
                                      </span>
                                      <span className="ml-2 font-medium text-slate-900">
                                        {new Date(
                                          item.created_at
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Notes */}
                                {item.note && (
                                  <div className="space-y-3 lg:col-span-3">
                                    <h4 className="font-semibold text-slate-700 text-sm uppercase tracking-wide mb-3">
                                      Notes
                                    </h4>
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                      <p className="text-sm text-slate-700">
                                        {item.note}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {reportData.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-gray-200 text-center">
              <p className="text-sm text-slate-600">
                End of Report - LabTrack System © {new Date().getFullYear()}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Generated by {user?.first_name} {user?.last_name} on{" "}
                {new Date().toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Printable Content */}
      <div id="printable-report" style={{ display: "none" }}>
        <div className="header">
          <h1>Lab Technician Report</h1>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
              fontSize: "12pt",
            }}
          >
            <div>
              <strong>Technician:</strong> {user?.first_name} {user?.last_name}
            </div>
            <div>
              <strong>User ID:</strong> {user?.user_id}
            </div>
            <div>
              <strong>Report Date:</strong>{" "}
              {new Date().toLocaleDateString()}
            </div>
          </div>
          {startDate && (
            <div style={{ marginTop: "10px", fontSize: "11pt" }}>
              <strong>Report Period:</strong> {startDate}{" "}
              {endDate && `to ${endDate}`}
              <br />
              <strong>Report Type:</strong>{" "}
              {reportType === "all"
                ? "All Samples"
                : reportType.charAt(0).toUpperCase() + reportType.slice(1)}
            </div>
          )}
        </div>

        <table>
          <thead>
            <tr>
              <th>Sample ID</th>
              <th>Code</th>
              <th>Type</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((item) => (
              <React.Fragment key={item.sample_id}>
                <tr>
                  <td>#{item.sample_id}</td>
                  <td>
                    <strong>{item.sample_code}</strong>
                  </td>
                  <td>{item.sample_type_name || "N/A"}</td>
                  <td>{item.status?.toUpperCase() || "UNKNOWN"}</td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td colSpan="5">
                    <div className="details-section">
                      <div className="details-grid">
                        <div>
                          <div className="section-title">Physical Properties</div>
                          <div className="detail-item">
                            <span className="detail-label">Dimensions:</span>{" "}
                            {item.dimensions || "N/A"}
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Weight:</span>{" "}
                            {item.weight ? `${item.weight}g` : "N/A"}
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Colour:</span>{" "}
                            {item.colour || "N/A"}
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Storage:</span>{" "}
                            {item.storage_location || "N/A"}
                          </div>
                        </div>

                        <div>
                          <div className="section-title">Test Results</div>
                          <div className="detail-item">
                            <span className="detail-label">
                              Water Absorption:
                            </span>{" "}
                            {item.water_absorption || "N/A"}
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">
                              Breaking Strength:
                            </span>{" "}
                            {item.breaking_strength || "N/A"}
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Test Results:</span>{" "}
                            {item.test_results || "N/A"}
                          </div>
                        </div>

                        <div>
                          <div className="section-title">Production Details</div>
                          <div className="detail-item">
                            <span className="detail-label">
                              Production ID:
                            </span>{" "}
                            {item.production_id || "N/A"}
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Line Code:</span>{" "}
                            {item.line_code || "N/A"}
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Line Name:</span>{" "}
                            {item.line_name || "N/A"}
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Line Type:</span>{" "}
                            {item.line_type || "N/A"}
                          </div>
                        </div>

                        <div>
                          <div className="section-title">Technician Details</div>
                          <div className="detail-item">
                            <span className="detail-label">Created By:</span>{" "}
                            {item.created_by_first_name}{" "}
                            {item.created_by_last_name}
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Role:</span>{" "}
                            {item.created_by_role || "N/A"}
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Created At:</span>{" "}
                            {new Date(item.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {item.note && (
                        <div style={{ marginTop: "10px" }}>
                          <div className="section-title">Notes</div>
                          <p>{item.note}</p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
