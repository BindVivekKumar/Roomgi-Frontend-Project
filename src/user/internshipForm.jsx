import React, { useState } from "react";

const InternshipForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    degree: "",
    year: "",
    role: "",
    skills: "",
    linkedin: "",
    github: "",
    portfolio: "",
    resume: null, // File upload
    whyJoin: "",
    availability: "",
  });

  const [loading, setLoading] = useState(false);

  // File aur Text input dono ko handle karne ke liye update kiya gaya handleChange
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ⚠️ APNE TELEGRAM BOT KI DETAILS YAHA DAALEIN
    const TELEGRAM_BOT_TOKEN = "8913075639:AAFgAXAN4GVNtJoFb72xINOL5lcpxM3NvCk";
    const TELEGRAM_CHAT_ID = "8615218309";

    // Telegram message format taiyar karna (Markdown support ke sath)
    const textMessage = `
🚀 *New Internship Application* 🚀
----------------------------------
👤 *Name:* ${formData.fullName}
📧 *Email:* ${formData.email}
📞 *Phone:* ${formData.phone}
🏢 *College:* ${formData.college}
🎓 *Degree:* ${formData.degree} (${formData.year})
💼 *Role:* ${formData.role}
🛠️ *Skills:* ${formData.skills}
⏳ *Availability:* ${formData.availability}

🔗 *Profiles:*
• LinkedIn: ${formData.linkedin || "N/A"}
• GitHub: ${formData.github || "N/A"}
• Portfolio: ${formData.portfolio || "N/A"}

📝 *Why Join Roomgi?:*
${formData.whyJoin}
----------------------------------
    `;

    try {
      // 1. Pehle Text Details Bhejein
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: textMessage,
          parse_mode: "Markdown",
        }),
      });

      // 2. Agar user ne Resume/File upload ki hai, toh use alag se send karein
      if (formData.resume) {
        const fileData = new FormData();
        fileData.append("chat_id", TELEGRAM_CHAT_ID);
        fileData.append("document", formData.resume);
        fileData.append("caption", `📄 Resume of ${formData.fullName}`);

        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
          method: "POST",
          body: fileData, // Form data content-type header fetch khud set kar leta hai
        });
      }

      alert("Application successfully submitted and sent to Telegram!");
      
      // Save Data API / Redirect to Payment
      // navigate("/payment");

    } catch (error) {
      console.error("Error sending data to Telegram:", error);
      alert("Something went wrong while submitting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-black py-20 px-5">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-white">
            Roomgi Internship Program
          </h1>
          <p className="text-gray-300 mt-4 text-lg">
            Build. Learn. Grow with one of the fastest growing student startups.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            {/* Email */}
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Phone */}
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            {/* College */}
            <Input
              label="College / University"
              name="college"
              value={formData.college}
              onChange={handleChange}
              required
            />

            {/* Degree */}
            <Input
              label="Degree"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              required
            />

            {/* Year */}
            <div>
              <label className="text-white mb-2 block">Current Year</label>
              <select
                name="year"
                onChange={handleChange}
                required
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white focus:border-purple-500 outline-none"
              >
                <option value="">Choose Year</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>Final Year</option>
                <option>Graduate</option>
              </select>
            </div>

            {/* Role */}
            <div className="md:col-span-2">
              <label className="text-white block mb-2">Preferred Internship Role</label>
              <select
                name="role"
                onChange={handleChange}
                required
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white focus:border-purple-500 outline-none"
              >
                <option value="">Select Role</option>
                <option>Frontend Developer</option>
                <option>Backend Developer</option>
                <option>Full Stack Developer</option>
                <option>React Developer</option>
                <option>Node.js Developer</option>
                <option>AI / ML</option>
                <option>UI/UX Designer</option>
                <option>Marketing</option>
                <option>Business Development</option>
                <option>Campus Ambassador</option>
              </select>
            </div>

            {/* Skills */}
            <div className="md:col-span-2">
              <label className="text-white mb-2 block">Technical Skills</label>
              <input
                type="text"
                name="skills"
                onChange={handleChange}
                required
                placeholder="React, Node.js, Java, Python..."
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 outline-none"
              />
            </div>

            {/* LinkedIn */}
            <Input
              label="LinkedIn Profile"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
            />

            {/* Github */}
            <Input
              label="GitHub / Portfolio"
              name="github"
              value={formData.github}
              onChange={handleChange}
            />

            {/* Portfolio */}
            <Input
              label="Portfolio Website (Optional)"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
            />

            {/* Availability */}
            <div>
              <label className="text-white block mb-2">Availability</label>
              <select
                name="availability"
                onChange={handleChange}
                required
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white focus:border-purple-500 outline-none"
              >
                <option value="">Select</option>
                <option>Part Time</option>
                <option>Full Time</option>
              </select>
            </div>

            {/* Resume */}
            <div className="md:col-span-2">
              <label className="text-white block mb-2">Upload Resume</label>
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
              />
            </div>

            {/* Why Join */}
            <div className="md:col-span-2">
              <label className="text-white block mb-2">Why do you want to join Roomgi?</label>
              <textarea
                rows={5}
                name="whyJoin"
                onChange={handleChange}
                required
                placeholder="Tell us about yourself..."
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <input type="checkbox" required className="w-4 h-4 accent-purple-600" />
            <span className="text-gray-300 text-sm">
              I confirm that all the information provided is accurate.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed transition rounded-xl py-4 text-white font-bold text-lg"
          >
            {loading ? "Submitting Application..." : "Register & Continue to Payment →"}
          </button>
        </form>
      </div>
    </section>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-white block mb-2">{label}</label>
    <input
      {...props}
      className="w-full rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 outline-none"
    />
  </div>
);

export default InternshipForm;
