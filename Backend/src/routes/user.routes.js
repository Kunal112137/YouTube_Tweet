import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUserDetails,
  updateCurrentUserDetails,
  updateCurrentUserAvatar,
  updateCurrentUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(upload.fields([{ name: "avatar", maxCount: 1 },{ name: "coverImage", maxCount: 1 },]),registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyToken, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyToken, changeCurrentPassword);
router.route('/current-userdetails').get(verifyToken, getCurrentUserDetails);
// router.route('/current-user').put(verifyToken, updateCurrentUserDetails);
router.route('/current-user/avatar').put(verifyToken, upload.single("avatar"), updateCurrentUserAvatar);
router.route('/current-user/cover-image').put(verifyToken, upload.single("coverImage"), updateCurrentUserCoverImage);
router.route('/channel/:username').get(getUserChannelProfile);
router.route('/watch-history').get(verifyToken, getWatchHistory);
router.route('/current-user')
  .get(verifyToken, getCurrentUserDetails)     // <-- add this GET route
  .put(verifyToken, updateCurrentUserDetails); // existing PUT route

export default router;