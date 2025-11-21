import { Route, Routes, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FlaskConical,
  FileText,
  Menu,
  X,
  LogOut,
  PlusCircle,
} from "lucide-react";

import UserDashboard from "./userpages/Userdashbord";
import SampleList from "./userpages/Samplelist";
import AddSample from "./userpages/Addsample";
import AddResult from "./userpages/Addresult";
import UserReports from "./userpages/Userreport";
import SampleOverview from "./userpages/SampleOverview";

export default function Userhome() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const BASE_PATH = "/user";

  // --- LOAD USER FROM LOCAL STORAGE ---
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

  const isActive = (relativePath) => {
    const fullPath = relativePath ? `${BASE_PATH}/${relativePath}` : BASE_PATH;
    return location.pathname === fullPath;
  };

  const menuItems = [
    { path: "", label: "Dashboard", icon: LayoutDashboard },
    { path: "sample", label: "My Samples", icon: FlaskConical },
    { path: "addsample", label: "Register Sample", icon: PlusCircle },
    { path: "addresult", label: "Add Result", icon: PlusCircle },
    { path: "report", label: "Reports", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white shadow-xl w-64`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto flex flex-col">
          <div className="flex items-center justify-between mb-8 px-3">
            <h1 className="text-2xl font-bold text-blue-600">LabTrack</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden hover:bg-gray-100 p-2 rounded"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const fullPath = item.path ? `${BASE_PATH}/${item.path}` : BASE_PATH;
              return (
                <Link
                  key={item.path || "dashboard"}
                  to={fullPath}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.path)
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 mt-auto text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        <nav className="bg-white shadow-sm sticky top-0 z-30 px-4 py-3 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              {user?.first_name ? user.first_name[0] : "U"}
            </div>
          </div>
        </nav>

        <main className="p-6">
          {/* Nested routes under /user/* */}
          <Routes>
            {/* /user */}
            <Route index element={<UserDashboard user={user} />} />
            {/* /user/sample */}
            <Route path="sample" element={<SampleList user={user} />} />
            {/* /user/addsample */}
            <Route path="addsample" element={<AddSample user={user} />} />
            {/* /user/addresult */}
            <Route path="addresult" element={<AddResult user={user} />} />
            {/* /user/addresult/:id */}
            <Route path="addresult/:id" element={<AddResult user={user} />} />
            {/* /user/report */}
            <Route path="report" element={<UserReports user={user} />} />
            <Route path="sample/:id" element={<SampleOverview user={user}  />} />
             <Route path='/*'element={<h1>Page not found error 404</h1>}></Route>
          </Routes>
        </main>
      </div>
    </div>
  );
}
