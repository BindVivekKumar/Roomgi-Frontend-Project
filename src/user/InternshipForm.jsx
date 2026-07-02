import React, { useState, useMemo } from "react";
 
const SECTIONS = [
  {
    id: "personal",
    number: "01",
    title: "Personal information",
    required: ["fullName", "email", "phone"],
  },
  {
    id: "academic",
    number: "02",
    title: "Academic background",
    required: ["college", "degree", "year"],
  },
  {
    id: "role",
    number: "03",
    title: "Role and skills",
    required: ["role", "skills", "availability"],
  },
  {
    id: "links",
    number: "04",
    title: "Professional links",
    required: [],
  },
  {
    id: "documents",
    number: "05",
    title: "Documents",
    required: ["resume"],
  },
  {
    id: "statement",
    number: "06",
    title: "Statement of interest",
    required: ["whyJoin"],
  },
];
 
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
    resume: null,
    whyJoin: "",
    availability: "",
  });
 
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");
 
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
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
 
    // Bot credentials should be moved to a backend service before going live —
    // any string here is visible to anyone who views page source.
    const TELEGRAM_BOT_TOKEN = "8913075639:AAFgAXAN4GVNtJoFb72xINOL5lcpxM3NvCk";
    const TELEGRAM_CHAT_ID = "8615218309";
 
    const textMessage = `
New Internship Application
----------------------------------
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
College: ${formData.college}
Degree: ${formData.degree} (${formData.year})
Role: ${formData.role}
Skills: ${formData.skills}
Availability: ${formData.availability}
 
Profiles:
LinkedIn: ${formData.linkedin || "N/A"}
GitHub: ${formData.github || "N/A"}
Portfolio: ${formData.portfolio || "N/A"}
 
Why join Roomgi:
${formData.whyJoin}
----------------------------------
    `;
 
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: textMessage,
        }),
      });
 
      if (formData.resume) {
        const fileData = new FormData();
        fileData.append("chat_id", TELEGRAM_CHAT_ID);
        fileData.append("document", formData.resume);
        fileData.append("caption", `Resume of ${formData.fullName}`);
 
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
          method: "POST",
          body: fileData,
        });
      }
 
      const ref = `ROOMGI-INT-${new Date().getFullYear()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;
      setReferenceId(ref);
      setSubmitted(true);
    } catch (error) {
      console.error("Error sending data to Telegram:", error);
      alert("We couldn't submit your application. Please try again.");
    } finally {
      setLoading(false);
    }
  };
 
  if (submitted) {
    return (
      <div style={styles.page}>
        <TopBar />
        <div style={styles.confirmWrap}>
          <div style={styles.confirmCard}>
            <div style={styles.confirmBadge}>Application received</div>
            <h1 style={styles.confirmTitle}>Thank you, {formData.fullName.split(" ")[0] || "applicant"}.</h1>
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
      <TopBar />
 
      <div style={styles.hero}>
        <span style={styles.heroEyebrow}>Careers · Internship Program</span>
        <h1 style={styles.heroTitle}>Internship application</h1>
        <p style={styles.heroSub}>
          Complete every section below to be considered for the Roomgi Internship
          Program. Fields marked required must be filled before submission.
        </p>
      </div>
 
      <div style={styles.body}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarLabel}>Application sections</div>
          <ol style={styles.sidebarList}>
            {sectionStatus.map((s) => (
              <li key={s.id} style={styles.sidebarItem}>
                <a href={`#${s.id}`} style={styles.sidebarLink}>
                  <span
                    style={{
                      ...styles.sidebarBadge,
                      ...(s.complete ? styles.sidebarBadgeDone : {}),
                    }}
                  >
                    {s.complete ? "✓" : s.number}
                  </span>
                  <span style={styles.sidebarText}>
                    {s.title}
                    {s.optional && <span style={styles.sidebarOptional}> · optional</span>}
                  </span>
                </a>
              </li>
            ))}
          </ol>
          <div style={styles.sidebarNote}>
            <div style={styles.sidebarNoteTitle}>Need help?</div>
            <div style={styles.sidebarNoteText}>
              Contact careers@roomgi.com for questions about this application.
            </div>
          </div>
        </aside>
 
        <main style={styles.main}>
          <form onSubmit={handleSubmit}>
            <Section id="personal" number="01" title="Personal information">
              <Grid>
                <Field label="Full name" required>
                  <input
                    style={styles.input}
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="As it appears on official documents"
                    required
                  />
                </Field>
                <Field label="Email address" required>
                  <input
                    style={styles.input}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                  />
                </Field>
                <Field label="Phone number" required>
                  <input
                    style={styles.input}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 00000 00000"
                    required
                  />
                </Field>
              </Grid>
            </Section>
 
            <Section id="academic" number="02" title="Academic background">
              <Grid>
                <Field label="College / university" required>
                  <input
                    style={styles.input}
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    required
                  />
                </Field>
                <Field label="Degree" required>
                  <input
                    style={styles.input}
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech Computer Science"
                    required
                  />
                </Field>
                <Field label="Current year" required>
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
              </Grid>
            </Section>
 
            <Section id="role" number="03" title="Role and skills">
              <Grid>
                <Field label="Preferred internship role" required full>
                  <select
                    style={styles.select}
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a role</option>

{/* Technology */}
<option>Software Development Engineer (SDE)</option>
<option>Frontend Developer</option>
<option>Backend Developer</option>
<option>Full Stack Developer</option>
<option>React.js Developer</option>
<option>Node.js Developer</option>
<option>Java Developer</option>
<option>Python Developer</option>
<option>Mobile App Developer (Android/iOS)</option>
<option>AI / Machine Learning Engineer</option>
<option>Data Science Intern</option>
<option>Data Analyst</option>
<option>Cyber Security Analyst</option>
<option>Cloud Computing Intern</option>
<option>DevOps Engineer</option>
<option>UI/UX Designer</option>
<option>QA / Software Testing</option>

{/* Business */}
<option>Business Development Executive</option>
<option>Business Analyst</option>
<option>Operations Executive</option>
<option>Project Coordinator</option>
<option>Product Management Intern</option>
<option>Sales Executive</option>
<option>Inside Sales Executive</option>
<option>Customer Success Executive</option>
<option>Customer Support Associate</option>

{/* Marketing */}
<option>Digital Marketing</option>
<option>Performance Marketing</option>
<option>Social Media Marketing</option>
<option>Content Marketing</option>
<option>SEO Executive</option>
<option>Brand Marketing</option>

{/* HR */}
<option>Human Resources (HR)</option>
<option>Talent Acquisition</option>
<option>Recruitment Executive</option>

{/* Finance */}
<option>Finance & Accounts</option>
<option>Accounting Intern</option>
<option>Financial Analyst</option>
<option>Investment Research Intern</option>

{/* Commerce */}
<option>Business Operations</option>
<option>Supply Chain & Logistics</option>
<option>Procurement Executive</option>

{/* Design */}
<option>Graphic Designer</option>
<option>Video Editor</option>
<option>Motion Graphics Designer</option>

{/* Content */}
<option>Content Writer</option>
<option>Technical Writer</option>
<option>Copywriter</option>

{/* Research */}
<option>Research Analyst</option>
<option>Market Research Intern</option>

{/* Others */}
<option>Campus Ambassador</option>
<option>Public Relations (PR)</option>
<option>Legal Intern</option>
<option>Administrative Executive</option>
<option>General Internship</option>
                  </select>
                </Field>
                <Field label="Technical skills" required full>
                  <input
                    style={styles.input}
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, Node.js, Java, Python..."
                    required
                  />
                </Field>
                <Field label="Availability" required>
                  <select
                    style={styles.select}
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option>Part Time</option>
                    <option>Full Time</option>
                  </select>
                </Field>
              </Grid>
            </Section>
 
            <Section id="links" number="04" title="Professional links" subtitle="Optional">
              <Grid>
                <Field label="LinkedIn profile">
                  <input
                    style={styles.input}
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="linkedin.com/in/username"
                  />
                </Field>
                <Field label="GitHub profile">
                  <input
                    style={styles.input}
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="github.com/username"
                  />
                </Field>
                <Field label="Portfolio website">
                  <input
                    style={styles.input}
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    placeholder="yourdomain.com"
                  />
                </Field>
              </Grid>
            </Section>
 
            <Section id="documents" number="05" title="Documents">
              <Field label="Resume" required full hint="Accepted formats: PDF, DOC, DOCX">
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
                    {formData.resume ? formData.resume.name : "Choose file or drag here"}
                  </span>
                  <span style={styles.fileDropButton}>Browse</span>
                </label>
              </Field>
            </Section>
 
            <Section id="statement" number="06" title="Statement of interest">
              <Field label="Why do you want to join Roomgi?" required full>
                <textarea
                  style={styles.textarea}
                  rows={6}
                  name="whyJoin"
                  value={formData.whyJoin}
                  onChange={handleChange}
                  placeholder="Tell us about your motivation and relevant experience..."
                  required
                />
              </Field>
            </Section>
 
            <div style={styles.declaration}>
              <input type="checkbox" required style={styles.checkbox} id="declare" />
              <label htmlFor="declare" style={styles.declarationText}>
                I confirm that the information provided in this application is accurate
                and complete to the best of my knowledge.
              </label>
            </div>
 
            <div style={styles.submitRow}>
              <span style={styles.submitNote}>
                By submitting, you agree to be contacted by Roomgi regarding this
                application.
              </span>
              <button type="submit" disabled={loading} style={styles.submitBtn}>
                {loading ? "Submitting…" : "Submit application"}
              </button>
            </div>
          </form>
        </main>
      </div>
 
      <Footer />
    </div>
  );
};
 
const TopBar = () => (
  <header style={styles.topbar}>
    <div style={styles.topbarInner}>
      <div style={styles.logo}>
        ROOMGI<span style={styles.logoMark}>®</span>
      </div>
      <div style={styles.topbarRight}>Careers Portal</div>
    </div>
  </header>
);
 
const Footer = () => (
  <footer style={styles.footer}>
    <div style={styles.footerInner}>
      © {new Date().getFullYear()} Roomgi Pvt. Ltd. is building the future of accommodation through technology, innovation, and a team passionate about solving real-world problems.
    </div>
  </footer>
);
 
const Section = ({ id, number, title, subtitle, children }) => (
  <section id={id} style={styles.section}>
    <div style={styles.sectionHeader}>
      <span style={styles.sectionNumber}>{number}</span>
      <div>
        <h2 style={styles.sectionTitle}>{title}</h2>
        {subtitle && <span style={styles.sectionSubtitle}>{subtitle}</span>}
      </div>
    </div>
    <div style={styles.sectionBody}>{children}</div>
  </section>
);
 
const Grid = ({ children }) => <div style={styles.grid}>{children}</div>;
 
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
  page: {
    minHeight: "100vh",
    background: "#F3F5F8",
    fontFamily:
      "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#16233D",
  },
  topbar: {
    background: "#0A1F44",
    borderBottom: "1px solid #0A1F44",
  },
  topbarInner: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "18px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    color: "#FFFFFF",
    fontFamily: "'IBM Plex Serif', Georgia, serif",
    fontSize: 22,
    fontWeight: 600,
    letterSpacing: "0.06em",
  },
  logoMark: {
    fontSize: 12,
    verticalAlign: "super",
    color: "#8FA8D6",
    marginLeft: 2,
  },
  topbarRight: {
    color: "#AFC2E3",
    fontSize: 13,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  hero: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "48px 32px 32px",
  },
  heroEyebrow: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#2455A4",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  heroTitle: {
    fontFamily: "'IBM Plex Serif', Georgia, serif",
    fontSize: 38,
    fontWeight: 600,
    color: "#0A1F44",
    margin: "0 0 12px",
  },
  heroSub: {
    fontSize: 16,
    color: "#5B6B84",
    maxWidth: 620,
    lineHeight: 1.6,
    margin: 0,
  },
  body: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "0 32px 64px",
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: 32,
    alignItems: "start",
  },
  sidebar: {
    position: "sticky",
    top: 24,
    background: "#FFFFFF",
    border: "1px solid #D8DEE7",
    borderRadius: 10,
    padding: "20px 18px",
  },
  sidebarLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#8493A9",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 14,
  },
  sidebarList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  sidebarItem: {
    marginBottom: 4,
  },
  sidebarLink: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 6px",
    textDecoration: "none",
    borderRadius: 6,
  },
  sidebarBadge: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "#EAF0FB",
    color: "#2455A4",
    fontSize: 11,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  sidebarBadgeDone: {
    background: "#1B7F5C",
    color: "#FFFFFF",
  },
  sidebarText: {
    fontSize: 13.5,
    color: "#16233D",
    fontWeight: 500,
  },
  sidebarOptional: {
    fontSize: 11.5,
    color: "#8493A9",
    fontWeight: 400,
  },
  sidebarNote: {
    marginTop: 18,
    paddingTop: 16,
    borderTop: "1px solid #E4E8EF",
  },
  sidebarNoteTitle: {
    fontSize: 12.5,
    fontWeight: 600,
    color: "#16233D",
    marginBottom: 4,
  },
  sidebarNoteText: {
    fontSize: 12.5,
    color: "#7A889C",
    lineHeight: 1.5,
  },
  main: {
    background: "#FFFFFF",
    border: "1px solid #D8DEE7",
    borderRadius: 10,
    overflow: "hidden",
  },
  section: {
    padding: "28px 32px",
    borderBottom: "1px solid #E4E8EF",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 20,
  },
  sectionNumber: {
    fontFamily: "'IBM Plex Serif', Georgia, serif",
    fontSize: 20,
    fontWeight: 600,
    color: "#C4CEDC",
    lineHeight: 1,
    minWidth: 30,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 600,
    color: "#0A1F44",
    margin: 0,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#8493A9",
    fontWeight: 500,
  },
  sectionBody: {
    paddingLeft: 44,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "18px 20px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  fieldFull: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    gridColumn: "1 / -1",
  },
  label: {
    fontSize: 12.5,
    fontWeight: 600,
    color: "#3D4A61",
  },
  asterisk: {
    color: "#C0392B",
  },
  hint: {
    fontSize: 11.5,
    color: "#8493A9",
  },
  input: {
    height: 40,
    padding: "0 12px",
    fontSize: 14,
    border: "1px solid #D0D6E1",
    borderRadius: 6,
    background: "#FBFCFD",
    color: "#16233D",
    outline: "none",
    fontFamily: "inherit",
  },
  select: {
    height: 40,
    padding: "0 12px",
    fontSize: 14,
    border: "1px solid #D0D6E1",
    borderRadius: 6,
    background: "#FBFCFD",
    color: "#16233D",
    outline: "none",
    fontFamily: "inherit",
  },
  textarea: {
    padding: 12,
    fontSize: 14,
    border: "1px solid #D0D6E1",
    borderRadius: 6,
    background: "#FBFCFD",
    color: "#16233D",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical",
  },
  fileDrop: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: "1px dashed #B9C3D3",
    borderRadius: 6,
    background: "#FBFCFD",
    padding: "10px 14px",
    cursor: "pointer",
  },
  fileInput: {
    position: "absolute",
    inset: 0,
    opacity: 0,
    cursor: "pointer",
  },
  fileDropText: {
    fontSize: 13.5,
    color: "#5B6B84",
  },
  fileDropButton: {
    fontSize: 12.5,
    fontWeight: 600,
    color: "#2455A4",
    background: "#EAF0FB",
    padding: "6px 12px",
    borderRadius: 5,
  },
  declaration: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    padding: "22px 32px",
    borderBottom: "1px solid #E4E8EF",
  },
  checkbox: {
    marginTop: 3,
    width: 15,
    height: 15,
    accentColor: "#0A1F44",
  },
  declarationText: {
    fontSize: 13,
    color: "#5B6B84",
    lineHeight: 1.5,
  },
  submitRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    padding: "22px 32px",
    flexWrap: "wrap",
  },
  submitNote: {
    fontSize: 12.5,
    color: "#8493A9",
    maxWidth: 380,
    lineHeight: 1.5,
  },
  submitBtn: {
    height: 44,
    padding: "0 28px",
    fontSize: 14,
    fontWeight: 600,
    color: "#FFFFFF",
    background: "#0A1F44",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    flexShrink: 0,
  },
  footer: {
    borderTop: "1px solid #D8DEE7",
    background: "#FFFFFF",
  },
  footerInner: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "20px 32px",
    fontSize: 12,
    color: "#8493A9",
  },
  confirmWrap: {
    maxWidth: 640,
    margin: "0 auto",
    padding: "80px 32px",
  },
  confirmCard: {
    background: "#FFFFFF",
    border: "1px solid #D8DEE7",
    borderRadius: 10,
    padding: "40px 40px",
    textAlign: "center",
  },
  confirmBadge: {
    display: "inline-block",
    fontSize: 11.5,
    fontWeight: 600,
    color: "#1B7F5C",
    background: "#E4F3EC",
    padding: "6px 14px",
    borderRadius: 20,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    marginBottom: 18,
  },
  confirmTitle: {
    fontFamily: "'IBM Plex Serif', Georgia, serif",
    fontSize: 26,
    fontWeight: 600,
    color: "#0A1F44",
    margin: "0 0 14px",
  },
  confirmText: {
    fontSize: 14.5,
    color: "#5B6B84",
    lineHeight: 1.6,
    margin: "0 0 26px",
  },
  refBox: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    background: "#F3F5F8",
    border: "1px solid #E4E8EF",
    borderRadius: 8,
    padding: "16px 20px",
    marginBottom: 24,
  },
  refLabel: {
    fontSize: 11.5,
    fontWeight: 600,
    color: "#8493A9",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  refValue: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 18,
    fontWeight: 600,
    color: "#0A1F44",
  },
  confirmSub: {
    fontSize: 12.5,
    color: "#8493A9",
    lineHeight: 1.6,
    margin: 0,
  },
};
 
export default InternshipForm;
