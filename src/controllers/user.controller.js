import { asyncHandler } from "../utils/asyncHandler.js";

import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import * as fs from "fs";

import fs from "fs/promises";
import mongoose from "mongoose";
import { ApiErrors } from "../utils/apiErrors.js";


// ===============================
// Generate Access & Refresh Tokens
// ===============================
const generateAccessAndRefreshTokens = async (userID) => {
  try {
    const user = await User.findById(userID);
    if (!user) throw new ApiErrors(404, "User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiErrors(500, "Something went wrong while generating tokens");
  }
};

// ===============================
// Register User
// ===============================
const registerUser = asyncHandler(async (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.files:", req.files);

  const { fullName, username, password, email } = req.body;

  if ([fullName, username, password, email].some((field) => !field?.trim())) {
    throw new ApiErrors(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiErrors(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImgLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiErrors(400, "Avatar file is required");
  }

  let avatar = await uploadCloudinary(avatarLocalPath);
  let coverImage = coverImgLocalPath ? await uploadCloudinary(coverImgLocalPath) : null;

  try {
    if (!avatar?.url) throw new ApiErrors(500, "Cloudinary upload failed for avatar");
    if (coverImage && !coverImage?.url) console.warn("Cloudinary upload failed for cover image");
  } finally {
    try { await fs.unlink(avatarLocalPath); } catch (e) { console.warn("Failed to delete avatar temp file:", e.message); }
    if (coverImgLocalPath) {
      try { await fs.unlink(coverImgLocalPath); } catch (e) { console.warn("Failed to delete cover image temp file:", e.message); }
    }
  }

  const newUser = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password, // plain — Mongoose pre-save hook will hash it
    username: username.toLowerCase(),
  });
  

  // ✅ This must be inside the function
  const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiErrors(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

// ===============================
// Login User
// ===============================
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  console.log(email);

  if (!username && !email) {
    throw new ApiErrors(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiErrors(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiErrors(400,"passward is not valid")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully")
    );
});

// ===============================
// Logout User
// ===============================
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// ===============================
// Refresh Access Token
// ===============================
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiErrors(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);

    if (!user) throw new ApiErrors(401, "Invalid refresh token");
    if (incomingRefreshToken !== user?.refreshToken)
      throw new ApiErrors(401, "Refresh token is expired or used");

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed")
      );
  } catch (error) {
    throw new ApiErrors(401, error?.message || "Invalid refresh token");
  }
});

// ===============================
// Change Password
// ===============================
const ChangePassword = asyncHandler(async (req, res) => {
  const { newPassword, oldPassword } = req.body;
  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiErrors(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  console.log("Password updated for user:", user.username);
    

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// ===============================
// Get Current User
// ===============================
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

// ===============================
// Update Account Details
// ===============================
const AccountDetail = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName && !email) {
    throw new ApiErrors(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { fullName, email } },
    { new: true }
  ).select("-password");
  console.log("Account details updated successfully ");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

// ===============================
// Update Avatar
// ===============================
const UpdateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalpath = req.file?.path;
  if (!avatarLocalpath) {
    throw new ApiErrors(400, "Avatar file is missing");
  }

  const avatar = await uploadCloudinary(avatarLocalpath);
  if (!avatar.url) {
    throw new ApiErrors(400, "Error while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { avatar: avatar.url } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

// ===============================
// Update Cover Image
// ===============================
const UpdatecoverImage = asyncHandler(async (req, res) => {
  const coverImgLocalpath = req.file?.path;
  if (!coverImgLocalpath) {
    throw new ApiErrors(400, "Cover image file is missing");
  }

  const coverImage = await uploadCloudinary(coverImgLocalpath);
  if (!coverImage.url) {
    throw new ApiErrors(400, "Error while uploading cover image");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { coverImage: coverImage.url } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

// ===============================
// Get User Profile
// ===============================
const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username?.trim()) {
    throw new ApiErrors(400, "Username is missing");
  }

  const channel = await User.aggregate([
    { $match: { username: username.toLowerCase() } },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribercount: { $size: "$subscribers" },
        channelsSubscribedTocount: { $size: "$subscribedTo" },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribercount: 1,
        channelsSubscribedTocount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiErrors(404, "Channel does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "User profile fetched successfully"));
});

// ===============================
// Get Watch History
// ===============================
const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                { $project: { fullName: 1, username: 1, avatar: 1 } },
              ],
            },
          },
          {
            $addFields: {
              owner: { $first: "$owner" },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, user[0].watchHistory, "Watch history fetched successfully"));
});

// ===============================
// Export
// ===============================
export {
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
};

// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiErrors } from "../utils/apiErrors.js";
// import { User } from "../models/user.model.js";
// import { uploadCloudinary } from "../utils/cloudinary.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import bcrypt from "bcrypt";
// import fs from "fs";

// const registerUser = asyncHandler(async (req, res) => {

//   // 🔹 Debugging: log incoming data
//   console.log("req.body:", req.body);
//   console.log("req.files:", req.files);

//   const { fullName, username, password, email } = req.body;

//   // 1️⃣ Validate fields
//   if ([fullName, username, password, email].some((field) => !field?.trim())) {
//     throw new ApiErrors(400, "All fields are required");
//   }

//   // ... rest of your code


//   // 2️⃣ Check if user already exists
//   const existedUser = await User.findOne({
//     $or: [{ username }, { email }],
//   });
//   if (existedUser) {
//     throw new ApiErrors(409, "User with email or username already exists");
//   }

//   // 3️⃣ Handle file uploads
//   const avatarLocalPath = req.files?.avatar?.[0]?.path;
//   const coverImgLocalPath = req.files?.coverImage?.[0]?.path;

//   if (!avatarLocalPath) {
//     throw new ApiErrors(400, "Avatar file is required");
//   }

//   // Upload to Cloudinary
//   const avatar = await uploadCloudinary(avatarLocalPath);
//   const coverImage = coverImgLocalPath
//     ? await uploadCloudinary(coverImgLocalPath)
//     : null;

//   // Delete local files after upload
//   fs.unlink(avatarLocalPath, (err) => err && console.error(err));
//   if (coverImgLocalPath) {
//     fs.unlink(coverImgLocalPath, (err) => err && console.error(err));
//   }

//   // 4️⃣ Hash password before saving
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // 5️⃣ Create user in DB
//   const user = await User.create({
//     fullName,
//     avatar: avatar.url,
//     coverImage: coverImage?.url || "",
//     email,
//     password: hashedPassword,
//     username: username.toLowerCase(),
//   });

//   // 6️⃣ Get created user (without sensitive fields)
//   const createdUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );

//   if (!createdUser) {
//     throw new ApiErrors(500, "Something went wrong while registering the user");
//   }

//   // 7️⃣ Send JSON response
//   return res
//     .status(201)
//     .json(
//       new ApiResponse(201, createdUser, "User registered successfully")
//     );
// });

// export { registerUser };


// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiErrors } from "../utils/apiErrors.js";
// import { User } from "../models/user.model.js";
// import { uploadCloudinary } from "../utils/cloudinary.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import mongoose from "mongoose";
// const registerUser = asyncHandler(async (req, res) => {
//   const { fullName, username, password, email } = req.body;

//   // 1️⃣ Validate fields
//   if ([fullName, username, password, email].some((field) => !field?.trim())) {
//     throw new ApiErrors(400, "All fields are required");
//   }

//   // 2️⃣ Check if user already exists
//   const existedUser = await User.findOne({
//     $or: [{ username }, { email }],
//   });
//   if (existedUser) {
//     throw new ApiErrors(409, "User with email or username already exists");
//   }

//   // 3️⃣ Handle file uploads (multer)
//   const avatarLocalPath = req.files?.avatar?.[0]?.path;
//   const coverImgLocalPath = req.files?.coverImage?.[0]?.path;

//   if (!avatarLocalPath) {
//     throw new ApiErrors(400, "Avatar file is required");
//   }

//   // Upload to cloudinary
//   const avatar = await uploadCloudinary(avatarLocalPath);
//   const coverImage = coverImgLocalPath
//     ? await uploadCloudinary(coverImgLocalPath)
//     : null;

//   // 4️⃣ Create user in DB
//   const user = await User.create({
//     fullName,
//     avatar: avatar.url,
//     coverImage: coverImage?.url || "",
//     email,
//     password, // ⚠️ TODO: hash before saving (e.g., bcrypt)
//     username: username.toLowerCase(),
//   });

//   // 5️⃣ Get created user (without sensitive fields)
//   const createdUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );

//   if (!createdUser) {
//     throw new ApiErrors(500, "Something went wrong while registering the user");
//   }

//   // 6️⃣ Send response
//   return res
//     .status(201)
//     .json(
//       new ApiResponse(201, createdUser, "User registered successfully")
//     );
// });

// export { registerUser };



// import {asyncHandler} from "../utils/asyncHandler.js";
// import { ApiErrors } from "../utils/apiErrors.js";
// import {User} from "../models/user.model.js";
// import { uploadCloudinary } from "../utils/cloudinary.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// const registerUser=asyncHandler(async(req,res)=>{
//     // get user details from frontend
//     //   validation -not empty
//     // check if user already exists:username, email
//     // check for images,check avatar
//     // upload them to cloudinary , avatar
//     // create user obeject -create entry in db
//     // remove password and refresh token field from response
//     // check for user creation 
//     // return res
//     const { fullName,username,password,email}=req.body

//   if(
//     [fullName,username,password,email].some((field)=>
//         field?.trim()==""
//     // in the above part of code field in taken as vaible which checks from fullname to email if any element found to be null"" after the trime means it fails condition will stop

//     )){
//        throw new  ApiErrors(400,"All fields are required ")
//     }
//     //  this is validation point which i mentioned above notes
//     const existedUser= await User.findOne({
//         $or: [{username},{email}]
//     })
//     if(existedUser){
// throw new ApiErrors(409, "User with email or username already exists")        
//     }
//     console.log(req.files)
//     // multer provide us many options in handling files
//     // here below  ? stands for: "is req.files present?".
//    const AvatarLocalPath= req.files?.avatar[0]?.path;
//    const CoverImgLocalPath=req.files?.coverImage[0].path;
//    if(!AvatarLocalPath){
//     throw new ApiErrors(400,"Avatar file is required")
//    }
//    const avatar =await uploadCloudinary(AvatarLocalPath);
//  const CoverImg=await uploadCloudinary(CoverImgLocalPath)
//  const user= await User.create({
//     fullName,
//     avatar:avatar.url,
//     coverImage: CoverImg?.url || "",
//     email,
//     password,
//     username:username.toLowerCase()
//   })
//  const creatuser= await User.findById(user._id).select("- password - refreshToken")
//  if(!creatuser){
//   throw new ApiErrors(500,"something went wrong while registering the user")
  
//  }
//  return res.status(201).json( 
//  new ApiResponse(200,creatuser,"User registered sucessfully")
//  )


//  } )
   

// export {registerUser}