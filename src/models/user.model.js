import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// ✅ Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Method to compare password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// ✅ Generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName:this.userName,
      fullName:this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn:process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// ✅ Generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn:process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);


// import mongoose,{Schema} from "mongoose";
// import jwt from "jsonwebtoken";

// const { JsonWebTokenError } = jwt;  // now works

// import bcrypt from "bcrypt"
// const userSchema=new Schema(
//      {
//             userName:{
//                 type:String,
//                 required:true,
//                 trim:true,
//                 lowercase:true,
//                 unique:true,
//                 index:true
//                 // we use index here for seraching it provides optimal searching 
//             },
//             email:{
//                 type:String,
//                 required:true,
//                 trim:true,
//                 lowercase:true,
//                 unique:true
//             }, 
//             fullName:{
//                 type:String,
//                 required:true,
//                 trim:true,
//                 index:true
//             },
//             avatar:{
//                 type:String,
//                 required:true,
               
//             },
//             coverImage:{
//                 type:String,
                
//             },
//             watchHistory:[{
//                 type:Schema.Types.ObjectId,
//                 ref: "Video"  // ✅ must be a string matching the model name

//             }
//             ],
//             password:{
//                 type:String,
//                 required:[true,'password is required']
//             },
//             refreshToken:{
//                 type:String
//             }
    
    
//         },{ timestamps:true}
// )
// userSchema.pre("save",async function(next) {
//     if (!this.ismodified("password")) return next();

//     this.password= await bcrypt.hash(this.password,10)
//     next()
    
// })
// userSchema.methods.isPasswordCorrect=async function (password){
//     return await bcrypt.compare(password,this.password)
// }
// userSchema.methods.generateAccessToken=function(){
//     return JsonWebTokenError.sign(
//         {
//         _id:this._id,
//         email:this.email,
//         userName:this.userName,
//         fullName:this.fullName
//         },
    
//     process.env.ACCESS_TOKEN_SECRET,
//     {
//         expiresIn:process.env.ACCESS_TOKEN_EXPIRY
//     }
// )

// }
// userSchema.methods.generateRefreshToken=function(){
//     return JsonWebTokenError.sign(
//         {
//         _id:this._id
//         },
      
    
//     process.env.REFRESH_TOKEN_SECRET,
//     {
//         expiresIn:process.env.REFRESH_TOKEN_EXPIRY
//     }
// )
// }

// export const User=mongoose.model("User",userSchema)
