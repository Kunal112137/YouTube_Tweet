import mongoose,{isValidObjectId} from "mongoose";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiErrors } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Tweet } from "../models/tweets.model.js";
import {list} from "postcss";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) throw new ApiErrors(400, " video ID is required");
const userId=req.user._id;
if(!userId)throw new ApiErrors(400,"unauthorized")
  if(!mongoose.Types.ObjectId(videoId))throw new ApiErrors(400,"invalid videoId")
const isValidId=await Video.findById(videoId);
if(!isValidId)throw new ApiErrors(404,"no videos foundf to this ID")
  const existingLike = await Like.findOne({ video: videoId, likedBy: userId });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id)
    return res.status(200).json(new ApiResponse(200, null, "Video unliked successfully"));
  }else{

  await Like.create({ video: videoId, likedBy: userId });
  return res.status(200).json(new ApiResponse(200, null, "Video liked successfully"));}
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const {  commentId } = req.params;
const userId=req.user._id;
  if (!userId) throw new ApiErrors(400, "Invalid user ID");
  if (!commentId) throw new ApiErrors(400, "Invalid comment ID");

if(!mongoose.Types.ObjectId.isValid(commentId))throw new ApiErrors(404,"invalid commentId");
  const existingLike = await Like.findOne({ likedBy: userId, comment: commentId });

  if (existingLike) {
    await existingLike.deleteOne();
    return res.status(200).json(new ApiResponse(200, null, "Comment unliked successfully"));
  }else{

  await Like.create({ likedBy: userId, comment: commentId });
  return res.status(200).json(new ApiResponse(200, null, "Comment liked successfully"));}
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const {  tweetId } = req.params;
const userId=req.user._id;
  if (!userId) throw new ApiErrors(400, "Invalid user ID");
  if (!tweetId) throw new ApiErrors(400, "Invalid tweet ID");
if(!mongoose.Types.ObjectId.isValid(tweetId))throw new ApiErrors(400,"invalid tweet id ")
const isValidId=await Tweet.findById(tweetId);
if(!isValidId)throw new ApiErrors(404,"no tweet found to this ID")
  const existingLike = await Like.findOne({ likedBy: userId, tweet: tweetId });
console.log("this is existing user ", existingLike);
  if (existingLike) {
    await existingLike.deleteOne();
    return res.status(200).json(new ApiResponse(200, null, "Tweet unliked successfully"));
  }
else{
  await Like.create({ likedBy: userId, tweet: tweetId });
  return res.status(200).json(new ApiResponse(200, null, "Tweet liked successfully")); }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const userId=req.user._id;
  if (!userId) throw new ApiErrors(400, "Invalid user ID");
const options={
  page:parseInt(page,10),
  limit:parseInt(limit,10),
  sort:{createdAt:-1}
}
const result=await Like.aggregate([
  {
    $match:{likedBy:new mongoose.Types.ObjectId(userId)},
    $lookup:{
      from:"videos",
      localField:"video",
      foreignField:"_id",
      as:"video"

    }
  },{
    $project:{
      _id:0,
      "video._id":1,
      "video.title":1,
      "video.thumbnail":1,
      "video.duration":1,
      "video.view":1,
      creatAt:1,

    }
  }
],options)
if(result.length==0){
  return res
  .status(200)
  .json(new ApiResponse(200, null, "no video is liked by you"));
}
  return res.status(200).json(
    new ApiResponse(
      200,
      result,
       "Successfully fetched liked videos"
       
    )
  );
});
const getLikesByVideo=asyncHandler(async(req,res)=>{
  const {videoId}=req.params;
  if (!videoId) throw new ApiErrors(400, " video ID required");
if(!mongoose.Types.ObjectId.isValid(videoId))throw new ApiErrors(400,"invalid videoId");
const likes=await Like.find({
  video:videoId
});
console.log("this is video",likes)
if(!likes)throw new ApiErrors(404,"no likes found for this video");
res.status(200).json(new ApiResponse(200,"likes feched successfully",{likes,totallikes:likes.length}))
})
const getLikesByComment=asyncHandler(async(req,res)=>{
const {commentId}=req.params;
if(!commentId)throw new ApiErrors(400,"Comment is required");
const likes=await Like.find({
  comment:commentId
})
if (!likes) {
  throw new ApiErrors(404, "No likes found for this comment"); }
  res.status(200).json(
    new ApiResponse(200, "Likes fetched successfully", {
      likes,
      totalLikes: likes.length,
    })
  );
});

const getLikesByTweet=asyncHandler(async(req,res)=>{
  const {tweetId}=req.params;
  if(!tweetId)throw new ApiErrors(400,"tweet id is required");
  const likes=await Like.find({tweet:tweetId});
  if(!likes)throw new ApiErrors(404,"no likes found for this tweet ");
  res.status(200).json(new ApiResponse(200,"Likes fetched successfully",{
    likes,
    totallikes:likes.length
  }))
})
export {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
  getLikesByTweet,
  getLikesByVideo,
  getLikesByComment
  
};


// import mongoose from "mongoose";
// import {Like} from "../models/like.model"
// import { ApiErrors } from "../utils/apiErrors";
// import {ApiResponse} from "../utils/ApiResponse"
// import {asyncHandler} from "../utils/asyncHandler"
// import {Video} from "../models/video.model";
// import {Tweet} from "../models/tweets.model";
// import { Comment } from "../models/comment.model";
// const toggleVideoLike=asyncHandler(async(req,res)=>{
//     const {videoId,userId}=req.params;
//     if(!videoId)throw new ApiErrors(400,"invalid video ID");
//     const video=await Video.findById(videoId);
   
//     if(!userId)throw new ApiErrors(400,"invalid user ID");
//     if(!video) throw new ApiErrors(404,"video does not exist")
//      const existinglike=await Like.findOne({
//     video:videoId,
//   likedBy:userId
// })
// if(existinglike){
//   await existinglike.deleteOne();
//   return res.status(200)
//             .json({
//               message:"you unliked video successfully",
//               sucess:true
//             })
// }
// else{
//   await Like.create({
//     video:videoId,
//     likedBy:userId
//   })
//   return res.status(200)
//             .json({
//               message:"video liked sucessfully"
//             })
// }
// });
// const toggleCommentLike=asyncHandler(async(req,res)=>{
//   const {videoId,userId,commentId}=req.params;
//   if(!videoId)throw new ApiErrors(400,"invalid video ID");
//   if(!userId)throw new ApiErrors(400,"invalid user ID");
//   if(!commentId) throw new ApiErrors(400,"invalid comment ID");
//   const comment=await Comment.findById(commentId);
//   if(!comment) throw new ApiErrors(4044,"comment does not exist");
//   const likedcommentCheck=await Like.findOne({likedBy:userId,
//     comment:commentId
//   })
//   if(likedcommentCheck){
//     await likedcommentCheck.deleteOne();
//     return res.status(200).json({
//       message:"liked comment deleted",
//       success:true
//     })
//   }
//   else{
//     await Like.create({
//       likedBy:userId,
//       comment:commentId
//     })
// return res.status(200).json({
//   message:"comment liked successfully",
//   success:true
// })
//   }
// })
// const toggleTweetLike=asyncHandler(async(req,res)=>{
//   const {userId,tweetId}=req.params;
//   if(!userId)throw new ApiErrors(400,"invalid user ID");
//   if(!tweetId)throw new ApiErrors(400,"invalid tweet ID");
//   const Tweetcheck=await Tweet.findById(tweetId);
//   if(!Tweetcheck) throw new ApiErrors(404,"tweet does not exist");
//   const tweetlike=await Like.findOne({likedBy:userId,
//     tweet:tweetId
//   })
//   if(tweetlike){
//     await tweetlike.deleteOne();
//     return res.status(200).json({
//       message:"sucessfully unliked the  tweet",
//       success:true
//     })
//   }
//   else{
//     await Like.create({
//       likedBy:userId,
//       tweet:tweetId

//     })
//     return res.status(200).json({
//       message:"sucessfully liked tweet",
//       success:true
//     })
    
//   }

// })
// const getLikedVideos=asyncHandler(async(req,res)=>{
//     const {userId}=req.params;

//     if(!userId)throw new ApiErrors(400,"invalid user id");
//     const LikedVideos=await Like.find({likedBy:userId,video:{$exists:true}})
//     .sort({createdAt:-1});
//    if(LikedVideos.length==0)throw new ApiErrors(200,"user haven't liked any video");
//    return res.status(200).json(
//     new ApiResponse(
//       200,
//       {
//         count: LikedVideos.length,
//         LikedVideos,
//       },
//       "Successfully fetched liked videos"
//     )
//   );
// });
// export {
//     toggleCommentLike,toggleVideoLike,toggleTweetLike,getLikedVideos
// }