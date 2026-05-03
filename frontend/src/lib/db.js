import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    const URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/syllabusiq";
    await mongoose.connect(URI);

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB Error ❌", error);
  }
};
