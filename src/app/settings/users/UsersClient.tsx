"use client";

import { useState, useTransition } from "react";
import { Plus, Search, Shield, User, ShieldAlert, AlertCircle, CheckSquare, Square } from "lucide-react";
import { addUser, toggleUserStatus, changeUserRole } from "@/actions/users";
import Modal from "@/components/ui/Modal";

export default function UsersClient({
  users,
  branches,
  departments,
  currentUserRole,
}: {
  users: any[];
  branches: any[];
  departments: any[];
  currentUserRole: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  // Multiselect state for the Add User Form
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);

  const filteredUsers = users.filter((u) =>
    (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.username || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleBranch = (id: number) => {
    setSelectedBranches(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const toggleDept = (id: number) => {
    setSelectedDepartments(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  const handleAddUser = async (formData: FormData) => {
    setErrorMsg("");
    startTransition(async () => {
      const res = await addUser(null, formData, selectedBranches, selectedDepartments);
      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        setIsModalOpen(false);
        setSelectedBranches([]);
        setSelectedDepartments([]);
      }
    });
  };

  const handleToggleStatus = (userId: number, currentStatus: string) => {
    startTransition(async () => {
      await toggleUserStatus(userId, currentStatus);
    });
  };

  const handleChangeRole = (userId: number, newRole: string) => {
    startTransition(async () => {
      await changeUserRole(userId, newRole);
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <button
          onClick={() => {
            setErrorMsg("");
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-all active:scale-95 flex items-center gap-2 shadow-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Flat Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-4">Name / Username</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                {currentUserRole === "Leader" && (
                  <th className="px-6 py-4 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={currentUserRole === "Leader" ? 4 : 3} className="px-6 py-10 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">{u.name}</p>
                          <p className="text-[11px] text-slate-500">@{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {u.role === "Leader" && <ShieldAlert className="w-4 h-4 text-red-500" />}
                        {u.role === "Co Leader" && <Shield className="w-4 h-4 text-amber-500" />}
                        {u.role === "Member" && <User className="w-4 h-4 text-blue-500" />}
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{u.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.status === "active" 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    
                    {/* Actions Column (Leader Only) */}
                    {currentUserRole === "Leader" && (
                      <td className="px-6 py-4 text-right">
                        {!u.isAbsoluteLeader && (
                          <div className="flex items-center justify-end gap-3">
                            {/* Role Switcher */}
                            <select
                              value={u.role}
                              onChange={(e) => handleChangeRole(u.id, e.target.value)}
                              disabled={isPending}
                              className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                            >
                              <option value="Co Leader">Co Leader</option>
                              <option value="Member">Member</option>
                            </select>

                            {/* Status Toggle */}
                            <button
                              onClick={() => handleToggleStatus(u.id, u.status)}
                              disabled={isPending}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                                u.status === "active"
                                  ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40"
                                  : "bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40"
                              }`}
                            >
                              {u.status === "active" ? "Deactivate" : "Activate"}
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (!isPending) setIsModalOpen(false);
        }}
        title="Add New User"
      >
        <form action={handleAddUser} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Name</label>
              <input type="text" name="name" required className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Username (Unique)</label>
              <input type="text" name="username" required className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
            <input type="text" name="pwd" required className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Role</label>
            <select
              name="role"
              disabled={currentUserRole !== "Leader"}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-60 disabled:bg-slate-100"
              defaultValue="Member"
            >
              {currentUserRole === "Leader" && <option value="Co Leader">Co Leader</option>}
              <option value="Member">Member</option>
            </select>
            {currentUserRole !== "Leader" && (
              <p className="text-[10px] text-slate-500 mt-1">Only Leaders can assign Co Leader roles.</p>
            )}
          </div>

          {/* Multiselects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Branch Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Assign Branches</label>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg max-h-32 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-2 space-y-1">
                {branches.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-2">No branches found</p>
                ) : (
                  branches.map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => toggleBranch(b.id)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-left transition-colors"
                    >
                      {selectedBranches.includes(b.id) ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{b.branch}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Department Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Assign Departments</label>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg max-h-32 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-2 space-y-1">
                {departments.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-2">No departments found</p>
                ) : (
                  departments.map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggleDept(d.id)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-left transition-colors"
                    >
                      {selectedDepartments.includes(d.id) ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{d.department}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center min-w-[120px]"
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
