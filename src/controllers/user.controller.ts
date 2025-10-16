import { Request, Response } from "express";
import asyncHandler from "@utils/asyncHandler";
import ApiError from "@utils/ApiError";
import ApiResponse from "@utils/ApiResponse";
import User from "@models/user.model";
import generateOtp from "@utils/otp.util";
import { sanitizeUser } from "@utils/auth.util";
import verifySignupMail from "@services/verifySignupMail.service";
import welcomeSignupMail from "@services/welcomeSignupMail.service";

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
