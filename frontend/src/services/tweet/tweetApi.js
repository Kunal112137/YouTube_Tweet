import  {createApi} from "@reduxjs/toolkit/query/react"
import { baseApi } from "../baseApi";

export const tweetApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    createTweet: builder.mutation({
      query: (body) => ({
        url: "/tweets",
        method: "POST",
        body,
      }),
    }),

    getUserTweet: builder.query({
      query: (userId) => `/tweet/user/${userId}`,
    }),

    updateTweet: builder.mutation({
      query: ({ tweetId, body }) => ({
        url: `/tweets/${tweetId}`,
        method: "PATCH",
        body,
      }),
    }),

    deleteTweet: builder.mutation({
      query: (tweetId) => ({
        url: `/tweets/${tweetId}`,
        method: "DELETE",
      }),
    }),

  }),
});

export const {
  useCreateTweetMutation,
  useGetUserTweetQuery,   // now generated correctly
  useUpdateTweetMutation,
  useDeleteTweetMutation,
} = tweetApi;