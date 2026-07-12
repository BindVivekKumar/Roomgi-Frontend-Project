import heroimg from "../assets/heroimg.webp";
import {
  Search,
  MapPin,
  ShieldCheck,
  CreditCard,
  Zap,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetservicesareaQuery } from "../backend-routes/userroutes/allpg";

export default function SearchPage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [supportedCities, setSupportedCities] = useState([]);

  const { data } = useGetservicesareaQuery();

  /* ----------------------------------
     Store Supported Cities Safely
  -----------------------------------*/
  useEffect(() => {
    if (data?.success && Array.isArray(data.data)) {
      setSupportedCities(data.data);
    } else {
      setSupportedCities([]);
    }
  }, [data]);

  /* ----------------------------------
     Google Places Autocomplete
  -----------------------------------*/
  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode"],
        componentRestrictions: { country: "in" },
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place?.address_components) return;

      let city = "";
      let area = "";

      place.address_components.forEach((c) => {
        if (c.types.includes("locality")) city = c.long_name;
        if (
          c.types.includes("sublocality") ||
          c.types.includes("sublocality_level_1")
        ) {
          area = c.long_name;
        }
      });

      if (!city) return;

      const isSupported = supportedCities.some(
        (c) => c.city.toLowerCase() === city.toLowerCase()
      );

      if (!isSupported) {
        toast.info(`RoomGi is not available in ${city} yet 🌍`);
        return;
      }

      navigate(`/search/${city}`);
    });

    return () =>
      window.google.maps.event.clearInstanceListeners(autocomplete);
  }, [supportedCities, navigate]);

  /* ----------------------------------
     Input Change
  -----------------------------------*/
  const handleFreeTextSearch = (value) => {
    setSearchError("");
    setSearchQuery(value);
  };

  /* ----------------------------------
     Find Button Click
  -----------------------------------*/
  const handleFindPG = useCallback(() => {
    setSearchError("");

    if (!searchQuery.trim()) {
      setSearchError("Please enter a location");
      return;
    }

    // const matchedCity = supportedCities.find((c) =>
    //   searchQuery.toLowerCase().includes(c.city.toLowerCase())
    // );


    const query = searchQuery.trim().toLowerCase();

const matchedCity = supportedCities.find((c) => {
  const city = c.city?.trim().toLowerCase();

  return (
    city?.startsWith(query) ||
    city?.includes(query) ||
    query.startsWith(city) ||
    query.includes(city)
  );
});

    if (!matchedCity) {
      toast.info("Service not available in this location yet 🌏");
      return;
    }

    navigate(`/search/${searchQuery}`);
  }, [searchQuery, supportedCities, navigate]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroimg}
          className="w-full h-full object-cover brightness-50"
          alt="hero"
        />
      </div>

      {/* Trust Badges */}
      <div className="absolute top-4 left-4 flex gap-3 z-10">
        {[ShieldCheck, CreditCard, Zap].map((Icon, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur px-3 py-2 rounded-xl text-white flex items-center gap-2"
          >
            <Icon size={16} />
            <span className="text-xs font-bold">
              {i === 0
                ? "Verified"
                : i === 1
                ? "Free property listing"
                : "Instant Booking"}
            </span>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl w-full px-4 text-center">
        <h1 className="text-5xl font-black text-white mb-6">
          Find Your <span className="text-indigo-400">Perfect Stay</span>
        </h1>

        <p className="text-indigo-100 mb-10">
          Free property listing• Verified properties • Instant booking
        </p>

        {/* Search Box */}
        <div className="bg-white rounded-2xl p-4 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center flex-1 border rounded-xl px-4">
              <MapPin className="text-indigo-500 mr-2" />
              <input
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => handleFreeTextSearch(e.target.value)}
                placeholder="Enter city or area"
                className="w-full py-3 outline-none font-semibold"
              />
            </div>

            <button
              onClick={handleFindPG}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Search size={18} />
              Find Rooms
            </button>
          </div>

          {searchError && (
            <p className="text-red-500 mt-2 text-sm font-semibold">
              {searchError}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
