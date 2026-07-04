// import React, { useState, useMemo } from "react";
// import axios from "axios";
 
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
 
 
 
 
const SECTIONS = [
  { id: "personal", number: "01", title: "Personal information", required: ["fullName", "email", "phone"] },
  { id: "academic", number: "02", title: "Academic background", required: ["college", "degree", "year"] },
  { id: "role", number: "03", title: "Role and skills", required: ["role", "skills", "availability"] },
  { id: "links", number: "04", title: "Professional links", required: [] },
  { id: "documents", number: "05", title: "Documents", required: ["resume"] },
  { id: "statement", number: "06", title: "Statement of interest", required: ["whyJoin"] },
];
 
const RESPONSIVE_CSS = `
  @media (max-width: 1100px) {
    .rg-topbar-inner, .rg-hero, .rg-body, .rg-footer-inner { max-width: 100% !important; }
    .rg-body { padding: 0 24px 56px !important; gap: 24px !important; }
    .rg-sidebar { padding: 18px 16px !important; }
  }
  @media (max-width: 900px) {
    .rg-body { grid-template-columns: 1fr !important; }
    .rg-sidebar { position: static !important; top: auto !important; }
    .rg-sidebar-list { display: flex !important; flex-wrap: wrap !important; gap: 6px !important; }
    .rg-sidebar-item { margin-bottom: 0 !important; }
    .rg-sidebar-link { padding: 6px 4px !important; }
    .rg-sidebar-note { display: none !important; }
    .rg-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .rg-hero-title { font-size: 32px !important; }
  }
  @media (max-width: 768px) {
    .rg-section { padding: 24px 20px !important; }
    .rg-section-body { padding-left: 0 !important; }
    .rg-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
  }
  @media (max-width: 640px) {
    .rg-topbar-inner { padding: 14px 18px !important; }
    .rg-logo { font-size: 18px !important; }
    .rg-hero { padding: 32px 18px 24px !important; }
    .rg-hero-title { font-size: 27px !important; }
    .rg-hero-sub { font-size: 14px !important; }
    .rg-body { padding: 0 18px 40px !important; gap: 20px !important; }
    .rg-sidebar { padding: 14px !important; }
    .rg-section { padding: 22px 18px !important; }
    .rg-section-header { gap: 10px !important; margin-bottom: 16px !important; }
    .rg-section-number { font-size: 17px !important; min-width: 24px !important; }
    .rg-section-title { font-size: 15.5px !important; }
    .rg-section-body { padding-left: 0 !important; }
    .rg-grid { grid-template-columns: 1fr !important; gap: 14px !important; }
    .rg-declaration { padding: 18px !important; }
    .rg-submit-row { flex-direction: column !important; align-items: stretch !important; padding: 18px !important; }
    .rg-submit-note { max-width: none !important; order: 2 !important; }
    .rg-submit-btn { width: 100% !important; order: 1 !important; }
    .rg-footer-inner { padding: 16px 18px !important; }
    .rg-confirm-wrap { padding: 40px 18px !important; }
    .rg-confirm-card { padding: 28px 20px !important; }
    .rg-confirm-title { font-size: 21px !important; }
  }
  @media (max-width: 400px) {
    .rg-hero-title { font-size: 24px !important; }
    .rg-section { padding: 18px 14px !important; }
    .rg-sidebar-text { font-size: 12.5px !important; }
  }
`;
 
const ResponsiveStyles = () => <style>{RESPONSIVE_CSS}</style>;
 
const API_BASE = "https://roomgi-backend-project-7pjg.onrender.com/api/v1/payment/user";
const RAZORPAY_KEY_ID = "rzp_live_Rn8nwfw3Hdmb8E"; // public key_id, safe to expose client-side
 
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
 
 
 
const InternshipForm = () => {
 
  useEffect(() => {
  loadRazorpay();
}, []);
 
 
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
    resume: null,
    whyJoin: "",
    availability: "",
  });
 
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showApplicationForm, setShowApplicationForm] = useState(false);
 
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };
 
  const sectionStatus = useMemo(() => {
    return SECTIONS.map((section) => {
      const optional = section.required.length === 0;
      const complete =
        !optional &&
        section.required.every((field) => {
          const value = formData[field];
          return value !== null && value !== undefined && value !== "";
        });
      return { ...section, optional, complete };
    });
  }, [formData]);
 
  const handleApplyNow = () => {
    setShowApplicationForm(true);
    // Give the new section a moment to mount, then scroll to it
    setTimeout(() => {
      const el = document.getElementById("personal");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
 
    try {
      // 1. Load Razorpay checkout script
      // setLoadingLabel("Preparing checkout…");
      // const razorpayLoaded = await loadRazorpay();
      // if (!razorpayLoaded) {
      //   throw new Error("Unable to load Razorpay. Check your internet connection.");
      // }
 
      // 2. Upload resume first, get back a URL to store
      // setLoadingLabel("Uploading resume…");
      // const uploadForm = new FormData();
      // uploadForm.append("resume", formData.resume);
 
      // const { data: uploadRes } = await axios.post(
      //   `${API_BASE}/upload-resume`,
      //   uploadForm,
      //   { headers: { "Content-Type": "multipart/form-data" } }
      // );
 
      // if (!uploadRes?.success || !uploadRes?.url) {
      //   throw new Error("Resume upload failed. Please try again.");
      // }
      // const resumeUrl = uploadRes.url;
 
      const resumeUrl = "";
 
      // 3. Create Razorpay order
      setLoadingLabel("Creating order…");
    const { data: order } = await axios.post(
  `${API_BASE}/internship-payment`,
  {
    amount: 5900,
  }
);
 
      // 4. Open Razorpay checkout
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Roomgi",
        description: "Internship Application Fee",
        order_id: order.id,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        handler: async function (response) {
  try {
    const { data } = await axios.post(
      `${API_BASE}/verify-internship-payment`,
      {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
 
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
        degree: formData.degree,
        year: formData.year,
        role: formData.role,
        skills: formData.skills,
        linkedin: formData.linkedin,
        github: formData.github,
        portfolio: formData.portfolio,
        whyJoin: formData.whyJoin,
        availability: formData.availability,
      }
    );
 
    console.log(data);
 
   if (data.success) {
    setReferenceId(
      data.referenceId || `RMG-${Date.now()}`
    );
 
    setSubmitted(true);
 
    setLoading(false);
    setLoadingLabel("");
}
  } catch (err) {
    console.error(err);
    alert("Payment verification failed.");
  }
},
        modal: {
          ondismiss: () => {
            setLoading(false);
            setLoadingLabel("");
          },
        },
      };
 
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        console.error("Payment failed:", resp.error);
        setErrorMsg(`Payment failed: ${resp.error.description || "please try again."}`);
        setLoading(false);
        setLoadingLabel("");
      });
      rzp.open();
      // NOTE: loading stays true while checkout modal is open;
      // it's cleared in handler/ondismiss/payment.failed above.
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setLoading(false);
      setLoadingLabel("");
    }
  };
 
  if (submitted) {
    return (
      <div style={styles.page}>
        <ResponsiveStyles />
        <TopBar />
        <div style={styles.confirmWrap} className="rg-confirm-wrap">
          <div style={styles.confirmCard} className="rg-confirm-card">
            <div style={styles.confirmBadge}>Application received</div>
            <h1 style={styles.confirmTitle} className="rg-confirm-title">
              Thank you, {formData.fullName.split(" ")[0] || "applicant"}.
            </h1>
            <p style={styles.confirmText}>
              Your application for the {formData.role || "internship"} position has been
              submitted to the Roomgi Talent Acquisition team. A confirmation has been
              logged against your reference number below.
            </p>
            <div style={styles.refBox}>
              <span style={styles.refLabel}>Reference number</span>
              <span style={styles.refValue}>{referenceId}</span>
            </div>
            <p style={styles.confirmSub}>
              Our team typically reviews applications within 5–7 business days. Please
              retain this reference number for any follow-up correspondence.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
 
 
  
 
  return (
    <div style={styles.page}>
      <ResponsiveStyles />
      <TopBar />
 
      <div style={styles.hero} className="rg-hero">
        <span style={styles.heroEyebrow}>Careers · Internship Program</span>
        <h1 style={styles.heroTitle} className="rg-hero-title">Hack to Hire</h1>
        <p style={styles.heroSub} className="rg-hero-sub">
          Complete every section below to be considered for the Roomgi Internship
          Program. Fields marked required must be filled before submission.
        </p>
      </div>
 
      <div
        style={
          showApplicationForm
            ? styles.body
            : { ...styles.body, gridTemplateColumns: "1fr" }
        }
        className="rg-body"
      >
        {showApplicationForm && (
          <aside style={styles.sidebar} className="rg-sidebar">
            <div style={styles.sidebarLabel}>Application sections</div>
            <ol style={styles.sidebarList} className="rg-sidebar-list">
              {sectionStatus.map((s) => (
                <li key={s.id} style={styles.sidebarItem} className="rg-sidebar-item">
                  <a href={`#${s.id}`} style={styles.sidebarLink} className="rg-sidebar-link">
                    <span
                      style={{
                        ...styles.sidebarBadge,
                        ...(s.complete ? styles.sidebarBadgeDone : {}),
                      }}
                    >
                      {s.complete ? "✓" : s.number}
                    </span>
                    <span style={styles.sidebarText} className="rg-sidebar-text">
                      {s.title}
                      {s.optional && <span style={styles.sidebarOptional}> · optional</span>}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
            <div style={styles.sidebarNote} className="rg-sidebar-note">
              <div style={styles.sidebarNoteTitle}>Need help?</div>
              <div style={styles.sidebarNoteText}>
                Contact support@roomgi.com for questions about this application.
              </div>
            </div>
          </aside>
        )}
 
        <main style={styles.main}>
 
            
            {/* ================= COMPANY OVERVIEW ================= */}
 
<Section
  id="company"
  number="00"
  title="About Roomgi Pvt. Ltd."
  subtitle="Building the Future of Smart Living"
>
  <div
    style={{
      background:
        "linear-gradient(135deg,#0A1F44 0%, #163E7A 55%, #2455A4 100%)",
      color: "#fff",
      borderRadius: 14,
      padding: "34px",
      marginBottom: 30,
      boxShadow: "0 20px 45px rgba(10,31,68,.15)",
    }}
  >
    <span
      style={{
        display: "inline-block",
        background: "rgba(255,255,255,.12)",
        padding: "6px 14px",
        borderRadius: 30,
        fontSize: 12,
        letterSpacing: "1px",
        fontWeight: 600,
        textTransform: "uppercase",
      }}
    >
      Internship Program 2026
    </span>
 
    <h2
      style={{
        margin: "18px 0 12px",
        fontSize: 34,
        fontWeight: 700,
        lineHeight: 1.2,
      }}
    >
      Build Products.<br />
      Build Your Career.
    </h2>
 
    <p
      style={{
        color: "rgba(255,255,255,.85)",
        fontSize: 16,
        lineHeight: 1.8,
        maxWidth: 850,
        marginBottom: 28,
      }}
    >
      At <strong>Roomgi Pvt. Ltd.</strong>, interns are treated as
      engineers and business professionals—not observers. You'll contribute to
      production-ready applications, collaborate with experienced mentors, work
      on real customer problems, and gain practical industry experience while
      building solutions used by thousands of users.
    </p>
 
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
        gap: 18,
      }}
    >
      {[
        ["Internship", "3 Months"],
        ["Monthly Stipend", "₹13,000"],
        ["Work Mode", "Hybrid / Remote"],
        ["PPO", "Performance Based"],
      ].map(([title, value]) => (
        <div
          key={title}
          style={{
            background: "rgba(255,255,255,.08)",
            border: "1px solid rgba(255,255,255,.12)",
            borderRadius: 12,
            padding: 18,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#D8E6FF",
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: ".08em",
            }}
          >
            {title}
          </div>
 
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            {value}
          </div>
        </div>
      ))}
    </div>
  </div>
 
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
      gap: 20,
    }}
  >
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E6EBF2",
        borderRadius: 12,
        padding: 22,
      }}
    >
      <h3
        style={{
          marginTop: 0,
          color: "#0A1F44",
        }}
      >
        What You'll Work On
      </h3>
 
      <ul
        style={{
          color: "#5B6B84",
          lineHeight: 2,
          paddingLeft: 18,
          marginBottom: 0,
        }}
      >
        <li>Production-grade Web Applications</li>
        <li>Artificial Intelligence Solutions</li>
        <li>Cloud & Backend Systems</li>
        <li>Mobile Applications</li>
        <li>Real Estate Technology Platform</li>
      </ul>
    </div>
 
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E6EBF2",
        borderRadius: 12,
        padding: 22,
      }}
    >
      <h3
        style={{
          marginTop: 0,
          color: "#0A1F44",
        }}
      >
        Why Join Roomgi?
      </h3>
 
      <ul
        style={{
          color: "#5B6B84",
          lineHeight: 2,
          paddingLeft: 18,
          marginBottom: 0,
        }}
      >
        <li>Real-world project experience</li>
        <li>Experienced mentor guidance</li>
        <li>Weekly technical reviews</li>
        <li>Performance-based PPO opportunity</li>
        <li>Fast learning startup environment</li>
      </ul>
    </div>
 
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E6EBF2",
        borderRadius: 12,
        padding: 22,
      }}
    >
      <h3
        style={{
          marginTop: 0,
          color: "#0A1F44",
        }}
      >
        Our Hiring Philosophy
      </h3>
 
      <p
        style={{
          color: "#5B6B84",
          lineHeight: 1.8,
          marginBottom: 0,
        }}
      >
        We believe talent is built through curiosity, ownership, consistency,
        and execution—not just academic scores. We look for candidates who are
        willing to learn, solve problems, collaborate effectively, and take
        responsibility for delivering meaningful results.
      </p>
    </div>
  </div>
</Section>
 
{/* ================= TECHNICAL TRACKS ================= */}
 
<Section
  id="career"
  number="00A"
  title="Technical Career Tracks"
  subtitle="Performance Based PPO"
>
  <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
    gap: 24,
    marginTop: 25,
  }}
>
  {/* ================= Alpha ================= */}
 
  <div
    style={{
      borderRadius: 18,
      overflow: "hidden",
      background: "#fff",
      border: "1px solid #DCE3EE",
      boxShadow: "0 15px 35px rgba(10,31,68,.08)",
      transition: ".3s",
    }}
  >
    <div
      style={{
        background: "linear-gradient(135deg,#0A1F44,#1E4E8C)",
        color: "#fff",
        padding: 24,
      }}
    >
      <span
        style={{
          display: "inline-block",
          background: "rgba(255,255,255,.15)",
          padding: "6px 14px",
          borderRadius: 30,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: ".08em",
        }}
      >
        TOP 5% PERFORMERS
      </span>
 
      <h2 style={{ margin: "16px 0 8px" }}>
        Alpha Tier
      </h2>
 
      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        ₹6.90 LPA
      </div>
    </div>
 
    <div style={{ padding: 24 }}>
      <p
        style={{
          color: "#5B6B84",
          lineHeight: 1.8,
        }}
      >
        Reserved for exceptional interns who consistently demonstrate
        outstanding engineering capability, leadership, ownership,
        innovation and product impact throughout the internship.
      </p>
 
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 18,
        }}
      >
        {[
          "Leadership",
          "Innovation",
          "System Design",
          "Ownership",
          "Mentorship",
        ].map((item) => (
          <span
            key={item}
            style={{
              background: "#EEF4FF",
              color: "#2455A4",
              padding: "6px 12px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  </div>
 
  {/* ================= Delta ================= */}
 
  <div
    style={{
      borderRadius: 18,
      overflow: "hidden",
      background: "#fff",
      border: "1px solid #DCE3EE",
      boxShadow: "0 15px 35px rgba(10,31,68,.08)",
    }}
  >
    <div
      style={{
        background: "linear-gradient(135deg,#2455A4,#4B8DFF)",
        color: "#fff",
        padding: 24,
      }}
    >
      <span
        style={{
          display: "inline-block",
          background: "rgba(255,255,255,.15)",
          padding: "6px 14px",
          borderRadius: 30,
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        HIGH PERFORMERS
      </span>
 
      <h2 style={{ margin: "16px 0 8px" }}>
        Delta Tier
      </h2>
 
      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        ₹5.30 LPA
      </div>
    </div>
 
    <div style={{ padding: 24 }}>
      <p
        style={{
          color: "#5B6B84",
          lineHeight: 1.8,
        }}
      >
        Awarded to interns who consistently deliver quality engineering
        solutions, collaborate effectively, solve complex problems and
        maintain high professional standards.
      </p>
 
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 18,
        }}
      >
        {[
          "Problem Solving",
          "Coding",
          "Teamwork",
          "Execution",
          "Communication",
        ].map((item) => (
          <span
            key={item}
            style={{
              background: "#EEF4FF",
              color: "#2455A4",
              padding: "6px 12px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  </div>
 
  {/* ================= Nova ================= */}
 
  <div
    style={{
      borderRadius: 18,
      overflow: "hidden",
      background: "#fff",
      border: "1px solid #DCE3EE",
      boxShadow: "0 15px 35px rgba(10,31,68,.08)",
    }}
  >
    <div
      style={{
        background: "linear-gradient(135deg,#138A5E,#29B675)",
        color: "#fff",
        padding: 24,
      }}
    >
      <span
        style={{
          display: "inline-block",
          background: "rgba(255,255,255,.15)",
          padding: "6px 14px",
          borderRadius: 30,
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        SUCCESSFUL INTERNS
      </span>
 
      <h2 style={{ margin: "16px 0 8px" }}>
        Nova Tier
      </h2>
 
      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        ₹3.80 LPA
      </div>
    </div>
 
    <div style={{ padding: 24 }}>
      <p
        style={{
          color: "#5B6B84",
          lineHeight: 1.8,
        }}
      >
        Offered to interns who successfully complete the internship while
        demonstrating strong learning ability, professionalism, teamwork
        and continuous technical growth.
      </p>
 
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 18,
        }}
      >
        {[
          "Learning",
          "Professionalism",
          "Growth",
          "Collaboration",
          "Adaptability",
        ].map((item) => (
          <span
            key={item}
            style={{
              background: "#E9F9F1",
              color: "#138A5E",
              padding: "6px 12px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  </div>
</div>
 
  <br />
 
 <h3
  style={{
    color: "#0A1F44",
    fontSize: 28,
    fontWeight: 700,
    textAlign: "center",
    margin: "45px 0 10px",
  }}
>
  Business & Non-Technical Career Progression
</h3>
 
<p
  style={{
    textAlign: "center",
    color: "#5B6B84",
    maxWidth: 760,
    margin: "0 auto 35px",
    lineHeight: 1.8,
    fontSize: 15,
  }}
>
  Our Business Internship Program is designed for candidates passionate about
  Sales, Marketing, Human Resources, Finance, Operations and Business
  Development. Full-Time employment is offered based on overall internship
  performance, business impact and leadership potential.
</p>
 
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
    gap: 24,
  }}
>
  {/* Alpha */}
 
  <div
    style={{
      borderRadius: 18,
      overflow: "hidden",
      background: "#fff",
      border: "1px solid #DCE3EE",
      boxShadow: "0 15px 35px rgba(10,31,68,.08)",
    }}
  >
    <div
      style={{
        background: "linear-gradient(135deg,#5B2BE0,#8B5CF6)",
        color: "#fff",
        padding: 24,
      }}
    >
      <span
        style={{
          display: "inline-block",
          background: "rgba(255,255,255,.15)",
          padding: "6px 14px",
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        TOP BUSINESS TALENT
      </span>
 
      <h2 style={{ margin: "16px 0 8px" }}>
        Alpha Tier
      </h2>
 
      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        ₹6.60 LPA
      </div>
    </div>
 
    <div style={{ padding: 24 }}>
      <p
        style={{
          color: "#5B6B84",
          lineHeight: 1.8,
        }}
      >
        Reserved for exceptional interns who consistently demonstrate
        leadership, strategic thinking, business growth, client management
        and measurable impact throughout the internship.
      </p>
 
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 18,
        }}
      >
        {[
          "Leadership",
          "Sales",
          "Business Growth",
          "Negotiation",
          "Ownership",
        ].map((item) => (
          <span
            key={item}
            style={{
              background: "#F4EEFF",
              color: "#6D28D9",
              padding: "6px 12px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  </div>
 
  {/* Delta */}
 
  <div
    style={{
      borderRadius: 18,
      overflow: "hidden",
      background: "#fff",
      border: "1px solid #DCE3EE",
      boxShadow: "0 15px 35px rgba(10,31,68,.08)",
    }}
  >
    <div
      style={{
        background: "linear-gradient(135deg,#2563EB,#3B82F6)",
        color: "#fff",
        padding: 24,
      }}
    >
      <span
        style={{
          display: "inline-block",
          background: "rgba(255,255,255,.15)",
          padding: "6px 14px",
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        HIGH PERFORMERS
      </span>
 
      <h2 style={{ margin: "16px 0 8px" }}>
        Delta Tier
      </h2>
 
      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        ₹5.00 LPA
      </div>
    </div>
 
    <div style={{ padding: 24 }}>
      <p
        style={{
          color: "#5B6B84",
          lineHeight: 1.8,
        }}
      >
        Awarded to interns who consistently achieve business goals,
        communicate effectively, collaborate with teams and execute
        responsibilities with professionalism.
      </p>
 
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 18,
        }}
      >
        {[
          "Marketing",
          "Operations",
          "Communication",
          "Execution",
          "Planning",
        ].map((item) => (
          <span
            key={item}
            style={{
              background: "#EEF4FF",
              color: "#2563EB",
              padding: "6px 12px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  </div>
 
  {/* Nova */}
 
  <div
    style={{
      borderRadius: 18,
      overflow: "hidden",
      background: "#fff",
      border: "1px solid #DCE3EE",
      boxShadow: "0 15px 35px rgba(10,31,68,.08)",
    }}
  >
    <div
      style={{
        background: "linear-gradient(135deg,#138A5E,#2CC784)",
        color: "#fff",
        padding: 24,
      }}
    >
      <span
        style={{
          display: "inline-block",
          background: "rgba(255,255,255,.15)",
          padding: "6px 14px",
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        SUCCESSFUL INTERNS
      </span>
 
      <h2 style={{ margin: "16px 0 8px" }}>
        Nova Tier
      </h2>
 
      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        ₹3.50 LPA
      </div>
    </div>
 
    <div style={{ padding: 24 }}>
      <p
        style={{
          color: "#5B6B84",
          lineHeight: 1.8,
        }}
      >
        Offered to interns who successfully complete the internship while
        demonstrating professionalism, adaptability, continuous learning and
        strong collaboration.
      </p>
 
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 18,
        }}
      >
        {[
          "Learning",
          "Professionalism",
          "Growth",
          "Teamwork",
          "Adaptability",
        ].map((item) => (
          <span
            key={item}
            style={{
              background: "#EAF9F2",
              color: "#138A5E",
              padding: "6px 12px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  </div>
</div>
 
{/* ================= Selection Process ================= */}
 
<div
  style={{
    marginTop: 40,
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid #DCE3EE",
    boxShadow: "0 10px 30px rgba(10,31,68,.06)",
  }}
>
  <div
    style={{
      background: "linear-gradient(135deg,#0A1F44,#2455A4)",
      color: "#fff",
      padding: "22px 28px",
    }}
  >
    <h2 style={{ margin: 0 }}>
      Internship Selection Process
    </h2>
 
    <p
      style={{
        marginTop: 8,
        color: "rgba(255,255,255,.9)",
      }}
    >
      Every application goes through a structured and transparent hiring
      process.
    </p>
  </div>
 
  <div
    style={{
      padding: 28,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
      gap: 20,
    }}
  >
    {[
      ["01", "Application Screening"],
      ["02", "Online Assessment"],
      ["03", "Technical / HR Interview"],
      ["04", "3-Month Internship"],
      ["05", "Performance Review & PPO"],
    ].map(([step, title]) => (
      <div
        key={step}
        style={{
          border: "1px solid #E6EBF2",
          borderRadius: 12,
          padding: 20,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 55,
            height: 55,
            borderRadius: "50%",
            background: "#EEF4FF",
            color: "#2455A4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          {step}
        </div>
 
        <h4
          style={{
            margin: 0,
            color: "#0A1F44",
          }}
        >
          {title}
        </h4>
      </div>
    ))}
  </div>
 
  <div
    style={{
      background: "#F8FAFC",
      padding: 22,
      borderTop: "1px solid #E6EBF2",
      color: "#5B6B84",
      lineHeight: 1.8,
      fontSize: 14,
    }}
  >
    <strong style={{ color: "#0A1F44" }}>Performance Notice:</strong>{" "}
    Full-Time offers and compensation are determined through a comprehensive
    evaluation based on technical or business competency, ownership,
    communication, leadership, innovation, collaboration, learning ability and
    overall contribution during the internship. Package tiers represent
    performance bands and are awarded only to eligible candidates who satisfy
    the company's evaluation criteria.
  </div>
</div>
 
{!showApplicationForm && (
  <div
    style={{
      marginTop: 40,
      textAlign: "center",
      padding: "36px 24px",
      background:
        "linear-gradient(135deg,#0A1F44 0%, #163E7A 55%, #2455A4 100%)",
      borderRadius: 16,
      boxShadow: "0 20px 45px rgba(10,31,68,.15)",
    }}
  >
    <h3
      style={{
        margin: "0 0 10px",
        color: "#fff",
        fontSize: 22,
        fontWeight: 700,
      }}
    >
      Ready to apply?
    </h3>
    <p
      style={{
        margin: "0 auto 22px",
        color: "rgba(255,255,255,.85)",
        maxWidth: 560,
        lineHeight: 1.7,
        fontSize: 14.5,
      }}
    >
      Click below to open the application form and submit your details for
      the Roomgi Internship Program.
    </p>
    <button
      type="button"
      onClick={handleApplyNow}
      style={{
        height: 52,
        padding: "0 36px",
        border: "none",
        borderRadius: 10,
        background: "#fff",
        color: "#0A1F44",
        fontSize: 16,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 15px 35px rgba(0,0,0,.2)",
      }}
    >
      Apply Now
    </button>
  </div>
)}
</Section>
 
{showApplicationForm && (
  <form onSubmit={handleSubmit}>
 
            <Section
  id="personal"
  number="01"
  title="Personal Information"
  subtitle="Tell us a little about yourself"
>
  <div
    style={{
      background: "#F8FAFC",
      border: "1px solid #E6EBF2",
      borderRadius: 12,
      padding: "18px 22px",
      marginBottom: 25,
    }}
  >
    <h3
      style={{
        margin: "0 0 8px",
        color: "#0A1F44",
        fontSize: 20,
      }}
    >
      Candidate Profile
    </h3>
 
    <p
      style={{
        margin: 0,
        color: "#5B6B84",
        lineHeight: 1.7,
        fontSize: 14,
      }}
    >
      Please provide your basic personal details exactly as they appear on your
      official documents. This information will be used for communication,
      verification and internship records.
    </p>
  </div>
 
  <Grid>
    <Field
      label="Full Name"
      required
      hint="Enter your full legal name"
    >
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 18,
          }}
        >
          👤
        </span>
 
        <input
          style={{
            ...styles.input,
            paddingLeft: 45,
          }}
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="e.g. Rahul Sharma"
          required
        />
      </div>
    </Field>
 
    <Field
      label="Email Address"
      required
      hint="We'll send updates to this email"
    >
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 18,
          }}
        >
          📧
        </span>
 
        <input
          type="email"
          style={{
            ...styles.input,
            paddingLeft: 45,
          }}
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@example.com"
          required
        />
      </div>
    </Field>
 
    <Field
      label="Mobile Number"
      required
      hint="Include your active WhatsApp number"
    >
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 18,
          }}
        >
          📱
        </span>
 
        <input
          style={{
            ...styles.input,
            paddingLeft: 45,
          }}
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+91 98765 43210"
          required
        />
      </div>
    </Field>
 
    <Field
      label="Current City"
      required
      hint="City where you're currently residing"
    >
      <input
        style={styles.input}
        name="city"
        value={formData.city || ""}
        onChange={handleChange}
        placeholder="e.g. Bengaluru"
        required
      />
    </Field>
  </Grid>
</Section>
 
          <Section
  id="academic"
  number="02"
  title="Academic Background"
  subtitle="Educational Qualifications"
>
  <div
    style={{
      background: "#F8FAFC",
      border: "1px solid #E6EBF2",
      borderRadius: 12,
      padding: "18px 22px",
      marginBottom: 25,
    }}
  >
    <h3
      style={{
        margin: "0 0 8px",
        color: "#0A1F44",
        fontSize: 20,
      }}
    >
      Academic Details
    </h3>

    <p
      style={{
        margin: 0,
        color: "#5B6B84",
        lineHeight: 1.7,
      }}
    >
      Provide your current academic information to help us assess your eligibility.
    </p>
  </div>

  <Grid>

    <Field label="College / University" required>
      <input
        style={styles.input}
        name="college"
        value={formData.college}
        onChange={handleChange}
        placeholder="ABC Institute of Technology"
        required
      />
    </Field>

    <Field label="Degree" required>
      <select
        style={styles.select}
        name="degree"
        value={formData.degree}
        onChange={handleChange}
        required
      >
        <option value="">Select Degree</option>
        <option>B.Tech</option>
        <option>B.E.</option>
        <option>BCA</option>
        <option>MCA</option>
        <option>B.Sc</option>
        <option>M.Tech</option>
        <option>MBA</option>
        <option>BBA</option>
        <option>B.Com</option>
        <option>M.Com</option>
        <option>BA</option>
        <option>Diploma</option>
        <option>Other</option>
      </select>
    </Field>

    <Field label="Specialization / Branch" required>
      <input
        style={styles.input}
        name="branch"
        value={formData.branch || ""}
        onChange={handleChange}
        placeholder="Computer Science Engineering"
        required
      />
    </Field>

    <Field label="Current Academic Year" required>
      <select
        style={styles.select}
        name="year"
        value={formData.year}
        onChange={handleChange}
        required
      >
        <option value="">Select</option>
        <option>1st Year</option>
        <option>2nd Year</option>
        <option>3rd Year</option>
        <option>Final Year</option>
        <option>Graduate</option>
      </select>
    </Field>

    <Field label="Current CGPA / Percentage">
      <input
        style={styles.input}
        name="cgpa"
        value={formData.cgpa || ""}
        onChange={handleChange}
        placeholder="8.25 or 82%"
      />
    </Field>

    <Field label="Active Backlogs">
      <select
        style={styles.select}
        name="backlogs"
        value={formData.backlogs || ""}
        onChange={handleChange}
      >
        <option value="">Select</option>
        <option>No Active Backlogs</option>
        <option>1</option>
        <option>2</option>
        <option>3+</option>
      </select>
    </Field>

  </Grid>
</Section>
 
            <Section
  id="role"
  number="03"
  title="Role Preferences & Technical Skills"
  subtitle="Help us identify the best opportunity for you"
>
  <div
    style={{
      background: "#F8FAFC",
      border: "1px solid #E6EBF2",
      borderRadius: 12,
      padding: "18px 22px",
      marginBottom: 25,
    }}
  >
    <h3
      style={{
        margin: "0 0 8px",
        color: "#0A1F44",
        fontSize: 20,
      }}
    >
      Career Preferences
    </h3>
 
    <p
      style={{
        margin: 0,
        color: "#5B6B84",
        lineHeight: 1.7,
      }}
    >
      Select your preferred internship role and provide details about your
      technical skills, experience and availability.
    </p>
  </div>
 
  <Grid>
 
    <Field label="Preferred Internship Role" required full>
      <select
        style={styles.select}
        name="role"
        value={formData.role}
        onChange={handleChange}
        required
      >
        <option value="">Select a Role</option>
 
        <optgroup label="Software Development">
          <option>Frontend Developer</option>
          <option>Backend Developer</option>
          <option>Full Stack Developer</option>
          <option>React Developer</option>
          <option>Node.js Developer</option>
          <option>Python Developer</option>
          <option>Java Developer</option>
          <option>C++ Developer</option>
        </optgroup>
 
        <optgroup label="Mobile Development">
          <option>Android Developer</option>
          <option>Flutter Developer</option>
          <option>React Native Developer</option>
        </optgroup>
 
        <optgroup label="Artificial Intelligence">
          <option>AI / ML Engineer</option>
          <option>Data Scientist</option>
          <option>Data Analyst</option>
          <option>Computer Vision</option>
        </optgroup>
 
        <optgroup label="Infrastructure">
          <option>Cloud Engineer</option>
          <option>DevOps Engineer</option>
          <option>Cyber Security</option>
          <option>QA Engineer</option>
        </optgroup>
 
        <optgroup label="Design">
          <option>UI/UX Designer</option>
          <option>Graphic Designer</option>
          <option>Product Designer</option>
        </optgroup>
 
        <optgroup label="Business Roles">
          <option>Business Development</option>
          <option>Sales</option>
          <option>Marketing</option>
          <option>Digital Marketing</option>
          <option>Human Resources</option>
          <option>Finance</option>
          <option>Operations</option>
          <option>Content Writer</option>
          <option>Customer Success</option>
          <option>Project Management</option>
          <option>Product Management</option>
        </optgroup>
 
        <option>Other</option>
      </select>
    </Field>
 
    <Field
      label="Primary Technical Skills"
      required
      full
      hint="Separate multiple skills using commas."
    >
      <textarea
        style={styles.textarea}
        rows={3}
        name="skills"
        value={formData.skills}
        onChange={handleChange}
        placeholder="React.js, Node.js, Express.js, MongoDB, JavaScript..."
        required
      />
    </Field>
 
    <Field label="Experience Level" required>
      <select
        style={styles.select}
        name="experience"
        value={formData.experience || ""}
        onChange={handleChange}
        required
      >
        <option value="">Select</option>
        <option>Fresher</option>
        <option>0-6 Months</option>
        <option>6-12 Months</option>
        <option>1-2 Years</option>
        <option>2+ Years</option>
      </select>
    </Field>
 
    <Field label="Internship Availability" required>
      <select
        style={styles.select}
        name="availability"
        value={formData.availability}
        onChange={handleChange}
        required
      >
        <option value="">Select</option>
        <option>Immediate</option>
        <option>Within 15 Days</option>
        <option>Within 30 Days</option>
        <option>Within 60 Days</option>
      </select>
    </Field>
 
    <Field label="Preferred Work Mode">
      <select
        style={styles.select}
        name="workMode"
        value={formData.workMode || ""}
        onChange={handleChange}
      >
        <option value="">Select</option>
        <option>Remote</option>
        <option>Hybrid</option>
        <option>On-Site</option>
        <option>Flexible</option>
      </select>
    </Field>
 
    <Field label="Preferred Work Location">
      <input
        style={styles.input}
        name="preferredLocation"
        value={formData.preferredLocation || ""}
        onChange={handleChange}
        placeholder="Delhi NCR / Bengaluru / Remote"
      />
    </Field>
 
    <Field label="Have you completed any internships?">
      <select
        style={styles.select}
        name="previousInternship"
        value={formData.previousInternship || ""}
        onChange={handleChange}
      >
        <option value="">Select</option>
        <option>Yes</option>
        <option>No</option>
      </select>
    </Field>
 
    <Field label="GitHub Contributions / Coding Profile">
      <input
        style={styles.input}
        name="codingProfile"
        value={formData.codingProfile || ""}
        onChange={handleChange}
        placeholder="LeetCode / CodeChef / HackerRank Profile URL"
      />
    </Field>
 
  </Grid>
</Section>
 
          <Section
  id="links"
  number="04"
  title="Professional Profiles"
  subtitle="Share your professional profiles and portfolio"
>
  <div
    style={{
      background: "#F8FAFC",
      border: "1px solid #E6EBF2",
      borderRadius: 12,
      padding: "18px 22px",
      marginBottom: 25,
    }}
  >
    <h3
      style={{
        margin: "0 0 8px",
        color: "#0A1F44",
        fontSize: 20,
      }}
    >
      Professional Profiles
    </h3>

    <p
      style={{
        margin: 0,
        color: "#5B6B84",
        lineHeight: 1.7,
      }}
    >
      Share your professional profiles to help us evaluate your projects,
      coding skills, and experience.
    </p>
  </div>

  <Grid>

    <Field
      label="LinkedIn Profile"
      hint="Professional networking profile"
    >
      <input
        style={styles.input}
        name="linkedin"
        value={formData.linkedin}
        onChange={handleChange}
        placeholder="https://linkedin.com/in/yourname"
      />
    </Field>

    <Field
      label="GitHub Profile"
      hint="Source code & projects"
    >
      <input
        style={styles.input}
        name="github"
        value={formData.github}
        onChange={handleChange}
        placeholder="https://github.com/username"
      />
    </Field>

    <Field
      label="Portfolio Website"
      hint="Personal website or portfolio (Optional)"
    >
      <input
        style={styles.input}
        name="portfolio"
        value={formData.portfolio}
        onChange={handleChange}
        placeholder="https://yourportfolio.com"
      />
    </Field>

    <Field
      label="LeetCode Profile"
      hint="Coding profile (Optional)"
    >
      <input
        style={styles.input}
        name="leetcode"
        value={formData.leetcode || ""}
        onChange={handleChange}
        placeholder="https://leetcode.com/username"
      />
    </Field>

  </Grid>
</Section>
 
           <Section
  id="documents"
  number="05"
  title="Documents & Supporting Files"
  subtitle="Upload your required documents"
>
  <div
    style={{
      background: "#F8FAFC",
      border: "1px solid #E6EBF2",
      borderRadius: 12,
      padding: "18px 22px",
      marginBottom: 25,
    }}
  >
    <h3
      style={{
        margin: "0 0 8px",
        color: "#0A1F44",
        fontSize: 20,
      }}
    >
      Document Submission
    </h3>
 
    <p
      style={{
        margin: 0,
        color: "#5B6B84",
        lineHeight: 1.7,
      }}
    >
      Please upload clear and updated documents. Your information will only be
      used for recruitment and verification purposes.
    </p>
  </div>
 
  <Grid>

  {/* Resume */}
  <Field
    label="Resume / CV"
    required
    hint="PDF, DOC or DOCX (Maximum 5 MB)"
  >
    <label style={styles.fileDrop}>
      <input
        type="file"
        name="resume"
        accept=".pdf,.doc,.docx"
        onChange={handleChange}
        required
        style={styles.fileInput}
      />

      <span style={styles.fileDropText}>
        {formData.resume
          ? formData.resume.name
          : "Upload your latest Resume"}
      </span>

      <span style={styles.fileDropButton}>
        Browse
      </span>
    </label>
  </Field>

</Grid>
 
  <div
    style={{
      marginTop: 25,
      background: "#EEF5FF",
      border: "1px solid #C8D9F8",
      borderRadius: 10,
      padding: 18,
    }}
  >
    <strong style={{ color: "#0A1F44" }}>
      Upload Guidelines
    </strong>
 
    <ul
      style={{
        marginTop: 12,
        color: "#5B6B84",
        lineHeight: 1.8,
      }}
    >
      <li>Upload your latest updated Resume.</li>
      <li>Resume should not exceed 5 MB.</li>
      <li>Use clear file names (e.g. Rahul_Sharma_Resume.pdf).</li>
      <li>Only upload genuine and valid documents.</li>
      <li>All submitted documents remain confidential.</li>
    </ul>
  </div>
</Section>
 
           <Section
  id="statement"
  number="06"
  title="Personal Statement"
  subtitle="Help us understand your motivation"
>
  <div
    style={{
      background: "#F8FAFC",
      border: "1px solid #E6EBF2",
      borderRadius: 12,
      padding: "18px 22px",
      marginBottom: 25,
    }}
  >
    <h3
      style={{
        margin: "0 0 8px",
        color: "#0A1F44",
        fontSize: 20,
      }}
    >
      Tell Us About Yourself
    </h3>

    <p
      style={{
        margin: 0,
        color: "#5B6B84",
        lineHeight: 1.7,
      }}
    >
      Tell us why you're interested in joining Roomgi and how you learned about this opportunity.
    </p>
  </div>

  <Grid>

    <Field
      label="Why do you want to join Roomgi?"
      required
      full
      hint="Minimum 100 words"
    >
      <textarea
        style={styles.textarea}
        rows={5}
        name="whyJoin"
        value={formData.whyJoin}
        onChange={handleChange}
        placeholder="Describe why you're interested in joining Roomgi, what excites you about this opportunity, and how you can contribute."
        required
      />
    </Field>

    <Field label="Are you willing to relocate if required?">
      <select
        style={styles.select}
        name="relocation"
        value={formData.relocation || ""}
        onChange={handleChange}
      >
        <option value="">Select</option>
        <option>Yes</option>
        <option>No</option>
        <option>Remote Preferred</option>
      </select>
    </Field>

    <Field label="How did you hear about Roomgi?">
      <select
        style={styles.select}
        name="source"
        value={formData.source || ""}
        onChange={handleChange}
      >
        <option value="">Select</option>
        <option>LinkedIn</option>
        <option>Instagram</option>
        <option>College</option>
        <option>Campus Drive</option>
        <option>Friend / Referral</option>
        <option>Google Search</option>
        <option>WhatsApp</option>
        <option>Other</option>
      </select>
    </Field>

  </Grid>
</Section>
           <div
  style={{
    margin: "30px 0",
    border: "1px solid #D8DEE7",
    borderRadius: 14,
    overflow: "hidden",
    background: "#FFFFFF",
    boxShadow: "0 10px 25px rgba(10,31,68,.05)",
  }}
>
  <div
    style={{
      background: "linear-gradient(135deg,#0A1F44,#2455A4)",
      color: "#FFFFFF",
      padding: "18px 24px",
    }}
  >
    <h3
      style={{
        margin: 0,
        fontSize: 20,
        fontWeight: 600,
      }}
    >
      Candidate Declaration
    </h3>
 
    <p
      style={{
        margin: "8px 0 0",
        opacity: 0.9,
        lineHeight: 1.6,
        fontSize: 14,
      }}
    >
      Please review the declaration carefully before submitting your
      application.
    </p>
  </div>
 
  <div
    style={{
      padding: "24px",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
      }}
    >
      <input
        type="checkbox"
        id="declare"
        required
        style={{
          marginTop: 4,
          width: 18,
          height: 18,
          accentColor: "#0A1F44",
          cursor: "pointer",
        }}
      />
 
      <label
  htmlFor="declare"
  style={{
    color: "#4B5563",
    lineHeight: 1.9,
    fontSize: 14,
    cursor: "pointer",
  }}
>
  I hereby certify that all information submitted in this application,
  including my educational qualifications, professional experience,
  projects, achievements, and supporting documents, is true, complete,
  and accurate to the best of my knowledge.

  <br /><br />

  I understand that any false, misleading, or incomplete information may
  result in the rejection of my application, withdrawal of any internship
  offer, or termination of employment if discovered at any stage of the
  recruitment process.

  <br /><br />

  I authorize <strong>Roomgi Pvt. Ltd.</strong> to verify the information
  provided in this application and agree to the processing of my personal
  information solely for recruitment, verification, and employment-related
  purposes in accordance with the company's privacy practices.

 

  I acknowledge that submission of this application does not guarantee an
  interview, internship offer, or full-time employment, and that all
  selection decisions are based on merit, performance, and organizational
  requirements.
</label>
    </div>
  </div>
</div>
 
           {errorMsg && (
  <div
    style={{
      margin: "25px 32px",
      padding: "18px 22px",
      background: "#FEF2F2",
      border: "1px solid #FECACA",
      borderRadius: 12,
      color: "#B91C1C",
      fontWeight: 500,
      lineHeight: 1.6,
    }}
  >
    <strong>Application Error</strong>
    <br />
    {errorMsg}
  </div>
)}
 
<div
  style={{
    marginTop: 35,
    borderTop: "1px solid #E5E7EB",
    padding: "30px 32px",
    background: "#FAFBFC",
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 30,
    }}
  >
    <div style={{ flex: 1, minWidth: 300 }}>
      <h3
        style={{
          margin: "0 0 12px",
          color: "#0A1F44",
          fontSize: 20,
        }}
      >
        Final Review
      </h3>
 
      <p
        style={{
          margin: 0,
          color: "#5B6B84",
          lineHeight: 1.8,
          fontSize: 14,
        }}
      >
        Please review your application carefully before submitting.
        Once submitted, your application will be reviewed by our
        Talent Acquisition Team.
 
        <br /><br />
 
        <strong>Selection Timeline:</strong>
 
        <br />
 
        • Application Review
 
        <br />
 
        • Online Assessment
 
        <br />
 
        • Technical / HR Interview
 
        <br />
 
        • Internship Offer
 
        <br />
 
        • Performance Evaluation & PPO
      </p>
 
      <div
        style={{
          marginTop: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        {[
          "Secure Submission",
          "Encrypted Data",
          "Privacy Protected",
          "HR Reviewed",
        ].map((item) => (
          <span
            key={item}
            style={{
              background: "#EEF4FF",
              color: "#2455A4",
              padding: "8px 14px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            ✓ {item}
          </span>
        ))}
      </div>
    </div>
 
    <div
      style={{
        minWidth: 280,
        textAlign: "center",
      }}
    >
      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          height: 58,
          border: "none",
          borderRadius: 12,
          background:
            loading
              ? "#94A3B8"
              : "linear-gradient(135deg,#0A1F44,#2455A4)",
          color: "#fff",
          fontSize: 17,
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 15px 35px rgba(36,85,164,.25)",
          transition: ".3s",
        }}
      >
        {loading
          ? (loadingLabel || "Submitting Application...")
          : "Submit Application"}
      </button>
 
      <p
        style={{
          marginTop: 15,
          color: "#64748B",
          fontSize: 12,
          lineHeight: 1.7,
        }}
      >
        By clicking <strong>"Submit Application"</strong>, you agree to
        Roomgi's recruitment process, privacy policy and candidate
        declaration.
 
        <br /><br />
 
        Expected review time:
        <strong> 5–7 Business Days</strong>
      </p>
    </div>
  </div>
</div>
  </form>
)}
        </main>
      </div>
 
      <Footer />
    </div>
  );
};
 
const TopBar = () => (
  <header style={styles.topbar}>
    <div style={styles.topbarInner} className="rg-topbar-inner">
      <div style={styles.logo} className="rg-logo">
        ROOMGI<span style={styles.logoMark}>®</span>
      </div>
      <div style={styles.topbarRight}>Careers Portal</div>
    </div>
  </header>
);
 
const Footer = () => (
  <footer style={styles.footer}>
    <div style={styles.footerInner} className="rg-footer-inner">
      © {new Date().getFullYear()} Roomgi Pvt. Ltd. All rights reserved.
      This application is confidential and intended solely for recruitment purposes.
    </div>
  </footer>
);
 
const Section = ({ id, number, title, subtitle, children }) => (
  <section id={id} style={styles.section} className="rg-section">
    <div style={styles.sectionHeader} className="rg-section-header">
      <span style={styles.sectionNumber} className="rg-section-number">{number}</span>
      <div>
        <h2 style={styles.sectionTitle} className="rg-section-title">{title}</h2>
        {subtitle && <span style={styles.sectionSubtitle}>{subtitle}</span>}
      </div>
    </div>
    <div style={styles.sectionBody} className="rg-section-body">{children}</div>
  </section>
);
 
const Grid = ({ children }) => <div style={styles.grid} className="rg-grid">{children}</div>;
 
const Field = ({ label, required, full, hint, children }) => (
  <div style={full ? styles.fieldFull : styles.field}>
    <label style={styles.label}>
      {label} {required && <span style={styles.asterisk}>*</span>}
    </label>
    {children}
    {hint && <span style={styles.hint}>{hint}</span>}
  </div>
);
 
const styles = {
  page: { minHeight: "100vh", background: "#F3F5F8", fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#16233D" },
  topbar: { background: "#0A1F44", borderBottom: "1px solid #0A1F44" },
  topbarInner: { maxWidth: 1180, margin: "0 auto", padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo: { color: "#FFFFFF", fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 22, fontWeight: 600, letterSpacing: "0.06em" },
  logoMark: { fontSize: 12, verticalAlign: "super", color: "#8FA8D6", marginLeft: 2 },
  topbarRight: { color: "#AFC2E3", fontSize: 13, letterSpacing: "0.04em", textTransform: "uppercase" },
  hero: { maxWidth: 1180, margin: "0 auto", padding: "48px 32px 32px" },
  heroEyebrow: { display: "block", fontSize: 13, fontWeight: 600, color: "#2455A4", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 },
  heroTitle: { fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 38, fontWeight: 600, color: "#0A1F44", margin: "0 0 12px" },
  heroSub: { fontSize: 16, color: "#5B6B84", maxWidth: 620, lineHeight: 1.6, margin: 0 },
  body: { maxWidth: 1180, margin: "0 auto", padding: "0 32px 64px", display: "grid", gridTemplateColumns: "260px 1fr", gap: 32, alignItems: "start" },
  sidebar: { position: "sticky", top: 24, background: "#FFFFFF", border: "1px solid #D8DEE7", borderRadius: 10, padding: "20px 18px" },
  sidebarLabel: { fontSize: 11, fontWeight: 600, color: "#8493A9", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 },
  sidebarList: { listStyle: "none", margin: 0, padding: 0 },
  sidebarItem: { marginBottom: 4 },
  sidebarLink: { display: "flex", alignItems: "center", gap: 10, padding: "8px 6px", textDecoration: "none", borderRadius: 6 },
  sidebarBadge: { width: 22, height: 22, borderRadius: "50%", background: "#EAF0FB", color: "#2455A4", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  sidebarBadgeDone: { background: "#1B7F5C", color: "#FFFFFF" },
  sidebarText: { fontSize: 13.5, color: "#16233D", fontWeight: 500 },
  sidebarOptional: { fontSize: 11.5, color: "#8493A9", fontWeight: 400 },
  sidebarNote: { marginTop: 18, paddingTop: 16, borderTop: "1px solid #E4E8EF" },
  sidebarNoteTitle: { fontSize: 12.5, fontWeight: 600, color: "#16233D", marginBottom: 4 },
  sidebarNoteText: { fontSize: 12.5, color: "#7A889C", lineHeight: 1.5 },
  main: { background: "#FFFFFF", border: "1px solid #D8DEE7", borderRadius: 10, overflow: "hidden" },
  section: { padding: "28px 32px", borderBottom: "1px solid #E4E8EF" },
  sectionHeader: { display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 },
  sectionNumber: { fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 20, fontWeight: 600, color: "#C4CEDC", lineHeight: 1, minWidth: 30 },
  sectionTitle: { fontSize: 17, fontWeight: 600, color: "#0A1F44", margin: 0 },
  sectionSubtitle: { fontSize: 12, color: "#8493A9", fontWeight: 500 },
  sectionBody: { paddingLeft: 44 },
  grid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "18px 20px" },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  fieldFull: { display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" },
  label: { fontSize: 12.5, fontWeight: 600, color: "#3D4A61" },
  asterisk: { color: "#C0392B" },
  hint: { fontSize: 11.5, color: "#8493A9" },
  input: { height: 40, padding: "0 12px", fontSize: 14, border: "1px solid #D0D6E1", borderRadius: 6, background: "#FBFCFD", color: "#16233D", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" },
  select: { height: 40, padding: "0 12px", fontSize: 14, border: "1px solid #D0D6E1", borderRadius: 6, background: "#FBFCFD", color: "#16233D", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" },
  textarea: { padding: 12, fontSize: 14, border: "1px solid #D0D6E1", borderRadius: 6, background: "#FBFCFD", color: "#16233D", outline: "none", fontFamily: "inherit", resize: "vertical", width: "100%", boxSizing: "border-box" },
  fileDrop: { position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px dashed #B9C3D3", borderRadius: 6, background: "#FBFCFD", padding: "10px 14px", cursor: "pointer" },
  fileInput: { position: "absolute", inset: 0, opacity: 0, cursor: "pointer" },
  fileDropText: { fontSize: 13.5, color: "#5B6B84" },
  fileDropButton: { fontSize: 12.5, fontWeight: 600, color: "#2455A4", background: "#EAF0FB", padding: "6px 12px", borderRadius: 5 },
  declaration: { display: "flex", alignItems: "flex-start", gap: 10, padding: "22px 32px", borderBottom: "1px solid #E4E8EF" },
  checkbox: { marginTop: 3, width: 15, height: 15, accentColor: "#0A1F44" },
  declarationText: { fontSize: 13, color: "#5B6B84", lineHeight: 1.5 },
  errorBox: { margin: "0 32px", padding: "12px 16px", background: "#FDECEA", border: "1px solid #F3C0BA", borderRadius: 6, color: "#B3261E", fontSize: 13 },
  submitRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, padding: "22px 32px", flexWrap: "wrap" },
  submitNote: { fontSize: 12.5, color: "#8493A9", maxWidth: 380, lineHeight: 1.5 },
  submitBtn: { height: 44, padding: "0 28px", fontSize: 14, fontWeight: 600, color: "#FFFFFF", background: "#0A1F44", border: "none", borderRadius: 6, cursor: "pointer", flexShrink: 0 },
  footer: { borderTop: "1px solid #D8DEE7", background: "#FFFFFF" },
  footerInner: { maxWidth: 1180, margin: "0 auto", padding: "20px 32px", fontSize: 12, color: "#8493A9" },
  confirmWrap: { maxWidth: 640, margin: "0 auto", padding: "80px 32px" },
  confirmCard: { background: "#FFFFFF", border: "1px solid #D8DEE7", borderRadius: 10, padding: "40px 40px", textAlign: "center" },
  confirmBadge: { display: "inline-block", fontSize: 11.5, fontWeight: 600, color: "#1B7F5C", background: "#E4F3EC", padding: "6px 14px", borderRadius: 20, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 18 },
  confirmTitle: { fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 26, fontWeight: 600, color: "#0A1F44", margin: "0 0 14px" },
  confirmText: { fontSize: 14.5, color: "#5B6B84", lineHeight: 1.6, margin: "0 0 26px" },
  refBox: { display: "flex", flexDirection: "column", gap: 4, background: "#F3F5F8", border: "1px solid #E4E8EF", borderRadius: 8, padding: "16px 20px", marginBottom: 24 },
  refLabel: { fontSize: 11.5, fontWeight: 600, color: "#8493A9", textTransform: "uppercase", letterSpacing: "0.06em" },
  refValue: { fontFamily: "'IBM Plex Mono', monospace", fontSize: 18, fontWeight: 600, color: "#0A1F44" },
  confirmSub: { fontSize: 12.5, color: "#8493A9", lineHeight: 1.6, margin: 0 },
};
 
export default InternshipForm;