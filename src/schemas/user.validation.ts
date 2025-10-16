import { z } from "zod";

export const registerUserSchema = z.object({
    name: z
        .string()
        .nonempty("Name is required")
        .min(2, "Name must be at least 2 characters long"),
    email: z
        .string()
        .nonempty("Email is required")
        .email("Invalid email format"),
    password: z
        .string()
        .nonempty("Password is required")
        .min(6, "Password must be at least 6 characters long"),
});

export const verifyOtpSignupSchema = z.object({
    otpSignup: z
        .string()
        .nonempty("OTP is required")
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^\d+$/, "OTP must contain only numbers"),
});

export const resendOtpSignupSchema = z.object({
    email: z
        .string()
        .nonempty({ message: "Email is required" })
        .email({ message: "Invalid email format" }),
});

export const loginUserSchema = z.object({
    email: z
        .string()
        .trim()
        .nonempty("Email is required")
        .email("Invalid email format"),

    password: z
        .string()
        .trim()
        .nonempty("Password is required")
        .min(6, "Password must be at least 6 characters long")
        .max(64, "Password cannot exceed 64 characters"),
});

export const forgetUserPasswordSchema = z.object({
    email: z
        .string()
        .trim()
        .nonempty("Email is required")
        .email("Invalid email format"),
});

export const resetUserPasswordParamsSchema = z.object({
    token: z
        .string()
        .nonempty("Token is required")
        .trim()
        .min(1, "Token cannot be empty"),
});

export const resetUserPasswordBodySchema = z
    .object({
        newPassword: z
            .string()
            .nonempty("New password is required")
            .min(6, "Password must be at least 6 characters long"),
        confirmPassword: z
            .string()
            .nonempty("Confirm password is required")
            .min(6, "Password must be at least 6 characters long"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
