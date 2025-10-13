import { config } from "@config/env.config";
import dotenv from "dotenv";
import connectDB from "@db/index";
import app from "./app";
import { logger } from "@utils/logger";
import seedAdmin from "@seed/seedAdmin";

dotenv.config({ path: "./.env" });

const PORT = Number(config.PORT) || 5000;

(async () => {
    try {
        await connectDB();
        await seedAdmin();

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
