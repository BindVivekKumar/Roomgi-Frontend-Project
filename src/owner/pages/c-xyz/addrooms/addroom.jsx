import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, IndianRupee, Image as ImageIcon,
  Plus, ArrowRight,
  Users, Info, Sparkles, X, Home
} from "lucide-react";
import {
  useAddRoomMutation,
  useGetAllRoomQuery
} from "../../../../backend-routes/ownerroutes/room";
import {

  useGetAllBranchbybranchIdQuery

} from "../../../../backend-routes/ownerroutes/branch";
import { useNavigate } from "react-router-dom";

function AddRoomForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [roomData, setRoomData] = useState({
    roomNumber: "", type: "", price: "", facilities: [], images: [],
    branch: "", category: "", description: "", notAllowed: [], rules: [], advancedmonth: "",
    branchid: "", flattype: "", roomtype: "", renttype: "",
    allowedFor: "Anyone", furnishedType: "Semi Furnished",
    max_adults: "",
    max_children: "",
    extra_bed_price: "",
    // status,

    city: "", services: [{ name: "", price: "" }]
  });

  const { refetch } = useGetAllRoomQuery();
  const [addRoom, { isLoading, isSuccess }] = useAddRoomMutation();
  const { data: Allbranchdata, isLoading: AllBranchloading } = useGetAllBranchbybranchIdQuery();

  const facilityOptions = [
    // Food & Living
    "Food Included",
    "RO Water",
    "Kitchen",

    // Comfort & Climate
    "AC",
    "Cooler",
    "Fan",
    "Geyser",
    "Heater",

    // Connectivity & Power
    "WiFi",
    "Power Backup",

    // Furniture & Appliances
    "Bed",

    "Study Table",
    "Refrigerator",
    "Washing Machine",
    "TV",

    // Hygiene & Services
    "Laundry",
    "Daily Cleaning",

    // Security & Safety
    "CCTV",


    // Parking & Access
    "Parking",



  ];


  // --- VALIDATION LOGIC ---
  const isNonEmpty = (v) =>
    v !== undefined && v !== null && String(v).trim() !== "";

  const isPositiveNumber = (v) => Number(v) > 0;

  const isNonNegativeNumber = (v) => Number(v) >= 0;


  const validateStep = () => {
    const isNonEmpty = (v) =>
      v !== undefined && v !== null && String(v).trim() !== "";

    const isPositiveNumber = (v) => Number(v) > 0;
    const isNonNegativeNumber = (v) => v !== "" && Number(v) >= 0;

    switch (step) {

      /* ================= STEP 1 ================= */
      case 1: {
        if (!isNonEmpty(roomData.branchid)) return false;
        if (!isNonEmpty(roomData.roomNumber)) return false;
        if (!isNonEmpty(roomData.category)) return false;
        if (!isNonEmpty(roomData.allowedFor)) return false;
        if (!isNonEmpty(roomData.furnishedType)) return false;

        // RENTED FLOW
        if (roomData.category === "Rented-Room") {
          if (!isNonEmpty(roomData.renttype)) return false;

          if (
            roomData.renttype === "Room-Rent" &&
            !isNonEmpty(roomData.roomtype)
          ) return false;

          if (
            roomData.renttype === "Flat-Rent" &&
            !isNonEmpty(roomData.flattype)
          ) return false;
        }

        // HOTEL basic check
        if (roomData.category === "Hotel") {
          if (!isNonEmpty(roomData.max_adults)) return false;
          if (!isNonEmpty(roomData.max_children)) return false;
        }

        return true;
      }

      /* ================= STEP 2 ================= */
      case 2: {

       
        /* -------- PG -------- */
        if (roomData.category === "Pg") {
          if (!isNonEmpty(roomData.type)) return false;
           if (!isPositiveNumber(roomData.advancedmonth)) return false;
          if (!isNonNegativeNumber(roomData.price)) return false;
          return true;
        }

        /* -------- HOTEL -------- */
        if (roomData.category === "Hotel") {
          if (!isNonNegativeNumber(roomData.price)) return false;
          if (!isNonNegativeNumber(roomData.extra_bed_price)) return false;
          return true;
        }

        /* -------- RENTED ROOM -------- */
        if (roomData.category === "Rented-Room") {
          if (!isPositiveNumber(roomData.price)) return false;
          return true;
        }

        return false;
      }

      /* ================= STEP 3 ================= */
      case 3: {
        if (!Array.isArray(roomData.images) || roomData.images.length === 0)
          return false;

        if (!Array.isArray(roomData.facilities) || roomData.facilities.length === 0)
          return false;

        if (!Array.isArray(roomData.rules) || roomData.rules.length === 0)
          return false;

        // if (!isNonEmpty(roomData.description)) return false;

        return true;
      }

      default:
        return false;
    }
  };

  const isNextDisabled = !validateStep();

  // --- HANDLERS ---
  const handleCheckboxArray = (field, value) => {
    setRoomData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter(v => v !== value) : [...prev[field], value]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setRoomData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index) => {
    setRoomData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };



  const handleAddRoom = async () => {
    const formData = new FormData();
    Object.keys(roomData).forEach(key => {
      if (['facilities', 'rules'].includes(key)) {
        roomData[key].forEach(val => formData.append(key, val));
      } else if (key === 'services') {
        formData.append(key, JSON.stringify(roomData.services.filter(s => s.name && s.price)));
      } else if (key === 'images') {
        roomData.images.forEach(img => formData.append("images", img));
      } else { formData.append(key, roomData[key]); }
    });
    try {
      // console.log("Submittig room data :" ,roomData)
       await addRoom(formData).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to list property");
    }
  };
  const slideVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success("Property listed successfully!");
      refetch();
      setTimeout(() => navigate(-1), 2000);
    }
  }, [isSuccess]);

  if (AllBranchloading) return (
    <div className="h-screen flex items-center justify-center bg-white animate-pulse">
      <div className="text-orange-500 font-bold">Setting up workspace...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <Toaster position="top-right" />

      <div className="max-w-5xl mx-auto py-12 px-4">
        {/* Step Indicator */}


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 lg:col-start-3">
            <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl overflow-hidden">

              <div className="p-8 md:p-10">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10 sm:space-y-12"
                    >
                      {/* ================= BASIC DETAILS ================= */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

                        {/* Branch */}
                        <InputWrapper label="Assign Branch *" icon={<Building2 size={40} />}>
                          <select
                            className="modern-input text-base sm:text-lg"
                            value={roomData.branchid}
                            onChange={(e) => {
                              const selectedId = e.target.value;
                              const selectedBranch = Allbranchdata?.allbranch?.find(
                                (b) => b._id === selectedId
                              );

                              setRoomData({
                                ...roomData,
                                branchid: selectedId,
                                branch: selectedBranch?.name || "",
                                city: selectedBranch?.city || "",
                              });
                            }}
                          >
                            <option value="">Select Branch</option>
                            {Allbranchdata?.allbranch?.map((b) => (
                              <option key={b._id} value={b._id}>
                                {b.name}
                              </option>
                            ))}
                          </select>
                        </InputWrapper>

                        {/* Room Number */}
                        <InputWrapper label="Room / Unit Number *" icon={<Home size={40} />}>
                          <input
                            className="modern-input text-base sm:text-lg"
                            placeholder="e.g. 101(ONLY NUMBERS ALLOWED)"
                            value={roomData.roomNumber}
                            onChange={(e) =>
                              setRoomData({ ...roomData, roomNumber: e.target.value })
                            }
                          />
                        </InputWrapper>

                        {/* Category */}
                        <InputWrapper label="Category *" icon={<Sparkles size={40} />}>
                          <select
                            className="modern-input text-base sm:text-lg"
                            value={roomData.category}
                            onChange={(e) =>
                              setRoomData({
                                ...roomData,
                                category: e.target.value,
                                renttype: "",
                                roomtype: "",
                                flattype: "",
                              })
                            }
                          >
                            <option value="">Select Category</option>
                            <option value="Pg">PG / Hostel</option>
                            <option value="Rented-Room">Flat / Room</option>
                            <option value="Hotel">Hotel</option>
                          </select>
                        </InputWrapper>
                        {
                          roomData.category !== "Hotel" && <InputWrapper label="Allowed For *" icon={<Users size={20} />}>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              {["Boys", "Girls", "Family", "Anyone"].map((opt) => {
                                const active = roomData.allowedFor === opt;

                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() =>
                                      setRoomData({ ...roomData, allowedFor: opt })
                                    }
                                    className={`py-4 rounded-2xl border-2 text-sm font-bold transition-all
            ${active
                                        ? "border-orange-500 bg-orange-50 text-orange-600 shadow-md"
                                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                                      }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </InputWrapper>
                        }


                        <InputWrapper label="Furnishing Type *" icon={<Home size={20} />}>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {["Fully Furnished", "Semi Furnished", "Unfurnished"].map((opt) => {
                              const active = roomData.furnishedType === opt;

                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() =>
                                    setRoomData({ ...roomData, furnishedType: opt })
                                  }
                                  className={`py-4 rounded-2xl border-2 text-sm font-bold transition-all
            ${active
                                      ? "border-orange-500 bg-orange-50 text-orange-600 shadow-md"
                                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                                    }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </InputWrapper>



                        {/* Rent Type */}
                        {roomData.category === "Rented-Room" && (
                          <InputWrapper label="Rent Type *">
                            <select
                              className="modern-input text-base sm:text-lg"
                              value={roomData.renttype}
                              onChange={(e) =>
                                setRoomData({
                                  ...roomData,
                                  renttype: e.target.value,
                                  roomtype: "",
                                  flattype: "",
                                })
                              }
                            >
                              <option value="">Select Rent Type</option>
                              <option value="Room-Rent">Room Rent</option>
                              <option value="Flat-Rent">Flat Rent</option>
                            </select>
                          </InputWrapper>
                        )}
                        {roomData.category === "Hotel" && (
                          <>

                            {/* Max Adults */}
                            <InputWrapper label="Max Adults *">
                              <input
                                type="number"
                                className="modern-input text-base sm:text-lg"
                                value={roomData.max_adults}
                                onChange={(e) =>
                                  setRoomData({
                                    ...roomData,
                                    max_adults: e.target.value,
                                  })
                                }
                              />
                            </InputWrapper>

                            {/* Max Children */}
                            <InputWrapper label="Max Children *">
                              <input
                                type="number"
                                className="modern-input text-base sm:text-lg"
                                value={roomData.max_children}
                                onChange={(e) =>
                                  setRoomData({
                                    ...roomData,
                                    max_children: e.target.value,
                                  })
                                }
                              />
                            </InputWrapper>

                            {/* Extra Bed Price */}

                          </>
                        )}

                        {/* Flat Type */}
                        {roomData.renttype === "Flat-Rent" && (
                          <InputWrapper label="Flat Type *">
                            <select
                              className="modern-input text-base sm:text-lg"
                              value={roomData.flattype}
                              onChange={(e) =>
                                setRoomData({ ...roomData, flattype: e.target.value })
                              }
                            >
                              <option value="">Select Flat Type</option>
                              {["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "5BHK"].map((f) => (
                                <option key={f} value={f}>
                                  {f}
                                </option>
                              ))}
                            </select>
                          </InputWrapper>
                        )}

                        {/* Room Type */}
                        {roomData.renttype === "Room-Rent" && (
                          <InputWrapper label="Room Type *">
                            <select
                              className="modern-input text-base sm:text-lg"
                              value={roomData.roomtype}
                              onChange={(e) =>
                                setRoomData({ ...roomData, roomtype: e.target.value })
                              }
                            >
                              <option value="">Select Room Type</option>
                              {["Single", "Double", "Triple"].map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                          </InputWrapper>
                        )}
                        {roomData.category === "Hotel" && (
                          <InputWrapper label="Room Type *">
                            <select
                              className="modern-input text-base sm:text-lg"
                              value={roomData.roomtype}
                              onChange={(e) =>
                                setRoomData({ ...roomData, roomtype: e.target.value })
                              }
                            >
                              <option value="">Select Room Type</option>
                              {[
                                "Standard-Single",
                                "Standard-Double",
                                "Twin-Room",
                                "Triple-Room",
                                "Family-Room",
                                "Deluxe",
                                "Super-Deluxe",
                                "Executive",
                                "Suite",
                              ].map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                          </InputWrapper>
                        )}
                      </div>

                      {/* ================= DESCRIPTION ================= */}
                      <InputWrapper label="Property Description  " icon={<Info size={20} />}>
                        <textarea
                          className="modern-input min-h-[160px] text-base sm:text-lg leading-relaxed"
                          // placeholder="Briefly describe the room, amenities, and who it’s ideal for..."
                          value={roomData.description}
                          onChange={(e) =>
                            setRoomData({ ...roomData, description: e.target.value })
                          }
                        />
                        <p className="mt-2 text-sm sm:text-base text-slate-600">
                          This helps users understand your property better and improves conversions.
                        </p>
                      </InputWrapper>
                    </motion.div>
                  )}



                  {step === 2 && (
                    <motion.div
                      key="step2"
                      variants={slideVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-10"
                    >
                      {/* ================= PG FLOW ================= */}
                      {roomData.category === "Pg" ? (
                        <>
                          {/* Sharing Type */}
                          <InputWrapper label="Sharing Configuration *" icon={<Users size={20} className="text-gray-700 dark:text-gray-200" />}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                              {["Single", "Double", "Triple", "Four"].map((t) => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => setRoomData({ ...roomData, type: t })}
                                  className={`group relative py-3 px-4 rounded-xl font-bold text-sm sm:text-base border-2 transition-all duration-200 flex flex-col items-center justify-center shadow-sm hover:shadow-md active:scale-95 h-20 sm:h-24
          ${roomData.type === t
                                      ? "bg-gradient-to-r from-orange-500 to-orange-600 border-orange-500 text-white shadow-orange-400/30 hover:from-orange-600 hover:to-orange-700"
                                      : "bg-white/60 dark:bg-gray-800/60 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-400 hover:bg-white/80 dark:hover:bg-gray-700/70"
                                    }`}
                                >
                                  <span className="text-lg sm:text-xl font-black leading-tight mb-0.5">
                                    {t}
                                  </span>
                                  <span className="text-xs font-medium opacity-100 tracking-wide">
                                    Sharing
                                  </span>
                                  {roomData.type === t && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 to-orange-500/30 rounded-xl blur-xs" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </InputWrapper>




                          {/* Rent + Services */}
                          <div className="bg-slate-50 p-6 sm:p-8 rounded-[2.5rem] border border-slate-200/60 space-y-6">

                            {/* Header */}
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                                  Monthly Rent *
                                </h3>
                                <p className="text-sm text-slate-500">
                                  Base rent charged per month
                                </p>
                              </div>
                            </div>

                            {/* Rent Input */}
                            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
                              <label className="text-sm font-semibold text-slate-700">
                                Rent Amount (₹)
                              </label>

                              <input
                                type="number"
                                min="0"
                                placeholder="Enter monthly rent"
                                className="modern-input text-lg sm:text-xl font-bold"
                                value={roomData.price}
                                onKeyDown={(e) =>
                                  ["-", "e", "E"].includes(e.key) && e.preventDefault()
                                }
                                onChange={(e) =>
                                  setRoomData({ ...roomData, price: e.target.value })
                                }
                              />
                            </div>

                            {/* Total Display */}
                            <div className="flex items-center justify-between border-t border-slate-200 pt-5">
                              <span className="text-sm sm:text-base font-bold uppercase tracking-wide text-slate-600">
                                Total Monthly Rent
                              </span>

                              <span className="text-2xl sm:text-3xl font-extrabold text-orange-500">
                                ₹{roomData.price || 0}
                              </span>
                            </div>
                          </div>


                          {/* Advance Month */}
                          <InputWrapper
                            label="Advance / Security Deposit"
                            icon={<IndianRupee size={18} />}
                          >
                            <input
                              type="number"
                              min="0"
                              placeholder="Enter Amount"
                              className="modern-input"
                              value={roomData.advancedmonth}
                              onKeyDown={(e) =>
                                ["-", "e", "E"].includes(e.key) && e.preventDefault()
                              }
                              onChange={(e) =>
                                setRoomData({
                                  ...roomData,
                                  advancedmonth: e.target.value,
                                })
                              }
                            />
                            <p className="text-[11px] text-slate-400 mt-1">
                              Example: 1 = 1 month advance
                            </p>
                          </InputWrapper>
                        </>
                      ) : (
                        /* ================= NON-PG FLOW ================= */
                        <>
                          <InputWrapper label="Base Pricing (₹) *" icon={<IndianRupee size={18} />}>
                            <input
                              type="number"
                              min="0"
                              className="modern-input text-2xl font-black h-20"
                              value={roomData.price}
                              onKeyDown={(e) =>
                                ["-", "e", "E"].includes(e.key) && e.preventDefault()
                              }
                              onChange={(e) =>
                                setRoomData({ ...roomData, price: e.target.value })
                              }
                            />
                          </InputWrapper>
                          {
                            roomData.category !== "Hotel" ? <>
                              <InputWrapper
                                label="Advance / Security Deposit (Months) *"
                                icon={<IndianRupee size={18} />}
                              >
                                <input
                                  type="number"
                                  min="0"
                                  className="modern-input"
                                  value={roomData.advancedmonth}
                                  onChange={(e) =>
                                    setRoomData({
                                      ...roomData,
                                      advancedmonth: e.target.value,
                                    })
                                  }
                                />
                              </InputWrapper>

                            </> : <>
                              <InputWrapper label="Extra Bed Price *">
                                <input
                                  type="number"
                                  className="modern-input text-base sm:text-lg"
                                  value={roomData.extra_bed_price}
                                  onChange={(e) =>
                                    setRoomData({
                                      ...roomData,
                                      extra_bed_price: e.target.value,
                                    })
                                  }
                                />
                              </InputWrapper>
                            </>
                          }


                        </>
                      )}
                    </motion.div>

                  )}


                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-14"
                    >
                      {/* ================= FACILITIES ================= */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Sparkles size={18} className="text-orange-500" />
                          <h3 className="text-base sm:text-lg font-extrabold uppercase text-slate-900">
                            Facilities *
                          </h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {facilityOptions.map((f) => {
                            const active = roomData.facilities.includes(f);
                            return (
                              <button
                                key={f}
                                type="button"
                                onClick={() => handleCheckboxArray("facilities", f)}
                                className={`py-4 rounded-2xl border-2 text-sm font-bold transition-all
                  ${active
                                    ? "border-orange-500 bg-orange-50 text-orange-600 shadow-md"
                                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                                  }`}
                              >
                                {f}
                              </button>
                            );
                          })}
                        </div>
                      </section>

                      {/* ================= RULES & RESTRICTIONS ================= */}

                      {/* House Rules */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Sparkles size={18} className="text-orange-500" />
                          <h3 className="text-base sm:text-lg font-extrabold uppercase text-slate-900">
                            House Rules
                          </h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {[
                            "Keep Clean",
                            "No Loud Music",
                            "No Outside Guests",
                            "Visitors Not Allowed",
                            "No Parties",
                            "Follow Entry & Exit Timings",
                            "Inform Before Late Entry",
                            "Smoking Prohibited",
                            "Alcohol Prohibited",
                          ].map((rule) => {
                            const active = roomData.rules.includes(rule);

                            return (
                              <button
                                key={rule}
                                type="button"
                                onClick={() => handleCheckboxArray("rules", rule)}
                                className={`py-4 rounded-2xl border-2 text-sm font-bold transition-all
          ${active
                                    ? "border-orange-500 bg-orange-50 text-orange-600 shadow-md"
                                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                                  }`}
                              >
                                {rule}
                              </button>
                            );
                          })}
                        </div>



                      </section>

                      {/* 🔒 Restrictions (future use) */}
                      {/* <section className="space-y-4"></section> */}

                      {/* ================= GALLERY ================= */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-2">
                          <ImageIcon size={18} className="text-indigo-600" />
                          <h3 className="text-base sm:text-lg font-extrabold uppercase text-slate-900">
                            Gallery (Min 1 Photo) *
                          </h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4
                      bg-slate-50 p-4 rounded-3xl border-2 border-dashed border-slate-300">
                          {roomData.images.map((img, i) => (
                            <div
                              key={i}
                              className="aspect-square rounded-xl overflow-hidden relative group border"
                            >
                              <img
                                src={URL.createObjectURL(img)}
                                alt="Property"
                                className="w-full h-full object-cover"
                              />

                              <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="absolute top-2 right-2 bg-red-600 text-white p-1.5
                         rounded-full opacity-0 group-hover:opacity-100 transition"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}

                          {/* Upload */}
                          <label
                            className="aspect-square bg-white rounded-xl border-2 border-dashed
                     border-slate-300 flex items-center justify-center
                     cursor-pointer hover:border-orange-500 transition"
                          >
                            <Plus size={28} className="text-slate-400" />
                            <input type="file" multiple hidden onChange={handleImageUpload} />
                          </label>
                        </div>
                      </section>
                    </motion.div>
                  )}


                </AnimatePresence>
              </div>

              {/* Action Bar */}
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="font-bold text-slate-400 hover:text-slate-900">
                  {step === 1 ? "Cancel" : "Back"}
                </button>
                <button
                  disabled={isNextDisabled || isLoading}
                  onClick={() => step < 3 ? setStep(step + 1) : handleAddRoom()}
                  className={`px-10 py-4 rounded-2xl font-black flex items-center gap-3 transition-all ${isNextDisabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white shadow-xl hover:bg-orange-600 shadow-slate-200'}`}
                >
                  {isLoading ? "Publishing..." : step === 3 ? "Launch Listing" : "Continue"}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .modern-input { width: 100%; padding: 0.8rem 1.2rem; background: #F8FAFC; border: 2px solid #F1F5F9; border-radius: 1rem; font-weight: 600; outline: none; transition: 0.2s; }
        .modern-input:focus { border-color: #f97316; background: white; box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1); }
      `}</style>
    </div>
  );
}

// function InputWrapper({ label, children, icon }) {
//   return (
//     <div className="space-y-2">
//       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
//         {icon} {label}
//       </label>
//       {children}
//     </div>
//   );
// }

const InputWrapper = ({ label, icon, children }) => {
  return (
    <div className="w-full">
      <label
        className="
          flex items-center gap-2 mb-2
          text-sm sm:text-base
          font-semibold
          uppercase tracking-wide
          text-slate-800
        "
      >
        {icon && (
          <span className="text-slate-700">
            {icon}
          </span>
        )}
        {label}
      </label>

      {children}
    </div>
  );
};

export default AddRoomForm;