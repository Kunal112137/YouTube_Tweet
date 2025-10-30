import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./routes/users.js";
import videoRouter from "./routes/video.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import likeRouter from "./routes/like.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";

const app = express();
app.use(express.json());


// ✅ Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ✅ Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/healthcheck", healthcheckRouter);

// ✅ Global error handler (very important for consistent JSON responses)
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

export { app };

// import cookieParser from "cookie-parser";
// import express from "express";
// import cors from "cors"

// const app= express()
// app.use(cors({
//     origin:process.env.CORS_ORIGIN,
//     credentials:true
// }))
// app.use(express.json({limit:"16kb"}))
// app.use(express.urlencoded({extended:true}))
// app.use(express.static("public"))
// app.use(cookieParser())

// import userRouter from './routes/users.js'
// app.use("/users",userRouter)

// export {app}
   