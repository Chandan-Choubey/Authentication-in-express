import mongoose from "mongoose";

const connectDb = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("MONGODB_URI is not defined in the environment variables.");
    process.exit(1);
  }

  try {
    const connection = await mongoose.connect(uri);
    console.log("MongoDB connection successful:", connection.connection.host);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDb;
