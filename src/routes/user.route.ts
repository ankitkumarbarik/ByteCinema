import { Router } from "express";
import validateRequest from "@middlewares/validate.middleware";
import { registerUserSchema } from "@schemas/user.validation";
import { registerUser } from "@controllers/user.controller";

const router = Router();

router.post(
    "/register",
    validateRequest(registerUserSchema, "body"),
    registerUser
);

export default router;
