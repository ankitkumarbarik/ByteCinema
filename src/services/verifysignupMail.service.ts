import { config } from "@config/env.config";
import transporter from "@config/mail.config";
import { promises as fs } from "fs";
import { logger } from "@utils/logger";
import ApiError from "@utils/ApiError";

const verifySignupMail = async (
    name: string,
    email: string,
    otpSignup: string
): Promise<void> => {
    try {
        const fullName = `${name}`;

        const htmlContent = await fs.readFile(
            "./src/mails/templates/verifySignupMail.html",
            "utf-8"
        );
        const finalHtml = htmlContent
            .replace("{{fullName}}", name)
            .replace("{{otpSignup}}", otpSignup);

        const mailOptions = {
            from: {
                name: "ByteCinema Movie Platform",
                address: config.SMTP_USER,
            },
            to: { name: fullName, address: email },
            subject: "🔐 Verify Your Email - ByteCinema Movie Platform",
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

export default verifySignupMail;
