import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  FlaskConical,
  Layers,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSamples: 0,
    totalSampleTypes: 0,
    productionLines: 0,
  });
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:3000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, samplesRes, typesRes, linesRes] = await Promise.all([
        fetch(`${API_BASE}/user`).then((r) => r.json()),
        fetch(`${API_BASE}/sample/samples`).then((r) => r.json()),
        fetch(`${API_BASE}/sampletype/sample-types`).then((r) => r.json()),
        fetch(`${API_BASE}/production/production-lines`).then((r) => r.json()),
      ]);

      setStats({
        totalUsers: usersRes.users?.length || 0,
        totalSamples: samplesRes.samples?.length || 0,
        totalSampleTypes: typesRes.sample_types?.length || 0,
        productionLines: linesRes.production_lines?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className={`h-1 w-full bg-gradient-to-r ${color}`} />
      <div className="p-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <Icon size={28} className="text-gray-700" />
        </div>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="from-blue-500 to-blue-600"
          subtitle="Managers & Lab Technicians"
        />
        <StatCard
          title="Samples"
          value={stats.totalSamples}
          icon={FlaskConical}
          color="from-purple-500 to-purple-600"
          subtitle="Registered lab samples"
        />
        <StatCard
          title="Sample Types"
          value={stats.totalSampleTypes}
          icon={Layers}
          color="from-green-500 to-green-600"
          subtitle="Defined categories"
        />
        <StatCard
          title="Production Lines"
          value={stats.productionLines}
          icon={Package}
          color="from-orange-500 to-orange-600"
          subtitle="Configured lines in system"
        />
      </div>

      {/* Lower summary card (optional info area) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            System Overview
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            This dashboard gives you a quick snapshot of the LabTrack
            environment. Use the sidebar to manage users, production lines,
            samples, and sample types.
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Manage access control under <strong>Users</strong>.</li>
            <li>
              • Define brick/tile categories in <strong>Sample Types</strong>.
            </li>
            <li>
              • Track testing workflow in <strong>Samples</strong> and generate reports from the <strong>Reports</strong> section.
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Activity & Status
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Data shown here is loaded from the live backend (users, samples,
            sample types, and production lines).
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase">Data Source</p>
              <p className="font-medium text-gray-800">LabTrack API</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase">Last Refresh</p>
              <p className="font-medium text-gray-800">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Refresh Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            <p className="text-sm text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      );
    }

    return <DashboardView />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <LayoutDashboard className="text-indigo-600" />
            Admin Overview
          </h2>
          <p className="text-sm text-gray-500">
            Quick summary of users, samples, sample types and production lines in
            LabTrack.
          </p>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default AdminDashboard;
