import pino, { Logger, LoggerOptions } from "pino";

// Factory to create a logger with optional context
export const createLogger = (context?: string): Logger => {
    const options: LoggerOptions = {
        level: process.env.NODE_ENV === "production" ? "info" : "debug",
        transport:
            process.env.NODE_ENV === "production"
                ? undefined
                : {
                    target: "pino-pretty",
                    options: {
                        colorize: true,
                        translateTime: "yyyy-mm-dd HH:MM:ss",
                        ignore: "pid,hostname",
                    },
                },
    };

    const baseLogger = pino(options);

    if (!context) return baseLogger;

    // Wrap methods to include context automatically
    const loggerWithContext = {
        info: (msg: string, meta?: object) =>
            baseLogger.info({ context, ...meta }, msg),
        warn: (msg: string, meta?: object) =>
            baseLogger.warn({ context, ...meta }, msg),
        error: (msg: string, meta?: object) =>
            baseLogger.error({ context, ...meta }, msg),
        debug: (msg: string, meta?: object) =>
            baseLogger.debug({ context, ...meta }, msg),
    };

    return loggerWithContext as Logger;
};

// Default logger without context
export const logger = createLogger();

// Helper to get context-specific logger
export const logWithContext = (context: string) => createLogger(context);
