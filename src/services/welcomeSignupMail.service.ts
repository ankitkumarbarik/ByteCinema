import { config } from "@config/env.config";
import transporter from "@config/mail.config";
import ApiError from "@utils/ApiError";
import { logger } from "@utils/logger";
import { promises as fs } from "fs";

const welcomeSignupMail = async (
    name: string,
    email: string
): Promise<void> => {
    try {
        const fullName = `${name}`;

        const htmlContent = await fs.readFile(
            "./src/mails/templates/welcomeSignupMail.html",
            "utf-8"
        );
        const finalHtml = htmlContent
            .replace("{{fullName}}", fullName)
            .replace("{{dashboardLink}}", "http://localhost:5000/");

        const mailOptions = {
            from: {
                name: "ByteCinema Movie Platform",
                address: config.SMTP_USER,
            },
            to: { name: fullName, address: email },
            subject: `Welcome ${fullName}`,
            html: finalHtml,
            text: finalHtml,
            attachments: [
                {
                    filename: "default.png",
                    path: "./public/images/default.png",
                },
                {
                    filename: "default.png",
                    path: "./public/images/default.png",
                    cid: "img1-contentid",
                },
            ],
        };

        const info = await transporter.sendMail(mailOptions);
        logger.info(`mail sent successfully to ${email}: ${info.response}`);
    } catch (err: any) {
        logger.error(`error sending verification mail: ${err.message}`);
        throw new ApiError(500, "failed to send verification email");
    }
};

export default welcomeSignupMail;
