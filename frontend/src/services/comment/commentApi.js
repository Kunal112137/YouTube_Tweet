import { createApi } from "@reduxjs/toolkit/query/react";
/*createApi is the main function you use to declare a group of related API endpoints (queries and mutations). RTK Query then generates reducers, middleware, and React hooks for those endpoints.*/

import {baseApi } from "../baseApi";
export const commentApi=createApi({
    reducerPath:'commentApi',
    baseQuery:baseApi,
    endpoints:(builder)=>({
        getVideoComments:builder.query({
            query:(videoId)=>`/Comment/${videoId}`,

        }),
        addComment:builder.mutation({
            query:({videoId,body})=>({
                url:`/comments/${videoId}`,
                method:'POST',
                body
            })
        }),
        deleteComment:builder.mutation({
            query:(commentId)=>({
                url:`/comments/c/${commentId}`,
                method:"DELETE"
            })
        }),
        updateComment:builder.mutation({
            query:({ commentId,body})=>({
                url:`/comments/c/${commentId}`,
                method:'PATCH',
            })
        })
    })
})
export const {  usegetVideoCommentsQuery,useaddCommentMutation,usedeleteCommentMutation,useupdateCommentMutation}=commentApi;

/*createApi({...}): defines a new API “slice” — a place to declare endpoints for comments in this example.

reducerPath: 'commentApi': the key under which RTK Query will store this API’s reducer in the Redux store. Usually something unique per API.

baseQuery: baseApi: the function RTK Query uses to actually make HTTP requests. This handles the low-level request (URL + method + headers). baseApi is your project-specific baseQuery.

endpoints: (builder) => ({ ... }): a function that returns an object where each key defines an endpoint (query or mutation). builder is a helper used to declare query() and mutation() endpoints
builder is a helper used to declare query() and mutation() endpoints. */