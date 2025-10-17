import cloudinary from "@config/cloudinary.config";
import { logger } from "@utils/logger";
import streamifier from "streamifier";

interface UploadResult {
    public_id: string;
    secure_url: string;
    [key: string]: any;
}

export const uploadOnCloudinary = async (
    fileBuffer: Buffer
): Promise<UploadResult | null> => {
    if (!fileBuffer) return null;

    try {
        return await new Promise<UploadResult>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: "auto", folder: "avatars" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as UploadResult);
                }
            );
            streamifier.createReadStream(fileBuffer).pipe(stream);
        });
    } catch (error: any) {
        logger.error("Cloudinary upload error:", error.message || error);
        return null;
    }
};

export const deleteFromCloudinary = async (publicId: string) => {
    if (!publicId) return null;

    try {
        const response = await cloudinary.uploader.destroy(publicId);

        if (response.result !== "ok") {
            logger.warn("Cloudinary deletion failed:", response);
            return null;
        }

        logger.info(`Deleted from Cloudinary. PUBLIC ID: ${publicId}`);

        return response;
    } catch (err: any) {
        logger.error("Cloudinary deletion error:", err.message || err);
        return null;
    }
};
