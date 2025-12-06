import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import conf from "../conf/conf.js";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl:import.meta.env.VITE_BACKEND_URL,
     credentials: "include",

    prepareHeaders: (headers, { endpoint }) => {
      const token = localStorage.getItem("token");

      // Endpoints that DO NOT require auth
      const noAuthEndpoints = [
        "registerUser",
        "loginUser",
        "refreshAccessToken",
        "getAllVideos",
      ];

      // Add Authorization if needed
      if (!noAuthEndpoints.includes(endpoint) && token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  endpoints: () => ({}), // MUST be here so injectEndpoints can work
});
