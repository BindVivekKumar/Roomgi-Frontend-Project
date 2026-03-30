import React, { useState, useMemo, useCallback } from "react";
import axios from "axios";
import sharePG from "./component/sharepg"
import {
    Phone, Navigation, Share2, CalendarIcon, Users, Minus, Plus,
    Shield, CheckCircle, X, Info
} from "lucide-react";
import Calendar from "react-calendar";
import { toast } from "react-hot-toast";

// --- REUSABLE SCALABLE COMPONENTS ---

// Subtle Card Wrapper
const Card = ({ children, className = "" }) => (
    <div className={`bg-white border border-slate-200 rounded-3xl overflow-hidden transition-all duration-300 ${className}`}>
        {children}
    </div>
);

const CounterButton = ({ onClick, children, variant = "default" }) => (
    <button
        onClick={onClick}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95 ${variant === "plus"
            ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-orange-500/30 hover:scale-105"
            : "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-orange-100 hover:to-pink-100 border-2 border-gray-300 hover:border-orange-400 text-gray-700"
            }`}
    >
        {children}
    </button>
);

const PriceDisplay = ({ price, label, category }) => (
    <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900">₹{price?.toLocaleString()}</span>
            <span className="text-sm font-medium text-slate-500">/{category === "Hotel" ? "night" : "month"}</span>
        </div>
        <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Includes all taxes
        </p>
    </div>
);

const IconButton = ({ icon: Icon, label, onClick, variant = "secondary" }) => {
    const variants = {
        primary: "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-200",
        secondary: "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200",
        emerald: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200"
    };
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all active:scale-95 shadow-sm font-medium text-xs uppercase tracking-wider ${variants[variant]}`}
        >
            <Icon className="w-5 h-5" />
            {label}
        </button>
    );
};

const RightInformationdescription = ({ pg, N }) => {
    console.log(pg)

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [form, setForm] = useState({ checkIn: "", checkOut: "", adults: 1 });

    // Logical Hooks (Same as your logic but cleaned up)
    const today = useMemo(() => new Date(), []);
    const maxDate = useMemo(() => {
        const date = new Date();
        date.setMonth(date.getMonth() + 2);
        return date;
    }, []);
    const normalizeDate = (date) => new Date(date).setHours(0, 0, 0, 0);

    // ✅ Get dynamic price for a specific date
    const getPriceForDate = useCallback((date) => {
        const current = normalizeDate(date);

        const found = pg.dynamicPricing?.find(d => {
            const start = normalizeDate(d.startDate);
            const end = normalizeDate(d.endDate);
            return current >= start && current <= end;
        });

        return found ? Number(found.price) : Number(pg.base_price || pg.price || 0);
    }, [pg]);

    // ✅ Only return dynamic price (for calendar highlight)
    const getDynamicPrice = useCallback((date) => {
        const current = normalizeDate(date);

        const found = pg.dynamicPricing?.find(d => {
            const start = normalizeDate(d.startDate);
            const end = normalizeDate(d.endDate);
            return current >= start && current <= end;
        });

        return found ? Number(found.price) : null;
    }, [pg]);

    // ✅ Calculate total price
    const calculateTotalPrice = useCallback(() => {
        if (!form.checkIn || !form.checkOut) return 0;

        let total = 0;
        let current = new Date(form.checkIn);
        const end = new Date(form.checkOut);

        while (current < end) {
            total += getPriceForDate(current);
            current.setDate(current.getDate() + 1);
        }

        return total * form.adults;
    }, [form, getPriceForDate]);

    // ✅ Daily breakdown (IMPORTANT 🔥)
    const priceBreakdown = useMemo(() => {
        if (!form.checkIn || !form.checkOut) return [];

        let breakdown = [];
        let current = new Date(form.checkIn);
        const end = new Date(form.checkOut);

        while (current < end) {
            breakdown.push({
                date: new Date(current),
                price: getPriceForDate(current),
                isDynamic: getDynamicPrice(current) !== null
            });

            current.setDate(current.getDate() + 1);
        }

        return breakdown;
    }, [form, getPriceForDate, getDynamicPrice]);


    // const getPriceForDate = useCallback((date) => {
    //     const current = new Date(date);
    //     const found = pg.dynamicpricing?.find(d =>
    //         current >= new Date(d.startDate) && current <= new Date(d.endDate)
    //     );
    //     return found ? Number(found.price) : Number(pg.base_price || pg.price || 0);
    // }, [pg]);


    const totalAmount = useMemo(() => {
        if (pg.category === "Pg") {
            return ((pg.price || 0) + (pg.advancedmonth || 0)) * form.adults;
        }
        return calculateTotalPrice();
    }, [pg, form.adults, calculateTotalPrice]);

    const nightsCount = useMemo(() => {
        if (!form.checkIn || !form.checkOut) return 0;
        return Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / (1000 * 60 * 60 * 24));
    }, [form.checkIn, form.checkOut]);

    const handleSubmit = async () => {
        // Validation logic same as yours
        toast.loading("Processing your request...");
        // Axios call logic here...
    };

    return (
        <div className="mx-auto w-full max-w-md space-y-5 text-slate-900 antialiased">

            {/* ================= PRICE CARD ================= */}
            <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
                <div className="flex justify-between items-center">

                    <PriceDisplay
                        price={pg.base_price || pg.price}
                        category={pg.category}
                    />

                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                        {pg.category}
                    </span>

                </div>
            </div>

            {/* ================= DATE PICKER ================= */}
            {pg.category !== "Pg" && (
                <div
                    onClick={() => setIsCalendarOpen(true)}
                    className="rounded-2xl border border-slate-200 p-4 cursor-pointer hover:border-orange-400 transition bg-white"
                >
                    <p className="text-sm font-semibold text-slate-600 mb-2">
                        Select Dates
                    </p>

                    <div className="flex justify-between text-sm text-slate-700">
                        <span>{form.checkIn || "Check-in"}</span>
                        <span>{form.checkOut || "Check-out"}</span>
                    </div>
                </div>
            )}

            {/* ================= GUESTS ================= */}
            {pg.category !== "Pg" && (
                <div className="rounded-2xl bg-slate-50 p-4 flex items-center justify-between">

                    <span className="text-sm font-medium text-slate-700">Guests</span>

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() =>
                                setForm(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))
                            }
                            className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-lg"
                        >
                            -
                        </button>

                        <span className="font-bold text-lg">{form.adults}</span>

                        <button
                            onClick={() =>
                                setForm(p => ({ ...p, adults: p.adults + 1 }))
                            }
                            className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-lg"
                        >
                            +
                        </button>

                    </div>
                </div>
            )}

            {/* ================= PG BILLING ================= */}
            {pg.category === "Pg" && (
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">

                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Monthly Rent</span>
                        <span className="font-bold">₹{pg.price?.toLocaleString()}</span>
                    </div>

                    {pg.advancedmonth > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Security Deposit</span>
                            <span className="font-bold">₹{pg.advancedmonth?.toLocaleString()}</span>
                        </div>
                    )}

                    <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Total</span>
                        <span className="font-black text-orange-600">
                            ₹{totalAmount?.toLocaleString()}
                        </span>
                    </div>

                </div>
            )}

            {/* ================= TOTAL SUMMARY ================= */}
            {pg.category !== "Pg" && (
                <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5">

                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Amount</span>
                        <span className="text-xl font-black text-orange-600">
                            ₹{totalAmount.toLocaleString()}
                        </span>
                    </div>

                    {nightsCount > 0 && (
                        <p className="text-xs text-slate-500 mt-2">
                            {nightsCount} nights × {form.adults} guests
                        </p>
                    )}

                </div>
            )}

            {/* ================= CTA BUTTON ================= */}
            {pg.category !== "Pg" && (
                <button
                    onClick={handleSubmit}
                    disabled={totalAmount <= 0}
                    className="w-full py-4 rounded-2xl bg-orange-500 text-white font-bold text-lg hover:bg-orange-600 active:scale-95 transition disabled:opacity-50"
                >
                    Book Now • ₹{totalAmount.toLocaleString()}
                </button>
            )}

            {/* ================= ACTION BUTTONS ================= */}
            <div className="grid grid-cols-2 gap-2">

                <IconButton
                    icon={Phone}
                    label="WhatsApp"
                    variant="emerald"
                    onClick={() => {
                        const message = `Hello 👋 I saw your PG on Roomgi App. I’d like to know more about availability, rent, and facilities. Please share details 🙏`;
                        window.open(
                            `https://wa.me/${N}?text=${encodeURIComponent(message)}`,
                            "_blank",
                            "noopener,noreferrer"
                        );
                    }}
                />
                <IconButton
                    icon={Share2}
                    label="Share"
                    onClick={() => {
                        sharePG(pg);
                    }}
                />

            </div>

            {/* ================= TRUST BADGE ================= */}
            <div className="flex items-center justify-center gap-2 text-slate-400 py-2">
                <Shield className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                    Secure & Verified Property
                </span>
            </div>

            {/* ================= CALENDAR MODAL ================= */}
            {isCalendarOpen && (
                <div className="fixed inset-0 z-[100] bg-slate-900/60 flex items-end sm:items-center justify-center">

                    <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden">

                        <div className="p-4 flex justify-between border-b">
                            <h3 className="font-bold">Select Dates</h3>
                            <button onClick={() => setIsCalendarOpen(false)}>✕</button>
                        </div>

                        <div className="p-4">
<Calendar
  minDate={today}
  maxDate={maxDate}
  selectRange={true}
  className="custom-modern-calendar"

  // ✅ Always stay in month (date) view
  view="month"

  // ❌ Disable switching to year/decade view
  maxDetail="month"
  minDetail="month"

    showNeighboringMonth={false}

  onChange={(value) => {
    if (value[0] && value[1]) {
      setForm({
        ...form,
        checkIn: value[0].toISOString().split("T")[0],
        checkOut: value[1].toISOString().split("T")[0],
      });
    }
  }}

  // ❌ Remove navigation to jump months/years fast
  prev2Label={null}
  next2Label={null}

  // Optional: remove top label click (extra safety)
  navigationLabel={({ date }) => (
    <span className="font-bold">
      {date.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
    </span>
  )}

  tileClassName={({ date }) => {
    const price = getDynamicPrice(date);
    return `relative transition-all active:scale-90 ${
      price ? "has-dynamic-price" : ""
    }`;
  }}

  tileContent={({ date }) => {
    const price = getDynamicPrice(date);
    return price ? (
      <div className="price-tag">₹{price}</div>
    ) : null;
  }}
/>              </div>

                        <div className="p-4 bg-slate-50">
                            <button
                                onClick={() => setIsCalendarOpen(false)}
                                className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold"
                            >
                                Confirm Dates
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default RightInformationdescription;