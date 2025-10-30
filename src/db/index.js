import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGODB_URL) {
    console.error("❌ MONGODB_URL is not defined in environment variables");
    process.exit(1);
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection FAILED:", error.message);
    process.exit(1);
  }
};

export default connectDB;


// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     const connection = await mongoose.connect(process.env.MONGODB_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
//   } catch (error) {
//     console.error("❌ MongoDB connection FAILED:", error.message);
//     process.exit(1);
//   }
// };

// export default connectDB;
