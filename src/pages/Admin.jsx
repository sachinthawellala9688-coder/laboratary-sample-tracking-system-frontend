import { Route, Routes, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  FlaskConical,
  FileText,
  Menu,
  X,
  LogOut,
  Layers,
} from "lucide-react";
import AdminDashboard from "./Adminpages/AdminDashborad";
import ProductionLines from "./Adminpages/ProductionLines";
import Samples from "./Adminpages/Samples";
import SampleTypes from "./Adminpages/SampleTypes";
import Reports from "./Adminpages/Report";
import AdminUsers from "./Adminpages/AdminUsers";
import SampleOverview from "./userpages/SampleOverview";
import AddResult from "./Adminpages/Adminresult";
import AddSample from "./Adminpages/Adminadd";

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !storedUser) {
      navigate("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.clear();
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/production", label: "Production Lines", icon: Package },
    { path: "/admin/sample", label: "Samples", icon: FlaskConical },
    { path: "/admin/type", label: "Sample Types", icon: Layers },
    { path: "/admin/report", label: "Reports", icon: FileText },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  // Safely get display name & avatar initial
  const displayName = user
    ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Admin User"
    : "Admin User";

  const displayEmail = user?.email || "admin@example.com";

  const avatarInitial = user?.first_name?.[0]?.toUpperCase() || "A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white shadow-xl w-64`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto flex flex-col">
          <div className="flex items-center justify-between mb-8 px-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Lab Admin
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden hover:bg-gray-100 rounded-lg p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105"
                      : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            className="w-full flex items-center gap-3 px-4 py-3 mt-auto text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        {/* Top Navigation Bar */}
        <nav className="bg-white shadow-md sticky top-0 z-30">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu size={24} className="text-gray-700" />
              </button>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500">{displayEmail}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
                  {avatarInitial}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <main className="p-6">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/production" element={<ProductionLines />} />
            <Route path="/sample" element={<Samples />} />
            <Route path="/type" element={<SampleTypes />} />
            <Route path="/addsample" element={<AddSample user={user} />} />
            <Route path="/result" element={<AddResult />} />
            <Route path="/result/:id" element={<AddResult />} />
            <Route path="/sample/:id" element={<SampleOverview />} />
            <Route path="/report" element={<Reports user={user} />} />
             <Route path='/*'element={<h1>Page not found error 404</h1>}></Route>
          </Routes>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
