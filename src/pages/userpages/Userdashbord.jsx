import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FlaskConical, 
  CheckCircle, 
  Clock, 
  Activity, 
  Plus, 
  ArrowRight 
} from "lucide-react";

const API_BASE = "http://localhost:3000";

export default function UserDashboard({ user }) {
  const [stats, setStats] = useState({
    total: 0,
    tested: 0,
    pending: 0
  });
  const [recentSamples, setRecentSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = () => {
    fetch(`${API_BASE}/sample/samples`)
      .then(res => res.json())
      .then(data => {
        const allSamples = data.samples || [];
        
        // 1. Filter samples strictly for this user
        // (Assumes the API response has 'created_by' or 'user_id' to match against)
        const mySamples = allSamples.filter(s => 
            s.created_by === user.user_id || s.user_id === user.user_id
        );

        // 2. Calculate Stats
        const total = mySamples.length;
        const tested = mySamples.filter(s => s.status === "completed").length;
        const pending = total - tested;

        setStats({ total, tested, pending });

        // 3. Get Recent Activity (Last 5 samples, reversed)
        // We slice the last 5 and reverse them to show newest first
        const recent = [...mySamples].slice(-5).reverse();
        setRecentSamples(recent);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading dashboard:", err);
        setLoading(false);
      });
  };

  // Helper component for Stat Cards
  const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between transition-transform hover:scale-[1.02]">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
      </div>
      <div className={`p-4 rounded-full ${bgColor}`}>
        <Icon size={28} className={color} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">
                Hello, {user?.first_name} 👋
            </h1>
            <p className="text-gray-500 mt-1">Here is your daily lab activity overview.</p>
        </div>
        <Link 
            to="/user/addsample" 
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200 transition-all"
        >
            <Plus size={20} /> Register New Sample
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            title="Total Registered" 
            value={loading ? "-" : stats.total} 
            icon={FlaskConical} 
            color="text-blue-600" 
            bgColor="bg-blue-50" 
        />
        <StatCard 
            title="Pending / In Progress" 
            value={loading ? "-" : stats.pending} 
            icon={Clock} 
            color="text-orange-500" 
            bgColor="bg-orange-50" 
        />
        <StatCard 
            title="Completed Results" 
            value={loading ? "-" : stats.tested} 
            icon={CheckCircle} 
            color="text-green-600" 
            bgColor="bg-green-50" 
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Samples Table (Takes up 2/3 width on large screens) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Activity size={20} className="text-blue-500" /> Recent Samples
                </h3>
                <Link to="/user/sample" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                    View All <ArrowRight size={16} />
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                            <th className="pb-3 font-semibold">Code</th>
                            <th className="pb-3 font-semibold">Status</th>
                            <th className="pb-3 font-semibold">Result</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {loading ? (
                            <tr><td colSpan="3" className="py-4 text-center">Loading...</td></tr>
                        ) : recentSamples.length === 0 ? (
                            <tr><td colSpan="3" className="py-4 text-center text-gray-500">No recent activity.</td></tr>
                        ) : (
                            recentSamples.map(sample => (
                                <tr key={sample.sample_id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 font-medium text-gray-700">{sample.sample_code}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                                            sample.status === 'tested' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {sample.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-gray-600">
                                        {sample.weight ? sample.weight : <span className="text-gray-300">-</span>}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Quick Guidelines / Info (Takes up 1/3 width) */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl shadow-lg p-6 flex flex-col justify-between">
            <div>
                <h3 className="text-lg font-bold mb-4">Quick Guidelines</h3>
                <ul className="space-y-3 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                        <span className="bg-gray-700 rounded-full p-1 mt-0.5 w-5 h-5 flex items-center justify-center text-xs">1</span>
                        Register samples immediately upon receipt using the "New Sample" button.
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="bg-gray-700 rounded-full p-1 mt-0.5 w-5 h-5 flex items-center justify-center text-xs">2</span>
                        Update status to <strong>Tested</strong> only after final verification.
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="bg-gray-700 rounded-full p-1 mt-0.5 w-5 h-5 flex items-center justify-center text-xs">3</span>
                        Use the Reports tab to print daily summaries.
                    </li>
                </ul>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-xs text-gray-400">System Status</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-sm font-medium">Database Connected</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}