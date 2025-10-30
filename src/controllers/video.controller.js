import mongoose,{isValidObjectId} from "mongoose";
import { ApiErrors } from "../utils/apiErrors.js";
import { Video } from "../models/video.model.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { uploadCloudinary,DeleteFile } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import {populate} from "dotenv";
const getAllvideos = asyncHandler(async (req, res) => {
   const { page = 1, limit = 10,  } = req.query;


 const pipeline = [
   { $match: { ispublished: true } },
   { $sort: { createdAt: -1 } }
 ];
 
 const aggregate = Video.aggregate(pipeline);
 
 const result = await Video.aggregatePaginate(aggregate, {
   page: parseInt(page, 10),
   limit: parseInt(limit, 10),
   populate: { path: "owner", select: "username email avatar" }
 });
 
 return res
   .status(200)
   .json(new ApiResponse(200, result, "Fetched user videos successfully"));
 
 
   return res.status(200).json(
     new ApiResponse(200,result, "Fetched user videos successfully")
   );
 });
const publishAVideo = asyncHandler(async (req, res) => {
  const title=req.body?.title;
  const description=req.body?.description;
  const duration=parseFloat(req.body?.duration);
  const videoFile=req.files?.videoFile?.[0]?.path;
  const thumbnail=req.files?.thumbnail?.[0]?.path;
   // 1️⃣ Validate input
   // 3️⃣ Send success response
   console.log("this area all fields",
      title,
      description,
      duration,
      videoFile,
      thumbnail
   );
   if(!videoFile || !thumbnail || !title || !description ||  isNaN(duration))throw new ApiErrors(400,"ALL fields are required ");
   const userId=req.user._id;
   const videoCloudinaryData=await uploadCloudinary(videoFile);
   const thumbnailCloudinaryData=await uploadCloudinary(thumbnail);
   const videoFilePublicId=videoCloudinaryData.public_id;
   const thumbnailPublicId=thumbnailCloudinaryData.public_id;
   const videolink=videoCloudinaryData.url;
   const thumbnaillink=thumbnailCloudinaryData.url;
   console.log("req.body", req.body);
   console.log("req.files", req.files);
   
   const newVideo=new Video({ videoFile:videolink,
      thumbnail:
      thumbnaillink,title,
      description,
      duration,
      owner:userId,
      videoFilePublicId,
      thumbnailPublicId
   })
   await newVideo.save();
   if(!newVideo)throw new ApiErrors(500,"failed to create video");
   return res.status(201).json(new ApiResponse(
     201,
     "Video published successfully",
     newVideo
   ));
 });
 export const incrementViews=asyncHandler(async(req,res,next)=>{
   const videoId=req.params.videoId; console.log("videoId",videoId);
   if(!mongoose.Types.ObjectId.isValid(videoId))throw new ApiErrors(400,"InvaliD videoID ");
   const video=await Video.findById(videoId);
   if(!video){
      throw new ApiErrors(404,"video not found");
   }
   await video.incrementViews();
   next();
 })
const getvideobyId=asyncHandler(async(req,res)=>{
   const videoId=req.params.videoId;
if(!mongoose.Types.ObjectId.isValid(videoId)) throw new ApiErrors("video with this id does not exist");
const video=await Video.findById(videoId).populate("owner",
   "username email avatar"
);
if(!video) throw new ApiErrors("video not found");
video.views += 1;
await video.save();
res.status(200)
  .json({
   message:"video fethced sucessfully",
   success:true,
   video
  })
})
const updatevideo = asyncHandler(async (req, res) => {
   const videoId = req.params?.videoId;
   const { title, description, ispublished, duration } = req.body;
   const videoFile = req.files?.videoFile?.[0]?.path;
   const thumbnail = req.files?.thumbnail?.[0]?.path;
 
   if (!mongoose.Types.ObjectId.isValid(videoId))
     throw new ApiErrors(400, "Invalid video Id");
 
   const video = await Video.findById(videoId);
   if (!video) throw new ApiErrors(404, "Video not found");
   if (!video.validateUser(req.user._id))
     throw new ApiErrors(403, "You are not authorized to update this video");
 
   if (title) video.title = title;
   if (description) video.description = description;
   if (!isNaN(parseFloat(duration))) video.duration = parseFloat(duration);
 
   // ✅ Video file update
   if (videoFile) {
     const videoCloudinaryData = await uploadCloudinary(videoFile);
     if (!videoCloudinaryData)
       throw new ApiErrors(500, "Error uploading video to Cloudinary");
 
     const deletedFile = await DeleteFile(video.videoFilePublicId);
     if (!deletedFile)
       throw new ApiErrors(500, "Error deleting old video from Cloudinary");
 
     video.videoFilePublicId = videoCloudinaryData.public_id;
     video.videoFile = videoCloudinaryData.url;
   }
 
   // ✅ Thumbnail update
   if (thumbnail) {
     const thumbnailCloudinaryData = await uploadCloudinary(thumbnail);
     if (!thumbnailCloudinaryData)
       throw new ApiErrors(500, "Error uploading thumbnail to Cloudinary");
 
     const deletedFile = await DeleteFile(video.thumbnailPublicId);
     if (!deletedFile)
       throw new ApiErrors(500, "Error deleting old thumbnail from Cloudinary");
 
     video.thumbnailPublicId = thumbnailCloudinaryData.public_id;
     video.thumbnail = thumbnailCloudinaryData.url;
   }
 
   // ✅ Publish status update
   if (ispublished !== undefined) {
     video.ispublished = ispublished === "true" || ispublished === true;
   }
 
   await video.save();
 
   return res
     .status(200)
     .json(new ApiResponse(200, "Video updated successfully", video));
 });
 
   
const deletevideo=asyncHandler(async(req,res)=>{
   const videoId=req.params?.videoId;
   if(!mongoose.Types.ObjectId.isValid(videoId))throw new ApiErrors(400,"invalid video Id") ;  
     const video=await Video.findById(videoId);
     if(!video) throw new ApiErrors(404,"vidoe not found") ;
     if(!video.validateUser(req.user._id))throw new ApiErrors(403,"you are not authorized to delete video");
     const deletedVideoFile=await DeleteFile(video.videoFilePublicId);
     const deletedThumbnailFile=await DeleteFile(video.thumbnailPublicId);
     if(!deletedThumbnailFile || !deletedVideoFile)throw new ApiErrors(503,"failed to delete video");
     const deletedVideo=await Video.findByIdAndDelete(videoId);

    
     res.status(200)
     .json(new ApiResponse(
   200,
      "video delete successfully",
      deletedVideo

     ));

   });
const togglePublicStatus=asyncHandler(async(req,res)=>{
   const videoId=req.params?.videoId;
   if(!mongoose.Types.ObjectId.isValid(videoId))throw new ApiErrors(400,"invalid video Id") ;  

const video=await Video.findById(videoId);
console.log("user",req.user._id);
if(!video.validateUser(req.user._id))throw new ApiErrors(403,"you have not authrorized to update this video");
   video.isPublic=!video.isPublic;
   
await video.save();
res.status(200)
.json(new ApiResponse(
   200,
  "video public status toggled",
   video
));
})
export const getRandomVideos=asyncHandler(async(req,res)=>{
   const {limit=10 }=req.query;
   const videos=await Video.aggregate([
      {
      $match:{ispublished:true}
   },
   {$sample:{size:parseInt(limit,10)}},{
      $lookup:{
         from:"users",
         localField:"owner",
         foreignField:"_id",
         as:"owner"
      }
   }
]);
return res.status(200).json(new ApiResponse(200,"Random Videos fetched successfully",videos)
   
)
});

export const getSubscribedVideos=asyncHandler(async(req,res)=>{
   const userId=req.user._id;
   const {page=1,limit=10}=req.query;
   const option={
      page:parseInt(page,10),
      limit:parseInt(limit,10),
      sort:{createdAt:-1},
      populate:{path:"owner",
      select:"username emial avatar"}
   };
   const result=aggregate([
      {
         $match:{subscriber:userId}
      },
      {
         $lookup:{
            from:"videos",
            localField:"channel",
            foreignField:"owner",
            as:"videos",
            pipeline:[
               {
                  $match:{ispublished:true}
               },
               {$sort:{ createdAt:-1}}
            ]
         }
      }
   ],option);
   return res.status(200).json(new ApiResponse(2000,"subscribed videos fetched successfully",result));
})
export const getTrendingVideos=asyncHandler(async(req,res)=>{
   const {page=10, limit=10}=req.query;
   const option={
      page:parseInt(page,10),
      limit:parseInt(limit,10),
      sort:{views:-1},
      populate:{ path:"owner", 
         select:"username emial avatar"
      },
   };
   const result=await Video.aggregatePaginate([
      {
         $match:{ispublished:true,
            isPublic:true
         }
      }
   ],option);
   return res.status(200).json(new ApiResponse(
      200,
      "Treding videos fetched successFully",
      result
   ));

})
export const searchVideos=asyncHandler(async(req,res)=>{
   const {page=1,limit=10,query}=req.query;
   if(!query)throw new ApiErrors(400,"Search query is required");
   const option={
      page:parseInt(page,10),
      limit:parseInt(limit,10),
      sort:{ createdAt:-1},
      populate:{path:"owner", select:"username email avatar"}

   }
   const result=await Video.aggregatePaginate([
      {
         $match:{$text:{
            $search:query
         }, ispublished:true}
      }
   ],option);
   if(!result.docs[0])throw new ApiErrors(404,"No matches Found");
   return res.status(200).json(new ApiResponse(
      200, "Videos Fteeched Successfully", result
   ))
});
export const getVideosByuser=asyncHandler(async(req,res)=>{
   const userId=req.params.userId;
   if(!mongoose.Types.ObjectId.isValid(userId))throw new ApiErrors(400,"Invalid user ID");
   const {page=1,limit=10}=req.query;
   const option={
      page:parseInt(page,10),
      limit:parseInt(limit,10),
      sort:{createdAt:-1}
   };
   const result= await Video.aggregatePaginate([
         {
            $match:{owner:new mongoose.Types.ObjectId(userId) }
         }
   ],option);
   if(!result.docs[0])throw new ApiErrors(404,"No video found");
   return res.status(200).json(new ApiResponse(200, "videos Fetched Successfully",result));
})
   export{
      getAllvideos,
      
      publishAVideo,
      getvideobyId,
      updatevideo,
      deletevideo,
      togglePublicStatus
   }
