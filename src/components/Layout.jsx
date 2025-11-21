import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Factory, FlaskConical, FileText, Layers } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/users', label: 'User Management', icon: <Users size={20} /> },
    { path: '/production-lines', label: 'Production Lines', icon: <Factory size={20} /> },
    { path: '/sample-types', label: 'Sample Types', icon: <Layers size={20} /> },
    { path: '/samples', label: 'Samples Action', icon: <FlaskConical size={20} /> },
    { path: '/reports', label: 'Generate Reports', icon: <FileText size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-6 text-xl font-bold border-b border-slate-700">Factory Admin</div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

const Layout = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;