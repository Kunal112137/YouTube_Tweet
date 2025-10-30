import mongoose ,{isValidObjectId}from "mongoose";
import { ApiErrors } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Like} from "../models/like.model.js";
import { User } from "../models/user.model.js";
import { SubScription } from "../models/subscription.js";
import { Video } from "../models/video.model.js";
import {Result} from "postcss";

// =====================
// 📊 Get Channel Stats
// =====================
const getChannelStats = asyncHandler(async (req, res) => {
  const  channelID  = req.user._id

  if (!channelID?.trim()) throw new ApiErrors(400, "Invalid channel ID");
const totalvideos=await Video.countDocuments({owner:channelID});
const viewAgg=await Video.aggregate([
  {$match:{owner:new mongoose.Types.ObjectId(channelID)}
},
{$group:{_id:null, totalViews:{$sum:"$views"}}},

]);
const totalViews=viewAgg.length>0?viewAgg[0].totalViews:0;
const totalSubscribers=await SubScription.countDocuments({channel:channelID});
const likesAgg=await Like.aggregate([
  {
   $lookup:{
    from:"video",
    localField:"video",
    foreignField:"_id",
    as:"videoData"

   } ,
  },
  {$unwind:"$videoData"},
  {$match:{"videoData.owner":new mongoose.Types.ObjectId(channelID)}}
]);
const totalLikes=likesAgg.length>0?likesAgg.length:0;
  // ✅ Check if channel exists
 
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalLikes,
        totalSubscribers,
        totalViews,
        totalvideos
      },
      "Channel stats fetched successfully"
    )
  );
});

// =====================
// 🎥 Get Channel Videos
// =====================
const getChannelVideos = asyncHandler(async (req, res) => {
  const userId  = req.user._id;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(userId)) throw new ApiErrors(400, "Invalid userId");
const options={
  page:parseInt(page,10),
  limit:parseInt(limit,10),
  sort:{creatAt:-1}
}
const result=await Video.aggregatePaginate([{
  $match:{owner:new mongoose.Types.ObjectId(userId)}
}],options);
if(!result.docs[0])throw new ApiErrors(404,"no videos Found")

  // ✅ Check if channel exists
 
  return res
    .status(200)
    .json(new ApiResponse(200, resultc, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };



// import mongoose from "mongoose";
// import { ApiErrors } from "../utils/apiErrors.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { asyncHandler } from "../utils/asyncHandler.js";

// import { User } from "../models/user.model.js";
// import { SubScription } from "../models/subscription.model.js";
// import { Video } from "../models/video.model.js"; // ✅ you missed this import

// // =====================
// // 📊 Get Channel Stats
// // =====================
// const getChannelStats = asyncHandler(async (req, res) => {
//   const { channelID } = req.params;
//   if (!channelID) throw new ApiErrors(400, "Invalid channel ID");

//   // Check if channel exists
//   const channel = await User.findById(channelID);
//   if (!channel) throw new ApiErrors(404, "Channel does not exist");

//   // Count subscribers (people who subscribed to this channel)
//   const subscriberCount = await SubScription.countDocuments({ channel: channelID });

//   // Count how many channels this user has subscribed to
//   const subscribedToCount = await SubScription.countDocuments({ subscriber: channelID });

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       {
//         channelId: channelID,
//         subscriberCount,
//         subscribedToCount,
//       },
//       "Channel stats fetched successfully"
//     )
//   );
// });

// // =====================
// // 🎥 Get Channel Videos
// // =====================
// const getChannelVideos = asyncHandler(async (req, res) => {
//   const { channelID } = req.params;
//   if (!channelID) throw new ApiErrors(400, "Invalid channel ID");

//   // Check if channel exists
//   const channel = await User.findById(channelID);
//   if (!channel) throw new ApiErrors(404, "Channel does not exist");

//   // Optional pagination
//   const { page = 1, limit = 10 } = req.query;
//   const skip = (page - 1) * limit;

//   // Fetch videos uploaded by the channel
//   const videos = await Video.find({ owner: channelID })
//     .skip(skip)
//     .limit(Number(limit))
//     .sort({ createdAt: -1 }); // latest first

//   if (!videos || videos.length === 0) {
//     return res.status(200).json(
//       new ApiResponse(200, [], "No videos found for this channel")
//     );
//   }

//   return res.status(200).json(
//     new ApiResponse(200, videos, "Channel videos fetched successfully",videos)
//   );
// });

// export {
//   getChannelStats,
//   getChannelVideos,
// };
