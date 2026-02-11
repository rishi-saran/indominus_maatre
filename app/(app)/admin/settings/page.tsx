"use client";

import React, { useState } from "react";
import { 
  Save, 
  Users, 
  Settings2, 
  Percent, 
  Video, 
  Plus, 
  Trash2,
  Edit2,
  X,
  Mail,
  User 
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Types ---
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Editor" | "Viewer";
  lastActive: string;
}

// --- Dummy Data ---
const dummyAdmins: AdminUser[] = [
  { id: "ADM001", name: "Admin User", email: "admin@maathre.com", role: "Super Admin", lastActive: "Just now" },
  { id: "ADM002", name: "Support Team", email: "support@maathre.com", role: "Editor", lastActive: "2 hours ago" },
];

export default function SettingsPage() {
  const [platformFee, setPlatformFee] = useState(15);
  const [payoutThreshold, setPayoutThreshold] = useState(5000);
  const [maxStreamDuration, setMaxStreamDuration] = useState(60);
  const [enableHD, setEnableHD] = useState(true);
  const [autoRecord, setAutoRecord] = useState(true);
  
  const [admins, setAdmins] = useState<AdminUser[]>(dummyAdmins);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({ name: "", email: "", role: "Editor" });
  
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

  // -- Actions --

  const handleSaveConfig = () => {
    // Simulate API call
    setTimeout(() => {
        toast.success("Platform configuration saved successfully");
    }, 500);
  };

  const handleInviteAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const newAdmin: AdminUser = {
        id: `ADM${Math.floor(Math.random() * 1000)}`,
        name: newAdminForm.name,
        email: newAdminForm.email,
        role: newAdminForm.role as any,
        lastActive: "Never"
    };
    setAdmins([...admins, newAdmin]);
    setIsInviteModalOpen(false);
    setNewAdminForm({ name: "", email: "", role: "Editor" });
    toast.success(`Invitation sent to ${newAdmin.email}`);
  };

  const handleUpdateAdmin = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingAdmin) return;
      
      setAdmins(admins.map(a => a.id === editingAdmin.id ? editingAdmin : a));
      setEditingAdmin(null);
      toast.success("Admin user updated");
  };

  const handleDeleteAdmin = (id: string) => {
      if (confirm("Are you sure you want to remove this admin?")) {
          setAdmins(admins.filter(a => a.id !== id));
          toast.success("Admin removed");
      }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Platform Settings</h1>
        <p className="text-gray-500 mt-2 font-medium">Configure global platform parameters and access controls.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Commission Rates */}
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-green-50 rounded-xl text-green-600">
                        <Percent className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Commission Rates</h2>
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Financial Rules</p>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Platform Fee (%)</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    min="0" max="100"
                                    value={platformFee}
                                    onChange={(e) => setPlatformFee(Number(e.target.value))}
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all font-medium text-gray-900 text-sm"
                                />
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400 font-bold text-sm">%</div>
                            </div>
                        </div>
                    
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Payout Threshold</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 font-bold text-sm">₹</span>
                                <input 
                                    type="number" 
                                    min="0"
                                    value={payoutThreshold}
                                    onChange={(e) => setPayoutThreshold(Number(e.target.value))}
                                    className="w-full pl-6 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all font-medium text-gray-900 text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <button 
                    onClick={handleSaveConfig}
                    className="w-full bg-gray-900 text-white font-bold py-2.5 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-900/10 text-sm"
                >
                    <Save className="h-4 w-4" />
                    Save Changes
                </button>
            </div>
        </section>

        {/* Streaming Config */}
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 h-full flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                        <Video className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Streaming Config</h2>
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Tech settings</p>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Max Duration (Mins)</label>
                        <input 
                            type="number" 
                            value={maxStreamDuration}
                            onChange={(e) => setMaxStreamDuration(Number(e.target.value))}
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-gray-900 text-sm"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
                            <input 
                                type="checkbox" 
                                checked={enableHD}
                                onChange={(e) => setEnableHD(e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                            />
                            <span className="font-bold text-gray-700 text-xs">Enable HD (720p+)</span>
                        </label>
                        
                        <label className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200">
                            <input 
                                type="checkbox" 
                                checked={autoRecord}
                                onChange={(e) => setAutoRecord(e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                            />
                            <span className="font-bold text-gray-700 text-xs">Auto-record</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <button 
                    onClick={handleSaveConfig}
                    className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 text-sm"
                >
                    <Save className="h-4 w-4" />
                    Save Config
                </button>
            </div>
        </section>
      </div>

      {/* Admin Users */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
         <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                    <Users className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Admin Users</h2>
                    <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Access Management</p>
                </div>
             </div>
             <button 
                onClick={() => setIsInviteModalOpen(true)}
                className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20"
             >
                <Plus className="h-4 w-4" />
                Invite New Admin
             </button>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                    <tr>
                        <th className="px-8 py-5">Name</th>
                        <th className="px-8 py-5">Email</th>
                        <th className="px-8 py-5">Role</th>
                        <th className="px-8 py-5">Last Active</th>
                        <th className="px-8 py-5 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {admins.map((admin) => {
                        const roleColors = {
                          "Super Admin": { badge: "bg-purple-100 text-purple-700 border border-purple-200", avatar: "bg-purple-100 text-purple-700", hover: "hover:bg-purple-50/30" },
                          "Editor": { badge: "bg-emerald-100 text-emerald-700 border border-emerald-200", avatar: "bg-emerald-100 text-emerald-700", hover: "hover:bg-emerald-50/30" },
                          "Viewer": { badge: "bg-amber-100 text-amber-700 border border-amber-200", avatar: "bg-amber-100 text-amber-700", hover: "hover:bg-amber-50/30" },
                        };
                        const rc = roleColors[admin.role] || roleColors["Viewer"];
                        return (
                        <tr key={admin.id} className={cn("transition-colors group", rc.hover)}>
                            <td className="px-8 py-5 font-bold text-gray-900 flex items-center gap-3">
                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold", rc.avatar)}>
                                    {admin.name.charAt(0)}
                                </div>
                                {admin.name}
                            </td>
                            <td className="px-8 py-5 text-gray-600">{admin.email}</td>
                            <td className="px-8 py-5">
                                <span className={cn(
                                    "px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider",
                                    rc.badge
                                )}>
                                    {admin.role}
                                </span>
                            </td>
                            <td className="px-8 py-5 text-gray-500 font-mono text-xs">{admin.lastActive}</td>
                            <td className="px-8 py-5 text-right">
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => setEditingAdmin(admin)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteAdmin(admin.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        );
                    })}
                </tbody>
            </table>
         </div>
      </section>

      {/* Invite Modal */}
      {isInviteModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
                  <div className="bg-purple-50 p-6 rounded-t-3xl border-b border-purple-100 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-purple-900">Invite New Admin</h3>
                      <button onClick={() => setIsInviteModalOpen(false)} className="p-1 hover:bg-purple-100 rounded-full transition-colors">
                          <X className="h-5 w-5 text-purple-400" />
                      </button>
                  </div>
                  <form onSubmit={handleInviteAdmin} className="p-6 space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input 
                                required
                                type="text" 
                                value={newAdminForm.name}
                                onChange={(e) => setNewAdminForm({...newAdminForm, name: e.target.value})}
                                placeholder="e.g. John Doe"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm font-medium"
                            />
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input 
                                required
                                type="email" 
                                value={newAdminForm.email}
                                onChange={(e) => setNewAdminForm({...newAdminForm, email: e.target.value})}
                                placeholder="admin@maathre.com"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm font-medium"
                            />
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                          <select 
                             value={newAdminForm.role}
                             onChange={(e) => setNewAdminForm({...newAdminForm, role: e.target.value})}
                             className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm font-medium appearance-none"
                          >
                              <option value="Super Admin">Super Admin</option>
                              <option value="Editor">Editor</option>
                              <option value="Viewer">Viewer</option>
                          </select>
                      </div>
                      <div className="pt-4">
                          <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3.5 rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20">
                              Send Invitation
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
      
      {/* Edit Modal */}
      {editingAdmin && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
                  <div className="bg-blue-50 p-6 rounded-t-3xl border-b border-blue-100 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-blue-900">Edit Admin</h3>
                      <button onClick={() => setEditingAdmin(null)} className="p-1 hover:bg-blue-100 rounded-full transition-colors">
                          <X className="h-5 w-5 text-blue-400" />
                      </button>
                  </div>
                  <form onSubmit={handleUpdateAdmin} className="p-6 space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                          <input 
                                required
                                type="text" 
                                value={editingAdmin.name}
                                onChange={(e) => setEditingAdmin({...editingAdmin, name: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
                            />
                      </div>
                      <div className="pb-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                          <select 
                             value={editingAdmin.role}
                             onChange={(e) => setEditingAdmin({...editingAdmin, role: e.target.value as any})}
                             className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium cursor-pointer"
                             size={1}
                          >
                              <option value="Super Admin">Super Admin</option>
                              <option value="Editor">Editor</option>
                              <option value="Viewer">Viewer</option>
                          </select>
                      </div>
                      <div className="pt-4">
                          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                              Update User
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}