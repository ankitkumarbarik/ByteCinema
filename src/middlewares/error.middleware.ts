import { config } from "@config/env.config";
import { Request, Response, NextFunction } from "express";
import ApiError from "@utils/ApiError";
import { logger } from "@utils/logger";

const errorMiddleware = (
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle specific known error types
    switch (err.name) {
        case "CastError":
            message = `Invalid value for ${(err as any).path}: ${
                (err as any).value
            }`;
            statusCode = 400;
            break;

        case "ValidationError":
            message = Object.values((err as any).errors)
                .map((val: any) => val.message)
                .join(", ");
            statusCode = 400;
            break;

        case "MongoServerError":
            if ((err as any).code === 11000) {
                const field = Object.keys((err as any).keyValue).join(", ");
                message = `Duplicate field value: ${field}`;
                statusCode = 400;
            }
            break;

        case "JsonWebTokenError":
            message = "Invalid token. Please log in again.";
            statusCode = 401;
            break;

        case "TokenExpiredError":
            message = "Your token has expired. Please log in again.";
            statusCode = 401;
            break;
    }

    // Log error for debugging (only in dev)
    if (config.NODE_ENV !== "production") {
        logger.error(`[ERROR] ${err.stack || message}`);
    }

    // Send clean response
    res.status(statusCode).json({
        success: false,
        error: {
            message,
            type: err.name || "Error",
            ...(config.NODE_ENV !== "production" && { stack: err.stack }),
        },
    });
};

export default errorMiddleware;
