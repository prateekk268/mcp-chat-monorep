import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const conectDB = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Database is already connected");
    return mongoose;
  }

  if (connectionState === 2) {
    console.log("Database is reconnecting");
    return mongoose;
  }

  try {
    const options = {
      autoCreate: false,
      autoIndex: false,
      bufferCommands: true,
      socketTimeoutMS: 100000,
    };

    console.log("Mongo URI:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI!, options);
    console.log("Database is connected..");
  } catch (error) {
    console.error("Connection Failed, error:", error);
  }
};

const gracefulShutdown = async (signal: string) => {
  try {
    console.log(`Received ${signal}, closing MongoDb connection ...`);
    await mongoose.connection.close();
    console.log("Database connection closed successfully");
  } catch (error) {
    console.error("Error happen during shutdown", error);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
