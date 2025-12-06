import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    mongoose.connection.on("error", (err) => {
      console.log("error in db connection", err);
    });

    console.log("✅ DB Connected Successfully:", connection.connection.host);
  } catch (error) {
    console.log("❌ DB Connection Error:", error.message);
    process.exit(1);
  }
};
export default connectDB;
