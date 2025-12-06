// will only authorize does user exist or not 
//  next  ka kaam hai ki maine  kaam kardiya ab jaha lena jana haiwaha  le jao (next)
import  { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { ApiErrors } from "../utils/apiErrors.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token = req.cookies?.accessToken || (authHeader ? authHeader.replace(/^Bearer\s+/i, "") : null);

    if (!token) {
      throw new ApiErrors(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if (!user) {
      throw new ApiErrors(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiErrors(401, error?.message || "Invalid access token");
  }
});

