import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


// ✅ Use ENV for production
const USER_API = import.meta.env.VITE_API_BASE_URL + "/v1/admin";

export const certificateApi = createApi({
    reducerPath: "certificateApi",

    baseQuery: fetchBaseQuery({
        baseUrl: USER_API,
        credentials: "include",

        // ✅ Prevent browser + CDN caching
        prepareHeaders: (headers) => {
            headers.set("Cache-Control", "no-store");
            headers.set("Pragma", "no-cache");
            return headers;
        },
    }),

    tagTypes: ["User"],

    // ✅ Production cache behavior
    keepUnusedDataFor: 0, // ⛔ No stale cache
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,

    endpoints: (builder) => ({

        verifyCertificate: builder.query({
            query: (id) => ({
                url: `/certificate/verify?id=${id}`,
                method: "GET"
            })
        })


    }),
});

export const {
    useVerifyCertificateQuery,
} = certificateApi;

export default certificateApi;
