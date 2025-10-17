import { Router } from "express";
import validateRequest from "@middlewares/validate.middleware";
import {
    changeCurrentPasswordSchema,
    forgetUserPasswordSchema,
    loginUserSchema,
    registerUserSchema,
    resendOtpSignupSchema,
    resetUserPasswordBodySchema,
    resetUserPasswordParamsSchema,
    verifyOtpSignupSchema,
} from "@schemas/user.validation";
import {
    changeCurrentPassword,
    deleteUser,
    forgetUserPassword,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    resendOtpSignup,
    resetUserPassword,
    verifyOtpSignup,
} from "@controllers/user.controller";
import verifyAuthentication from "@middlewares/authentication.middleware";

const router = Router();

router
    .route("/register")
    .post(validateRequest(registerUserSchema, "body"), registerUser);

router
    .route("/verify-signup")
    .post(validateRequest(verifyOtpSignupSchema, "body"), verifyOtpSignup);

router
    .route("/resend-signup")
    .post(validateRequest(resendOtpSignupSchema, "body"), resendOtpSignup);

router
    .route("/login")
    .post(validateRequest(loginUserSchema, "body"), loginUser);

router
    .route("/forget-password")
    .post(
        validateRequest(forgetUserPasswordSchema, "body"),
        forgetUserPassword
    );

router
    .route("/reset-password/:token")
    .post(
        validateRequest(resetUserPasswordParamsSchema, "params"),
        validateRequest(resetUserPasswordBodySchema, "body"),
        resetUserPassword
    );

router.route("/refresh-token").post(refreshAccessToken);

router.route("/logout").post(verifyAuthentication, logoutUser);

router.route("/delete").delete(verifyAuthentication, deleteUser);

router
    .route("/change-password")
    .patch(
        verifyAuthentication,
        validateRequest(changeCurrentPasswordSchema, "body"),
        changeCurrentPassword
    );

export default router;
