import { config } from "@config/env.config";
import transporter from "@config/mail.config";
import { promises as fs } from "fs";
import { logger } from "@utils/logger";
import ApiError from "@utils/ApiError";

const tokenVerifyMail = async (name: string, email: string, token: string) => {
    try {
        const fullName = `${name}`;

        const FRONTEND_BASE_URL =
            config.FRONTEND_BASE_URL || "http://localhost:5173";
        const resetLink = `${FRONTEND_BASE_URL}/reset-password/${token}`;

        const htmlContent = await fs.readFile(
            "./src/mails/templates/tokenVerifyMail.html",
            "utf-8"
        );
        const finalHtml = htmlContent
            .replace("{{fullName}}", fullName)
            .replace("{{actionLink}}", resetLink);

        const mailOptions = {
            from: {
                name: "ByteCinema Movie Platform",
                address: config.SMTP_USER,
            },
            to: { name: fullName, address: email },
            subject: "🔐 Password Reset Code - ByteCinema Movie Platform",
            html: finalHtml,
            text: finalHtml,
        };

        const info = await transporter.sendMail(mailOptions);
        logger.info(`mail sent successfully to ${email}: ${info.response}`);
    } catch (err: any) {
        logger.error(`error sending verification mail: ${err.message}`);
        throw new ApiError(500, "failed to send verification email");
    }
};

export default tokenVerifyMail;
