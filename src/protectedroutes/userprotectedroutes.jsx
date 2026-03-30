import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { user } = useSelector((state) => state.auth);

  // If admin tries to open user/public pages → redirect to admin dashboard
  if (user?.role === "owner" || user?.role === "HotelOwner") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
