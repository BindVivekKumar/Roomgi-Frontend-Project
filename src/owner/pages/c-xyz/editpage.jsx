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
  Image as ImageIcon, ShieldCheck, Zap, Plus, X, Calendar, Save
} from "lucide-react";

/* ================= CONSTANTS ================= */
const FACILITIES = ["Food Included", "RO Water", "Kitchen", "AC", "Cooler", "Fan", "Geyser", "Heater", "Non-AC", "WiFi", "Power Backup", "Bed", "Study Table", "Refrigerator", "Washing Machine", "TV", "Laundry", "Daily Cleaning", "CCTV", "Parking"];
const RULES = ["Keep Clean", "No noise", "No Loud Music", "No Outside Guests", "Visitors Not Allowed", "No Parties", "Timings", "Follow Entry & Exit Timings", "Inform Before Late Entry", "Smoking Prohibited", "Alcohol Prohibited"];

/* ================= UI COMPONENTS ================= */
const SectionCard = ({ title, icon, children, subtitle }) => (
  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6 transition-all hover:shadow-md">
    <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-4 bg-slate-50/50">
      <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-slate-800 tracking-tight">{title}</h3>
        {subtitle && <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{subtitle}</p>}
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const CustomInput = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-1.5 flex-1">
    <label className="text-xs font-black text-slate-400 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />}
      <input
        {...props}
        className={`w-full ${Icon ? 'pl-11' : 'px-4'} py-3 bg-slate-50 border-2 border-transparent rounded-2xl focus:ring-0 focus:border-blue-400 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300`}
      />
    </div>
  </div>
);

const BadgeButton = ({ label, isSelected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2.5 rounded-2xl border-2 text-xs font-black transition-all active:scale-95 ${isSelected
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

  const { data, isLoading, refetch } = useGetRoomByIdQuery(roomId);
  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();
  const [deleteImageAPI] = useDeleteRoomImageMutation();
  const [addImagesAPI] = useAddRoomImagesMutation();

  const [formData, setFormData] = useState({
    roomNumber: "", category: "Pg", price: "", base_price: "", advancedmonth: "", facilities: [], rules: [],
  });

  const [dynamicPricing, setDynamicPricing] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [dirty, setDirty] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    if (data?.room) {
      setFormData({ ...data.room, facilities: data.room.facilities || [], rules: data.room.rules || [] });
      setDynamicPricing(data.room.dynamicPricing || []);
      setDirty(false);
    }
  }, [data]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  const handleToggleArray = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter(v => v !== value) : [...prev[field], value],
    }));
    setDirty(true);
  };

  const handleUpdateRoom = async () => {
    try {
      await updateRoom({ id: roomId, data: { ...formData, dynamicPricing } }).unwrap();
      toast.success("Room updated successfully!");
      navigate(-1);
    } catch { toast.error("Failed to update"); }
  };

  const handleAddImages = async () => {
    if (!selectedImages.length) return toast.error("Choose images first");
    const fd = new FormData();
    fd.append("id", roomId);
    selectedImages.forEach(img => fd.append("roomImages", img));
    try {
      await addImagesAPI(fd).unwrap();
      toast.success("Images uploaded");
      setSelectedImages([]);
      refetch();
    } catch { toast.error("Upload failed"); }
  };

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-slate-200"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      <Toaster />

      {/* STICKY HEADER */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="font-black text-slate-900 text-xl tracking-tight">Edit Room #{formData.roomNumber}</h1>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{formData.category} Settings</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleUpdateRoom}
              disabled={!dirty || isUpdating}
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:bg-slate-200 disabled:shadow-none transition-all flex items-center gap-2"
            >
              <Save size={18} />
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 grid lg:grid-cols-12 gap-8 mt-4">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-7 space-y-2">

          {/* IMAGE MANAGER */}
          <SectionCard title="Gallery" icon={<ImageIcon size={20} />} subtitle="Room Visuals">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {data.room.roomImages.map((img, i) => (
                <div key={i} className="group relative aspect-square rounded-[2rem] overflow-hidden border-4 border-white shadow-sm hover:scale-95 transition-all">
                  <img src={img} className="h-full w-full object-cover" alt="room" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => deleteImageAPI({ id: roomId, imageurl: img }).then(refetch)}
                      className="bg-white text-red-500 p-3 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all group">
                <Upload size={24} className="text-slate-300 group-hover:text-blue-500 mb-2 transition-all" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-500">Add Photo</span>
                <input type="file" multiple className="hidden" onChange={(e) => setSelectedImages([...e.target.files])} />
              </label>
            </div>
            {selectedImages.length > 0 && (
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-[2rem] border border-blue-100">
                <span className="text-xs font-bold text-blue-700 tracking-tight">{selectedImages.length} images ready</span>
                <button onClick={handleAddImages} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-black shadow-md">Upload</button>
              </div>
            )}
          </SectionCard>

          {/* FACILITIES */}
          <SectionCard title="Facilities" icon={<Zap size={20} />} subtitle="Amenities Provided">
            <div className="flex flex-wrap gap-2.5">
              {FACILITIES.map(f => (
                <BadgeButton key={f} label={f} isSelected={formData.facilities.includes(f)} onClick={() => handleToggleArray("facilities", f)} />
              ))}
            </div>
          </SectionCard>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 space-y-2">

          {/* PRICING */}
          <SectionCard title="Pricing Engine" icon={<IndianRupee size={20} />} subtitle="Base Rates">
            <CustomInput
              label={formData.category === "Hotel" ? "Base Price (Nightly)" : "Standard Price (Monthly)"}
              type="number"
              icon={IndianRupee}
              value={formData.category === "Hotel" ? formData.base_price : formData.price}
              onChange={(e) => handleInputChange(formData.category === "Hotel" ? "base_price" : "price", e.target.value)}
              placeholder="0.00"
            />
          </SectionCard>

          {/* DYNAMIC PRICING (HOTEL ONLY) */}
          {formData.category === "Hotel" && (
            <SectionCard title="Dynamic Rates" icon={<Plus size={20} />} subtitle="Seasonal Pricing">
              <div className="space-y-4 bg-slate-50 p-5 rounded-3xl mb-6 border border-slate-100">
                <div className="grid grid-cols-2 gap-3">
                  <CustomInput label="Start" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  <CustomInput label="End" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
                <div className="flex gap-3">
                  <CustomInput label="Special Price" type="number" icon={IndianRupee} value={priceInput} onChange={e => setPriceInput(e.target.value)} />
                  <button
                    onClick={() => {
                      if (!startDate || !endDate || !priceInput) return toast.error("Fill all fields");
                      setDynamicPricing(prev => [...prev, { startDate, endDate, price: Number(priceInput) }]);
                      setStartDate(""); setEndDate(""); setPriceInput(""); setDirty(true);
                    }}
                    className="self-end bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {dynamicPricing.map((item, i) => {
                  // Din calculate karne ke liye logic
                  const days = Math.ceil((new Date(item.endDate) - new Date(item.startDate)) / (1000 * 60 * 60 * 24)) + 1;

                  // Date ko sundar dikhane ke liye (e.g., 12 May)
                  const formatDate = (dateStr) => {
                    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                  };

                  return (
                    <div key={i} className="group relative bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:border-blue-300 transition-all">
                      <div className="flex justify-between items-center">

                        {/* Left Side: Date Range Info */}
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
                            <Calendar size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-slate-700">{formatDate(item.startDate)}</span>
                              <span className="text-slate-300 text-xs">→</span>
                              <span className="text-sm font-black text-slate-700">{formatDate(item.endDate)}</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                              Duration: {days} {days > 1 ? 'Days' : 'Day'}
                            </p>
                          </div>
                        </div>

                        {/* Right Side: Price & Action */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-[10px] font-black text-emerald-500 uppercase leading-none mb-1">New Rate</p>
                            <span className="text-lg font-black text-blue-600">₹{item.price}</span>
                          </div>

                          <button
                            onClick={() => {
                              setDynamicPricing(prev => prev.filter((_, idx) => idx !== i));
                              setDirty(true);
                            }}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Subtle Progress Bar (Optional UI Touch) */}
                      <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-100 w-full opacity-50"></div>
                      </div>
                    </div>
                  );
                })}

                {dynamicPricing.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-3xl">
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No special rates added yet</p>
                  </div>
                )}
              </div>
            </SectionCard>
          )}

          {/* RULES */}
          {formData.category !== "Hotel" && (
            <SectionCard title="House Rules" icon={<ShieldCheck size={20} />} subtitle="Policy & Compliance">
              <div className="flex flex-wrap gap-2.5">
                {RULES.map(r => (
                  <BadgeButton key={r} label={r} isSelected={formData.rules.includes(r)} onClick={() => handleToggleArray("rules", r)} />
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}