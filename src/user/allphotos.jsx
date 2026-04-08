import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useGetPgByIdQuery } from "../backend-routes/userroutes/allpg.js";
import FullWidthSlider from "../user/FullWidthSlider";

export default function AllPotos() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetPgByIdQuery(id);

  useEffect(() => {
    if (data) console.log(data);
  }, [data]);

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  const images = data?.room?.rooms[0]?.roomImages || [];

  return (
    <div className="max-w-6xl mx-auto px-4 pb-10">

      {/* 🔙 Back Button + Title */}
      <div className="flex items-center justify-between mt-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold text-gray-800 tracking-wide">
          📸 All Photos
        </h1>

        <div></div>
      </div>

      {/* ⭐ FULL WIDTH SLIDER */}
      {images.length > 0 && (
        <div className="rounded-xl overflow-hidden shadow-lg">
          <FullWidthSlider images={images} />
        </div>
      )}

      {/* ⭐ GRID BELOW */}
      <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
        More Photos
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

        {images.map((img, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden shadow-md border border-gray-200
            hover:shadow-xl transition hover:scale-105 bg-white"
          >
            <img
              src={img}
              className="w-full h-44 object-cover transition duration-300 hover:brightness-90"
              alt=""
            />
          </div>
        ))}

      </div>
    </div>
  );
}
