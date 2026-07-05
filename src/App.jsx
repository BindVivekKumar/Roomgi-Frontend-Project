import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, lazy, Suspense } from "react";

/* ---------- LAYOUT (Common - No Lazy Load) ---------- */
import Header from "./user/Header";
import Footer from "./user/Footer";

import ScrollToTop from "./user/ScrollToTop";
import ProtectedRoute from "./protectedroutes/userprotectedroutes";
import { hydrateUser } from "./backend-routes/slice/authSlice";
import ResetPassword from "./user/changingpassword.jsx"


/* ---------- LAZY LOADED COMPONENTS ---------- */
// User Pages
const LandingPage = lazy(() => import("./user/LandingPage"));
const PGDetailsPage = lazy(() => import("./user/PGDetailsPage"));
// const HotelDetailsPage=Lazy(()=>import ("./user/HotelDetailsPage"))
const PGMap = lazy(() => import("./user/pgmap.jsx"));
const Searched = lazy(() => import("./user/filtered.jsx"));
const BranchRoomsPage = lazy(() => import("./user/branch-rooms.jsx"));
const AllPotos = lazy(() => import("./user/allphotos"));
const Wishlist = lazy(() => import("./user/wishlist"));
const WishlistPage = lazy(() => import("./user/wishlistdetails"));
const Bookings = lazy(() => import("./user/booking"));
const PayRentPanel = lazy(() => import("./user/payrent"));
const TenantDashboard = lazy(() => import("./user/trackrentdashboard"));
const CreateComplaint = lazy(() => import("./user/complain"));
const ComplaintsPage = lazy(() => import("./user/mycomplain"));
const Profile = lazy(() => import("./user/myprofile"));
const SignupSuccess = lazy(() => import("./user/signupsuccess"));
const BookingSuccess = lazy(() => import("./user/bookingssuccess"));
const AuthModal = lazy(() => import("./user/AuthModal"));
const ForgotPassword = lazy(() => import("./user/forgotemail"));
// Static Pages
const CancellationPolicy = lazy(() => import("./user/cancilationandrefundpolicy"));
const ContactUs = lazy(() => import("./user/contactus"));
const PrivacyPolicy = lazy(() => import("./user/privacypolicy"));
const TermsConditions = lazy(() => import("./user/termsandcondition"));
const ShippingPolicy = lazy(() => import("./user/shippingpolicy"));
const HelpCenter = lazy(() => import("./user/HelpCenter.jsx"));
const FAQs = lazy(() => import("./user/FAQs.jsx"));
const Career = lazy(() => import("./user/career.jsx"));
const CustomerSupport = lazy(() => import("./user/CustomerSupport.jsx"));
const PartnerWithRoomgi = lazy(() => import("./user/PartnerWithRoomgi.jsx"));
const AboutUs = lazy(() => import("./user/AbutUs.jsx"));
const About = lazy(() => import("./user/About.jsx"));
const Contact = lazy(() => import("./user/Contact.jsx"));
const FounderPage = lazy(() => import("./user/founderpage.jsx"));
const Disclaimer = lazy(() => import("./user/desclaimer.jsx"));
const InternshipCertificate = lazy(() => import("./user/InternshipCertificate"));
const ReportIssue = lazy(() => import("./user/reportanissue.jsx"));
const MissionVision = lazy(() => import("./user/missionandvision.jsx"));
const WhyRoomgi = lazy(() => import("./user/why-roomgi.jsx"));
const SafetyGuidelinesPage = lazy(() => import("./user/safetyguidlinepage.jsx"));
const HotelBookingForm = lazy(() => import("./user/hoteldatebooking"))
const CertificateVerify = lazy(() => import("./user/certificate"))
const AdminApp = lazy(() => import("./owner/AdminApp"));
const InternshipForm = lazy(() => import("./user/InternshipForm"));
// Loading Component
const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-white">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
  </div>
);

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    try {
      const parsed = raw ? JSON.parse(raw) : null;
      dispatch(hydrateUser({ user: parsed, isAuthenticated: !!parsed }));
    } catch {
      localStorage.removeItem("user");
      dispatch(hydrateUser({ user: null, isAuthenticated: false }));
    }
  }, [dispatch]);


  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />


      <Header />


      <main className="flex-1">
        {/* Suspense is CRITICAL here */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* 🔒 USER PROTECTED */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/pg/:id" element={<PGDetailsPage />} />
              <Route path="/hotelbookingform/:id" element={<HotelBookingForm />} />
              <Route path="/pgmap/:branchId" element={<PGMap />} />
              <Route path="/branch-rooms/:id" element={<BranchRoomsPage />} />
              <Route path="/allphotos/:id" element={<AllPotos />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/wishlistdetails" element={<WishlistPage />} />
              <Route path="/wishlistdetails/:id" element={<TenantDashboard />} />
              <Route path="/mybooking" element={<Bookings />} />
              <Route path="/payrent/:id" element={<PayRentPanel />} />
              <Route path="/complain/:branchId" element={<CreateComplaint />} />
              <Route path="/mycomplain" element={<ComplaintsPage />} />
              <Route path="/myprofile" element={<Profile />} />
              <Route path="/signup-success" element={<SignupSuccess />} />
              <Route path="/bookingssuccess" element={<BookingSuccess />} />
             
            </Route>

            {/* 🌍 PUBLIC */}
            <Route path="/search/:city" element={<Searched />} />
             <Route path="/internshipviahackathons" element={<InternshipForm />} />
            <Route path="/login" element={<AuthModal />} />
            <Route path="/cancellationpolicy" element={<CancellationPolicy />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/termsandcondition" element={<TermsConditions />} />
            <Route path="/shippingpolicy" element={<ShippingPolicy />} />
            <Route path="/helpcenter" element={<HelpCenter />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/career" element={<Career />} />
            <Route path="/customersupport" element={<CustomerSupport />} />
            <Route path="/partnerwithroomgi" element={<PartnerWithRoomgi />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/founder" element={<FounderPage />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/internship-certificate" element={<InternshipCertificate />} />
            <Route path="/reportissue" element={<ReportIssue />} />
            <Route path="/mission" element={<MissionVision />} />
            <Route path="/why-roomgi" element={<WhyRoomgi />} />
            <Route path="/safety-guidelines" element={<SafetyGuidelinesPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/forgotpasswordpage/:token" element={<ResetPassword />} />
            <Route path="/certificates" element={<CertificateVerify />} />


            {/* 🛠 ADMIN */}
            <Route path="/admin/*" element={<AdminApp />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default App;