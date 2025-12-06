import mongoose,{Schema} from "mongoose";
const subscriptionScehma=mongoose.Schema({
    subscriber:{
        type:Schema.Types.ObjectId,
        // onw who is subscribing 
        ref:"User"

    }, channel:{
        type:Schema.Types.ObjectId,
        // one who subscribed channels
        ref:"User"
    }

},{timestamps:true})
export const SubScription=mongoose.model("Subscription ",subscriptionScehma)