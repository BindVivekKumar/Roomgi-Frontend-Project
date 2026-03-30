import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedin, userLoggedout } from "../slice/authSlice";

// ✅ Use ENV for API base
const USER_API = import.meta.env.VITE_API_BASE_URL + "/v2/user";

const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",

    // ✅ Prevent browser/CDN cache
    prepareHeaders: (headers) => {
      headers.set("Cache-Control", "no-store");
      headers.set("Pragma", "no-cache");
      return headers;
    },
  }),

  tagTypes: ["User", "Wishlist"],

  // ✅ Production-safe default cache rules
  keepUnusedDataFor: 0,
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,

  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (formdata) => ({ url: "register", method: "POST", body: formdata }),
      invalidatesTags: ["User"],
    }),

    resetUserpassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `resetpassword/${token}`,
        method: "POST",
        body: { password },
      }),
      invalidatesTags: ["User"],
    }),

    profile: builder.query({
      query: () => ({ url: "profile" }),
      providesTags: ["User"],
    }),

    getAllFiltered: builder.query({
      query: () => ({ url: "filtered" }),
      providesTags: ["User"],
    }),

    toggleWishlist: builder.mutation({
      query: ({ roomId, branchId }) => ({
        url: "/wishlist/toggle",
        method: "POST",
        body: { roomId, branchId },
      }),
      invalidatesTags: ["Wishlist"],
    }),

    getWishlist: builder.query({
      query: () => ({ url: "/wishlist/my" }),
      providesTags: ["Wishlist"],
    }),

    ForgotUserpassword: builder.mutation({
      query: ({ email }) => ({
        url: "forgotpassword",
        method: "POST",
        body: { email },
      }),
      invalidatesTags: ["User"],
    }),

    sendOtp: builder.mutation({
      query: (email) => ({
        url: "send-otp",
        method: "POST",
        body: email,
      }),
    }),

    loginUser: builder.mutation({
      query: (formdata) => ({ url: "login", method: "POST", body: formdata }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedin({ user: result.data.existingUser }));
          localStorage.setItem("user", JSON.stringify(result.data.existingUser));
        } catch (err) {
          console.log("login error:", err);
        }
      },
      invalidatesTags: ["User"],
    }),

    logoutUser: builder.mutation({
      query: () => ({ url: "logout", method: "GET" }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(userLoggedout());
          dispatch(authApi.util.resetApiState());
        } catch (err) {
          console.log("logout error:", err);
        }
      },
      invalidatesTags: ["User", "Wishlist"],
    }),

    loadUser: builder.query({
      query: () => ({ url: "profile", method: "GET" }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result.data?.profile) {
            dispatch(userLoggedin({ user: result.data.profile }));
          } else {
            dispatch(userLoggedout());
          }
        } catch {
          dispatch(userLoggedout());
        }
      },
      providesTags: ["User"],
    }),

    updateUser: builder.mutation({
      query: (formdata) => ({ url: "profile/update", method: "PUT", body: formdata }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedin({ user: result.data.user }));
          localStorage.setItem("user", JSON.stringify(result.data.user));
        } catch (err) {
          console.log("update user error:", err);
        }
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllFilteredQuery,
  useToggleWishlistMutation,
  useGetWishlistQuery,
  useForgotUserpasswordMutation,
  useProfileQuery,
  useResetUserpasswordMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
  useLoginUserMutation,
  useLoadUserQuery,
  useSendOtpMutation,
  useUpdateUserMutation,
} = authApi;

export default authApi;
