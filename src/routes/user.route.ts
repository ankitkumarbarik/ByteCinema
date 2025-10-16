import { Router } from "express";
import validateRequest from "@middlewares/validate.middleware";
import {
    registerUserSchema,
    resendOtpSignupSchema,
    verifyOtpSignupSchema,
} from "@schemas/user.validation";
import {
    registerUser,
    resendOtpSignup,
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

export default router;
