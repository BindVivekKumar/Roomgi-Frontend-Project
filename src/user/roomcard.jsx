import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, ArrowRight, ShieldCheck, Users } from "lucide-react";
import WishlistButton from "../user/wishlist.jsx";

/* ---------------- IMAGE OPTIMIZATION ---------------- */
const optimizeImg = (input) => {
  let url = Array.isArray(input) ? input[0] : input;
  if (typeof url !== "string") return "/room-placeholder.jpg";

  return url.replace(
    "/upload/",
    "/upload/f_auto,q_auto,w_500,c_fill,g_auto/"
  );
};

/* ---------------- RATING ---------------- */
const calculateRating = (reviews = []) => {
  if (!Array.isArray(reviews) || reviews.length === 0) return null;
  const total = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
  return (total / reviews.length).toFixed(1);
};

/* ---------------- SKELETON ---------------- */
const Skeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl border border-slate-100 p-3">
    <div className="bg-slate-200 aspect-[5/4] rounded-xl mb-3" />
    <div className="h-4 bg-slate-200 rounded w-4/5 mb-2" />
    <div className="h-3 bg-slate-200 rounded w-3/5" />
  </div>
);

/* ---------------- CARD COMPONENT ---------------- */
const RoomCard = memo(function RoomCard({
  pgData = [],
  setIsAuthModalOpen,
  isLoading = false,
}) {
  const navigate = useNavigate();

  const goToDetail = useCallback(
    (id) => navigate(`/pg/${id}`),
    [navigate]
  );

  /* ---------- LOADING ---------- */
  if (isLoading) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8 px-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} />
        ))}
      </section>
    );
  }

  /* ---------- EMPTY ---------- */
  if (!pgData.length) {
    return (
      <p className="text-center text-slate-400 py-20">
        No properties found
      </p>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8 px-4">
      {pgData.map((room, index) => {
        const avgRating = calculateRating(room.personalreview);

        return (
          <article
            key={room._id}
            onClick={() => goToDetail(room._id)}
            className="group relative flex flex-col bg-white rounded-2xl border border-slate-100 
                       hover:border-green-200 hover:shadow-[0_15px_40px_rgba(34,197,94,0.08)] 
                       transition-all duration-500 overflow-hidden cursor-pointer active:scale-[0.98]"
          >
            {/* IMAGE */}
            <div className="relative aspect-[5/4] overflow-hidden">
              <img
                src={optimizeImg(room.roomImages || room.branch?.Propertyphoto?.[0])}
                alt={room.branch?.name || "Room"}
                loading={index < 2 ? "eager" : "lazy"}
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105`}
              />

              {/* VERIFIED */}
              <div className="absolute top-3 left-3 z-30 space-y-2">
                {room.verified && (
                  <div className="flex items-center gap-1.5 bg-emerald-500 text-white px-2 py-1 rounded-full text-[10px] font-bold">
                    <ShieldCheck size={12} />
                    VERIFIED
                  </div>
                )}
              </div>

              {/* WISHLIST */}
              <div
                className="absolute top-3 right-3 z-30"
                onClick={(e) => e.stopPropagation()}
              >
                <WishlistButton
                  pg={room}
                  onAuthOpen={() => setIsAuthModalOpen(true)}
                />
              </div>

              {/* RATING */}
              <div className="absolute bottom-3 right-3 bg-white px-2 py-1 rounded-lg flex items-center gap-1">
                <Star size={12} className="text-amber-500" fill="currentColor" />
                <span className="text-xs font-bold">
                  {avgRating || "New"}
                </span>
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-4 flex flex-col flex-grow">
              <span className="text-[10px] font-bold text-green-600 uppercase mb-1">
                {room.category || "PG"}
              </span>

              <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-1">
                {room.branch?.name}
              </h3>

              <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-2">
                <MapPin size={12} className="text-slate-400" />
                <span className="truncate">
                  {room.branch?.streetAdress} {room.branch?.locationName}, {room?.city}
                </span>
              </div>

              {/* AMENITIES */}
              <div className="flex items-center gap-2 mb-3">
                {room.type && (
                  <div className="flex items-center gap-1 text-xs font-semibold bg-slate-50 px-2 py-1 rounded-lg">
                    <Users size={12} />
                    {room.type}
                  </div>
                )}

                <span className="text-xs text-slate-400">
                  {room.furnishedType || "Furnished"}
                </span>
              </div>

              {/* PRICE + BUTTON */}
              <div className="mt-auto pt-3 border-t flex justify-between items-center gap-3">
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">
                    Monthly
                  </p>

                  <p className="text-sm font-black text-gray-900">
                    ₹{room.category==="Pg" ||room.category==="Rented-Room"? room.price : room.base_price}
                    <span className="text-[10px] text-gray-500">/mo</span>
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToDetail(room._id);
                  }}
                  className="flex-grow bg-slate-900 text-white py-2.5 rounded-xl font-bold text-sm 
                             hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                >
                  View
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
});

export default RoomCard;