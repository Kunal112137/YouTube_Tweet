import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import {verifyJWT} from "../middlewares/auth.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import {
    getAllvideos,
    deletevideo,
     
      publishAVideo,
      getvideobyId,
      updatevideo,
      togglePublicStatus
      ,incrementViews,
      searchVideos,
      getVideosByuser,
      getRandomVideos,
      getSubscribedVideos,
      getTrendingVideos
} from "../controllers/video.controller.js"
const router=Router();
router.use(verifyJWT);
router
.route("/")
.get(getAllvideos)
.post(upload.fields([
    { name:"videoFile", maxCount:1, },
    { name: "thumbnail", maxCount: 1 }
]),
publishAVideo);
router.route("/search").get(searchVideos);



router.route("/toggle/publish/:videoId").patch(togglePublicStatus);
router.route("/random").get(getRandomVideos);
router.route("/trending").get(getTrendingVideos);
router.route("/subscriptions").get(getSubscribedVideos);
router.route("/user/:userId").get(getVideosByuser)
router.route("/:videoId").get(getvideobyId)
.delete(deletevideo).patch(upload.fields([{name:"videoFile"},{name:"thumbnail"}]),updatevideo);

// 🔵 Get, update, or delete a specific video

  export default router
