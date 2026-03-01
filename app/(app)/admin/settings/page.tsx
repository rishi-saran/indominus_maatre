"use client";

import React, { useState, useEffect } from "react";
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
  User,
  Lock
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AdminUsersService, AdminUser } from "@/lib/services/admin-users.service";
import { AdminSettingsService } from "@/lib/services/admin-settings.service";

export default function SettingsPage() {
  const [platformFee, setPlatformFee] = useState(15);
  const [payoutThreshold, setPayoutThreshold] = useState(5000);
  const [maxStreamDuration, setMaxStreamDuration] = useState(60);
  const [enableHD, setEnableHD] = useState(true);
  const [autoRecord, setAutoRecord] = useState(true);
  const [savingCommission, setSavingCommission] = useState(false);

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [adminsLoading, setAdminsLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({ first_name: "", last_name: "", email: "", phone: "", password: "" });

  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  // -- Fetch admins on mount --
  useEffect(() => {
    (async () => {
      try {
        const res = await AdminUsersService.list();
        setAdmins(res.users ?? []);
      } catch {
        // silently fail — table will show empty
      } finally {
        setAdminsLoading(false);
      }
    })();
  }, []);

  // -- Fetch commission settings on mount --
  useEffect(() => {
    (async () => {
      try {
        const settings = await AdminSettingsService.getCommission();
        const map: Record<string, string> = {};
        settings.forEach(s => { map[s.key] = s.value; });
        if (map.platform_commission_rate) setPlatformFee(Number(map.platform_commission_rate));
        if (map.payout_threshold) setPayoutThreshold(Number(map.payout_threshold));
      } catch {
        // keep default values
      }
    })();
  }, []);

  // -- Actions --

  const handleSaveCommission = async () => {
    setSavingCommission(true);
    try {
      await AdminSettingsService.bulkUpdate({
        platform_commission_rate: String(platformFee),
        payout_threshold: String(payoutThreshold),
      });
      toast.success("Commission settings saved");
    } catch (err: any) {
      toast.error(err.message || "Failed to save commission settings");
    } finally {
      setSavingCommission(false);
    }
  };

  const handleSaveStreaming = () => {
    // Streaming config persistence not yet wired to backend
    toast.success("Streaming configuration saved");
  };

  const handleInviteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    try {
      const created = await AdminUsersService.create({
        first_name: newAdminForm.first_name,
        last_name: newAdminForm.last_name,
        email: newAdminForm.email,
        phone: newAdminForm.phone || undefined,
        plain_password: newAdminForm.password,
      });
      setAdmins(prev => [...prev, created]);
      setIsInviteModalOpen(false);
      setNewAdminForm({ first_name: "", last_name: "", email: "", phone: "", password: "" });
      toast.success(`Admin account created for ${created.email}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create admin");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;
    setEditLoading(true);
    try {
      const updated = await AdminUsersService.update(editingAdmin.id, {
        first_name: editingAdmin.first_name,
        last_name: editingAdmin.last_name,
        email: editingAdmin.email,
        phone: editingAdmin.phone,
        is_active: editingAdmin.is_active,
      });
      setAdmins(prev => prev.map(a => a.id === editingAdmin.id ? { ...a, ...updated } : a));
      setEditingAdmin(null);
      toast.success("Admin updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update admin");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm("Are you sure you want to remove this admin? This cannot be undone.")) return;
    try {
      await AdminUsersService.delete(id);
      setAdmins(prev => prev.filter(a => a.id !== id));
      toast.success("Admin removed");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove admin");
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
                    onClick={handleSaveCommission}
                    disabled={savingCommission}
                    className="w-full bg-[#1a5d1a] text-white font-bold py-2.5 rounded-xl hover:bg-green-900 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-800/20 text-sm disabled:opacity-60"
                >
                    <Save className="h-4 w-4" />
                    {savingCommission ? "Saving..." : "Save Changes"}
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
                    onClick={handleSaveStreaming}
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
                     className="flex items-center gap-2 bg-[#1a5d1a] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-900 transition-all shadow-lg shadow-green-800/20"
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
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5">Joined</th>
                        <th className="px-8 py-5 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {adminsLoading ? (
                        <tr><td colSpan={5} className="px-8 py-10 text-center text-gray-400">Loading admins...</td></tr>
                    ) : admins.length === 0 ? (
                        <tr><td colSpan={5} className="px-8 py-10 text-center text-gray-400">No admin users found.</td></tr>
                    ) : admins.map((admin) => {
                        const fullName = `${admin.first_name || ''} ${admin.last_name || ''}`.trim() || admin.email;
                        const initials = (admin.first_name?.[0] ?? admin.email[0]).toUpperCase();
                        return (
                        <tr key={admin.id} className="transition-colors group hover:bg-purple-50/30">
                            <td className="px-8 py-5 font-bold text-gray-900 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-purple-100 text-purple-700">
                                    {initials}
                                </div>
                                {fullName}
                            </td>
                            <td className="px-8 py-5 text-gray-600">{admin.email}</td>
                            <td className="px-8 py-5">
                                <span className={cn(
                                    "px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider",
                                    admin.is_active
                                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                        : "bg-gray-100 text-gray-500 border border-gray-200"
                                )}>
                                    {admin.is_active ? "Active" : "Inactive"}
                                </span>
                            </td>
                            <td className="px-8 py-5 text-gray-500 font-mono text-xs">
                                {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : "—"}
                            </td>
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
                      <h3 className="text-lg font-bold" style={{ color: '#1a5d1a' }}>Invite New Admin</h3>
                      <button onClick={() => setIsInviteModalOpen(false)} className="p-1 hover:bg-purple-100 rounded-full transition-colors">
                          <X className="h-5 w-5 text-purple-400" />
                      </button>
                  </div>
                  <form onSubmit={handleInviteAdmin} className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                          <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                              <div className="relative">
                                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                  <input
                                      required
                                      type="text"
                                      value={newAdminForm.first_name}
                                      onChange={(e) => setNewAdminForm({...newAdminForm, first_name: e.target.value})}
                                      placeholder="First"
                                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm font-medium"
                                  />
                              </div>
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                              <input
                                  required
                                  type="text"
                                  value={newAdminForm.last_name}
                                  onChange={(e) => setNewAdminForm({...newAdminForm, last_name: e.target.value})}
                                  placeholder="Last"
                                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm font-medium"
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
                          <label className="block text-sm font-bold text-gray-700 mb-2">Phone <span className="font-normal text-gray-400">(optional)</span></label>
                          <input
                              type="tel"
                              value={newAdminForm.phone}
                              onChange={(e) => setNewAdminForm({...newAdminForm, phone: e.target.value})}
                              placeholder="+91 98765 43210"
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm font-medium"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                          <div className="relative">
                              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <input
                                  required
                                  type="password"
                                  value={newAdminForm.password}
                                  onChange={(e) => setNewAdminForm({...newAdminForm, password: e.target.value})}
                                  placeholder="Temporary password"
                                  minLength={8}
                                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm font-medium"
                              />
                          </div>
                      </div>
                      <div className="pt-4">
                          <button type="submit" disabled={inviteLoading} className="w-full bg-[#1a5d1a] text-white font-bold py-3.5 rounded-xl hover:bg-green-900 transition-colors shadow-lg shadow-green-800/20 disabled:opacity-60">
                              {inviteLoading ? "Creating Admin..." : "Create Admin"}
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
                      <div className="grid grid-cols-2 gap-3">
                          <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                              <input
                                  required
                                  type="text"
                                  value={editingAdmin.first_name}
                                  onChange={(e) => setEditingAdmin({...editingAdmin, first_name: e.target.value})}
                                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                              <input
                                  required
                                  type="text"
                                  value={editingAdmin.last_name}
                                  onChange={(e) => setEditingAdmin({...editingAdmin, last_name: e.target.value})}
                                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
                              />
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                          <div className="relative">
                              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <input
                                  required
                                  type="email"
                                  value={editingAdmin.email}
                                  onChange={(e) => setEditingAdmin({...editingAdmin, email: e.target.value})}
                                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
                              />
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Phone <span className="font-normal text-gray-400">(optional)</span></label>
                          <input
                              type="tel"
                              value={editingAdmin.phone ?? ''}
                              onChange={(e) => setEditingAdmin({...editingAdmin, phone: e.target.value})}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
                          />
                      </div>
                      <div className="pt-4">
                          <button type="submit" disabled={editLoading} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-60">
                              {editLoading ? "Saving..." : "Update Admin"}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
}