import User, { IUser } from "@models/user.model";
import { ROLES } from "@config/role";
import ApiError from "@utils/ApiError";
import { config } from "@config/env.config";
import { logger } from "@utils/logger";

const seedAdmin = async (): Promise<void> => {
    try {
        const existedAdmin = await User.findOne({ role: ROLES.ADMIN }).exec();

        if (!existedAdmin) {
            if (!config.ADMIN_EMAIL || !config.ADMIN_PASSWORD) {
                throw new ApiError(
                    500,
                    "admin email or password not defined in environment"
                );
            }

            const admin: Partial<IUser> = {
                name: "Admin",
                email: config.ADMIN_EMAIL,
                password: config.ADMIN_PASSWORD,
                role: ROLES.ADMIN,
                isVerified: true,
                authProvider: "local",
            };

            const user = new User(admin);
            await user.save();

            logger.info("default admin created successfully");
        } else {
            logger.info("admin already exists");
        }
    } catch (err: any) {
        logger.error("error while creating default admin:", err);
    }
};

export default seedAdmin;
