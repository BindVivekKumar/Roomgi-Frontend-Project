import { useState } from "react";
import {
    TrendingUp, Calendar, Wallet, Search,
    Plus, ArrowUpRight, ChevronRight, LogIn, LogOut
} from "lucide-react";
import { useGetRevenueDetailsQuery } from "../../backend-routes/ownerroutes/payments";
import { useNavigate } from "react-router-dom";

export default function Payments() {
    const navigate = useNavigate();
    const currentDate = new Date();

    const [dateAndYear, setDateAndYear] = useState({
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
    });

    const { data, isLoading } = useGetRevenueDetailsQuery(dateAndYear);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency', currency: 'INR', maximumFractionDigits: 0
        }).format(amount || 0);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-800">

            {/* HEADER */}
            <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                        Occupancy & Revenue
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm md:text-base">
                        Real-time property performance overview.
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white/70 backdrop-blur-xl border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm hover:shadow-md transition-all">

                    {/* Icon */}
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600">
                        <Calendar size={18} />
                    </div>

                    {/* Month */}
                    <select
                        className="text-sm font-semibold bg-transparent outline-none text-slate-700 cursor-pointer hover:text-indigo-600 transition"
                        value={dateAndYear.month}
                        onChange={(e) => setDateAndYear(p => ({ ...p, month: Number(e.target.value) }))}
                    >
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                            <option key={i} value={i + 1}>{m}</option>
                        ))}
                    </select>

                    {/* Divider */}
                    <div className="h-5 w-px bg-slate-200"></div>

                    {/* Year */}
                    <select
                        className="text-sm font-semibold bg-transparent outline-none text-slate-700 cursor-pointer hover:text-indigo-600 transition"
                        value={dateAndYear.year}
                        onChange={(e) => setDateAndYear(p => ({ ...p, year: Number(e.target.value) }))}
                    >
                        {[2024, 2025, 2026].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>

                </div>
            </div>

            {/* STATS */}
            <div className="max-w-7xl mx-auto grid grid-cols-3 gap-3 md:gap-6 mb-10">

                {/* Revenue */}
                <div className="bg-white p-4 md:p-6 rounded-2xl border shadow-sm">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-2">
                        <Wallet size={18} />
                    </div>
                    <p className="text-slate-500 text-xs md:text-sm font-medium uppercase tracking-wide">
                        Revenue
                    </p>
                    <h2 className="text-lg md:text-3xl font-bold text-slate-900 mt-1">
                        {formatCurrency(data?.income)}
                    </h2>
                </div>

                {/* Checkins */}
                <div className="bg-white p-4 md:p-6 rounded-2xl border shadow-sm">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-2">
                        <LogIn size={18} />
                    </div>
                    <p className="text-slate-500 text-xs md:text-sm font-medium uppercase tracking-wide">
                        Check-ins
                    </p>
                    <h2 className="text-lg md:text-3xl font-bold text-slate-900 mt-1">
                        {data?.totalCheckins || 0}
                    </h2>
                </div>

                {/* Checkouts */}
                <div className="bg-white p-4 md:p-6 rounded-2xl border shadow-sm">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-xl w-fit mb-2">
                        <LogOut size={18} />
                    </div>
                    <p className="text-slate-500 text-xs md:text-sm font-medium uppercase tracking-wide">
                        Check-outs
                    </p>
                    <h2 className="text-lg md:text-3xl font-bold text-slate-900 mt-1">
                        {data?.totalCheckouts || 0}
                    </h2>
                </div>
            </div>

            {/* TABLE */}
            <div className="max-w-7xl mx-auto bg-white rounded-2xl border shadow-sm overflow-hidden">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-4 border-b gap-4">
                    <h3 className="font-semibold text-slate-800 text-lg">
                        Transaction History
                    </h3>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search tenant..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Tenant</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Branch</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Date</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {data?.allPayments?.map((p) => (
                                <tr key={p._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {p?.tenantId?.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {p?.branch?.name}
                                    </td>
                                    <td className="px-6 py-4 font-semibold">
                                        {formatCurrency(p?.amountpaid)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${p?.tilldatestatus === "paid"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-rose-100 text-rose-600"
                                            }`}>
                                            {p?.tilldatestatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-500">
                                        {new Date(p.createdAt).toLocaleDateString('en-GB')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y">
                    {data?.allPayments?.map((p) => (
                        <div key={p._id} className="p-4">
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-semibold text-slate-900 text-base">
                                        {p?.tenantId?.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {p?.branch?.name}
                                    </p>
                                </div>
                                <p className="font-semibold text-slate-900">
                                    {formatCurrency(p?.amountpaid)}
                                </p>
                            </div>

                            <div className="flex justify-between mt-2">
                                <span className={`text-xs px-2 py-1 rounded ${p?.tilldatestatus === "paid"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-600"
                                    }`}>
                                    {p?.tilldatestatus}
                                </span>

                                <p className="text-xs text-slate-500">
                                    {new Date(p.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}