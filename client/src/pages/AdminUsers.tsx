import { trpc } from "@/lib/trpc";
import { Users, Shield, ShieldOff, Trash2, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const usersQuery = trpc.users.list.useQuery();
  const updateRole = trpc.users.updateRole.useMutation({
    onSuccess: () => {
      usersQuery.refetch();
      toast.success("User role updated successfully");
    },
    onError: (err) => toast.error(err.message),
  });
  const deleteUser = trpc.users.delete.useMutation({
    onSuccess: () => {
      usersQuery.refetch();
      toast.success("User deleted successfully");
    },
    onError: (err) => toast.error(err.message),
  });

  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const filteredUsers = (usersQuery.data ?? []).filter((u) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#003B71]">User Management</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage user roles and access permissions</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2 shadow-sm">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Login Method</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usersQuery.isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    {search ? "No users match your search" : "No users found"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSelf = currentUser?.id === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                            u.role === "admin" ? "bg-[#C8102E]" : "bg-[#003B71]"
                          }`}>
                            {(u.name || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{u.name || "—"}</p>
                            {isSelf && <span className="text-[10px] text-[#C8102E] font-medium">(You)</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{u.email || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          u.role === "admin"
                            ? "bg-[#C8102E]/10 text-[#C8102E]"
                            : "bg-blue-50 text-blue-700"
                        }`}>
                          {u.role === "admin" ? <Shield className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs capitalize">{u.loginMethod || "—"}</td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {u.lastSignedIn ? new Date(u.lastSignedIn).toLocaleString() : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!isSelf && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onClick={() => updateRole.mutate({
                                  userId: u.id,
                                  role: u.role === "admin" ? "user" : "admin",
                                })}
                                disabled={updateRole.isPending}
                              >
                                {u.role === "admin" ? (
                                  <><ShieldOff className="w-3.5 h-3.5 mr-1" /> Demote</>
                                ) : (
                                  <><Shield className="w-3.5 h-3.5 mr-1" /> Promote</>
                                )}
                              </Button>
                              {confirmDelete === u.id ? (
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-8 px-2 text-xs"
                                    onClick={() => {
                                      deleteUser.mutate({ userId: u.id });
                                      setConfirmDelete(null);
                                    }}
                                    disabled={deleteUser.isPending}
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-xs"
                                    onClick={() => setConfirmDelete(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => setConfirmDelete(u.id)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
