import mongoose,{isValidObjectId} from "mongoose";
import { ApiErrors } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import {populate} from "dotenv";


// ✅ GET ALL COMMENTS OF A VIDEO
const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 100 } = req.query;

if(!mongoose.Types.ObjectId.isValid(videoId))throw new ApiErrors(400,"invalid videoID");
const options={
  page:parseInt(page,10),
  limit:parseInt(limit,10),
  sort:{createAt:-1},
  populate:{path:"owner",
    select:"username avatar"
  },
};
const result = await Comment.aggregate([
  { $match:{video:new mongoose.Types.ObjectId(videoId)}},
  { $addFields:{
    areYouOwner:{
      $eq:["$owner",new mongoose.Types.ObjectId(req.user._id)],
    }
  }}
],options);

  
res.status(200).json(
    new ApiResponse(
      200,
      
      "Fetched all comments successfully",
      result
    )
  );
});


// ✅ ADD COMMENT
const addComment = asyncHandler(async (req, res) => {
  const content=req.body?.content;
  const videoId=req.params?.videoId;
  if(!content || !videoId){
    throw new ApiErrors(401,"content and videoID is required");
  }
  const UserId=req.user._id;
  if(!UserId)throw new ApiErrors(401,"unauthorized");

  if (!mongoose.Types.ObjectId(videoId)) throw new ApiErrors(400, "Invalid video ID");

  const comment = await Comment.create({
    owner: req.user._id,
    content, // ✅ field name: 'content' (check your schema)
    video: videoId,
    owner:UserId
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});


// ✅ UPDATE COMMENT
const updateComment = asyncHandler(async (req, res) => {
  const { videoId, commentId } = req.params;
  const { content } = req.body;

  if (!mongoose.Types.ObjectId(videoId)) throw new ApiErrors(400, "Invalid video ID");
  if (!mongoose.Types.ObjectId(commentId)) throw new ApiErrors(400, "Invalid comment ID");
  if (!content?.trim()) throw new ApiErrors(400, "New comment text is required");
const userId=req.user._id;
if (!mongoose.Types.ObjectId(userId)) throw new ApiErrors(400, "Invalid userID");


  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiErrors(404, "Comment not found");
const validUser=comment.validateUser(userId);
if(!validUser)throw new ApiErrors(403,"You are not allowed to updated this  comment")
  // ✅ Optional ownership check

  comment.content = content;
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});


// ✅ DELETE COMMENT
const deleteComment = asyncHandler(async (req, res) => {
  const { videoId, commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(videoId)) throw new ApiErrors(400, "Invalid video ID");
  if (!mongoose.Types.ObjectId.isValid(commentId)) throw new ApiErrors(400, "Invalid comment ID");
const userId=req.user._id;
if(!userId)throw new ApiErrors(401,"unauthorized or token has been expired");

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiErrors(404, "Comment does not exist");

  // ✅ Optional ownership check
const validUser=comment.validateUser(userId);
if(!validUser)throw new ApiErrors(403,"you are not allowed to deleted this comment");
const deleteComment=await Comment.findByIdAndDelete(commentId);
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});


export {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
};
