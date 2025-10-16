import { Router } from "express";
import validateRequest from "@middlewares/validate.middleware";
import {
    loginUserSchema,
    registerUserSchema,
    resendOtpSignupSchema,
    verifyOtpSignupSchema,
} from "@schemas/user.validation";
import {
    loginUser,
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

router.post("/login", validateRequest(loginUserSchema, "body"), loginUser);

export default router;
