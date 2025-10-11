import pino from "pino";

export const logger = pino({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "yyyy-mm-dd HH:MM:ss",
        },
    },
});
