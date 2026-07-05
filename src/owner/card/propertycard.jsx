import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Edit, Trash2, Loader2, Phone, X, CheckCircle2
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const PropertyCard = React.memo(({
  property, onDelete, deletingPropertyId,
  totalVacant, occupiedBeds, occupiedRental,
  totalpgbed, totalRooms, totalOccupied,
}) => {

  const [phone, setPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateContact = async (e) => {
    e.preventDefault();

    if (!phone) return toast.error("Enter phone number");

    setIsUpdating(true);

    try {
      const res = await axios.put(
        "http://localhost:5000/api/v1/branch/owner/update-contact",
        {
          branchId: property._id,
          number: phone,
        }
      );

      if (res.data.success) {
        toast.success("Contact updated successfully");
        setPhone("");
        setIsEditing(false);
      } else {
        toast.error("Update failed");
      }

    } catch (err) {
      toast.error("Server error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >

      {/* CARD */}
      <div className="relative bg-white rounded-[28px] border border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="p-6 flex justify-between items-center">

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200">
            <MapPin size={14} className="text-orange-600" />
            <span className="text-xs font-extrabold tracking-wide text-orange-700">
              {property.city}
            </span>
          </div>

          <div className={`px-4 py-1.5 rounded-full text-xs font-extrabold border ${
            totalVacant > 0
              ? "bg-green-100 text-green-700 border-green-200"
              : "bg-red-100 text-red-700 border-red-200"
          }`}>
            {totalVacant} VACANT
          </div>

        </div>

        {/* TITLE */}
        <div className="px-6">
          <h2 className="text-2xl font-black text-slate-900 leading-tight">
            {property.name}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {property.landmark || "Prime Location"}
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 px-6 mt-6">

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-xs font-bold text-slate-500">Beds</p>
            <p className="text-xl font-black text-slate-900">
              {occupiedBeds} <span className="text-sm text-slate-400">/ {totalpgbed}</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-xs font-bold text-slate-500">Rooms</p>
            <p className="text-xl font-black text-slate-900">
              {occupiedRental} <span className="text-sm text-slate-400">/ {property.totalrentalRoom}</span>
            </p>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex justify-between items-center px-6 py-6 mt-auto">

          <div className="flex gap-3">

            <button
              onClick={() => setIsEditing(true)}
              className="p-3 rounded-2xl bg-orange-100 text-orange-700 hover:bg-orange-200 transition"
            >
              <Edit size={16} />
            </button>

            <button
              onClick={() => onDelete(totalOccupied, property._id)}
              disabled={deletingPropertyId === property._id}
              className="p-3 rounded-2xl bg-red-100 text-red-600 hover:bg-red-200 transition disabled:opacity-50"
            >
              {deletingPropertyId === property._id
                ? <Loader2 className="animate-spin" />
                : <Trash2 size={16} />
              }
            </button>

          </div>

        </div>

        {/* EDIT MODAL */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            >

              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white w-[90%] max-w-md rounded-2xl p-6 shadow-2xl"
              >

                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-black">Update Contact</h3>

                  <button onClick={() => setIsEditing(false)}>
                    <X />
                  </button>
                </div>

                <form onSubmit={handleUpdateContact} className="space-y-4">

                  <div className="flex items-center border rounded-xl px-3 py-2 bg-slate-50">
                    <Phone className="text-slate-400" size={18} />
                    <input
                      className="w-full ml-2 outline-none bg-transparent font-semibold"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <button
                    disabled={isUpdating}
                    className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition"
                  >
                    {isUpdating ? "Updating..." : "Save"}
                  </button>

                </form>

              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
});

export default PropertyCard;