import { Router } from "express";
import {
  createTweet,
  getTweets,
  getTweetById,
  updateTweet,
  deleteTweet,
  getUserTweets
} from "../controllers/tweet.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyToken, createTweet);
router.get("/", getTweets);
router.get("/:id", getTweetById);
router.put("/:tweetId", verifyToken, updateTweet);
router.delete("/:tweetId", verifyToken, deleteTweet);
router.get("/user/:userId", verifyToken, getUserTweets);

export default router;
