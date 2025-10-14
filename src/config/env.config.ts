import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

export const config = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || "development",
    MONGO_URI: process.env.MONGO_URI || "",
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "1d",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "10d",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || "",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "",
    SMTP_SERVICE: process.env.SMTP_SERVICE || "",
    SMTP_HOST: process.env.SMTP_HOST || "",
    SMTP_SECURE: process.env.SMTP_SECURE || "",
    SMTP_PORT: process.env.SMTP_PORT || "",
    SMTP_USER: process.env.SMTP_USER || "",
    SMTP_PASS: process.env.SMTP_PASS || "",
};
