import { Router } from "express";
import validateRequest from "@middlewares/validate.middleware";
import {
    forgetUserPasswordSchema,
    loginUserSchema,
    registerUserSchema,
    resendOtpSignupSchema,
    resetUserPasswordBodySchema,
    resetUserPasswordParamsSchema,
    verifyOtpSignupSchema,
} from "@schemas/user.validation";
import {
    forgetUserPassword,
    loginUser,
    registerUser,
    resendOtpSignup,
    resetUserPassword,
    verifyOtpSignup,
} from "@controllers/user.controller";

const router = Router();

router.post(
    "/register",
    validateRequest(registerUserSchema, "body"),
    registerUser
);

router.post(
    "/verify-signup",
    validateRequest(verifyOtpSignupSchema, "body"),
    verifyOtpSignup
);

router.post(
    "/resend-signup",
    validateRequest(resendOtpSignupSchema, "body"),
    resendOtpSignup
);

router.post("/login", validateRequest(loginUserSchema, "body"), loginUser);

router.post(
    "/forget-password",
    validateRequest(forgetUserPasswordSchema, "body"),
    forgetUserPassword
);

router.post(
    "/reset-password/:token",
    validateRequest(resetUserPasswordParamsSchema, "params"),
    validateRequest(resetUserPasswordBodySchema, "body"),
    resetUserPassword
);

export default router;
