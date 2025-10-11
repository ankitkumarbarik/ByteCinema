import dotenv from "dotenv";
import connectDB from "@db/index";
import app from "./app";
import { logger } from "@utils/logger";

dotenv.config({ path: "./.env" });

const PORT = Number(process.env.PORT) || 5000;

(async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        });
        server.on("error", (err: Error) => {
            logger.error(`Server Error: ${err.message}`);
            process.exit(1);
        });
    } catch (err: any) {
        logger.error(`MongoDB connection failed ${err.message}`);
        process.exit(1);
    }
})();
