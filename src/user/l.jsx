import React from "react";
import {
  Check,
  X,
  Bed,
  Wifi,
  Snowflake,
  ParkingCircle,
  Utensils,   // 🔥 Restaurant replacement
  Waves,      // 🔥 Pool replacement
  Dumbbell,
  Tv,
  Microwave,
  Coffee, Shield,
  MapPin,
  Star
} from "lucide-react";
/* =========================
   OYO PREMIUM BLOCK
========================= */
const CardBlock = ({ title, icon: Icon, children, className = "" }) => (
  <div className="group relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:shadow-orange-500/20 border border-orange-100/50 hover:border-orange-200/70 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
    {/* Gradient top bar */}
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 shadow-lg" />

    {/* Icon header */}
    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-orange-100/50">
      {Icon && <Icon className="w-7 h-7 text-orange-500 shadow-lg p-2 bg-orange-50/50 rounded-2xl group-hover:scale-110 transition-transform" />}
      <h3 className="text-xl font-black bg-gradient-to-r from-gray-900 via-orange-800 to-pink-600 bg-clip-text tracking-tight">
        {title}
      </h3>
    </div>

    <div className={className}>
      {children}
    </div>
  </div>
);

/* =========================
   PREMIUM INFO ITEM
========================= */
const InfoItem = ({ label, value, icon: Icon }) => {
  return (
    <div className="flex items-center gap-3 p-3 w-full rounded-xl bg-slate-50 border border-slate-100 hover:border-orange-200 transition">

      {Icon && (
        <Icon className="w-4 h-4 text-orange-500 flex-shrink-0" />
      )}

      <div className="min-w-0 w-full">
        <p className="text-[10px] font-bold text-slate-500 uppercase">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-900 truncate">
          {value || "—"}
        </p>
      </div>

    </div>
  );
};
/* =========================
   FACILITY TAG
========================= */
const FacilityTag = ({ icon: Icon, label, available = true }) => (
  <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-300 group hover:scale-105 hover:shadow-md ${available
      ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 border border-emerald-200 hover:from-emerald-200 hover:to-emerald-100'
      : 'bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 opacity-70 hover:opacity-90'
    }`}>
    {Icon ? (
      <Icon className={`w-5 h-5 flex-shrink-0 ${available ? 'text-emerald-600 shadow-md' : 'text-gray-500'}`} />
    ) : (
      <Check className={`w-5 h-5 flex-shrink-0 ${available ? 'text-emerald-600' : 'text-gray-500'}`} />
    )}
    <span className={`font-semibold text-sm tracking-wide ${available ? 'text-emerald-800' : 'text-gray-600'}`}>
      {label}
    </span>
  </div>
);

/* =========================
   MAIN OYO COMPONENT
========================= */
const LeftInformationdescription = ({ pg }) => {
  if (!pg) return null;

  return (
    <div className="lg:col-span-2 space-y-6">

      {/* ================= OYO PROPERTY HEADER ================= */}
    <div className="relative p-5">    <div className="absolute -top-4 left-4">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-2xl shadow-xl font-bold text-sm tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4 fill-current" />
            Roomgi Verified Property
          </div>
        </div>

      <div className="relative p-5">

  {/* HEADER */}
  <div className="mb-5">
    <h2 className="text-lg font-black text-orange-600">
      Room Details
    </h2>
  </div>

  {/* GRID INSIDE ONE CARD */}
  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">

    <InfoItem label="Category" value={pg.category} icon={Bed} />
    <InfoItem label="Room No." value={pg.roomNumber} icon={Bed} />

    <InfoItem
      label="Room Type"
      value={pg.category === "Hotel" ? pg.room_type : pg.type}
      icon={Bed}
    />

    <InfoItem
      label="Furnishing"
      value={pg.furnishedType || "Unfurnished"}
      icon={Coffee}
    />

  </div>
</div>
      </div>

      {/* ================= DESCRIPTION ================= */}
      {pg.description && (
        <CardBlock title="About This Stay" icon={MapPin}>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed text-base bg-gradient-to-r from-white/80 to-orange-50/50 backdrop-blur-sm p-6 rounded-2xl border border-orange-100/30 shadow-inner">
              {pg.description}
            </p>
          </div>
        </CardBlock>
      )}

      {/* ================= FACILITIES ================= */}
      {pg.facilities?.length > 0 && (
        <CardBlock title="What's Included" icon={Check}>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {pg.facilities.map((item, i) => (
              <FacilityTag
                key={i}
                label={item}
                icon={getFacilityIcon(item)}
              />
            ))}
          </div>
        </CardBlock>
      )}

      {/* ================= HOUSE RULES ================= */}
      {pg.rules?.length > 0 && (
        <CardBlock title="House Rules" icon={Shield}>
          <div className="space-y-3">
            {pg.rules.map((rule, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50/70 to-indigo-50/50 rounded-2xl border border-blue-200/50 hover:shadow-md transition-all group">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-2 flex-shrink-0 animate-pulse" />
                <p className="text-sm text-gray-700 leading-relaxed flex-1 group-hover:text-blue-800 transition-colors">
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </CardBlock>
      )}

      {/* ================= NOT ALLOWED ================= */}
      {pg.notAllowed?.length > 0 && (
        <CardBlock title="Not Permitted" icon={X}>
          <div className="space-y-3">
            {pg.notAllowed.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50/70 to-rose-50/50 rounded-2xl border border-red-200/50 hover:shadow-md transition-all group">
                <X className="w-5 h-5 text-red-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <p className="text-sm text-gray-700 leading-relaxed flex-1 group-hover:text-red-800 transition-colors">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </CardBlock>
      )}

      {/* ================= LOCATION INFO ================= */}
      {pg.location && (
        <CardBlock title="Location Perks" icon={MapPin}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              label="Distance from City Center"
              value={`${pg.location.distance || '2.5'} km`}
              className="col-span-full"
            />
            <InfoItem
              label="Nearest Airport"
              value={pg.location.airport || 'DEL - 18 km'}
            />
            <InfoItem
              label="Nearest Metro"
              value={pg.location.metro || 'Blue Line - 1.2 km'}
            />
            <InfoItem
              label="Popular Landmark"
              value={pg.location.landmark || 'India Gate - 3 km'}
            />
          </div>
        </CardBlock>
      )}
    </div>
  );
};

// 🔥 FACILITY ICON MAPPER
const getFacilityIcon = (facility) => {
  const icons = {
    WiFi: Wifi,
    AC: Snowflake,
    Parking: ParkingCircle,
    Food: Utensils,     // 🔥 Restaurant → Utensils
    Pool: Waves,        // 🔥 Pool → Waves
    Gym: Dumbbell,
    TV: Tv,
    Microwave: Microwave,
    Coffee: Coffee,
    //   Laundry: Shirt      // 🔥 Laundry replacement
  };
  return icons[facility] || null;
};

export default LeftInformationdescription;