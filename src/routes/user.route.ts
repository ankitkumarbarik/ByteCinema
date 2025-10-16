import { Router } from "express";
import validateRequest from "@middlewares/validate.middleware";
import {
    registerUserSchema,
    verifyOtpSignupSchema,
} from "@schemas/user.validation";
import { registerUser, verifyOtpSignup } from "@controllers/user.controller";

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

export default router;
