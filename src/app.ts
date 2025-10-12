import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { fileSize } from "@constants/index";
import { logger } from "@utils/logger";
import errorMiddleware from "@middlewares/error.middleware";

const app: Application = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true, limit: fileSize }));
app.use(express.json({ limit: fileSize }));
app.use(cookieParser());

// health check
app.get("/", (req: Request, res: Response) => {
    logger.info("Root route accessed");
    res.status(200).json({ message: "API is running" });
});

// routes import

// routes define

// global error handler - one last middleware
app.use(errorMiddleware);

export default app;
