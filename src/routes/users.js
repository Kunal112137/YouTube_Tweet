import { Router } from "express";
// import { AccountDetail, ChangePassword, getCurrentUser, getUserProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, UpdateAvatar, UpdatecoverImage } from "../controllers/user.controller.js"; // ← must match actual file name
import { upload } from "../middlewares/multer.js";
import {verifyJWT} from "../middlewares/auth.js";

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  ChangePassword,
  getCurrentUser,
  AccountDetail,
  UpdateAvatar,
  UpdatecoverImage,
  getUserProfile,
  getWatchHistory,
} from "../controllers/user.controller.js"

const router = Router();

// 📝 POST /api/v1/users/register
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  registerUser
)
router.route("/login").post(loginUser)
// secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").patch(verifyJWT, ChangePassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,AccountDetail)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),UpdateAvatar)
router.route("/cover-image").patch(verifyJWT,upload.single("cover-image"),UpdatecoverImage)
router.route("/c/:username").get(verifyJWT,getUserProfile)
router.route("/history").get(verifyJWT,getWatchHistory)
export default router;



// import { Router } from "express";
// import { registerUser } from "../controllers/users.controller.js";
// import { upload } from "../middlewares/multer.js";

// const router = Router();

// // 📝 POST /api/v1/users/register
// router.route("/register").post(
//   upload.fields([
//       {
//           name: "avatar",
//           maxCount: 1
//       }, 
//       {
//           name: "coverImage",
//           maxCount: 1
//       }
//   ]),
//   registerUser
//   )

// export default router;
