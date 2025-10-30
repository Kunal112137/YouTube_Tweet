import { Router } from "express";
import {
  createTweet,
  updateTweet,
  getUserTweets,
  deleteTweet,
  getTweets,
  getTweetsById,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.js";

const router = Router();

// ✅ Protect all routes using JWT middleware
router.use(verifyJWT);

// ✅ CREATE a new tweet
router.post("/", createTweet);

// ✅ GET all tweets (with pagination)
router.get("/", getTweets);

// ✅ GET tweets by userId
router.get("/user/:userId", getUserTweets);

// ✅ GET tweet by tweetId
router.get("/:tweetId", getTweetsById);

// ✅ UPDATE tweet
router.patch("/:tweetId", updateTweet);

// ✅ DELETE tweet
router.delete("/:tweetId", deleteTweet);

export default router;
