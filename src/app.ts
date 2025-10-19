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
app.use(express.static("public"));
app.use(cookieParser());

// health check
app.get("/", (req: Request, res: Response) => {
    logger.info("Root route accessed");
    res.status(200).json({ message: "API is running" });
});

// routes import
import userRouter from "@routes/user.route";
import movieRouter from "@routes/movie.route";
import reviewRouter from "@routes/review.route";
import theaterRouter from "@routes/theater.route";
import showtimeRouter from "@routes/showtime.route";

// routes define
app.use("/api/v1/users", userRouter);
app.use("/api/v1/movies", movieRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/theaters", theaterRouter);
app.use("/api/v1/showtimes", showtimeRouter);

// global error handler - one last middleware
app.use(errorMiddleware);

export default app;
