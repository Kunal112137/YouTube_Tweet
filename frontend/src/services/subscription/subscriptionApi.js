import {createApi} from "@reduxjs/toolkit/query/react";
import {baseApi} from "../baseApi";
export const subscriptionApi=baseApi.injectEndpoints({
    reducerPath:'subscriptionApi',
    baseQuery:baseApi,
    endpoints:(builder)=>({
        getUserChannelSubscribers:builder.query({
            query:(channelId)=>`/subscriptions/c/${channelId}`,
               
        }),
        toggleSubscription:builder.mutation({
            query:(channelId)=>({
                url:`/subscription/c/${channelId}`,
                method:'POST'
            })
        }),
        getSubscribedChannels:builder.query({
            query:(subscriberId)=>`/subscription/u/${subscriberId}`
        })
    })
})
export const {
    useGetUserChannelSubscribersQuery,
    useToggleSubscriptionMutation,
    useGetSubscribedChannelsQuery
} = subscriptionApi;