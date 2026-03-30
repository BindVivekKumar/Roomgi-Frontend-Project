import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Loader2, Home, ShieldCheck
} from "lucide-react";
import { toast } from "react-toastify";
// Removed react-helmet-async - install with: npm i react-helmet-async or use basic meta in index.html [web:11]
import {
  useAddbranchMutation,
  useGetAllBranchByOwnerQuery,
  useGetAllBranchbybranchIdQuery,
  useDeleteBranchMutation,
} from "../../backend-routes/ownerroutes/branch";
import AddPropertyModal from "./property/addproperty";
import PropertyCard from "../card/propertycard"
// Memoized PropertyCard component



export default function Properties() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const { data: allbranchowner, refetch: refetchAllBranchOwner, isLoading: loadingAllBranchOwner } =
    useGetAllBranchByOwnerQuery(undefined, { skip: user?.role !== "owner" && user?.role !== "HotelOwner"});

  const { data: branchmanagerdata, refetch: refetchBranchManagerData, isLoading: loadingBranchManagerData } =
    useGetAllBranchbybranchIdQuery();

  const [addbranch, { isLoading: addingBranch }] = useAddbranchMutation();
  const [deleteBranch] = useDeleteBranchMutation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingPropertyId, setDeletingPropertyId] = useState(null);
  const [phoneNumber,setphoneNumber]=useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    streetAdress: "",
    landmark: "",
    images: [],
    previewImages: [],
  });

  const branchFetched = useMemo(() => {
    if (allbranchowner?.allbranch?.length > 0) return allbranchowner.allbranch;
    return [];
  }, [allbranchowner?.allbranch, branchmanagerdata?.allbranch]);

  const processedProperties = useMemo(() =>
    branchFetched.map((property) => {
      const { occupiedBeds, occupiedRental, totalRooms, totalOccupied } =
        property.rooms?.reduce((acc, room) => {
          acc.occupiedBeds += room.occupied || 0;
          acc.occupiedRental += room.occupiedRentalRoom || 0;
          acc.totalRooms += room.capacity || 0;
          acc.totalOccupied += room.occupied || 0;
          return acc;
        }, { occupiedBeds: 0, occupiedRental: 0, totalRooms: 0, totalOccupied: 0 }) ||
        { occupiedBeds: 0, occupiedRental: 0, totalRooms: 0, totalOccupied: 0 };

      const totalVacant = totalRooms - totalOccupied;
      const totalOccupancyRate = totalRooms ? Math.round((totalOccupied / totalRooms) * 100) : 0;
      const totalpgbed = totalRooms - (property.totalrentalRoom || 0) - (property.totelhotelroom || 0);

      return { ...property, occupiedBeds, occupiedRental, totalpgbed, totalRooms, totalOccupied, totalVacant, totalOccupancyRate };
    }),
    [branchFetched]
  );


  const handleDeleteProperty = useCallback(async (occupiedLength, id) => {
    if (occupiedLength !== 0) return toast.warn("Can't delete property: rooms are occupied.");
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      setDeletingPropertyId(id);
      await deleteBranch(id).unwrap();
      toast.success("Property deleted.");
      refetchAllBranchOwner?.();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete property.");
    } finally {
      setDeletingPropertyId(null);
    }
  }, [deleteBranch, refetchAllBranchOwner]);

  const handleSaveProperty = useCallback(async (e) => {
    e.preventDefault();

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "previewImages") {
        if (key === "images") formData.images.forEach((f) => payload.append("images", f));
        else payload.append(key, formData[key]);
      }
    });
    try {
      await addbranch(payload).unwrap();
      toast.success("Property added successfully.");
      setShowAddModal(false);
      setFormData({ name: "", address: "", city: "", state: "", pincode: "", streetAdress: "", landmark: "", images: [], previewImages: [] });
      user?.role === "owner"||user?.role === "HotelOwner" ? refetchAllBranchOwner?.() : (refetchAllBranch?.(), refetchBranchManagerData?.());
    } catch (err) {
      console.log(err)
      toast.error(err?.data?.message || "Failed to add property.");
    }
  }, [formData, addbranch, user?.role, refetchAllBranchOwner, refetchBranchManagerData]);

  const handlePropertyChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  useEffect(() => {
    return () => formData.previewImages.forEach(url => URL.revokeObjectURL(url));
  }, [formData.previewImages]);

  const showAddRoom = !!branchmanagerdata?.allbranch?.length;
  const isLoading = loadingAllBranchOwner || loadingBranchManagerData;

  return (
    <div className="space-y-5 min-h-screen mt-8">



   
      <div className="relative z-20 flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap mb-6">

        {/* Add Property */}
        <button
          onClick={() => setShowAddModal(true)}
          disabled={addingBranch}
          className="flex-1 sm:flex-none flex items-center justify-center gap-3 
               px-8 py-5 lg:px-10 lg:py-6 rounded-3xl 
               text-sm lg:text-base font-black uppercase tracking-[0.1em] text-white
               bg-gradient-to-r from-orange-600 via-orange-700 to-amber-700
               shadow-2xl shadow-orange-300/40
               border border-orange-500/30 backdrop-blur-sm
               transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-lg
               relative overflow-hidden"
        >
          <Plus size={20} strokeWidth={3} />
          <span>Add Property</span>
        </button>

        {/* Add Room */}
        {showAddRoom && (
          <button
            onClick={() => navigate("/admin/addroom")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-3 
                 px-8 py-5 lg:px-10 lg:py-6 rounded-3xl 
                 text-sm lg:text-base font-black uppercase tracking-[0.1em] text-gray-900
                 bg-gradient-to-r from-white/70 via-white to-amber-50/80
                 border-2 border-orange-200/60
                 shadow-xl shadow-orange-100/40
                 backdrop-blur-xl transition-all duration-300 relative overflow-hidden"
          >
            <Home size={20} strokeWidth={2.5} className="text-orange-600" />
            <span>Add Room</span>
          </button>
        )}
      </div>



      {/* =====================
      PROPERTIES GRID
      ===================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {isLoading ? (
          // Loading Skeletons
          Array.from({ length: 3 }, (_, i) => (
            <div key={`skeleton-${i}`} className="h-72 bg-gray-200 rounded-xl animate-pulse" />
          ))
        ) : processedProperties.length === 0 ? (
          // Empty State
          <div className="col-span-full text-center text-gray-500 py-12 md:col-span-3">
            No properties found.{" "}
            <button onClick={() => setShowAddModal(true)} className="text-orange-500 font-bold hover:underline">
              Add your first property →
            </button>
          </div>
        ) : (
          // Properties
          processedProperties.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              onDelete={handleDeleteProperty}
              deletingPropertyId={deletingPropertyId}
              {...property}
            />
          ))
        )}
      </div>


      {/* =====================
      MODAL
      ===================== */}
      <AnimatePresence>
        {showAddModal && (
          <AddPropertyModal
            formData={formData}
            setFormData={setFormData}
            handlePropertyChange={handlePropertyChange}
            handleSaveProperty={handleSaveProperty}
            addingBranch={addingBranch}
            setShowAddModal={setShowAddModal}
          />
        )}
      </AnimatePresence>

    </div>


  );
}
