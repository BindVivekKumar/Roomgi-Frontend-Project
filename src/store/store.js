import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

/* =======================
   AUTH + LOCAL SLICES
======================= */
import authReducer, { hydrateUser } from "../backend-routes/slice/authSlice";
import wishlistReducer from "../backend-routes/slice/wishlist";
import tenantReducer from "../backend-routes/slice/notpaidtenantslice";

/* =======================
   RTK QUERY APIs (USER)
======================= */
import { user_PgApi } from "../backend-routes/userroutes/allpg";
import authApi from "../backend-routes/userroutes/authapi";
import user_complaints from "../backend-routes/userroutes/complaints";
import user_filter from "../backend-routes/userroutes/filter";
import user_payment from "../backend-routes/userroutes/payment";
import user_review from "../backend-routes/userroutes/review";
import certificateApi from "../backend-routes/userroutes/certificate";

/* =======================
   RTK QUERY APIs (OWNER)
======================= */
import owner_branch from "../backend-routes/ownerroutes/branch";
import owner_complain from "../backend-routes/ownerroutes/complaints";
import owner_payment from "../backend-routes/ownerroutes/payments";
import owner_room from "../backend-routes/ownerroutes/room";
import owner_tenant from "../backend-routes/ownerroutes/tenant";

/* =======================
   COMBINED REDUCER
======================= */
const appReducer = combineReducers({
  auth: authReducer,
  tenants: tenantReducer,
  wishlist: wishlistReducer,

  [user_PgApi.reducerPath]: user_PgApi.reducer,
  [authApi.reducerPath]: authApi.reducer,

  [owner_branch.reducerPath]: owner_branch.reducer,
  [owner_complain.reducerPath]: owner_complain.reducer,
  [owner_payment.reducerPath]: owner_payment.reducer,
  [owner_room.reducerPath]: owner_room.reducer,
  [owner_tenant.reducerPath]: owner_tenant.reducer,
  [certificateApi.reducerPath]: certificateApi.reducer,

  [user_complaints.reducerPath]: user_complaints.reducer,
  [user_filter.reducerPath]: user_filter.reducer,
  [user_payment.reducerPath]: user_payment.reducer,
  [user_review.reducerPath]: user_review.reducer,
});

/* =======================
   ROOT REDUCER
   (LOGOUT = FULL RESET)
======================= */
const rootReducer = (state, action) => {
  if (action.type === "auth/userLoggedout") {
    state = undefined;

    // 🔥 CLEAR RTK QUERY CACHE
    user_PgApi.util.resetApiState();
    authApi.util.resetApiState();
  }
  return appReducer(state, action);
};

/* =======================
   STORE
======================= */
export const appStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // RTK Query safe
    }).concat(
      user_PgApi.middleware,
      authApi.middleware,

      owner_branch.middleware,
      owner_complain.middleware,
      owner_payment.middleware,
      owner_room.middleware,
      owner_tenant.middleware,

      user_complaints.middleware,
      user_filter.middleware,
      user_payment.middleware,
      user_review.middleware,
      certificateApi.middleware,
    ),
});

/* =======================
   AUTO REFETCH (MOBILE SAFE)
======================= */
setupListeners(appStore.dispatch);

/* =======================
   HYDRATE USER
======================= */
const initializeUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return { user: null, isAuthenticated: false };

    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser) return { user: null, isAuthenticated: false };

    return { user: parsedUser, isAuthenticated: true };
  } catch (err) {
    console.error("User hydrate error:", err);
    return { user: null, isAuthenticated: false };
  }
};

appStore.dispatch(hydrateUser(initializeUser()));
