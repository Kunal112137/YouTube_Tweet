import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js";
import { ApiErrors } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose,{isValidObjectId} from "mongoose";
import{Video} from  "../models/video.model.js";
// CREATE PLAYLIST
const createPlaylist = asyncHandler(async (req, res) => {
  const userId  = req.user._id;
  const name=req.body?.name;
  const description=req.body?.description;
  const videosId=req.body?.videosId;
  const owner=req.user._id;
  if (!name)
    throw new ApiErrors(400, "playlist Name are required");
const newPlaylist=new Playlist({
  name,
  description,
  videos:videosId || [],
  owner
})
await newPlaylist.save();
if(!newPlaylist)throw new ApiErrors(500,"failed to create playlist");

  return res
    .status(201)
    .json(new ApiResponse(201, newPlaylist, "Playlist created successfully"));
});

// GET USER PLAYLISTS
const getUserPlaylists = asyncHandler(async (req, res) => {
  const userId  =  req.user._id || req.params?.userId;

  const playlists = await Playlist.find({ owner: userId })
  .populate("videos")
.sort({createdAt:-1})
.select("-__v -owner");

    return res
      .status(200)
      .json(new ApiResponse(200, [], "No playlists found for this user"));


});

// GET PLAYLIST BY ID
const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) throw new ApiErrors(400, "Invalid playlist ID");

  const playlist = await Playlist.findById(playlistId).populate("videos")
  .select("-__v _owner");
  if (!playlist) throw new ApiErrors(404, "Playlist does not found");

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Successfully fetched playlist"));
});

// ADD VIDEO TO PLAYLIST
const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const  playlistId = req.params?.playlistId;
  const  videoId = req.params?.videoId;
  const userId=req.user._id;
  if(!mongoose.Types.ObjectId.isValid(playlistId)||!mongoose.Types.ObjectId.isValid(videoId) )throw new ApiErrors(400,"invalid playlistId or VideoId");
  const isValidId=await Video.findById(videoId);
  if(!isValidId)throw new ApiErrors(404,"this is not valid video ID");
  


  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiErrors(404, "Playlist does not found");

const result=playlist.videos.filter((vidId)=>
vidId.toString()===videoId.toString());
console.log("this is result",result);
if(result.length !==0){
  return res
  .status(201)
  .json(new ApiResponse(201,"video already availble to playlist",playlist))
}
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video added to playlist successfully"));
});

// REMOVE VIDEO FROM PLAYLIST
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const userId=req.user._id;
  

  if (!mongoose.Types.ObjectId.isValid(playlistId)) throw new ApiErrors(400, "Invalid playlist ID");
  if (!mongoose.Types.ObjectId.isValid(videoId)) throw new ApiErrors(400, "Invalid video ID");

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiErrors(404, "Playlist does not exist");

  if (!playlist.videos.includes(videoId))
    throw new ApiErrors(400, "Video not found in playlist");
const validateOwner=playlist.validateOwner(userId);
if(!validateOwner)throw new ApiErrors(404,"you are not authorized to modify this playlist",playlist);
  playlist.videos=playlist.videos.filter((vId)=>
  vId.toString !== videoId);
  await playlist.save();
  
  

  return res.status(200).json(
    new ApiResponse(200, playlist, "Video removed from playlist successfully")
  );
});

// DELETE PLAYLIST
const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const userId=req.user._id;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) throw new ApiErrors(400, "Invalid playlist ID");

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiErrors(404, "Playlist does not exist");
const validateOwner=playlist.validateOwner(userId);
if(!validateOwner)throw new ApiErrors(403,"you are not Authrized to deleted this playlist")
const deletedPlaylist=await Playlist.findByIdAndUpdate(playlistId);

  return res
    .status(200)
    .json(new ApiResponse(200,deletedPlaylist, "Playlist deleted successfully"));
});

// UPDATE PLAYLIST (name / description / add video)
const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  const  userId=req.user._id;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) throw new ApiErrors(400, "Invalid playlist ID");

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiErrors(404, "Playlist does not found with this ID");
const validateOwner=playlist.validateOwner(userId);
if(!validateOwner)throw new ApiErrors(403, "You are not authorized to update this playlist");
playlist.name=name|| playlist.name;
playlist.description=description || playlist.description;


  await playlist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

export {
  createPlaylist,

  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
