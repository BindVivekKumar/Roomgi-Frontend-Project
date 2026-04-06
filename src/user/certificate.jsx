import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useVerifyCertificateQuery } from "../backend-routes/userroutes/certificate";
import axios from "axios";

export default function CertificateVerify() {
  const [certNo, setCertNo] = useState("");
  const [searchId, setSearchId] = useState("");

  const certRef = useRef();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setSearchId(idFromUrl);
      setCertNo(idFromUrl);
    }
  }, [searchParams]);

  const { data, error, isLoading } = useVerifyCertificateQuery(searchId, {
    skip: !searchId,
  });

  const handleVerify = () => {
    if (!certNo) return;
    setSearchId(certNo);
  };

  // 📄 Download Certificate (FIXED)
  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/v1/admin/certificate/download?id=${searchId}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `certificate-${searchId}.pdf`);

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download certificate");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-[420px]">

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🎓 Certificate Verification
        </h2>

        {/* Input */}
        <input
          type="text"
          placeholder="Enter Certificate ID"
          value={certNo}
          onChange={(e) => setCertNo(e.target.value.toUpperCase())}
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <p className="text-xs text-gray-500 mt-2 text-center">
          Example: CERT-ROOMGI-2026-XXXXXX
        </p>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isLoading}
          className="w-full mt-4 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition"
        >
          {isLoading ? "Verifying..." : "🔍 Verify"}
        </button>

        {/* RESULT */}
        {data?.data && (
          <div
            ref={certRef}
            className="mt-6 bg-gradient-to-br from-white to-gray-50 border rounded-2xl p-5 shadow-lg space-y-3"
          >
            <p className="text-green-600 font-bold text-center text-lg">
              ✅ Verified Certificate
            </p>

            <div className="text-sm space-y-1">
              <p><strong>👤 Name:</strong> {data.data.name}</p>
              <p><strong>💼 Role:</strong> {data.data.role}</p>
              <p><strong>📅 Duration:</strong> {data.data.duration}</p>

              <p>
                <strong>🗓 Start:</strong>{" "}
                {new Date(data.data.startDate).toLocaleDateString("en-IN")}
              </p>

              <p>
                <strong>🗓 End:</strong>{" "}
                {new Date(data.data.endDate).toLocaleDateString("en-IN")}
              </p>

              <p>
                <strong>💰 Stipend:</strong>{" "}
                {data.data.type === "Paid"
                  ? `₹${data.data.amount}`
                  : "Unpaid"}
              </p>

              <p><strong>📌 Type:</strong> {data.data.type}</p>
            </div>

            {/* Link */}
            <a
              href={data.data.qrLink}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline text-xs block text-center"
            >
              🔗 View Official Certificate
            </a>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="w-full mt-3 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition font-semibold"
            >
              📄 Download Certificate
            </button>
          </div>
        )}

        {/* Invalid */}
        {data && !data.data && (
          <p className="mt-4 text-center text-red-500 font-medium">
            ❌ Invalid Certificate
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="mt-4 text-center text-red-500">
            Server Error
          </p>
        )}
      </div>
    </div>
  );
}