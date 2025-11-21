import { useState, useEffect } from "react";
import { Search, Trash2, Plus, FileText, Package, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:3000";

export default function SampleList({ user }) {
  const [samples, setSamples] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate= useNavigate();

  useEffect(() => {
    if (user) {
      fetchSamples();
    }
  }, [user]);

  const fetchSamples = () => {
    setLoading(true);
    fetch(`${API_BASE}/sample/samples`)
      .then((res) => res.json())
      .then((data) => {
        const allSamples = data.samples || [];
        const mySamples = allSamples.filter(
          (s) => s.created_by === user?.user_id
        );
        setSamples(mySamples);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this sample?")) {
      fetch(`${API_BASE}/sample/samples/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then(() => {
          alert("Sample deleted");
          fetchSamples();
        })
        .catch((err) => console.error(err));
    }
  };

  const handleRowClick = (id) => {
     navigate(`/user/sample/${id}`);
  };

  const filteredSamples = samples.filter((sample) =>
    sample.sample_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStatusBadge = (status) => {
    if (!status) {
      return (
        <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase bg-gray-100 text-gray-600 border border-gray-200">
          N/A
        </span>
      );
    }

    const normalized = status.toLowerCase();
    let classes = "bg-gray-100 text-gray-700 border-gray-200";
    let icon = "⚪";

    if (normalized === "completed") {
      classes = "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200";
      icon = "✓";
    } else if (
      normalized === "pending" ||
      normalized === "intesting" ||
      normalized === "in test"
    ) {
      classes = "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200";
      icon = "⏳";
    } else if (normalized === "reject" || normalized === "rejected") {
      classes = "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200";
      icon = "✗";
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase border ${classes}`}
      >
        <span>{icon}</span>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="text-white" size={22} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Samples
            </h1>
          </div>
          <p className="text-gray-600 ml-13">
            Manage and track all your quality control samples
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
          {/* Decorative Header Bar */}
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          {/* Toolbar */}
          <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Search Bar */}
              <div className="relative w-full md:w-96 group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by sample code..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* New Button */}
              <a
                href="/user/addsample"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 whitespace-nowrap"
              >
                <Plus size={20} />
                <span>New Sample</span>
              </a>
            </div>

            {/* Stats Row */}
            <div className="mt-4 flex gap-4 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-indigo-100">
                <Package size={16} className="text-indigo-600" />
                <span className="text-sm font-semibold text-gray-700">
                  Total: <span className="text-indigo-600">{filteredSamples.length}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-green-100">
                <span className="text-sm font-semibold text-gray-700">
                  Completed: <span className="text-green-600">
                    {filteredSamples.filter(s => s.status?.toLowerCase() === 'completed').length}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-amber-100">
                <span className="text-sm font-semibold text-gray-700">
                  Pending: <span className="text-amber-600">
                    {filteredSamples.filter(s => s.status?.toLowerCase() === 'pending').length}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-slate-50 border-b-2 border-indigo-100">
                  <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Sample Code
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Production Line
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      Created At
                    </div>
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <User size={14} />
                      Created By
                    </div>
                  </th>
                  <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
                        <p className="text-gray-500 font-medium">Loading samples...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredSamples.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <Package size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No samples found</p>
                        <p className="text-sm text-gray-400">
                          {searchTerm ? "Try a different search term" : "Create your first sample to get started"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSamples.map((sample, index) => (
                    <tr
                      key={sample.sample_id}
                      className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 cursor-pointer transition-all group"
                      onClick={() => handleRowClick(sample.sample_id)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center text-indigo-700 font-bold text-xs">
                            {index + 1}
                          </div>
                          <span className="font-mono font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {sample.sample_code}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-700 font-medium">
                          {sample.sample_type_name || "-"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-700">
                          {sample.line_name || "-"}
                        </span>
                      </td>
                      <td className="p-4">
                        {renderStatusBadge(sample.status)}
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">
                          {sample.created_at
                            ? new Date(sample.created_at).toLocaleString()
                            : "-"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-700 font-medium">
                          {user
                            ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || "-"
                            : sample.created_by ?? "-"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          {/* Add / Update Result */}
                          <a
                            href={`/user/addresult/${sample.sample_id}`}
                            className="p-2.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all hover:scale-110 group/btn"
                            title="Add / Update Result"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FileText size={18} className="group-hover/btn:scale-110 transition-transform" />
                          </a>
                          
                          {/* Delete */}
                          <button
                            onClick={(e) => handleDelete(e, sample.sample_id)}
                            className="p-2.5 text-red-600 hover:bg-red-100 rounded-lg transition-all hover:scale-110 group/btn"
                            title="Delete"
                          >
                            <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {!loading && filteredSamples.length > 0 && (
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-indigo-100">
              <p className="text-sm text-gray-600 text-center">
                Showing <span className="font-bold text-indigo-600">{filteredSamples.length}</span> sample{filteredSamples.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}