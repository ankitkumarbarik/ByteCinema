import jwt, { SignOptions } from "jsonwebtoken";
import User, { IUser } from "@models/user.model";
import ApiError from "@utils/ApiError";
import { logger } from "@utils/logger";

interface AccessTokenPayload {
    _id: string;
    email?: string;
    role?: string;
}

export const generateAccessToken = (user: IUser): string => {
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.ACCESS_TOKEN_EXPIRY) {
        throw new ApiError(
            500,
            "access_token secret or expiry missing in environment"
        );
    }

    const payload: AccessTokenPayload = {
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
    };

    const options: SignOptions = {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"],
    };

    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);
};

type RefreshTokenPayload = Pick<AccessTokenPayload, "_id">;

export const generateRefreshToken = (user: IUser): string => {
    if (
        !process.env.REFRESH_TOKEN_SECRET ||
        !process.env.REFRESH_TOKEN_EXPIRY
    ) {
        throw new ApiError(
            500,
            "refresh_token secret or expiry missing in environment"
        );
    }

    const payload: RefreshTokenPayload = {
        _id: user._id.toString(),
    };

    const options: SignOptions = {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"],
    };

    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, options);
};

interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

const generateAccessAndRefreshToken = async (
    userId: string
): Promise<TokenResponse> => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new ApiError(404, "user not found");

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error: any) {
        logger.error("error generating tokens", error);
        throw new ApiError(
            500,
            "something went wrong while generating access and refresh token"
        );
    }
};

export default generateAccessAndRefreshToken;
