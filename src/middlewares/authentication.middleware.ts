import { config } from "@config/env.config";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "@utils/asyncHandler";
import ApiError from "@utils/ApiError";
import jwt from "jsonwebtoken";
import User, { IUser } from "@models/user.model";

interface JwtPayload {
    _id: string;
    email?: string;
    role?: string;
}

const verifyAuthentication = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "").trim();
        if (!token) throw new ApiError(401, "unauthorized: no token provided");

        if (!config.ACCESS_TOKEN_SECRET) {
            throw new ApiError(500, "access_token secret not defined");
        }

        const decodedToken = jwt.verify(
            token,
            config.ACCESS_TOKEN_SECRET
        ) as JwtPayload;
        if (!decodedToken) throw new ApiError(401, "unauthorized request");

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );
        if (!user) throw new ApiError(401, "unauthorized: user not found");

        req.user = user as IUser;
        next();
    }
);

export default verifyAuthentication;
