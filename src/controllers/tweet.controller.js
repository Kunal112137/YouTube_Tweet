import mongoose ,{isValidObjectId }from "mongoose";
import { Tweet } from "../models/tweets.model.js";
import { ApiErrors } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* =====================================
   🐦 CREATE TWEET
===================================== */
const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiErrors(400, "Tweet content is required");
  }
  if (content.length > 280) {
    throw new ApiErrors(400, "Content exceeds maximum length of 280 characters");
  }

  const userID = req.user._id;

  const tweet = new Tweet({
    content,
    owner: userID,
  });

  await tweet.save();

  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

/* =====================================
   👤 GET USER TWEETS
===================================== */
const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiErrors(400, "Invalid user ID");
  }

  const tweets = await Tweet.find({ owner: userId })
    .populate("owner", "username email avatar")
    .sort({ createdAt: -1 });

  if (!tweets.length) {
    throw new ApiErrors(404, "No tweets found for this user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
});

/* =====================================
   ✏️ UPDATE TWEET
===================================== */
const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;
  const { content } = req.body;

  // Validate tweet ID
  if (!isValidObjectId(tweetId)) {
    throw new ApiErrors(400, "Invalid tweet ID");
  }

  // Validate content
  if (!content?.trim()) {
    throw new ApiErrors(400, "Tweet content is required");
  }

  if (content.length > 280) {
    throw new ApiErrors(400, "Content exceeds maximum length of 280 characters");
  }

  // Find tweet
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new ApiErrors(404, "Tweet not found");

  // Validate ownership
  if (!tweet.validateUser(userId)) {
    throw new ApiErrors(403, "You are not authorized to update this tweet");
  }

  // Avoid duplicate update
  if (tweet.content === content) {
    throw new ApiErrors(409, "This content is already present");
  }

  // Update and save
  tweet.content = content;
  await tweet.save();

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});



/* =====================================
   🗑️ DELETE TWEET
===================================== */
const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(tweetId)) {
    throw new ApiErrors(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new ApiErrors(404, "Tweet not found");

  if (!tweet.validateUser(userId)) {
    throw new ApiErrors(403, "You are not authorized to delete this tweet");
  }

  await Tweet.findByIdAndDelete(tweetId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

/* =====================================
   🌍 GET ALL TWEETS (PAGINATED)
===================================== */
const getTweets = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    populate: { path: "owner", select: "username avatar" },
  };

  const tweets = await Tweet.aggregatePaginate([{ $match: {} }], options);

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

/* =====================================
   🔎 GET TWEET BY ID
===================================== */
const getTweetsById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiErrors(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findById(id).populate("owner", "username avatar");
  if (!tweet) throw new ApiErrors(404, "Tweet not found");

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet fetched successfully"));
});

export {
  createTweet,
  updateTweet,
  getUserTweets,
  deleteTweet,
  getTweets,
  getTweetsById,
};
