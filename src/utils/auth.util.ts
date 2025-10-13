import { Response } from "express";
import User from "@models/user.model";
import { IUser } from "@models/user.model";

export const sanitizeUser = async (
    userId: string
): Promise<Partial<IUser> | null> => {
    return await User.findById(userId).select("-password -refreshToken");
};

export const setAuthCookies = (
    res: Response,
    accessToken: string,
    refreshToken: string
): Response => {
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options);
};

export const clearAuthCookies = (res: Response): Response => {
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options);
};
