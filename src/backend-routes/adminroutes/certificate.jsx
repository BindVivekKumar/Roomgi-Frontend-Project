// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { userLoggedin, userLoggedout } from "../slice/authSlice";

// // ✅ Use ENV for production
// const USER_API = import.meta.env.VITE_API_BASE_URL + "/v2/user";

// export const certificateApi = createApi({
//   reducerPath: "certificateApi",

//   baseQuery: fetchBaseQuery({
//     baseUrl: USER_API,
//     credentials: "include",

//     // ✅ Prevent browser + CDN caching
//     prepareHeaders: (headers) => {
//       headers.set("Cache-Control", "no-store");
//       headers.set("Pragma", "no-cache");
//       return headers;
//     },
//   }),

//   tagTypes: ["User"],

//   // ✅ Production cache behavior
//   keepUnusedDataFor: 0, // ⛔ No stale cache
//   refetchOnMountOrArgChange: true,
//   refetchOnFocus: true,
//   refetchOnReconnect: true,

//   endpoints: (builder) => ({

 
//   }),
// });

// export const {

// } = certificateApi;

// export default certificateApi;
