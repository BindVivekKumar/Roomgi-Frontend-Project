import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../protectedroutes/adminprotectedroutes";

import Properties from "./pages/Properties";
import Tenants from "./pages/Tenants";
import Payments from "./pages/Payments";
import Complaints from "./pages/Complaints";
import Subscription from "./pages/Subscription";

import AddPayment from "./pages/c-xyz/addpayment";
import TenantDetails from "./pages/c-xyz/tenantdetail";
import EditTenant from "./pages/c-xyz/Editingtenant";

import AddRoomForm from "./pages/c-xyz/addrooms/addroom";
import ShowRooms from "./pages/c-xyz/showallroom";
import EditRoomForm from "./pages/c-xyz/editpage";

import Signup from "./pages/auth/signup";
import Login from "./pages/auth/loginpage";

export default function AdminApp() {
  return (
    <Routes>
      {/* 🔒 PROTECTED ADMIN ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={["branch-manager", "owner"]} />}>
        
          <Route index element={<Navigate to="properties" replace />} />

          <Route path="properties" element={<Properties />} />
          <Route path="addroom" element={<AddRoomForm />} />
          <Route path="edit-room/:roomId" element={<EditRoomForm />} />
          <Route path="showrooms" element={<ShowRooms />} />

          {/* <Route path="tenants" element={<Tenants />} /> */}
          <Route path="tenaantdetail/:id" element={<TenantDetails />} />
          <Route path="edittenant/:id" element={<EditTenant />} />

          <Route path="payments" element={<Payments />} />
          <Route path="add-payment" element={<AddPayment />} />

          <Route path="complaints" element={<Complaints />} />
          <Route path="subscription" element={<Subscription />} />

          {/* fallback */}
          <Route path="*" element={<Navigate to="properties" replace />} />
        </Route>
   

      {/* 🌐 PUBLIC AUTH ROUTES */}
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
    </Routes>
  );
}
