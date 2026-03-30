import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetRoomByIdQuery,
  useUpdateRoomMutation,
  useDeleteRoomImageMutation,
  useAddRoomImagesMutation,
} from "../../../backend-routes/ownerroutes/room.js";
import { Toaster, toast } from "react-hot-toast";
import {
  Trash2, Upload, ArrowLeft, IndianRupee,
  Image as ImageIcon, ShieldCheck, Zap, Plus, X
} from "lucide-react";

/* ================= CONSTANTS ================= */
const FACILITIES = ["Food Included", "RO Water", "Kitchen", "AC", "Cooler", "Fan", "Geyser", "Heater", "Non-AC", "WiFi", "Power Backup", "Bed", "Study Table", "Refrigerator", "Washing Machine", "TV", "Laundry", "Daily Cleaning", "CCTV", "Parking"];
const RULES = ["Keep Clean", "No noise", "No Loud Music", "No Outside Guests", "Visitors Not Allowed", "No Parties", "Timings", "Follow Entry & Exit Timings", "Inform Before Late Entry", "Smoking Prohibited", "Alcohol Prohibited"];
const GENDER_OPTIONS = ["Boys", "Girls", "Family", "Anyone"];
const FURNISHED_OPTIONS = ["Fully Furnished", "Semi Furnished", "Unfurnished"];

/* ================= UI COMPONENTS ================= */
const SectionCard = ({ title, icon, children, subtitle }) => (
  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6">
    <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-4 bg-slate-50/50">
      <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">{icon}</div>
      <div>
        <h3 className="font-bold text-slate-800 tracking-tight">{title}</h3>
        {subtitle && <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{subtitle}</p>}
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const CustomInput = ({ label, ...props }) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
    />
  </div>
);

const BadgeButton = ({ label, isSelected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2.5 rounded-2xl border text-xs font-black transition-all active:scale-95 ${
      isSelected
        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
        : "bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:bg-blue-50"
    }`}
  >
    {label}
  </button>
);

/* ================= MAIN COMPONENT ================= */
export default function EditRoomForm() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // API Hooks
  const { data, isLoading, refetch } = useGetRoomByIdQuery(roomId);
  const [updateRoom, { isLoading: isUpdating, isSuccess }] = useUpdateRoomMutation();
  const [deleteImageAPI] = useDeleteRoomImageMutation();
  const [addImagesAPI] = useAddRoomImagesMutation();

  // States
  const [formData, setFormData] = useState({
    roomNumber: "", category: "Pg", price: "", rentperday: "", rentperNight: "",
    rentperhour: "", advancedmonth: "", allowedFor: "Anyone",
    furnishedType: "Unfurnished", facilities: [], rules: [],
  });
  const [datePricing, setDatePricing] = useState([]); 
  const [dirty, setDirty] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Sync Data from API
  useEffect(() => {
    if (data?.room) {
      setFormData({ 
        ...data.room, 
        facilities: data.room.facilities || [], 
        rules: data.room.rules || [] 
      });
      setDirty(false);
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Room updated successfully");
      navigate(-1);
    }
  }, [isSuccess, navigate]);

  /* ================= HANDLERS ================= */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  const handleToggleArray = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(v => v !== value) 
        : [...prev[field], value],
    }));
    setDirty(true);
  };

  const handleUpdateRoom = async () => {
    try {
      await updateRoom({ id: roomId, data: formData }).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const handleAddImages = async () => {
    if (!selectedImages.length) return toast.error("Select images first");
    const fd = new FormData();
    fd.append("id", roomId);
    selectedImages.forEach(img => fd.append("roomImages", img));
    try {
      setIsUploading(true);
      await addImagesAPI(fd).unwrap();
      toast.success("Images Uploaded");
      setSelectedImages([]);
      refetch();
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-2">
        <div className="h-10 w-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Room...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <Toaster position="top-center" />
      
      {/* HEADER WITH ACTIONS */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="font-black text-slate-900 text-lg tracking-tight leading-none mb-1">Room #{formData.roomNumber}</h1>
              <span className={`text-[10px] font-black uppercase tracking-widest ${dirty ? 'text-amber-500' : 'text-emerald-500'}`}>
                {dirty ? "● Unsaved Progress" : "● Synced"}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => navigate(-1)} 
              className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleUpdateRoom} 
              disabled={!dirty || isUpdating}
              className="bg-blue-600 text-white px-6 py-2 rounded-2xl text-sm font-black shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 disabled:bg-slate-200 disabled:shadow-none transition-all"
            >
              {isUpdating ? "Saving..." : "Update"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 grid lg:grid-cols-12 gap-6 mt-4">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* GALLERY */}
          <SectionCard title="Gallery" icon={<ImageIcon size={20} />} subtitle="Room Photos">
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
               {data?.room?.roomImages?.map((img, i) => (
                 <div key={i} className="group relative aspect-square rounded-[2rem] overflow-hidden border-2 border-white shadow-sm hover:scale-95 transition-transform">
                   <img src={img} className="h-full w-full object-cover" alt="room" />
                   <button 
                    onClick={() => window.confirm("Delete image?") && deleteImageAPI({ id: roomId, imageurl: img }).unwrap().then(refetch)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg">
                     <Trash2 size={14} />
                   </button>
                 </div>
               ))}
               <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all group">
                  <Upload size={20} className="text-slate-300 group-hover:text-blue-500 mb-1" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Add Photo</span>
                  <input type="file" multiple className="hidden" onChange={(e) => setSelectedImages([...e.target.files])} />
               </label>
             </div>

             {selectedImages.length > 0 && (
               <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-bottom-2">
                 <span className="text-xs font-bold text-blue-700">{selectedImages.length} new files ready</span>
                 <button onClick={handleAddImages} disabled={isUploading} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-md shadow-blue-200">
                    {isUploading ? "Uploading..." : "Upload Now"}
                 </button>
               </div>
             )}
          </SectionCard>

          {/* FACILITIES */}
          <SectionCard title="Facilities" icon={<Zap size={20} />} subtitle="What's Included">
            <div className="flex flex-wrap gap-2">
              {FACILITIES.map(item => (
                <BadgeButton key={item} label={item} isSelected={formData.facilities.includes(item)} onClick={() => handleToggleArray("facilities", item)} />
              ))}
            </div>
          </SectionCard>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* PRICING ENGINE */}
          <SectionCard title="Pricing" icon={<IndianRupee size={20} />} subtitle="Standard Rates">
             <div className="space-y-5">
               <CustomInput label="Monthly Rent" type="number" value={formData.price} onChange={e => handleInputChange("price", e.target.value)} placeholder="0.00" />
               <CustomInput label="Advance Deposit" type="number" value={formData.advancedmonth} onChange={e => handleInputChange("advancedmonth", e.target.value)} placeholder="Months" />
             </div>
          </SectionCard>

          {/* DYNAMIC PRICING FOR PG */}
          {formData.category === "Hotel" && (
            <SectionCard title="Date Pricing" icon={<Plus size={20} />} subtitle="Special Rates">
               <div className="flex gap-2 mb-4 bg-slate-50 p-2 rounded-2xl">
                  <input type="date" id="dateInput" className="bg-transparent border-none p-2 text-sm font-bold flex-1 outline-none" />
                  <input type="number" id="priceInput" placeholder="Price" className="bg-white border-none rounded-xl p-2 text-sm w-20 font-bold outline-none shadow-sm" />
                  <button 
                    onClick={() => {
                      const d = document.getElementById("dateInput").value;
                      const p = document.getElementById("priceInput").value;
                      if(d && p) {
                        setDatePricing(prev => [...prev, {date: d, price: p}]);
                        document.getElementById("dateInput").value = "";
                        document.getElementById("priceInput").value = "";
                      } else { toast.error("Enter date and price"); }
                    }}
                    className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-100 hover:scale-105 transition-transform"><Plus size={20}/></button>
               </div>
               <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                 {datePricing.map((item, i) => (
                   <div key={i} className="flex justify-between items-center bg-white border border-slate-100 p-3 rounded-2xl shadow-sm transition-all hover:border-blue-200">
                     <span className="text-xs font-bold text-slate-500">{item.date}</span>
                     <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-blue-600">₹{item.price}</span>
                        <X size={14} className="text-slate-300 cursor-pointer hover:text-red-500" onClick={() => setDatePricing(prev => prev.filter((_, idx) => idx !== i))} />
                     </div>
                   </div>
                 ))}
                 {datePricing.length === 0 && <p className="text-center text-[10px] text-slate-300 font-bold uppercase py-4">No custom rates set</p>}
               </div>
            </SectionCard>
          )}

          {/* RULES SECTION */}
          <SectionCard title="Rules" icon={<ShieldCheck size={20} />} subtitle="Compliance">
            <div className="flex flex-wrap gap-2">
              {RULES.map(rule => (
                <BadgeButton key={rule} label={rule} isSelected={formData.rules.includes(rule)} onClick={() => handleToggleArray("rules", rule)} />
              ))}
            </div>
          </SectionCard>
        </div>

      </div>
    </div>
  );
}