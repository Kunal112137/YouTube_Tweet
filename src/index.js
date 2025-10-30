import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: '../.env'
});
console.log("Cloudinary API Key:", process.env.CLOUDINARY_API_KEY);
console.log("MongoDB URL:", process.env.MONGODB_URL);

console.log("Cloudinary API Key:", process.env.CLOUDINARY_API_KEY);

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    // bind to IPv4 0.0.0.0
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on http://127.0.0.1:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Failed:", err.message);
    process.exit(1);
  });



// import dotenv from "dotenv";
// import connectDB from "./db/index.js";
// import { app } from "./app.js"; // import the configured app

// dotenv.config({
//   path: './.env'
// })
// console.log("Cloudinary API Key:", process.env.CLOUDINARY_API_KEY);

// // Start server after DB connection
// connectDB()
//   .then(() => {
//     app.listen(process.env.PORT || 8000, () => {
//       console.log(`✅ Server running on port ${process.env.PORT || 8000}`)
//     });
//   })
//   .catch((err) => {
//     console.error("❌ DB Connection Failed:", err.message);
//     process.exit(1);
//   });


// code ki consistency ko kharab karta hai . with this our run can but prfessional we do not this kind of things 
// require('dotenv').config({})

// import mongoose from "mongoose"
// import {DB_NAME} from "constants"
// import express from "express"
// server.js (or index.js)

// import express from "express";
// import dotenv from "dotenv";
// import connectDB from "./db/index.js";
// import userRoutes from "./routes/users.js"; // ✅ renamed correctly

// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static("public/temp")); // serve uploaded files

// // Routes
// app.use("/api/v1/users", userRoutes); // ✅ consistent name

// // Test route
// app.get("/", (req, res) => res.send("🚀 Server is running!"));

// // Start server after DB connection
// connectDB()
//   .then(() => {
//     app.listen(process.env.PORT || 8000, () => {
//       console.log(`✅ Server running on port ${process.env.PORT || 8000}`);
//     });
//   })
//   .catch((err) => console.error("❌ DB Connection Failed:", err));


/* FIRST APPROACH WHICH IS BASIC APPRAOCH
const app=express()
(async()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on('errror',(error)=>{
            console.log("ERRR",error);
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    }
    catch(error){
        console.log("ERRROR", error);
        throw error;
    }
})( )

*/