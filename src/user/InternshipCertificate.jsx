import { useState } from "react";

const InternshipCertificate = () => {
  const [certificateId, setCertificateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (!certificateId) {
      setError("Please enter Certificate ID");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/certificate/verify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ certificateId }),
        }
      );

      if (!res.ok) throw new Error("Invalid");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `RoomGi_Certificate_${certificateId}.pdf`;
      a.click();
    } catch (err) {
      setError("Invalid or unapproved Certificate ID");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[360px]">
        <h2 className="text-xl font-bold text-center mb-4">
          Internship Certificate
        </h2>

        <input
          type="text"
          placeholder="Enter Certificate ID"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
          className="w-full border p-2 rounded mb-2"
        />

        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}

        <button
          onClick={handleDownload}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          {loading ? "Verifying..." : "Verify & Download"}
        </button>
      </div>
    </div>
  );
};

export default InternshipCertificate;
