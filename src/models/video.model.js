import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // Cloudinary URL
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    ispublished:{
      type:Boolean,
      default:true
    },
   

    isPublic: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videoFilePublicId: String,
    thumbnailPublicId:String,
  },
  {
    timestamps: true,
  }
);
videoSchema.index({title:"text",
  description:"text"
})
videoSchema.methods.incrementViews-function(){
  this.views+=1;
  return this.save();
};
videoSchema.methods.validateUser=function(userId){
  return this.owner.toString()===userId.toString();
}

// ✅ Add aggregate pagination plugin
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);


// import mongoose, {Schema} from "mongoose";
// import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
// const videoSchema=mongoose.Schema({
//     videoFile:{
//         type:String,     //cloudnary url
//         required:true,

//     },
//     thumbnail:{
//         type:String,
//         required:true
//     },
//     title:{
//         type:String,
//         required:true

//     },
//     description:{
//         type:String,
//         required:true

//     }
//     , duration:{
//         type:Number,
//         required:true
//     },
//     views:{
//         String:Number,
//         default:0
       
//     },
//     isPublished:{
//         type:Boolean,
//         default:true
//     },
//     owner:{
//         type:Schema.Types.ObjectId,
//         ref:"User"
//     }

// },
//     {
//         timestamps:true
//     }
// )
// videoSchema.plugin(mongooseAggregatePaginate)
// export const video=mongoose.model("Video",videoSchema)