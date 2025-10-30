import { Router } from "express";
import {
    getLikedVideos,
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikesByTweet,
    
    getLikesByVideo,
    getLikesByComment
} from "../controllers/like.controller.js"
import { verifyJWT } from "../middlewares/auth.js";
const router=Router();
router.use(verifyJWT);
router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);
router.get("/videos/:commentId",getLikesByComment);
router.get("/videos/:videoId",getLikesByVideo);
router.get("/tweet/:tweetId",getLikesByTweet)
export default router