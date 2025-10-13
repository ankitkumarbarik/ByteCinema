import { config } from "@config/env.config";
import mongoose from "mongoose";
import { logger } from "@utils/logger";
import { DB_NAME } from "../constants";

const connectDB = async (): Promise<void> => {
    if (!config.MONGO_URI) {
        logger.error("MONGO_URI not defined in .env!");
        process.exit(1);
    }

    try {
        const connectionInstance = await mongoose.connect(
            `${config.MONGO_URI}/${DB_NAME}`
        );
        logger.info(
            `MongoDB connected at host: ${connectionInstance?.connection?.host}`
        );
    } catch (err: any) {
        logger.error("MongoDB connection failed:", err);
        process.exit(1);
    }
};

export default connectDB;
