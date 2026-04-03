import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Loader2, LayoutGrid, Star, MapPin, ShieldCheck, 
  ArrowLeft, Heart, Share2, Info, Navigation 
} from "lucide-react";
import { toast } from "react-toastify";
import handleGetDirections from "./component/handleGetDirections"
// Components & API
import LeftInformationdescription from "./l.jsx";
import RightInformationdescription from "./r.jsx";
import SkeletonLoader from "./loader/skeletondetails.jsx";
import { useProfileQuery } from "../backend-routes/userroutes/authapi";
import { useGetPgByIdQuery } from "../backend-routes/userroutes/allpg.js";

export default function PGDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isConfirmingBooking, setIsConfirmingBooking] = useState(false);
  
  const { data: userdata } = useProfileQuery();
  const { data, isLoading, isError } = useGetPgByIdQuery(id);

  const pg = data?.room;
  const coord=data?.location;
  const Number=data?.phoneNumber
  const allImages = useMemo(() => pg?.roomImages || [], [pg]);

  // Back Button Functionality
  const handleBack = () => navigate(-1);

  if (isLoading) return <SkeletonLoader />;

  if (isError || !pg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-800">Finding your perfect stay...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 selection:bg-orange-100">
      
      {/* 🟢 TOP NAV BAR (Sticky on Scroll) */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors group"
          >
            <ArrowLeft className="w-6 h-6 group-active:scale-90 transition-transform" />
          </button>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Heart className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* 🟢 HEADER SECTION */}
        <div className="mb-8">
          {/* <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Popular Choice
            </span>
            <div className="flex items-center gap-1 text-orange-500 font-bold text-sm">
              <Star className="w-4 h-4 fill-current" />
              <span>4.8 (120+ reviews)</span>
            </div>
          </div> */}
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {pg.name || "Premium Managed Stay"}
          </h1>
          <div className="flex items-center gap-1 text-slate-500 mt-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{pg.branch?.name || "Prime Location, City Center"}</span>
          </div>
        </div>

        {/* 🟢 MODERN GALLERY GRID */}
        <div className="relative group mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[350px] md:h-[550px] rounded-[2rem] overflow-hidden shadow-2xl shadow-orange-900/10">
            {/* Main Image */}
            <div className="md:col-span-2 md:row-span-2 relative overflow-hidden">
              <img 
                src={allImages[0]} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-zoom-in" 
                alt="Main View"
              />
            </div>
            {/* Secondary Images */}
            {allImages.slice(1, 5).map((img, idx) => (
              <div key={idx} className="hidden md:block relative overflow-hidden">
                <img 
                  src={img} 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-zoom-in" 
                  alt={`Room view ${idx + 2}`}
                />
              </div>
            ))}
            {/* View All Overlay */}
            <button 
              onClick={() => navigate(`/allpotos/${id}`)}
              className="absolute bottom-6 right-6 flex items-center gap-2 bg-white/90 backdrop-blur px-5 py-2.5 rounded-xl shadow-lg hover:bg-white transition-all font-bold text-sm border border-slate-200"
            >
              <LayoutGrid className="w-4 h-4" />
              View All Photos
            </button>
          </div>
        </div>

        {/* 🟢 CONTENT GRID (Two Column Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Side: Information */}
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white p-2 rounded-3xl">
               <LeftInformationdescription pg={pg} />
            </div>
            
            {/* Location Bar with Directions */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-lg">
                    <Navigation className="w-7 h-7 text-orange-400" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold">How to get there?</h3>
                    <p className="text-slate-400 text-sm">Open in Maps for precise directions to {pg.name}</p>
                 </div>
               </div>
               <button 

               onClick={()=>handleGetDirections(coord)}

               
               className="w-full md:w-auto px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-900/20 active:scale-95">
                 Get Directions
               </button>
            </div>
          </div>

          {/* Right Side: Booking Card */}
          <div className="lg:col-span-4 relative">
            <div className="lg:sticky lg:top-28">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden transition-all duration-300 hover:shadow-orange-200/40">
                <RightInformationdescription pg={pg} N={Number} />
                
                {/* Security Badge */}
                <div className="bg-slate-50 p-4 flex items-center justify-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-t border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  Roomgi Safe & Secure Booking
                </div>
              </div>
              
              {/* Extra Help Card */}
              <div className="mt-6 p-6 bg-orange-50/50 rounded-3xl border border-orange-100 flex items-start gap-4">
                <Info className="w-5 h-5 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-bold text-orange-900 text-sm">Need Help?</h4>
                  <p className="text-xs text-orange-800/70 mt-1 leading-relaxed">Our 24/7 concierge is available to help you with your booking or any property queries.</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      {/* 🟢 PAYMENT PROCESSING MODAL */}
      {isConfirmingBooking && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-3xl animate-in zoom-in-95 duration-300">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-25"></div>
              <div className="relative bg-orange-500 rounded-full w-20 h-20 flex items-center justify-center shadow-lg shadow-orange-500/40">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Finalizing...</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              We are verifying your transaction with the bank. Please do not refresh the page.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}