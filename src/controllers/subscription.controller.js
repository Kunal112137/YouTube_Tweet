
import mongoose,{isValidObjectId} from "mongoose";
import { SubScription } from "../models/subscription.js";
import { ApiErrors } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

/* ==============================================
   🔁 TOGGLE SUBSCRIPTION (Subscribe / Unsubscribe)
============================================== */
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId, userId } = req.params;
  const subscriberId=req.user._id;


  if (!mongoose.Types.ObjectId.isValid(channelId)) throw new ApiErrors(400, "Invalid channel ID");
  if (!userId) throw new ApiErrors(400, "Invalid user ID");
const existingSubscription=await SubScription.findOne({
  subscriber:subscriberId,
  channel:channelId

})
if(existingSubscription){ const unsubscribed=await SubScription.findByIdAndDelete(existingSubscription._id);
  if(!unsubscribed)throw new ApiErrors(501,"failed to delete the object");
  // throw new ApiError(501,"failed to unsubscribe the channel");

return res.status(200).json(new ApiResponse(200,unsubscribed,"unsubscribed successfully"))
}
  const subscription=new SubScription({
    subscriber:subscriberId,
    channel:channelId
  });


  await SubScription.create({
    subscriber: userId,
    channel: channelId,
  });
  await subscription.save();
  new ApiResponse(201,"subscribed successfully",{
    subscription,
    length:subscription.length
  })

});

/* ==============================================
   👥 GET CHANNEL SUBSCRIBER COUNT
============================================== */
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(subscriberId)) throw new ApiErrors(400, "invalid channel ID ");
const subscribers=await SubScription.find({channel:subscriberId}).populate("subscriber",":username email avatar")
  const channel = await User.findById(channelId);
  if (!channel) throw new ApiErrors(404, "Channel does not exist");
  return res.status(200).json(
    new ApiResponse(
      200,
     subscribers,
      "Subscriber count fetched successfully"
    )
  );
});

/* ==============================================
   📺 GET ALL CHANNELS A USER IS SUBSCRIBED TO
============================================== */
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const  subscriberId  = req.user._id;
  const subscriptions=await SubScription.find({subscriber:subscriberId})
  .populate("channel", "username email avatar")
 res.status(200).json(
    new ApiResponse(
      200,
      subscriptions,
      "Subscribed channels fetched successfully"
    )
  );
});

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
};
