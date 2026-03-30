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
  Trash2, Upload, ArrowLeft, Info, IndianRupee,
  Image as ImageIcon, CheckCircle2, ShieldCheck, Zap
} from "lucide-react";

/* ================= CONSTANTS ================= */
const FACILITIES = [
  "Food Included","RO Water","Kitchen","AC","Cooler","Fan","Geyser",
  "Heater","WiFi","Power Backup","Bed","Study Table","Refrigerator",
  "Washing Machine","TV","Laundry","Daily Cleaning","CCTV","Parking"
];

const RULES = [
  "Keep clean","No Loud Music","No Outside Guests","Visitors Not Allowed",
  "No Parties","Follow Entry & Exit Timings","Inform Before Late Entry",
  "Smoking Prohibited","Alcohol Prohibited"
];

const GENDER_OPTIONS = ["Boys", "Girls", "Family", "Anyone"];
const FURNISHED_OPTIONS = ["Fully Furnished", "Semi Furnished", "Unfurnished"];

/* ================= UI COMPONENTS ================= */
const SectionCard = ({ title, icon, children, subtitle }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b flex items-center gap-3 bg-slate-50">
      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">{icon}</div>
      <div>
        <h3 className="font-bold text-slate-800">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const CustomInput = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-sm font-semibold text-slate-700">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
    />
  </div>
);

const BadgeButton = ({ label, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl border text-sm font-medium ${
      isSelected
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-white border-slate-200 text-slate-600 hover:bg-blue-50"
    }`}
  >
    {label}
  </button>
);

/* ================= MAIN ================= */
export default function EditRoomForm() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useGetRoomByIdQuery(roomId);
  const [updateRoom, { isLoading: isUpdating, isSuccess }] = useUpdateRoomMutation();
  const [deleteImageAPI] = useDeleteRoomImageMutation();
  const [addImagesAPI] = useAddRoomImagesMutation();

  const [formData, setFormData] = useState({
    roomNumber: "",
    category: "Pg",
    price: "",
    rentperday: "",
    rentperNight: "",
    rentperhour: "",
    advancedmonth: "",
    allowedFor: "Anyone",
    furnishedType: "Unfurnished",
    facilities: [],
    rules: [],
  });

  const [dirty, setDirty] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  /* ================= EFFECTS ================= */
  useEffect(() => {
    if (data?.room) {
      setFormData({
        ...data.room,
        facilities: data.room.facilities || [],
        rules: data.room.rules || [],
      });
      setDirty(false);
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Room updated successfully");
      navigate(-1);
    }
  }, [isSuccess]);

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
    } catch {
      toast.error("Update failed");
    }
  };

  const handleAddImages = async () => {
    if (!selectedImages.length) return toast.error("Select images");

    const fd = new FormData();
    fd.append("id", roomId);
    selectedImages.forEach(img => fd.append("roomImages", img));

    try {
      setIsUploading(true);
      await addImagesAPI(fd).unwrap();
      toast.success("Uploaded");
      setSelectedImages([]);
      refetch();
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  /* ================= LOADING ================= */
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <Toaster />

      {/* HEADER */}
      <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ArrowLeft onClick={() => navigate(-1)} className="cursor-pointer" />
          <h1 className="font-bold text-lg">
            Room #{formData.roomNumber}
          </h1>
        </div>
        <button
          onClick={handleUpdateRoom}
          disabled={!dirty || isUpdating}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          {isUpdating ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-2 gap-6">

        {/* IMAGES */}
        <SectionCard title="Images" icon={<ImageIcon size={18} />}>
          <div className="grid grid-cols-2 gap-3">
            {data?.room?.roomImages?.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} className="rounded-xl h-32 w-full object-cover" />
                <button
                  onClick={() => {
                    if (window.confirm("Delete image?")) {
                      deleteImageAPI({ id: roomId, imageurl: img })
                        .unwrap()
                        .then(refetch);
                    }
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <input type="file" multiple onChange={(e) => setSelectedImages([...e.target.files])} />
          <button onClick={handleAddImages} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">
            Upload
          </button>
        </SectionCard>

        {/* PRICING */}
        <SectionCard title="Pricing" icon={<IndianRupee size={18} />}>
          <CustomInput
            label="Monthly Rent"
            type="number"
            value={formData.price}
            onChange={e => handleInputChange("price", e.target.value)}
          />
          <CustomInput
            label="Advance"
            type="number"
            value={formData.advancedmonth}
            onChange={e => handleInputChange("advancedmonth", e.target.value)}
          />
        </SectionCard>

        {/* FACILITIES */}
        <SectionCard title="Facilities" icon={<Zap size={18} />}>
          <div className="flex flex-wrap gap-2">
            {FACILITIES.map(item => (
              <BadgeButton
                key={item}
                label={item}
                isSelected={formData.facilities.includes(item)}
                onClick={() => handleToggleArray("facilities", item)}
              />
            ))}
          </div>
        </SectionCard>

        {/* RULES */}
        <SectionCard title="Rules" icon={<ShieldCheck size={18} />}>
          <div className="flex flex-wrap gap-2">
            {RULES.map(rule => (
              <BadgeButton
                key={rule}
                label={rule}
                isSelected={formData.rules.includes(rule)}
                onClick={() => handleToggleArray("rules", rule)}
              />
            ))}
          </div>
        </SectionCard>

      </div>
    </div>
  );
}