"use client";

import React, { useState } from "react";
import { 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  IndianRupee,
  X,
  Receipt,
  Pencil,
  Wallet,
  PiggyBank,
  CreditCard,
  Banknote,
  Smartphone,
  Globe
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Types ---
type PaymentStatus = "Pending" | "Completed" | "Failed";
type PayoutStatus = "Processing" | "Processed" | "Rejected";

interface Transaction {
  id: string;
  user: string;
  amount: number;
  date: string;
  method: string;
  status: PaymentStatus;
}

interface Payout {
  id: string;
  priest: string;
  amount: number;
  date: string;
  status: PayoutStatus;
}

// --- Dummy Data ---
const dummyTransactions: Transaction[] = [
  { id: "TXN1001", user: "Rahul Sharma", amount: 5000, date: "Feb 10, 2024", method: "UPI", status: "Completed" },
  { id: "TXN1002", user: "Priya Patel", amount: 3500, date: "Feb 09, 2024", method: "Credit Card", status: "Completed" },
  { id: "TXN1003", user: "Amit Kumar", amount: 12000, date: "Feb 08, 2024", method: "Net Banking", status: "Failed" },
  { id: "TXN1004", user: "Sneha Reddy", amount: 2100, date: "Feb 08, 2024", method: "UPI", status: "Pending" },
  { id: "TXN1005", user: "Vikram Singh", amount: 7500, date: "Feb 07, 2024", method: "UPI", status: "Completed" },
];

const dummyPayouts: Payout[] = [
  { id: "P0681", priest: "Pandit Ravi", amount: 15000, date: "Feb 01, 2024", status: "Processed" },
  { id: "P0682", priest: "Acharya Mishra", amount: 8500, date: "Feb 01, 2024", status: "Processing" },
  { id: "P0683", priest: "Swami Iyer", amount: 22000, date: "Jan 31, 2024", status: "Processing" },
];

const monthlyCommissionData = [
  { name: "Jul", commission: 45000 },
  { name: "Aug", commission: 52000 },
  { name: "Sep", commission: 48000 },
  { name: "Oct", commission: 61000 },
  { name: "Nov", commission: 55000 },
  { name: "Dec", commission: 63000 },
];

// --- Components ---

const methodIcon = (method: string) => {
  switch(method) {
    case "UPI": return <Smartphone className="h-3.5 w-3.5" />;
    case "Credit Card": return <CreditCard className="h-3.5 w-3.5" />;
    case "Net Banking": return <Globe className="h-3.5 w-3.5" />;
    default: return <Banknote className="h-3.5 w-3.5" />;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string, dot: string }> = {
    Completed: { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" },
    Processed: { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" },
    Pending: { bg: "bg-amber-50 text-amber-700 border-amber-100", dot: "bg-amber-500" },
    Processing: { bg: "bg-amber-50 text-amber-700 border-amber-100", dot: "bg-amber-500" },
    Failed: { bg: "bg-red-50 text-red-600 border-red-100", dot: "bg-red-500" },
    Rejected: { bg: "bg-red-50 text-red-600 border-red-100", dot: "bg-red-500" },
  };
  const s = config[status] || { bg: "bg-gray-50 text-gray-600 border-gray-100", dot: "bg-gray-400" };
  return (
    <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 w-fit", s.bg)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)}></span>
      {status}
    </span>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-3.5 border border-gray-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.12)] rounded-xl">
        <p className="font-bold text-gray-900 text-sm mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-semibold text-emerald-600">
            ₹{(entry.value / 1000).toFixed(0)}k
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<"incoming" | "payouts" | "commission">("incoming");
  const [transactions, setTransactions] = useState<Transaction[]>(dummyTransactions);
  const [payouts, setPayouts] = useState<Payout[]>(dummyPayouts);
  const [selectedItem, setSelectedItem] = useState<Transaction | Payout | null>(null);
  const [commissionRate, setCommissionRate] = useState(15);
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [tempRate, setTempRate] = useState(15);

  const totalVolume = 420000;
  const platformEarnings = Math.round(totalVolume * commissionRate / 100);
  const priestEarnings = totalVolume - platformEarnings;

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // -- Actions --

  const handleApprovePayout = (id: string) => {
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: "Processed" } : p));
    toast.success(`Payout ${id} approved successfully`);
  };

  const handleRejectPayout = (id: string) => {
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: "Rejected" } : p));
    toast.error(`Payout ${id} rejected`);
  };

  const exportReport = () => {
    const data = activeTab === "incoming" ? transactions : payouts;
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `finance_report_${activeTab}_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Report exported successfully");
  };

  // -- Stat Cards --
  const statCards = [
    {
      title: "Total Revenue",
      value: "₹4,20,000",
      trend: "+12.5%",
      icon: IndianRupee,
      gradient: "from-emerald-50 to-green-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      trendColor: "text-emerald-600 bg-emerald-50",
      borderColor: "border-emerald-100",
    },
    {
      title: "Platform Commission",
      value: "₹63,000",
      trend: "+8.2%",
      icon: PiggyBank,
      gradient: "from-amber-50 to-yellow-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      trendColor: "text-amber-600 bg-amber-50",
      borderColor: "border-amber-100",
    },
    {
      title: "Priest Earnings",
      value: "₹3,57,000",
      trend: null,
      icon: Wallet,
      gradient: "from-violet-50 to-purple-50",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      trendColor: "",
      borderColor: "border-violet-100",
    },
  ];

  // -- Render Tab Content --

  const renderIncoming = () => (
    <div className="bg-white rounded-3xl border border-gray-100/80 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-50/50">
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Method</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((txn, idx) => (
              <tr key={txn.id} className="hover:bg-gradient-to-r hover:from-green-50/30 hover:to-transparent transition-all duration-200 group">
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">{txn.id}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center text-[11px] font-bold text-emerald-700">
                      {txn.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-semibold text-gray-800">{txn.user}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs font-medium">{txn.date}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1.5 text-gray-600 text-xs font-medium">
                    {methodIcon(txn.method)}
                    {txn.method}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">₹{txn.amount.toLocaleString()}</td>
                <td className="px-6 py-4"><StatusBadge status={txn.status} /></td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setSelectedItem(txn)}
                    className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-1.5 rounded-lg transition-all hover:shadow-sm cursor-pointer"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPayouts = () => (
    <div className="bg-white rounded-3xl border border-gray-100/80 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-50/50">
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Payout ID</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Priest</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payouts.map((payout) => (
              <tr key={payout.id} className="hover:bg-gradient-to-r hover:from-amber-50/30 hover:to-transparent transition-all duration-200">
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">{payout.id}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-yellow-50 flex items-center justify-center text-[11px] font-bold text-amber-700">
                      {payout.priest.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-semibold text-gray-800">{payout.priest}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs font-medium">{payout.date}</td>
                <td className="px-6 py-4 font-bold text-gray-900">₹{payout.amount.toLocaleString()}</td>
                <td className="px-6 py-4"><StatusBadge status={payout.status} /></td>
                <td className="px-6 py-4 text-right">
                  {payout.status === "Processing" ? (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleApprovePayout(payout.id)}
                        className="px-3.5 py-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all border border-emerald-200 hover:shadow-sm cursor-pointer"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleRejectPayout(payout.id)}
                        className="px-3.5 py-1.5 text-[11px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all border border-red-200 hover:shadow-sm cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-gray-300">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCommission = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Chart */}
      <div className="bg-white p-7 rounded-3xl border border-gray-100/80 shadow-sm relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-50 rounded-full blur-3xl"></div>
        <h3 className="text-lg font-bold text-gray-900 mb-1 relative z-10">Monthly Commission</h3>
        <p className="text-xs text-gray-400 font-medium mb-6 relative z-10">Breakdown of platform earnings</p>
        <div className="h-[280px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyCommissionData}>
              <defs>
                <linearGradient id="commGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `₹${value/1000}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area type="monotone" dataKey="commission" stroke="#10b981" strokeWidth={2.5} fill="url(#commGrad)" dot={{ stroke: '#10b981', strokeWidth: 2, fill: '#fff', r: 4 }} activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="space-y-6">
         {/* Commission Rule Card */}
         <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6 rounded-3xl border border-emerald-100/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 opacity-[0.04]">
                <IndianRupee className="w-32 h-32 text-emerald-900" />
            </div>
            <h4 className="text-gray-900 font-bold mb-1.5 relative z-10">Platform Commission Rule</h4>
            <p className="text-gray-500 text-sm mb-5 relative z-10">Current platform fee is set to <span className="font-bold text-emerald-700">{commissionRate}%</span> for all service bookings.</p>
            <div className="flex items-center gap-3 relative z-10">
                <div className="bg-white/70 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-[#1a5d1a]/30 shadow-sm">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Current Rate</span>
                    {isEditingRate ? (
                      <div className="flex items-center gap-1 mt-0.5">
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={tempRate}
                          onChange={(e) => setTempRate(Number(e.target.value))}
                          autoFocus
                          className="w-14 text-2xl font-black text-[#1a5d1a] bg-white border border-[#1a5d1a]/40 rounded-md px-2 py-0.5 outline-none focus:ring-2 focus:ring-[#1a5d1a]/40"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setCommissionRate(tempRate);
                              setIsEditingRate(false);
                              toast.success(`Commission rate updated to ${tempRate}%`);
                            } else if (e.key === 'Escape') {
                              setTempRate(commissionRate);
                              setIsEditingRate(false);
                            }
                          }}
                        />
                        <span className="text-2xl font-black text-[#1a5d1a]">%</span>
                      </div>
                    ) : (
                      <div
                        className="text-2xl font-black text-[#1a5d1a] cursor-pointer flex items-center gap-1.5 group/rate mt-0.5"
                        onClick={() => { setTempRate(commissionRate); setIsEditingRate(true); }}
                      >
                        {commissionRate}%
                        <Pencil className="h-3 w-3 text-[#1a5d1a]/60 opacity-0 group-hover/rate:opacity-100 transition-opacity" />
                      </div>
                    )}
                </div>
                <button
                  onClick={() => {
                    if (isEditingRate) {
                      setCommissionRate(tempRate);
                      setIsEditingRate(false);
                      toast.success(`Commission rate updated to ${tempRate}%`);
                    } else {
                      setTempRate(commissionRate);
                      setIsEditingRate(true);
                    }
                  }}
                  className="text-xs font-bold bg-[#1a5d1a] text-white px-4 py-2.5 rounded-xl hover:bg-green-900 transition-all shadow-lg shadow-green-800/15 cursor-pointer"
                >
                  {isEditingRate ? 'Save' : 'Update Rules'}
                </button>
            </div>
         </div>

         {/* Financial Summary */}
         <div className="bg-white p-6 rounded-3xl border border-gray-100/80 shadow-sm">
            <h4 className="font-bold text-gray-900 text-sm mb-4 bg-gradient-to-r from-gray-100 to-gray-50 -mx-6 -mt-6 px-6 py-4 rounded-t-3xl border-b border-gray-100/50">Financial Summary</h4>
            <div className="space-y-3 mt-3">
              <div className="flex justify-between items-center text-sm p-3.5 bg-gray-50/80 rounded-xl">
                <span className="text-gray-500 font-medium text-xs">Total processed volume</span>
                <span className="font-bold text-gray-900">{formatCurrency(totalVolume)}</span>
              </div>
              <div className="flex justify-between items-center text-sm p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-100/50">
                <span className="text-emerald-700 font-medium text-xs">Platform earnings ({commissionRate}%)</span>
                <span className="font-bold text-emerald-700">+ {formatCurrency(platformEarnings)}</span>
              </div>
              <div className="flex justify-between items-center text-sm p-3.5 bg-amber-50/50 rounded-xl border border-amber-100/50">
                <span className="text-amber-700 font-medium text-xs">Priest earnings ({100 - commissionRate}%)</span>
                <span className="font-bold text-amber-700">{formatCurrency(priestEarnings)}</span>
              </div>
            </div>
         </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Finance Overview</h1>
          <p className="text-gray-400 mt-1.5 font-medium text-sm">Track payments, commissions, and priest payouts.</p>
        </div>
        
        {activeTab !== "commission" && (
          <button 
            onClick={exportReport}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group cursor-pointer"
          >
            <Download className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
            <span className="group-hover:text-emerald-700 transition-colors">Export Report</span>
          </button>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((card) => (
          <div key={card.title} className={`bg-gradient-to-br ${card.gradient} p-5 rounded-3xl border ${card.borderColor} shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300`}>
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/30 rounded-full blur-2xl"></div>
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">{card.title}</p>
                <h3 className="text-2xl font-black text-gray-900">{card.value}</h3>
                {card.trend && (
                  <span className={cn("inline-flex items-center gap-1 mt-2 text-[11px] font-bold px-2 py-0.5 rounded-full", card.trendColor)}>
                    <TrendingUp className="h-3 w-3" /> {card.trend}
                  </span>
                )}
              </div>
              <div className={cn("p-3 rounded-2xl", card.iconBg)}>
                <card.icon className={cn("h-5 w-5", card.iconColor)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs & Content */}
      <div className="flex flex-col space-y-6">
         <div className="flex items-center gap-4">
          {[
            { key: "incoming", label: "Incoming Payments" },
            { key: "payouts", label: "Priest Payouts" },
            { key: "commission", label: "Commission Summary" },
          ].map((tab) => (
            <button 
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                "px-6 py-2 text-sm font-bold rounded-full border transition-all duration-300 cursor-pointer",
                activeTab === tab.key 
                  ? "bg-[#1a5d1a] text-white border-[#1a5d1a] shadow-md" 
                  : "bg-white text-[#1a5d1a] border-[#1a5d1a] hover:bg-[#1a5d1a]/10"
              )}
              style={{ boxShadow: activeTab === tab.key ? '0 2px 12px 0 #1a5d1a22' : undefined }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          {activeTab === "incoming" && renderIncoming()}
          {activeTab === "payouts" && renderPayouts()}
          {activeTab === "commission" && renderCommission()}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setSelectedItem(null)}>
           <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="px-6 pt-6 pb-3 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                    <Receipt className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Transaction Details</h3>
                </div>
                <button onClick={() => setSelectedItem(null)} className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>
              
              <div className="px-6 pb-6 space-y-4">
                {/* Amount highlight */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100/50">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Amount</p>
                      <p className="text-2xl font-black text-gray-900">₹{selectedItem.amount.toLocaleString()}</p>
                    </div>
                    <StatusBadge status={selectedItem.status} />
                </div>
                
                {/* Info rows */}
                <div className="space-y-0 bg-gray-50/50 rounded-2xl overflow-hidden border border-gray-100/50">
                  <div className="flex justify-between p-3.5 border-b border-gray-100/80">
                    <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">ID</span>
                    <span className="text-gray-900 text-xs font-mono font-bold">{selectedItem.id}</span>
                  </div>
                  <div className="flex justify-between p-3.5 border-b border-gray-100/80">
                    <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Date</span>
                    <span className="text-gray-900 text-xs font-bold">{selectedItem.date}</span>
                  </div>
                  {'user' in selectedItem && (
                    <div className="flex justify-between p-3.5 border-b border-gray-100/80">
                      <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Customer</span>
                      <span className="text-gray-900 text-xs font-bold">{(selectedItem as Transaction).user}</span>
                    </div>
                  )}
                  {'method' in selectedItem && (
                    <div className="flex justify-between p-3.5">
                      <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Method</span>
                      <span className="text-gray-900 text-xs font-bold flex items-center gap-1.5">
                        {methodIcon((selectedItem as Transaction).method)}
                        {(selectedItem as Transaction).method}
                      </span>
                    </div>
                  )}
                  {'priest' in selectedItem && (
                    <div className="flex justify-between p-3.5">
                      <span className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Priest</span>
                      <span className="text-gray-900 text-xs font-bold">{(selectedItem as Payout).priest}</span>
                    </div>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-3 pt-1">
                  <button 
                    onClick={() => {
                      const receiptData = [
                        { Field: 'Transaction ID', Value: selectedItem.id },
                        { Field: 'Amount', Value: `Rs. ${selectedItem.amount.toLocaleString()}` },
                        { Field: 'Date', Value: selectedItem.date },
                        { Field: 'Status', Value: selectedItem.status },
                        ...('user' in selectedItem ? [{ Field: 'Customer', Value: (selectedItem as Transaction).user }] : []),
                        ...('method' in selectedItem ? [{ Field: 'Method', Value: (selectedItem as Transaction).method }] : []),
                        ...('priest' in selectedItem ? [{ Field: 'Priest', Value: (selectedItem as Payout).priest }] : []),
                      ];
                      const ws = XLSX.utils.json_to_sheet(receiptData);
                      const wb = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(wb, ws, 'Receipt');
                      XLSX.writeFile(wb, `receipt_${selectedItem.id}.xlsx`);
                      toast.success('Receipt downloaded successfully');
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all text-xs cursor-pointer group"
                  >
                    <Download className="h-3.5 w-3.5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                    Receipt
                  </button>
                  <button 
                    onClick={() => setSelectedItem(null)} 
                    className="flex-1 py-2.5 rounded-xl bg-gray-900 font-bold text-white hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10 text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}