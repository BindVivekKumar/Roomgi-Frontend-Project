import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  useGetAllFilteredQuery,
  useAppliedAllFilteredMutation,
  useGetAllnearestPgMutation,
} from "../backend-routes/userroutes/filter";

import { Loader2, Search } from "lucide-react";
import ROOMCARD from "../user/roomcard";

export default function Searched() {
  const { city } = useParams();
  const searchInputRef = useRef(null);

  const { data, isLoading } = useGetAllFilteredQuery(city);
  const [applyFilters, { isLoading: pgisLoading }] =
    useAppliedAllFilteredMutation();
  const [getAllnearestPg] = useGetAllnearestPgMutation();

  const [pgData, setPgData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");

  // FILTER STATES
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(50000);
  const [category, setCategory] = useState("any");
  const [type, setType] = useState("any");

  /* ================= GOOGLE AUTOCOMPLETE ================= */
  useEffect(() => {
    if (!window.google || !searchInputRef.current || !city) return;

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: city }, (results, status) => {
      if (status !== "OK" || !results?.[0]) return;

      const bounds = results[0].geometry.viewport;

      const autocomplete = new window.google.maps.places.Autocomplete(
        searchInputRef.current,
        {
          bounds,
          strictBounds: true,
          componentRestrictions: { country: "IN" },
        }
      );

      autocomplete.addListener("place_changed", async () => {
        const place = autocomplete.getPlace();
        if (!place?.geometry) return;

        const lat = place.geometry.location.lat();
        const long = place.geometry.location.lng();

        setSearchQuery(place.formatted_address || "");

        try {
          const res = await getAllnearestPg({ lat, long }).unwrap();
          setPgData(res?.data || []);
        } catch (err) {
          console.error(err);
        }
      });
    });
  }, [city]);

  /* ================= RESET ================= */
  useEffect(() => {
    setSearchQuery("");
    setPgData(data?.data || []);
  }, [city, data]);

  /* ================= SEARCH ================= */
  const handleFindPG = () => {
    if (!searchQuery.trim()) {
      setSearchError("Please enter area or property name");
      return;
    }
    setSearchError("");

    const filtered = data?.data?.filter(
      (pg) =>
        pg.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pg.branch?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setPgData(filtered || []);
  };

  /* ================= APPLY FILTER ================= */
  const handleApplyFilters = async () => {
    const filterBody = {
      city,
      min: Number(min),
      max: Number(max),
      category,
      type,
    };

    try {
      const response = await applyFilters(filterBody).unwrap();
      setPgData(response?.data || []);
      setIsFilterOpen(false);
    } catch (err) {
      console.error("Filter error:", err);
    }
  };

  /* ================= RESET FILTER ================= */
  const handleResetFilters = () => {
    setMin(0);
    setMax(50000);
    setCategory("any");
    setType("any");
    setPgData(data?.data || []);
  };

  /* ================= LOADER ================= */
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
        <p className="mt-3">Finding stays in {city}...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* SEARCH BAR */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">Find PG & Homes</h1>
            <p className="text-green-600 font-semibold">
              100% Verified | Owner Posted
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search area..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!e.target.value.trim())
                    setPgData(data?.data || []);
                }}
                className="w-full pl-12 pr-4 py-4 border rounded-2xl"
              />
            </div>

            <button
              onClick={handleFindPG}
              className="bg-green-500 text-white px-6 py-4 rounded-2xl"
            >
              Search
            </button>

            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="border-2 border-green-500 text-green-500 px-6 py-4 rounded-2xl"
            >
              {isFilterOpen ? "Close Filters" : "Filters"}
            </button>
          </div>

          {searchError && (
            <p className="text-red-500 mt-2 text-center">{searchError}</p>
          )}
        </div>
      </div>

      {/* FILTER PANEL */}
      {isFilterOpen && (
  <div className="max-w-7xl mx-auto px-4 mt-6">

    <div className="
      bg-white rounded-3xl shadow-xl border border-gray-200
      p-6 md:p-8 transition-all duration-300
    ">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Filter Properties
        </h2>

        <button
          onClick={() => setIsFilterOpen(false)}
          className="text-gray-400 hover:text-red-500 text-lg"
        >
          ✕
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* MIN PRICE */}
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">
            Min Price
          </label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            placeholder="₹ 0"
            className="
              w-full p-3 rounded-xl border
              focus:ring-2 focus:ring-green-400
              outline-none
            "
          />
        </div>

        {/* MAX PRICE */}
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">
            Max Price
          </label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            placeholder="₹ 50,000"
            className="
              w-full p-3 rounded-xl border
              focus:ring-2 focus:ring-green-400
              outline-none
            "
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">
            Property Type
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="
              w-full p-3 rounded-xl border
              focus:ring-2 focus:ring-green-400
              outline-none
            "
          >
            <option value="Pg">PG</option>
            <option value="Rented-Room">Flat</option>
            <option value="Hotel">Hotel</option>
          </select>
        </div>

        {/* ROOM TYPE */}
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">
            Room Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="
              w-full p-3 rounded-xl border
              focus:ring-2 focus:ring-green-400
              outline-none
            "
          >
            <option value="any">Any</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Triple">Triple</option>
          </select>
        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">

        {/* LEFT */}
        <button
          onClick={handleResetFilters}
          className="
            w-full md:w-auto
            px-6 py-3 rounded-xl
            bg-gray-100 text-gray-700
            hover:bg-gray-200
            transition
          "
        >
          Reset Filters
        </button>

        {/* RIGHT */}
        <button
          onClick={handleApplyFilters}
          className="
            w-full md:w-auto
            px-8 py-3 rounded-xl
            bg-gradient-to-r from-green-500 to-green-600
            text-white font-semibold
            shadow-lg hover:shadow-xl
            hover:scale-105
            transition-all duration-300
          "
        >
          Apply Filters
        </button>

      </div>

      {/* LOADING */}
      {pgisLoading && (
        <div className="mt-4 text-green-500 text-sm">
          Applying filters...
        </div>
      )}

    </div>
  </div>
)}

      {/* RESULTS */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {pgData?.length ? (
          <ROOMCARD pgData={pgData} />
        ) : (
          <div className="text-center mt-20">
            <p className="text-xl font-bold">No properties found</p>
          </div>
        )}
      </div>
    </div>
  );
}