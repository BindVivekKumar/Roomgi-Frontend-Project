import { useState } from "react";
import Calendar from "react-calendar";
import axios from "axios"
import{useParams} from "react-router-dom"

import { useGetPgByIdQuery } from "../backend-routes/userroutes/allpg.js";




export default function HotelBookingPage() {
    const {id}=useParams();
    const { data, isLoading, isError } = useGetPgByIdQuery(id);
      const pg = data?.room;
  const [form, setForm] = useState({
    checkIn: "",
    checkOut: "",
    adults: 1,
  });

    const handleSubmit = async (amount) => {
      try {
        const payload = {
          ...form,
          price: amount,
        };
  
        const response = await axios.post(
          "http://localhost:5000/api/v1/hotel/user/create-booking",
          payload
        );
  
        console.log(response.data);
  
        if (response.data.success) {
          toast.success("Booking created successfully ✅");
          setShowForm(false);
        } else {
          toast.error(response.data.message || "Booking failed ❌");
        }
  
      } catch (error) {
        console.error(error);
  
        toast.error(
          error?.response?.data?.message || "Something went wrong ❌"
        );
      }
    };
  const getNights = () => {
    if (!form.checkIn || !form.checkOut) return 0;
    return (
      (new Date(form.checkOut) - new Date(form.checkIn)) /
      (1000 * 60 * 60 * 24)
    );
  };

  const totalPrice = getNights() * (pg?.base_price || 0);

  return (

  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-10 px-4">
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

      {/* LEFT SIDE */}
      <div className="lg:col-span-2 space-y-8">

        {/* IMAGE */}
        <div className="relative">
          <img
            src={pg?.images?.[0]}
            className="w-full h-[380px] object-cover rounded-3xl shadow-xl"
          />
          <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-4 py-2 rounded-xl shadow">
            <p className="font-bold text-lg">{pg?.branch?.name}</p>
          </div>
        </div>

        {/* INFO */}
        <div className="bg-white p-6 rounded-3xl shadow-md">
          <h1 className="text-3xl font-extrabold text-gray-800">
            {pg?.branch?.name}
          </h1>

          <p className="text-gray-500 mt-1">
            📍 {pg?.branch?.city}, {pg?.branch?.state}
          </p>

          <p className="mt-4 text-gray-600 leading-relaxed">
            {pg?.description || "Comfortable stay with premium facilities."}
          </p>
        </div>

        {/* FACILITIES */}
        <div className="bg-white p-6 rounded-3xl shadow-md">
          <h2 className="text-xl font-bold mb-4">✨ Facilities</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {pg?.facilities?.map((f, i) => (
              <div
                key={i}
                className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-xl text-sm font-medium text-center"
              >
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE (BOOKING CARD) */}
      <div className="sticky top-10 h-fit">

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6">

          {/* PRICE */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-extrabold text-gray-900">
              ₹{pg?.base_price}
              <span className="text-sm text-gray-500 font-medium"> / night</span>
            </h2>
          </div>

          {/* DATE DISPLAY */}
          <div className="border rounded-2xl p-3 mb-4 bg-gray-50">
            <p className="text-sm font-semibold text-gray-700">
              {form.checkIn || "Check-in"} → {form.checkOut || "Check-out"}
            </p>
          </div>

          {/* CALENDAR */}
          <div className="rounded-2xl overflow-hidden border mb-4">
            <Calendar
              minDate={new Date()}
              showNeighboringMonth={false}
              className="border-0 w-full"

              onClickDay={(date) => {
                if (!form.checkIn) {
                  setForm({
                    ...form,
                    checkIn: date.toISOString().split("T")[0],
                    checkOut: "",
                  });
                } else if (!form.checkOut) {
                  const checkInDate = new Date(form.checkIn);

                  if (date < checkInDate) {
                    setForm({
                      ...form,
                      checkIn: date.toISOString().split("T")[0],
                      checkOut: "",
                    });
                  } else {
                    setForm({
                      ...form,
                      checkOut: date.toISOString().split("T")[0],
                    });
                  }
                } else {
                  setForm({
                    ...form,
                    checkIn: date.toISOString().split("T")[0],
                    checkOut: "",
                  });
                }
              }}
            />
          </div>

          {/* GUEST SELECTOR */}
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
            <span className="font-medium text-gray-700">Guests</span>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setForm({
                    ...form,
                    adults: Math.max(1, form.adults - 1),
                  })
                }
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
              >
                -
              </button>

              <span className="font-bold text-lg">{form.adults}</span>

              <button
                onClick={() =>
                  setForm({
                    ...form,
                    adults: form.adults + 1,
                  })
                }
                className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center hover:bg-indigo-600"
              >
                +
              </button>
            </div>
          </div>

          {/* PRICE BREAKDOWN */}
          {form.checkIn && form.checkOut && (
            <div className="mt-6 border-t pt-4 space-y-3 text-sm">

              <div className="flex justify-between">
                <span>Nights</span>
                <span className="font-semibold">{getNights()}</span>
              </div>

              <div className="flex justify-between">
                <span>Price/night</span>
                <span>₹{pg?.base_price}</span>
              </div>

              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Total</span>
                <span className="text-indigo-600">₹{totalPrice}</span>
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => handleSubmit(totalPrice)}
            disabled={!form.checkIn || !form.checkOut}
            className="w-full mt-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {form.checkIn && form.checkOut
              ? `Confirm Booking ₹${totalPrice}`
              : "Select dates first"}
          </button>

          <p className="text-xs text-gray-400 text-center mt-3">
            🔒 Secure payment | Free cancellation
          </p>
        </div>
      </div>
    </div>
  </div>
);
}