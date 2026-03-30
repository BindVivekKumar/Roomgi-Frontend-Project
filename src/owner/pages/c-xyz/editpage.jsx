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

/* ================= UI COMPONENTS ================= */
const SectionCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm mb-6">
    <div className="px-6 py-4 border-b flex items-center gap-4 bg-slate-50">
      <div className="p-2 bg-blue-600 text-white rounded-xl">{icon}</div>
      <h3 className="font-bold">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const CustomInput = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-gray-500">{label}</label>
    <input {...props} className="w-full px-3 py-2 bg-gray-100 rounded-xl outline-none" />
  </div>
);

const BadgeButton = ({ label, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-xl text-xs ${
      isSelected ? "bg-blue-600 text-white" : "bg-gray-100"
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
  const [updateRoom, { isLoading: isUpdating }] = useUpdateRoomMutation();
  const [deleteImageAPI] = useDeleteRoomImageMutation();
  const [addImagesAPI] = useAddRoomImagesMutation();

  /* ================= STATES ================= */
  const [formData, setFormData] = useState({
    roomNumber: "",
    category: "Pg",
    price: "",
    base_price: "",
    advancedmonth: "",
    facilities: [],
    rules: [],
  });

  const [dynamicPricing, setDynamicPricing] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priceInput, setPriceInput] = useState("");

  const [dirty, setDirty] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (data?.room) {
      setFormData({
        ...data.room,
        facilities: data.room.facilities || [],
        rules: data.room.rules || [],
      });

      setDynamicPricing(data.room.dynamicPricing || []);
      setDirty(false);
    }
  }, [data]);

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
      await updateRoom({
        id: roomId,
        data: { ...formData, dynamicPricing }
      }).unwrap();

      toast.success("Updated Successfully");
      navigate(-1);
    } catch {
      toast.error("Update failed");
    }
  };

  const handleAddImages = async () => {
    const fd = new FormData();
    fd.append("id", roomId);
    selectedImages.forEach(img => fd.append("roomImages", img));

    await addImagesAPI(fd);
    refetch();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Toaster />

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft />
        </button>

        <button
          onClick={handleUpdateRoom}
          disabled={!dirty || isUpdating}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          {isUpdating ? "Saving..." : "Save"}
        </button>
      </div>

      {/* IMAGES */}
      <SectionCard title="Images" icon={<ImageIcon />}>
        <div className="grid grid-cols-3 gap-3">
          {data.room.roomImages.map((img, i) => (
            <div key={i} className="relative">
              <img src={img} className="h-24 w-full object-cover rounded-xl" />
              <button
                onClick={() => deleteImageAPI({ id: roomId, imageurl: img }).then(refetch)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>

        <input type="file" multiple onChange={(e) => setSelectedImages([...e.target.files])} />
        <button onClick={handleAddImages}>Upload</button>
      </SectionCard>

      {/* PRICING */}
      <SectionCard title="Pricing" icon={<IndianRupee />}>
        {formData.category === "Hotel" ? (
          <CustomInput
            label="Base Price"
            value={formData.base_price}
            onChange={(e) => handleInputChange("base_price", e.target.value)}
          />
        ) : (
          <CustomInput
            label="Price"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
          />
        )}
      </SectionCard>

      {/* DYNAMIC PRICING */}
      {formData.category === "Hotel" && (
        <SectionCard title="Dynamic Pricing" icon={<Plus />}>
          <div className="flex gap-2 mb-3">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            <input type="number" value={priceInput} onChange={e => setPriceInput(e.target.value)} />

            <button
              onClick={() => {
                if (!startDate || !endDate || !priceInput) return toast.error("Fill all");

                setDynamicPricing(prev => [
                  ...prev,
                  { startDate, endDate, price: Number(priceInput) }
                ]);

                setStartDate("");
                setEndDate("");
                setPriceInput("");
                setDirty(true);
              }}
              className="bg-blue-600 text-white px-2 rounded"
            >
              <Plus />
            </button>
          </div>

          {dynamicPricing.map((item, i) => (
            <div key={i} className="flex justify-between bg-gray-100 p-2 rounded mb-2">
              <span>
                {new Date(item.startDate).toISOString().slice(0,10)} →
                {new Date(item.endDate).toISOString().slice(0,10)}
              </span>

              <div className="flex gap-2">
                <span>₹{item.price}</span>
                <X
                  onClick={() => {
                    setDynamicPricing(prev => prev.filter((_, idx) => idx !== i));
                    setDirty(true);
                  }}
                />
              </div>
            </div>
          ))}
        </SectionCard>
      )}

      {/* FACILITIES */}
      <SectionCard title="Facilities" icon={<Zap />}>
        <div className="flex flex-wrap gap-2">
          {FACILITIES.map(f => (
            <BadgeButton
              key={f}
              label={f}
              isSelected={formData.facilities.includes(f)}
              onClick={() => handleToggleArray("facilities", f)}
            />
          ))}
        </div>
      </SectionCard>

      {/* RULES */}
      {formData.category !== "Hotel" && (
        <SectionCard title="Rules" icon={<ShieldCheck />}>
          <div className="flex flex-wrap gap-2">
            {RULES.map(r => (
              <BadgeButton
                key={r}
                label={r}
                isSelected={formData.rules.includes(r)}
                onClick={() => handleToggleArray("rules", r)}
              />
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}