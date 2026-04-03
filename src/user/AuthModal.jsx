import {
  X,
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck, ArrowRight
} from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useRegisterUserMutation,
  useLoginUserMutation,
} from "../backend-routes/userroutes/authapi";
import { userLoggedin } from "../backend-routes/slice/authSlice";
import "react-toastify/dist/ReactToastify.css";

export default function AuthModal() {
  const [isSignUp, setIsSignUp] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });

  const [registerUser, { isLoading: registerLoading }] =
    useRegisterUserMutation();
  const [loginUser, { isLoading: loginLoading }] =
    useLoginUserMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (isSignUp) {
        if (
          !formData.username ||
          !formData.email ||
          !formData.password ||
          !formData.phone ||
          !formData.role
        ) {
          return toast.error("Please fill all fields");
        }

        res = await registerUser(formData).unwrap();

        dispatch(userLoggedin({ user: res.existingUser }));
        localStorage.setItem(
          "user",
          JSON.stringify(res.existingUser)
        );

        toast.success("Account created successfully 🎉");
        navigate("/");
      } else {
        res = await loginUser({
          email: formData.email,
          password: formData.password,
        }).unwrap();

        dispatch(userLoggedin({ user: res.existingUser }));
        localStorage.setItem(
          "user",
          JSON.stringify(res.existingUser)
        );

        toast.success("Logged in successfully");

        const role = res?.existingUser?.role || "";
        navigate(role != "user" ? "/admin/properties" : "/");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4 py-12">
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl max-w-4xl w-full flex flex-col lg:flex-row overflow-hidden shadow-2xl border border-orange-100/50">

        {/* CLOSE BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="absolute -top-4 -right-4 z-50 bg-white shadow-xl p-3 rounded-3xl border-4 border-orange-50/80"
        >
          <X size={20} className="text-orange-600 shadow-lg" />
        </button>

        {/* LEFT IMAGE */}
        <div className="lg:w-[40%] relative min-h-[280px] lg:min-h-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070&auto=format&fit=crop"
            alt="Premium PG"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-orange-900/95 via-orange-900/40 to-transparent" />

          {/* Content Overlay */}
          <div className="relative z-10 p-8 h-full flex flex-col justify-end text-white">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse shadow-lg" />
              <span className="text-xs font-black tracking-[0.3em] uppercase bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                Verified PG
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-black leading-tight mb-3 drop-shadow-2xl">
              Direct Owner Deals
              <span className="block text-amber-300/90 text-lg tracking-tight">Free property listing</span>
            </h1>

            <p className="text-amber-100/90 text-sm font-semibold drop-shadow-lg bg-black/20 px-4 py-2 rounded-xl backdrop-blur-sm max-w-sm">
              100% Verified | Owner Posted | Instant Contact
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex-1 bg-white/95 p-8 lg:p-12 xl:p-14">
          <div className="max-w-md mx-auto w-full space-y-6">

            {/* Title */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-orange-50/80 px-4 py-2 rounded-2xl border border-orange-200 mb-4 backdrop-blur-sm">
                <ShieldCheck size={18} className="text-orange-600" />
                <span className="text-xs font-black uppercase tracking-wider text-orange-700">Secure Sign In</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 to-slate-800 bg-clip-text text-transparent mb-2">
                {isSignUp ? "Join Roomgi" : "Welcome Back"}
              </h2>
              <p className="text-slate-600 font-semibold text-sm">
                {isSignUp
                  ? "Create free account with verified owners"
                  : "Access 1000+ verified properties instantly"
                }
              </p>
            </div>

            {/* FORM */}
            <form className="space-y-5" onSubmit={handleSubmit}>

              {isSignUp && (
                <div className="space-y-1">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                    Full Name
                  </label>
                  <Input
                    icon={User}
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="h-14 text-lg bg-orange-50/50 border-orange-200 focus:border-orange-500 focus:ring-orange-200/50 font-semibold"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  Email Address
                </label>
                <Input
                  icon={Mail}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@gmail.com"
                  className="h-14 text-lg bg-orange-50/50 border-orange-200 focus:border-orange-500 focus:ring-orange-200/50 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  Password
                </label>
                <Input
                  icon={Lock}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter secure password"
                  className="h-14 text-lg bg-orange-50/50 border-orange-200 focus:border-orange-500 focus:ring-orange-200/50 font-semibold"
                />
              </div>

              {isSignUp && (
                <>
                  <div className="space-y-1">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                      Account Type
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full h-14 px-5 py-3 border-2 border-orange-200 rounded-2xl text-lg font-semibold bg-orange-50/50 focus:border-orange-500 focus:ring-2 focus:ring-orange-200/50 transition-all appearance-none bg-no-repeat bg-right"
                    >
                      <option value="">Select Role</option>
                      <option value="user">Tenant / Buyer</option>
                      <option value="owner">Property Owner</option>
                      <option value="HotelOwner">Hotel Owner</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                      Phone Number
                    </label>
                    <PhoneInput
                      value={formData.phone}
                      onChange={(val) => setFormData((p) => ({ ...p, phone: val }))}
                      inputClass="w-full h-14 px-5 py-3 border-2 border-orange-200 rounded-2xl text-lg font-semibold bg-orange-50/50 focus:border-orange-500 focus:ring-2 focus:ring-orange-200/50 transition-all"
                    />
                  </div>
                </>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={registerLoading || loginLoading}
                className="group w-full h-16 bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700
                       text-white rounded-3xl font-black text-lg uppercase tracking-widest
                       flex items-center justify-center gap-3
                       border border-orange-500/30 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registerLoading || loginLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    {isSignUp ? "Create Account" : "Sign In Now"}
                    <ArrowRight size={20} className="" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle */}
            <div className="pt-8 border-t-2 border-orange-50/50">
              <p className="text-center text-sm font-semibold text-slate-600">
                {isSignUp ? "Already registered?" : "New to platform?"}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="ml-2 font-black text-orange-600 underline decoration-2 px-2 bg-orange-50/50 py-1 rounded-lg"
                >
                  {isSignUp ? "Login Here" : "Create Account"}
                </button>
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 pt-6">
              <div className="flex items-center gap-2 text-xs text-orange-700 font-black uppercase tracking-wider">
                <ShieldCheck size={14} />
                100% Verified
              </div>
              <div className="w-px h-6 bg-orange-200" />
              <div className="flex items-center gap-2 text-xs text-orange-700 font-black uppercase tracking-wider">
                <ShieldCheck size={14} />
                Free property listing
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
}

/* ---------- REUSABLE INPUTS ---------- */

function PhoneInput({ value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
        Phone
      </label>
      <div className="relative">
        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
        <span className="absolute left-11 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
          +91
        </span>
        <input
          type="tel"
          value={value}
          onChange={(e) =>
            onChange(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
          placeholder="9876543210"
          className="w-full pl-[4.75rem] pr-4 py-3.5 border rounded-2xl text-sm font-semibold outline-none"
        />
      </div>
    </div>
  );
}

function Input({ icon: Icon, label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
        <input
          {...props}
          className="w-full pl-12 pr-4 py-3.5 border rounded-2xl text-sm font-semibold outline-none"
        />
      </div>
    </div>
  );
}
