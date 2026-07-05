import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchPage from "./search.jsx"
import {
  Search, MapPin, ShieldCheck, CreditCard, Zap,
  ArrowRight, Star, Users,
} from "lucide-react";
import { useSelector } from "react-redux"
import AuthModal from "../user/AuthModal";
import ROOMCARD from "../user/roomcard";
import LandingPageSkeleton from "./loader/landingpageskeleton";
import { useGetAllListedPgQuery, useGetAllhotelsroomQuery } from "../backend-routes/userroutes/allpg.js";
import { useGetWishlistQuery } from "../backend-routes/userroutes/authapi";

import Ads1 from "../assets/ads1.png";
import Ads2 from "../assets/ads2.png";
import Ads3 from "../assets/ads3.png";
import Ads4 from "../assets/ads4.png";


export default function LandingPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();


  const [userLocation, setUserLocation] = useState({
    lat: null,
    lng: null,
  });
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("Location permission denied");
        // fallback → random verified PGs will load
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }, []);


  const slides = [
    { type: "stats" },

    {
      image: Ads1,
      path: "/login",
    },

    {
      image: Ads2,
      path: "/login",
    },

    {
      image: Ads3,
      path: "/internshipviahackathons",
    },

    {
      image: Ads4,
      path: "/login",
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const category = searchParams.get("category") || "Pg";




  const { data: pgApiData, isLoading: pgLoading, error: pgError } =
    useGetAllListedPgQuery(
      userLocation.lat && userLocation.lng
        ? {
          lat: userLocation.lat,
          lng: userLocation.lng,
          category: category,
        }
        : {
          category: category,
        }
    );

  // const { data: pgApiData, isLoading: pgLoading, error: pgError } = useGetAllhotelsroomQuery();

  const { data: wishlistData, isLoading: wishlistLoading } = useGetWishlistQuery();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Optimized state management
  const [pgData, setPgData] = useState([]);


  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");


  /* ---------------- PERFORMANCE OPTIMIZED EFFECTS ---------------- */
  useEffect(() => {
    if (pgApiData?.hotelroom) {
      setPgData(pgApiData.hotelroom);
    }
    else if (pgApiData?.allrooms) {
      setPgData(pgApiData.allrooms);
    }
  }, [pgApiData]);
  const filterOptions = [
    { key: "owner", label: "property Registered", count: pgApiData?.property || 0 },
    { key: "All", label: "All Stays", count: pgApiData?.count || 0 },
    { key: "Newest", label: "Newest", count: pgData.filter(p => p.createdAt > Date.now() - 30 * 24 * 60 * 60 * 1000).length },

  ];

  // SEO Optimized Meta Tags
  useEffect(() => {
    const title = "RoomGi - Premium PG & Rooms Without Brokerage | Verified Stays";
    const description = "Discover verified PGs, rooms & shared accommodations with Minimum charges. High-speed WiFi, modern amenities, instant booking. Live better, pay less.";

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    return () => {
      document.title = "RoomGi - Find Your Perfect Stay";
    };
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 font-inter selection:bg-indigo-100/60">
      {/* Structured Data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "RoomGi",
          "url": "https://roomgi.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://roomgi.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })
      }} />
      <SearchPage />
      {/* Trust Signals Section */}
      <section
        aria-labelledby="trust-section-title"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28"
      >
        <h2 id="trust-section-title" className="sr-only">
          Why Choose RoomGi
        </h2>

        {/* Feature Cards */}
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 mb-16 sm:mb-20">
          {[
            {
              icon: ShieldCheck,
              title: "100% Verified",
              desc: "Every property undergoes a 25-point physical inspection",
              stat: "10K+",
              gradient: "from-indigo-500 to-indigo-600",
              text: "text-indigo-500",
            },
            {
              icon: CreditCard,
              title: "Free property listing",
              desc: "Direct owner deals, save ₹15K–30K instantly",
              stat: "100%",
              gradient: "from-emerald-500 to-emerald-600",
              text: "text-emerald-500",
            },
            {
              icon: Zap,
              title: "Instant Booking",
              desc: "Book & move in within 24 hours",
              stat: "24 hrs",
              gradient: "from-amber-500 to-amber-600",
              text: "text-amber-500",
            },
          ].map((feature, i) => (
            <article
              key={i}
              className={`group relative bg-white/90  p-1.5 sm:p-10 rounded-2xl sm:rounded-3xl border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 ${i === 1 ? "ring-2 ring-emerald-100/60" : ""
                }`}
            >
              {/* Decorative Index - Mobile par size chotta kiya (text-2xl) */}
              <span
                aria-hidden="true"
                className={`absolute top-3 right-3 sm:top-4 sm:right-4 text-2xl sm:text-4xl font-black opacity-[0.06] ${feature.text}`}
              >
                0{i + 1}
              </span>

              {/* Icon Container - Mobile par size w-12 h-12 */}
              <div
                className={`w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br ${feature.gradient} text-white rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg transition-transform duration-300 group-hover:scale-105`}
              >
                <feature.icon className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>

              {/* Title - Mobile par text-lg, Desktop par text-2xl */}
              <h3 className="text-lg sm:text-2xl font-black text-slate-900 mb-1 sm:mb-3 group-hover:text-indigo-600 transition-colors">
                {feature.title}
              </h3>

              {/* Description - Mobile par text-sm aur line-clamp taaki height barabar rahe */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-2 sm:mb-6">
                {feature.desc}
              </p>

              {/* Stat Badge - Mobile par padding aur text chotta */}
              <span
                className=" absolute top-4 right-4 sm:static text-sm sm:text-lg font-black bg-gradient-to-r from-slate-900 to-slate-800 text-white px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl shadow-md "
              >
                {feature.stat}
              </span>
            </article>
          ))}
        </div>

        {/* Stats Row */}
        <div
          className="relative overflow-hidden 
  bg-slate-900 rounded-[2rem] sm:rounded-[3rem] shadow-2xl
  h-[240px] sm:h-[320px] md:h-[380px] lg:h-[420px]"
        >



          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out
${
  activeSlide === index
    ? "opacity-100 scale-100 z-10 pointer-events-auto"
    : "opacity-0 scale-[1.02] z-0 pointer-events-none"
}
`}
            >

              {/* ================= STATS SLIDE ================= */}
              {slide.type === "stats" && (
                <>
                  {/* Background glows */}
                  <div className="absolute top-0 -left-16 sm:-left-20 w-48 sm:w-64 h-48 sm:h-64 bg-indigo-500/20 rounded-full blur-[90px]" />
                  <div className="absolute bottom-0 -right-16 sm:-right-20 w-48 sm:w-64 h-48 sm:h-64 bg-purple-500/20 rounded-full blur-[90px]" />

                  <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 w-full">
                    {[
                      { label: "Partner Cities", value: "4", suffix: "+", icon: MapPin, color: "text-indigo-400" },
                      { label: "Verified Properties", value: "1", suffix: "K+", icon: Star, color: "text-amber-400" },
                      { label: "Happy Residents", value: "5", suffix: "K+", icon: Users, color: "text-emerald-400" },
                    ].map((stat, i) => (
                      <div key={i} className="flex flex-col items-center text-center">

                        <div className="relative mb-4 sm:mb-6">
                          <div className={`absolute inset-0 blur-2xl opacity-20 ${stat.color.replace("text", "bg")}`} />
                          <stat.icon className={`w-8 h-8 sm:w-12 sm:h-12 ${stat.color}`} />
                        </div>

                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl sm:text-5xl lg:text-6xl font-black text-white">
                            {stat.value}
                          </span>
                          <span className={`text-xl sm:text-3xl font-black ${stat.color}`}>
                            {stat.suffix}
                          </span>
                        </div>

                        <p className="mt-2 text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ================= IMAGE SLIDE ================= */}
              {slide.type !== "stats" && (
                <div className="absolute inset-0 overflow-hidden rounded-[2rem] sm:rounded-[3rem]">

                  <div className="absolute inset-0 p-2 sm:p-3 md:p-4 lg:p-5">
 <div
  className="relative w-full h-full cursor-pointer"
 onClick={() => {
  console.log(slide.path);
  navigate(slide.path);
}}
>
  <img
    src={slide.image}
    alt="Sponsored Ad"
    className="block w-full h-full object-cover rounded-[2rem]"
  />
</div>
</div>
                  {/* Overlay */}
                  {/* <div className="absolute inset-0 bg-black/25" /> */}

                  {/* Badge */}
                  <span
                    className="absolute top-4 sm:top-6 left-4 sm:left-6 
      px-3 py-1.5 bg-white/20 backdrop-blur 
      text-white text-[10px] sm:text-xs font-bold 
      rounded-full"
                  >
                    Sponsered By Hack2Hire
                  </span>

                </div>
              )}





            </div>
          ))}
        </div>



  </section>

      {/* Featured Properties - SEO Optimized */}
      <section
        aria-labelledby="featured-properties-title"
        className="max-w-7xl mx-auto px-6 pb-24 sm:pb-32"
      >
        <header className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 sm:mb-20 gap-8">
          <div>
            <h2
              id="featured-properties-title"
              className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-transparent mb-6 leading-tight"
            >
              Featured{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Properties
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-lg">
              Handpicked premium stays • Verified quality • Ready to move-in
            </p>
          </div>

          {/* Filter Pills */}
          <nav
            aria-label="Property Filters"
            className="flex flex-wrap gap-3"
          >
            {filterOptions.map((option) => {
              const isActive = activeFilter === option.key;

              return (
                <div
                  key={option.key}
                  className={`flex items-center gap-2 px-5 sm:px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 shadow-sm cursor-default select-none
        ${isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-400/40"
                      : "bg-white text-slate-600 border border-slate-200"
                    }
      `}
                >
                  {option.label}

                  <span
                    className={`px-2 py-1 rounded-xl text-xs font-bold
          ${isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-700"
                      }
        `}
                  >
                    {option.count}
                  </span>
                </div>
              );
            })}
          </nav>
        </header>

        {/* Listings */}
        {pgData.length > 0 ? (
          <>
            {
              (pgLoading || wishlistLoading) ? <LandingPageSkeleton /> :
                <>
                  <ROOMCARD
                    pgData={pgData}
                    wishlistItems={wishlistData?.items || []}
                    setIsAuthModalOpen={setIsAuthModalOpen}
                  />
                </>
            }
          </>

        ) :
          (
            <div
              role="status"
              className="py-32 sm:py-40 text-center bg-gradient-to-br from-slate-50 to-indigo-50 rounded-4xl border-2 border-dashed border-indigo-200/50"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-4xl flex items-center justify-center mx-auto mb-10 sm:mb-12 shadow-2xl animate-pulse">
                <Search className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
              </div>

              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6">
                No matches found
              </h3>

              <p className="text-lg sm:text-xl text-slate-600 mb-10 sm:mb-12 max-w-lg mx-auto">
                Try adjusting your filters or search for popular cities like Mumbai,
                Bangalore, Gurgaon
              </p>

              <button
                onClick={() => navigate("/")}
                className="px-10 sm:px-12 py-5 sm:py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl font-black text-base sm:text-lg shadow-2xl hover:shadow-3xl transition-all"
              >
                Show All Properties
              </button>
            </div>
          )}
      </section>

      {/* CTA Section - Above the fold priority */}
      <section
        aria-labelledby="cta-title"
        className="relative w-full py-20 sm:py-28 overflow-hidden"
      >
        {/* Unified premium background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2B2F6C] via-[#6D6EEA] to-[#9B8CFF]" />

        {/* Soft top fade */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/20 to-transparent" />

        {/* Ambient glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.25),transparent_60%)]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[2.75rem] bg-white/10 backdrop-blur-2xl border border-white/15 shadow-[0_40px_120px_rgba(0,0,0,0.45)] px-8 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 text-center">

            {/* Glass edge ring */}
            <div className="pointer-events-none absolute inset-0 rounded-[2.75rem] ring-1 ring-white/10" />

            <h2
              id="cta-title"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight"
            >
              Ready to upgrade your living?
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
              Join 12K+ professionals living brokerage-free. Book your premium stay today.
            </p>

            <div
              role="group"
              aria-label="Call to action"
              className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-center"
            >
              {/* Primary CTA */}
              <button
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                  navigate("/");
                }}
                className="group relative flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm sm:text-base text-white shadow-[0_15px_40px_rgba(124,58,237,0.45)] overflow-hidden transition-all duration-300 hover:scale-[1.03]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10" />

                <span className="relative z-10 flex items-center gap-2">
                  Start Searching
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
              {
                !isAuthenticated ? <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 rounded-full border border-white/25 text-white/90 backdrop-blur-md hover:bg-white/10 transition-all font-medium text-sm sm:text-base"
                >
                  List Your Property
                </button> : <></>
              }
            </div>
          </div>
        </div>
      </section>

      {/* White separation before footer */}
      <div className="w-full h-16 sm:h-20 bg-white" />
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </div>
  );
}