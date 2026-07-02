import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Mail,
  MapPin,
  Download,
  Share,
  ShieldCheck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
const socialLinks = [
  { icon: Facebook, url: "https://www.facebook.com/share/1BxqbAZze5/" },
  { icon: Instagram, url: "https://www.instagram.com/roomgipvtltd?utm_source=qr&igsh=amhsMW4wZjU1bTdl" },
  { icon: Linkedin, url: "https://www.linkedin.com/company/roomgi" },
  { icon: Twitter, url: "https://x.com/teamroomgi" },
  { icon: Youtube, url: "https://youtube.com/@roomgipvtltd?si=I1bvrzE6LjReDgEN" },
];

export default function Footer() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setDeferredPrompt(null);
    } else {
      alert("To install: Tap your browser menu and select 'Add to Home Screen'");
    }
  };

  return (
    <footer className="relative overflow-hidden bg-[#020617] pt-24 pb-10 text-slate-400">
      {/* Background Decor */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-full -translate-x-1/2 bg-indigo-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* 1. BRAND & IDENTITY (4 Cols) */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <Link to="/" className="flex items-center gap-3 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-black text-white shadow-xl shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                  R
                </div>
                <span className="text-3xl font-black tracking-tighter text-white">
                  Roomgi<span className="text-indigo-500">.</span>
                </span>
              </Link>
              <p className="mt-6 text-sm leading-relaxed text-slate-400 max-w-sm">
                 Roomgi helps students, professionals, and families rent, buy, and sell verified PGs, rooms, flats, homes,
  and commercial spaces across India. Minimum charges, transparent pricing, and trusted listings make every
  property decision simple.**.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 group-hover:border-indigo-500/50 transition-all">
                  <MapPin size={18} className="text-indigo-400" />
                </div>
                <div className="text-sm">
                  <p className="text-white font-bold text-xs uppercase tracking-widest">Headquarters</p>
                  <p>Noida, Uttar Pradesh, India</p>
                </div>
              </div>

              <a href="mailto:support@roomgi.com" className="flex items-center gap-4 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 group-hover:border-indigo-500/50 transition-all">
                  <Mail size={18} className="text-indigo-400" />
                </div>
                <div className="text-sm">
                  <p className="text-white font-bold text-xs uppercase tracking-widest">Email Support</p>
                  <p className="group-hover:text-white transition-colors">support@roomgi.com</p>
                </div>
              </a>
            </div>
          </div>

          {/* 2. NAVIGATION (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-2">
              <div className="space-y-10">
                {/* Company Section */}
               {/* Company Section */}
<nav>
  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">
    Company
  </h3>

  <ul className="mt-6 space-y-4 text-sm font-medium">
    {[
      { label: "About", path: "/about" },
      { label: "Mission", path: "/mission" },
      { label: "Certificates", path: "/certificates" },
      { label: "Career", path: "/career" },
      {
        label: "Roomgi Campus Internship Program",
        path: "/internshipviahackathons",
      },
    ].map((item) => (
      <li key={item.label}>
        <Link
          to={item.path}
          className="hover:text-indigo-400 transition-all flex items-center group"
        >
          <span className="h-[2px] w-0 bg-indigo-500 transition-all group-hover:w-3 group-hover:mr-2" />
          {item.label}
        </Link>
      </li>
    ))}
  </ul>
</nav>
                {/* Leadership Section */}
                <nav>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Leadership</h3>
                  <ul className="mt-6 space-y-4 text-sm font-medium">
                    <li><Link to="/founder" className="hover:text-indigo-400 transition-all flex items-center group">
                      <span className="h-[2px] w-0 bg-indigo-500 transition-all group-hover:w-3 group-hover:mr-2" />Founder
                    </Link></li>
                    <li><Link to="/why-roomgi" className="hover:text-indigo-400 transition-all flex items-center group">
                      <span className="h-[2px] w-0 bg-indigo-500 transition-all group-hover:w-3 group-hover:mr-2" />Our Story
                    </Link></li>
                  </ul>
                </nav>
              </div>

              <div className="space-y-10">
                {/* Support Section */}
                <nav>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Support</h3>
                  <ul className="mt-6 space-y-4 text-sm font-medium">
                    {["FAQs", "Contact", "Help Center"].map((item) => (
                      <li key={item}>
                        <Link to={`/${item.toLowerCase().replace(' ', '')}`} className="hover:text-indigo-400 transition-all flex items-center group">
                          <span className="h-[2px] w-0 bg-indigo-500 transition-all group-hover:w-3 group-hover:mr-2" />
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                {/* Legal Section */}
                <nav>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Trust & Legal</h3>
                  <ul className="mt-6 space-y-4 text-sm font-medium">
                    {["Privacy Policy", "TermsandCondition"].map((item) => (
                      <li key={item}>
                        <Link to={`/${item.toLowerCase().replace(' ', '')}`} className="hover:text-indigo-400 transition-all flex items-center group">
                          <span className="h-[2px] w-0 bg-indigo-500 transition-all group-hover:w-3 group-hover:mr-2" />
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          {/* 3. PWA & SOCIALS (3 Cols) */}
          <div>
      <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white mb-6">
        Connect With Us
      </h3>
      <div className="flex flex-wrap gap-3">
        {socialLinks.map(({ icon: Icon, url }, i) => (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white hover:-translate-y-1 transition-all duration-300"
          >
            <Icon size={18} />
          </a>
        ))}
      </div>
    </div>
        </div>

        {/* 4. COPYRIGHT BAR */}
        <div className="mt-20 border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">
            <span>© {new Date().getFullYear()} Roomgi Private Limited</span>
            <span className="hidden md:block">•</span>
            <span className="text-indigo-500/80">Made with pride in India</span>
          </div>
          
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-600">
            <Link to="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</Link>
            <Link to="/privacypolicy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
