import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const user_PgApi = createApi({
  reducerPath: "user_PgApi",

  /* =======================
     🌍 BASE QUERY
  ======================= */
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL + "/v1/property/user",
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Cache-Control", "no-store");
      headers.set("Pragma", "no-cache");
      return headers;
    },
  }),

  /* =======================
     🏷️ TAGS
  ======================= */
  tagTypes: ["Pg"],

  /* =======================
     🔁 AUTO REFRESH (MOBILE SAFE)
  ======================= */
  refetchOnFocus: true,
  refetchOnReconnect: true,

  endpoints: (builder) => ({
    /* =======================
       🏠 GET ALL PGs
    ======================= */
    getAllListedPg: builder.query({
      query: (params = {}) => ({
        url: "/allpg",
        method: "GET",
        params, // 👈 send everything dynamically
      }),
      providesTags: ["Pg"],
      keepUnusedDataFor: 60,
    }),
    getAllhotelsroom: builder.query({
      query: () => ({
        url: "/allhotelrooms",
        method: "GET"
      })
    }),

    getRecomendedPg: builder.query({
      query: ({lng,lat}) => ({
        url: `/getRecomendedPg?lat=${lat}&lng=${lng}`,
        method: "GET",
      }),
      providesTags: ["Pg"],
      keepUnusedDataFor: 60,
    }),

    /* =======================
       🌆 SERVICE CITIES
    ======================= */
    getservicesarea: builder.query({
      query: () => ({
        url: "/services-cities",
        method: "GET",
      }),
      providesTags: ["Pg"],
      keepUnusedDataFor: 300, // 5 minutes
    }),

    /* =======================
       🗺️ MAP DATA
    ======================= */
    getMapPg: builder.query({
      query: () => ({
        url: "/getmapofpg",
        method: "GET",
        params: { _v: "map-v1" }, // controlled cache bust
      }),
      providesTags: ["Pg"],
      keepUnusedDataFor: 60,
    }),

    /* =======================
       🏢 PG BY ID
    ======================= */
    getPgById: builder.query({
      query: (id) => ({
        url: `get/${id}`,
        method: "GET",
      }),
      providesTags: ["Pg"],
      keepUnusedDataFor: 300,
    }),
  }),
});

/* =======================
   🎯 EXPORT HOOKS
======================= */
export const {
  useGetAllListedPgQuery,
  useGetAllhotelsroomQuery,
  useGetservicesareaQuery,
  useGetMapPgQuery,
  useGetPgByIdQuery,
  useGetRecomendedPgQuery,
} = user_PgApi;

export default user_PgApi;
