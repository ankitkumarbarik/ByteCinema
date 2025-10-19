import express from "express";
import verifyAuthentication from "@middlewares/authentication.middleware";
import verifyAuthorization from "@middlewares/authorization.middleware";
import validateRequest from "@middlewares/validate.middleware";
import { ROLES } from "@config/role";
import { createTheater } from "@controllers/theater.controller";
import { createTheaterSchema } from "@schemas/theater.schema";

const router = express.Router();

router.post(
    "/",
    verifyAuthentication,
    verifyAuthorization(ROLES.ADMIN),
    validateRequest(createTheaterSchema, "body"),
    createTheater
);

export default router;
