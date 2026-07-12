import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ✅ Use ENV variable for production
const BRANCH_API = import.meta.env.VITE_API_BASE_URL + "/v1/branch/owner";

const owner_branch = createApi({
  reducerPath: "owner_branch",

  baseQuery: fetchBaseQuery({
    baseUrl: BRANCH_API,
    credentials: "include",

    // ✅ Prevent browser/mobile cache
    prepareHeaders: (headers) => {
      headers.set("Cache-Control", "no-store");
      headers.set("Pragma", "no-cache");
      return headers;
    },
  }),

  tagTypes: ["Branch", "Room", "Property", "Location"],

  // ✅ Production defaults
  keepUnusedDataFor: 0,
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,

  endpoints: (builder) => ({

    /* ---------------- BRANCH ---------------- */
    addbranch: builder.mutation({
      query: (payload) => ({
        url: "add",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Branch"],
    }),

    getAllBranch: builder.query({
      query: () => "get",
      providesTags: ["Branch"],
    }),

    // deleteBranch: builder.mutation({
    //   query: (id) => ({
    //     url: "/DeleteBranch",
    //     method: "DELETE",
    //     body: { id },
    //   }),
    //   invalidatesTags: ["Branch"],
    // }),





    deleteBranch: builder.mutation({
  query: (branchId) => ({
    url: "DeleteBranch",
    method: "DELETE",
    body: { branchId },
  }),
  invalidatesTags: ["Branch"],
}),

    getAllBranchByOwner: builder.query({
      query: () => "getalllbranchowner",
      providesTags: ["Branch"],
    }),

    getAllBranchbybranchId: builder.query({
      query: () => "getbranch/bybranchMnager",
      providesTags: ["Branch"],
    }),

    /* ---------------- LOCATION ---------------- */
    getStates: builder.query({
      query: () => "states",
      providesTags: ["Location"],
    }),

    getCities: builder.mutation({
      query: (payload) => ({
        url: "cities",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Location"],
    }),

    getLocationNames: builder.mutation({
      query: (payload) => ({
        url: "locations",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Location"],
    }),

  }),
});

export const {
  useAddbranchMutation,
  useGetAllBranchQuery,
  useGetAllBranchByOwnerQuery,
  useGetAllBranchbybranchIdQuery,
  useDeleteBranchMutation,
  useGetStatesQuery,
  useGetCitiesMutation,
  useGetLocationNamesMutation,
} = owner_branch;

export default owner_branch;
