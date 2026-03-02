"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ApiService } from '@/lib/services/api.service';
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
  Wallet,
  PiggyBank,
  CreditCard,
  Banknote,
  Smartphone,
  Globe
} from "lucide-react";
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

interface PriestEarning {
  priest_name: string;
  total_amount: number;
}

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

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<"incoming" | "payouts" | "priest-earnings">("incoming");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [errorTransactions, setErrorTransactions] = useState<string | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [selectedItem, setSelectedItem] = useState<Transaction | Payout | null>(null);
  const [summary, setSummary] = useState<{ totalRevenue: number; priestEarnings: number; platformCommission?: number } | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [errorSummary, setErrorSummary] = useState<string | null>(null);
  const [priestEarnings, setPriestEarnings] = useState<PriestEarning[]>([]);
  const [loadingPriestEarnings, setLoadingPriestEarnings] = useState(true);
  const [errorPriestEarnings, setErrorPriestEarnings] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Fetch summary
  useEffect(() => {
    async function fetchSummary() {
      setLoadingSummary(true);
      setErrorSummary(null);
      try {
        const headers = await ApiService.getAuthHeaders();
        const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
        const res = await fetch(`/api/admin/finance/summary`, {
          headers: {
            ...headers,
            ...(adminToken ? { 'x-admin-token': adminToken } : {}),
          }
        });
        if (!res.ok) throw new Error('Failed to fetch finance summary');
        const data = await res.json();
        setSummary(data);
      } catch (e: any) {
        setErrorSummary(e.message || 'Failed to load summary');
      } finally {
        setLoadingSummary(false);
      }
    }
    fetchSummary();
  }, []);

  // Fetch incoming payments (transactions)
  useEffect(() => {
    async function fetchTransactions() {
      setLoadingTransactions(true);
      setErrorTransactions(null);
      try {
        const headers = await ApiService.getAuthHeaders();
        const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
        const res = await fetch(`/api/admin/finance/incoming-payments?limit=20`, {
          method: 'GET',
          headers: {
            ...headers,
            ...(adminToken ? { 'x-admin-token': adminToken } : {}),
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          if (res.status === 401) throw new Error('Unauthorized: Please login as admin');
          throw new Error('Failed to fetch incoming payments');
        }
        const data = await res.json();
        const txns: Transaction[] = (data.orders || []).map((order: any) => ({
          id: order.transaction_id,
          user: order.customer,
          amount: order.amount,
          date: order.date,
          method: order.method,
          status: order.status as PaymentStatus,
        }));
        setTransactions(txns);
      } catch (e: any) {
        setErrorTransactions(e.message || 'Failed to load incoming payments');
      } finally {
        setLoadingTransactions(false);
      }
    }
    fetchTransactions();
  }, []);

  // Priest earnings
  useEffect(() => {
    async function fetchPriestEarnings() {
      setLoadingPriestEarnings(true);
      setErrorPriestEarnings(null);
      try {
        const headers = await ApiService.getAuthHeaders();
        const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
        const res = await fetch(`/api/admin/finance/priest-earnings`, {
          headers: {
            ...headers,
            ...(adminToken ? { 'x-admin-token': adminToken } : {}),
          }
        });
        if (!res.ok) throw new Error('Failed to fetch priest earnings');
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.earnings || []);
        const mapped: PriestEarning[] = (list || []).map((item: any) => ({
          priest_name: item.priest_name || item.priest || item.name || 'Unknown',
          total_amount: Number(item.total_amount ?? item.amount ?? 0),
        }));
        setPriestEarnings(mapped);
      } catch (e: any) {
        setErrorPriestEarnings(e.message || 'Failed to load priest earnings');
      } finally {
        setLoadingPriestEarnings(false);
      }
    }
    fetchPriestEarnings();
  }, []);

  const handleApprovePayout = (id: string) => {
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: "Processed" } : p));
    toast.success(`Payout ${id} approved successfully`);
  };

  const handleRejectPayout = (id: string) => {
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: "Rejected" } : p));
    toast.error(`Payout ${id} rejected`);
  };

  const exportReport = () => {
    const data = activeTab === "incoming"
      ? transactions
      : activeTab === "payouts"
        ? payouts
        : priestEarnings;
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `finance_report_${activeTab}_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success("Report exported successfully");
  };

  const priestEarningsTotal = useMemo(() => {
    return priestEarnings.reduce((sum, item) => sum + (item.total_amount || 0), 0);
  }, [priestEarnings]);

  const statCards = summary ? [
    {
      title: "Total Revenue",
      value: formatCurrency(summary.totalRevenue),
      trend: null,
      icon: IndianRupee,
      gradient: "from-emerald-50 to-green-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      trendColor: "text-emerald-600 bg-emerald-50",
      borderColor: "border-emerald-100",
    },
    {
      title: "Platform Commission",
      value: summary.platformCommission !== undefined ? formatCurrency(summary.platformCommission) : "₹0",
      trend: null,
      icon: PiggyBank,
      gradient: "from-amber-50 to-yellow-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      trendColor: "text-amber-600 bg-amber-50",
      borderColor: "border-amber-100",
    },
    {
      title: "Priest Earnings",
      value: formatCurrency(priestEarningsTotal),
      trend: null,
      icon: Wallet,
      gradient: "from-violet-50 to-purple-50",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      trendColor: "",
      borderColor: "border-violet-100",
    },
  ] : [];

  const renderIncoming = () => (
    <div className="bg-white rounded-3xl border border-gray-100/80 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="overflow-x-auto">
        {loadingTransactions ? (
          <div className="text-center py-8 text-gray-400 text-lg font-semibold">Loading payments...</div>
        ) : errorTransactions ? (
          <div className="text-center py-8 text-red-500 text-lg font-semibold">{errorTransactions}</div>
        ) : (
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
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gradient-to-r hover:from-green-50/30 hover:to-transparent transition-all duration-200 group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">{txn.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center text-[11px] font-bold text-emerald-700">
                        {txn.user?.split(' ').map((n: string) => n[0]).join('')}
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
        )}
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

  const renderPriestEarnings = () => (
    <div className="bg-white rounded-3xl border border-gray-100/80 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="overflow-x-auto">
        {loadingPriestEarnings ? (
          <div className="text-center py-8 text-gray-400 text-lg font-semibold">Loading priest earnings...</div>
        ) : errorPriestEarnings ? (
          <div className="text-center py-8 text-red-500 text-lg font-semibold">{errorPriestEarnings}</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-50/50">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Priest</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Total Donation Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {priestEarnings.map((item, idx) => (
                <tr key={`${item.priest_name}-${idx}`} className="hover:bg-gradient-to-r hover:from-violet-50/30 hover:to-transparent transition-all duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-100 to-purple-50 flex items-center justify-center text-[11px] font-bold text-violet-700">
                        {item.priest_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-semibold text-gray-800">{item.priest_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">₹{item.total_amount.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Finance Overview</h1>
          <p className="text-gray-400 mt-1.5 font-medium text-sm">Track payments, commissions, and priest payouts.</p>
        </div>
        {activeTab !== "priest-earnings" && (
          <button 
            onClick={exportReport}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group cursor-pointer"
          >
            <Download className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
            <span className="group-hover:text-emerald-700 transition-colors">Export Report</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loadingSummary ? (
          <div className="col-span-3 text-center py-8 text-gray-400 text-lg font-semibold">Loading summary...</div>
        ) : errorSummary ? (
          <div className="col-span-3 text-center py-8 text-red-500 text-lg font-semibold">{errorSummary}</div>
        ) : (
          statCards.map((card) => (
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
          ))
        )}
      </div>

      <div className="flex flex-col space-y-6">
        <div className="flex items-center gap-4">
          {[
            { key: "incoming", label: "Incoming Payments" },
            { key: "payouts", label: "Priest Payouts" },
            { key: "priest-earnings", label: "Priest Earnings" },
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
          {activeTab === "priest-earnings" && renderPriestEarnings()}
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setSelectedItem(null)}>
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden" onClick={(e) => e.stopPropagation()}>
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
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100/50">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Amount</p>
                  <p className="text-2xl font-black text-gray-900">₹{selectedItem.amount.toLocaleString()}</p>
                </div>
                <StatusBadge status={selectedItem.status} />
              </div>
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
