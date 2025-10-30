import { Router } from "express";
import {
    getSubscribedChannel,
    getUserChannelSubscribers,
    toogleSubscription
} from "../models/subscription.controller.js"
import { verifyJWT } from "../middlewares/auth.js";

const router=Router();
router.use(verifyJWT);
router
.route("/c/:channelId")
.get(getSubscribedChannel)
.post(toogleSubscription);
router.route("/u/:subscribedId").get(getUserChannelSubscribers);
export default router