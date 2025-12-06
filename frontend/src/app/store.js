import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../services/baseApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});


// import { configureStore } from "@reduxjs/toolkit";
// import { videoApi } from "../services/video/videoApi";
// import { playlistApi } from "../services/playlist/playlistApi";
// import { commentApi } from "../services/comment/commentApi";
// import { likeApi } from "../services/like/likeApi";
// import { dashboardApi } from "../services/dashboard/dashboardApi";
// import { userApi } from "../services/user/userApi";
// import { subscriptionApi } from "../services/subscription/subscriptionApi";
// import { tweetApi } from "../services/tweet/tweetApi";
// const store=configureStore({
//     reducer:{
//         [userApi.reducerPath]:userApi.reducer,
//         [videoApi.reducerPath]:videoApi.reducer,
//         [playlistApi.reducerPath]:playlistApi.reducer,
//         [commentApi.reducerPath]:commentApi.reducer,
//         [likeApi.reducerPath]:likeApi.reducer,
//         [dashboardApi.reducerPath]:dashboardApi.reducer,
//         [subscriptionApi.reducerPath]:subscriptionApi.reducer,
//         [tweetApi.reducerPath]:tweetApi.reducer
//     },
//     middleware:(getDefaultMiddleware)=> getDefaultMiddleware().concat(
//         userApi.middleware,
//         videoApi.middleware,
//         playlistApi.middleware,
//         commentApi.middleware,
//         likeApi.middleware,
//         dashboardApi.middleware,
//         subscriptionApi.middleware,
//         tweetApi.middleware
//     ),


    
// });
// export default store;