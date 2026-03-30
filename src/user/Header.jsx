import { useEffect, useState, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Home,
  User,
  Menu,
  Loader2,
  X,
  LogOut,
  MessageSquare,
  Briefcase,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import logo from "../assets/logofinal.png";
import { useLogoutUserMutation } from "../backend-routes/userroutes/authapi";
import { userLoggedout } from "../backend-routes/slice/authSlice";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  console.log(user);

  const [openDropdown, setOpenDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownRef = useRef(null);
  const [logoutUser, { isLoading }] = useLogoutUserMutation();

  const isAdmin =
    user?.role === "owner" || user?.role === "branch-manager";

  const isHotelOwner = user?.role === "HotelOwner";

  /* Scroll Effect */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Outside Click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Logout */
  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
    } catch { }
    localStorage.clear();
    dispatch(userLoggedout());
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
    setOpenDropdown(false);
    setMobileMenu(false);
  };

  const navLinks = [
    { label: "Explore PG", path: "/?category=Pg", icon: <Home size={18} /> },
    { label: "About", path: "/about", icon: <User size={18} /> },
    { label: "Contact", path: "/contact", icon: <MessageSquare size={18} /> },
    // { label: "Explore Hotel", path: "/?category=Hotel", icon: <MessageSquare size={18} /> },
  ];

  const userLinks = [
    { label: "My Profile", path: "/myprofile", icon: <User size={18} /> },
    { label: "Bookings", path: "/mybooking", icon: <Briefcase size={18} /> },
    { label: "Complaints", path: "/mycomplain", icon: <MessageSquare size={18} /> },
  ];

  const hotelOwnerLinks = [
    { label: "Properties", path: "/admin/properties", icon: <Home size={18} /> },
    { label: "Payments", path: "/admin/payments", icon: <Briefcase size={18} /> },
    { label: "Rooms", path: "/admin/showrooms", icon: <Home size={18} /> },
    // { label: "Complaints", path: "/admin/complaints", icon: <MessageSquare size={18} /> },
  ];

  const adminMenuItems = [
    { label: "Properties", path: "/admin/properties", icon: <Home size={18} /> },
    { label: "Rooms", path: "/admin/showrooms", icon: <Home size={18} /> },
  ];

  return (
    <>
      {/* HEADER */}
      <header
        className={`z-[100] transition-all duration-500 ${isScrolled
            ? "bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            : "bg-white"
          }`}
      >
        <div
          className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all ${isScrolled ? "py-3" : "py-5"
            }`}
        >
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 active:scale-95 transition"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={22} />
            </button>

            <button
              onClick={() => navigate("/")}
              className="hover:opacity-90 transition"
            >
              <img src={logo} className="h-10 md:h-12" alt="Roomgi" />
            </button>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex gap-10 items-center">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.path}
                className={`relative flex items-center gap-2 font-semibold text-sm transition ${location.pathname === l.path
                    ? "text-indigo-600"
                    : "text-slate-500 hover:text-slate-900"
                  }`}
              >
                {l.icon}
                {l.label}
                {location.pathname === l.path && (
                  <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-indigo-600 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* RIGHT */}
          {!isAuthenticated ? (
            <button
              onClick={() => navigate("/login")}
              className="
    hidden lg:flex items-center gap-2
    px-7 py-2.5 rounded-full
    text-white font-semibold tracking-wide

    bg-gradient-to-r 
    from-[#7B2FF7] via-[#FF3CAC] to-[#FFB347]

    shadow-lg shadow-pink-500/40
    hover:shadow-2xl hover:shadow-pink-500/60
    hover:scale-[1.06]

    active:scale-95
    transition-all duration-300 ease-out
    relative overflow-hidden
  "
            >
              {/* glossy shine */}
              <span
                className="
      absolute inset-0 
      bg-gradient-to-r from-transparent via-white/25 to-transparent
      translate-x-[-120%] hover:translate-x-[120%]
      transition-transform duration-700
    "
              />
              Login / Signup
            </button>

          ) : (
            <div ref={dropdownRef} className="relative hidden lg:block">
              <button
                onClick={() => setOpenDropdown((p) => !p)}
                className="flex items-center gap-3 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition"
              >
                <span className="font-medium">{user?.username}</span>
                <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
              </button>

              {openDropdown && (
                <div className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">

                  {/* Admin OR User Links */}
                  {(isAdmin &&  (
                    <>
                      <div className="border-t my-2" />
                      {adminMenuItems.map((u) => (
                        <button
                          key={u.label}
                          onClick={() => {
                            navigate(u.path);
                            setOpenDropdown(false);
                          }}
                          className="w-full px-5 py-3 flex items-center gap-3 text-sm font-medium hover:bg-slate-50 transition"
                        >
                          {u.icon}
                          {u.label}
                        </button>
                      ))}
                    </>
                  ))}

                  {/* Hotel Owner Links */}
                  {isHotelOwner && (
                    <>
                      <div className="border-t my-2" />
                      {hotelOwnerLinks.map((u) => (
                        <button
                          key={u.label}
                          onClick={() => {
                            navigate(u.path);
                            setOpenDropdown(false);
                          }}
                          className="w-full px-5 py-3 flex items-center gap-3 text-sm font-medium hover:bg-slate-50 transition"
                        >
                          {u.icon}
                          {u.label}
                        </button>
                      ))}
                    </>
                  )}

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full px-5 py-3 flex items-center gap-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <LogOut />
                    )}
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>


      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-[110] transition ${mobileMenu ? "visible" : "invisible"
          }`}
      >
        {/* Overlay */}
        <div
          onClick={() => setMobileMenu(false)}
          className={`
            absolute inset-0 
            bg-black/50 backdrop-blur-md
            transition-all duration-500
            ${mobileMenu ? "opacity-100" : "opacity-0"}
          `}
        />

        {/* Sidebar */}
        {/* Sidebar */}
        <aside
          className={`
    absolute top-3 left-3 bottom-3 w-[300px] 
    bg-white/90 backdrop-blur-2xl
    rounded-[32px]
    shadow-[0_20px_60px_rgba(0,0,0,0.25)]
    border border-white/40

    flex flex-col   /* ⭐ IMPORTANT */

    transform transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
    ${mobileMenu ? "translate-x-0 opacity-100" : "-translate-x-[120%] opacity-0"}
  `}
        >

          {/* HEADER */}
          <div className="p-8 pb-4 flex justify-between items-center">
            <img src={logo} className="h-10" alt="Roomgi" />
            <X className="cursor-pointer" onClick={() => setMobileMenu(false)} />
          </div>

          {/* MENU LIST SCROLLABLE */}
          <div className="flex-1 overflow-y-auto px-6 space-y-2">

            {(
              !isAuthenticated
                ? navLinks
                : isAdmin
                  ? adminMenuItems
                  : [...navLinks, ...userLinks]
            ).map((l) => (
              <button
                key={l.label}
                onClick={() => {
                  navigate(l.path);
                  setMobileMenu(false);
                }}
                className="
          w-full flex items-center gap-4 px-5 py-3 rounded-2xl
          text-slate-700 font-medium
          hover:bg-white hover:shadow-md
          active:scale-[0.98]
          transition-all duration-200
        "
              >
                {l.icon}
                {l.label}
              </button>
            ))}

          </div>

          {/* ⭐ BOTTOM AUTH SECTION FIXED */}
          <div className="p-6 border-t border-slate-200">

            {/* LOGIN */}
            {!isAuthenticated && (
              <button
                onClick={() => {
                  navigate("/login");
                  setMobileMenu(false);
                }}
                className="
        w-full flex items-center gap-4 
        px-5 py-4 rounded-2xl
        text-white font-semibold
        bg-gradient-to-r from-[#7B2FF7] via-[#FF3CAC] to-[#FFB347]
        shadow-lg shadow-pink-500/40
        hover:shadow-2xl hover:shadow-pink-500/60
        hover:scale-[1.03]
        active:scale-[0.98]
        transition-all duration-300 relative overflow-hidden
      "
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <User size={18} />
                </div>
                Login / Signup

                {/* subtle shine effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent 
                       translate-x-[-120%] hover:translate-x-[120%] 
                       transition-transform duration-700" />
              </button>
            )}

            {/* LOGOUT */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="
        w-full flex items-center gap-4 
        px-5 py-4 rounded-2xl
        bg-red-50 text-red-600 font-semibold
        hover:bg-red-100
        active:scale-[0.98]
        transition-all duration-300
      "
              >
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <LogOut size={18} />
                </div>
                Logout
              </button>
            )}

          </div>


        </aside>

      </div>
    </>
  );
}
