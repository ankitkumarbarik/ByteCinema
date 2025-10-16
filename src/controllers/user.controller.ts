import { Request, Response } from "express";
import asyncHandler from "@utils/asyncHandler";
import ApiError from "@utils/ApiError";
import ApiResponse from "@utils/ApiResponse";
import User from "@models/user.model";
import generateOtp from "@utils/otp.util";
import { sanitizeUser, setAuthCookies } from "@utils/auth.util";
import verifySignupMail from "@services/verifySignupMail.service";
import welcomeSignupMail from "@services/welcomeSignupMail.service";
import generateAccessAndRefreshToken from "@services/token.service";
import generateToken from "@utils/token.util";
import tokenVerifyMail from "@services/tokenVerifyMail.service";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "@config/env.config";

export const registerUser = asyncHandler(
    async (req: Request, res: Response) => {
        const { name, email, password } = req.body;

        const existedUser = await User.findOne({ email });
        if (existedUser) throw new ApiError(409, "email already exists");

        const otpSignup = generateOtp();
        const otpSignupExpiry = new Date(Date.now() + 5 * 60 * 1000);

        const newUser = new User({
            name,
            email,
            password,
            otpSignup,
            otpSignupExpiry,
        });
        await newUser.save();

        const createdUser = await sanitizeUser(newUser._id);
        if (!createdUser)
            throw new ApiError(
                500,
                "something went wrong while registering the user"
            );

        // NOTE: await verifySignupMail - we can but, i want to send the mail immediately..
        verifySignupMail(
            createdUser.name!,
            createdUser.email!,
            createdUser.otpSignup!
        );

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    createdUser,
                    "user registered successfully....Please verify OTP !"
                )
            );
    }
);

export const verifyOtpSignup = asyncHandler(
    async (req: Request, res: Response) => {
        const { otpSignup } = req.body;

        const existedUser = await User.findOneAndUpdate(
            { otpSignup, otpSignupExpiry: { $gt: new Date() } },
            {
                $unset: { otpSignup: 1, otpSignupExpiry: 1 },
                $set: { isVerified: true },
            },
            { new: true }
        );
        if (!existedUser) throw new ApiError(400, "invalid or expired otp");

        // NOTE: await welcomeSignupMail - we can but, i want to send the mail immediately..
        welcomeSignupMail(existedUser.name!, existedUser.email!);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    existedUser,
                    "OTP verified successfully. Account activated."
                )
            );
    }
);

export const resendOtpSignup = asyncHandler(
    async (req: Request, res: Response) => {
        const { email } = req.body;

        const existedUser = await User.findOne({ email });
        if (!existedUser) throw new ApiError(404, "email doesn't exists");

        if (existedUser.isVerified)
            throw new ApiError(400, "user is already verified");

        const isOtpExpired =
            !existedUser.otpSignupExpiry ||
            existedUser.otpSignupExpiry < new Date();
        if (isOtpExpired) {
            const otpSignup = generateOtp();
            const otpSignupExpiry = new Date(Date.now() + 5 * 60 * 1000);

            const updatedUser = await User.findByIdAndUpdate(
                existedUser._id,
                { $set: { otpSignup, otpSignupExpiry } },
                { new: true }
            );
            if (!updatedUser)
                throw new ApiError(
                    500,
                    "something went wrong while updating the user"
                );

            // NOTE: await verifySignupMail - we can but, i want to send the mail immediately..
            verifySignupMail(
                updatedUser.name!,
                updatedUser.email!,
                updatedUser.otpSignup!
            );

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        updatedUser,
                        "OTP resent successfully."
                    )
                );
        } else {
            // NOTE: await verifySignupMail - we can but, i want to send the mail immediately..
            verifySignupMail(
                existedUser.name!,
                existedUser.email!,
                existedUser.otpSignup!
            );

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        existedUser,
                        "OTP resent successfully."
                    )
                );
        }
    }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existedUser = await User.findOne({ email });
    if (!existedUser) throw new ApiError(404, "email doesn't exists");

    const isPasswordValid = await existedUser.comparePassword(password);
    if (!isPasswordValid) throw new ApiError(401, "invalid password");

    if (!existedUser.isVerified) {
        const isOtpExpired =
            !existedUser.otpSignupExpiry ||
            existedUser.otpSignupExpiry < new Date();
        if (isOtpExpired) {
            const otpSignup = generateOtp();
            const otpSignupExpiry = new Date(Date.now() + 5 * 60 * 1000);

            const updatedUser = await User.findByIdAndUpdate(
                existedUser._id,
                { $set: { otpSignup, otpSignupExpiry } },
                { new: true }
            );
            if (!updatedUser)
                throw new ApiError(
                    500,
                    "something went wrong while updating the user"
                );

            // NOTE: await verifySignupMail - we can but, i want to send the mail immediately..
            verifySignupMail(
                updatedUser.name!,
                updatedUser.email!,
                updatedUser.otpSignup!
            );

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        updatedUser,
                        "OTP resent successfully."
                    )
                );
        } else {
            // NOTE: await verifySignupMail - we can but, i want to send the mail immediately..
            verifySignupMail(
                existedUser.name!,
                existedUser.email!,
                existedUser.otpSignup!
            );

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        existedUser,
                        "OTP resent successfully."
                    )
                );
        }
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        existedUser._id
    );

    const user = await sanitizeUser(existedUser._id);
    if (!user) throw new ApiError(404, "user not found");

    setAuthCookies(res, accessToken, refreshToken);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user, accessToken, refreshToken },
                "user logged in successfully."
            )
        );
});

export const forgetUserPassword = asyncHandler(
    async (req: Request, res: Response) => {
        const { email } = req.body;

        const token = generateToken();
        const expiry = Date.now() + 3600000;

        const existedUser = await User.findOneAndUpdate(
            { email },
            {
                $set: {
                    forgetPasswordToken: token,
                    forgetPasswordExpiry: expiry,
                },
            },
            { new: true }
        );
        if (!existedUser) throw new ApiError(404, "email does not exists");

        tokenVerifyMail(
            existedUser.name!,
            existedUser.email!,
            existedUser.forgetPasswordToken!
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    email: existedUser.email,
                    token: existedUser.forgetPasswordToken,
                },
                "token generated - check your email to reset your password"
            )
        );
    }
);

export const resetUserPassword = asyncHandler(
    async (req: Request, res: Response) => {
        const { token } = req.params;
        const { newPassword, confirmPassword } = req.body;

        const existedUser = await User.findOne({
            forgetPasswordToken: token,
            forgetPasswordExpiry: { $gt: new Date() },
        });
        if (!existedUser) throw new ApiError(404, "invalid or expired token");

        existedUser.forgetPasswordToken = undefined;
        existedUser.forgetPasswordExpiry = undefined;
        existedUser.password = confirmPassword || newPassword;
        await existedUser.save();

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { email: existedUser.email },
                    "password reset successfully. You can now log in with your new password."
                )
            );
    }
);

export const refreshAccessToken = asyncHandler(
    async (req: Request, res: Response) => {
        const token = req.cookies?.refreshToken || req.body.refreshToken;
        if (!token) throw new ApiError(401, "unauthorized request");

        const decodedToken = jwt.verify(
            token,
            config.REFRESH_TOKEN_SECRET
        ) as JwtPayload;
        if (!decodedToken) throw new ApiError(401, "unauthorized request");

        const existedUser = await User.findById(decodedToken?._id);
        if (!existedUser) throw new ApiError(401, "invalid refresh token");

        if (token !== existedUser?.refreshToken)
            throw new ApiError(401, "refresh token is expired or used");

        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(existedUser._id);

        const user = await sanitizeUser(existedUser._id);
        if (!user) throw new ApiError(404, "user not found");

        setAuthCookies(res, accessToken, refreshToken);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { user, accessToken, refreshToken },
                    "access token refreshed successfully"
                )
            );
    }
);
