import { createTransport } from "nodemailer";
import { config } from "@config/env.config";
import ApiError from "@utils/ApiError";

if (
    !config.SMTP_SERVICE ||
    !config.SMTP_HOST ||
    !config.SMTP_SECURE ||
    !config.SMTP_PORT ||
    !config.SMTP_USER ||
    !config.SMTP_PASS
)
    throw new ApiError(500, "SMTP environment variables are missing");

const transporter = createTransport({
    service: config.SMTP_SERVICE,
    host: config.SMTP_HOST,
    secure: config.SMTP_SECURE === "true",
    port: Number(config.SMTP_PORT),
    auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
    },
});

export default transporter;
