import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Newspaper, Users, Eye, Calendar } from "lucide-react";
import { editions } from "@/data/newsletter";

export default function AdminDashboard() {
  const { user } = useAuth();
  const usersQuery = trpc.users.list.useQuery();

  const totalEditions = editions.length;
  const totalUsers = usersQuery.data?.length ?? 0;
  const totalSections = editions.reduce((sum, e) => sum + e.sections.length, 0);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-[#003B71]">Welcome back, {user?.name || "Admin"}</h1>
        <p className="text-gray-500 mt-1">RTA AI Newsletter Administration Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Newspaper} label="Total Editions" value={totalEditions} color="#C8102E" />
        <StatCard icon={Eye} label="Total Sections" value={totalSections} color="#003B71" />
        <StatCard icon={Users} label="Registered Users" value={totalUsers} color="#2563eb" />
        <StatCard icon={Calendar} label="Next Edition" value="May 2026" color="#059669" isText />
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#003B71]">Recent Users</h2>
          <span className="text-xs text-gray-400">{totalUsers} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Last Sign In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usersQuery.isLoading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : usersQuery.data && usersQuery.data.length > 0 ? (
                usersQuery.data.slice(0, 5).map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3 font-medium text-gray-900">{u.name || "—"}</td>
                    <td className="px-6 py-3 text-gray-500">{u.email || "—"}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        u.role === "admin" ? "bg-[#C8102E]/10 text-[#C8102E]" : "bg-blue-50 text-blue-700"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-xs">
                      {u.lastSignedIn ? new Date(u.lastSignedIn).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">No users yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editions Overview */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-[#003B71]">Published Editions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {editions.map((ed) => (
            <div key={ed.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-[#C8102E]/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[#003B71] flex items-center justify-center flex-shrink-0">
                <Newspaper className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#003B71] text-sm">{ed.title.en}</p>
                <p className="text-xs text-gray-400 mt-0.5">{ed.month.en} {ed.year} — {ed.sections.length} sections</p>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700">
                Published
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, isText }: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
  isText?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className={`font-bold text-[#003B71] ${isText ? "text-lg" : "text-2xl"}`}>{value}</p>
      </div>
    </div>
  );
}
