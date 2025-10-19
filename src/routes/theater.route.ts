import express from "express";
import verifyAuthentication from "@middlewares/authentication.middleware";
import verifyAuthorization from "@middlewares/authorization.middleware";
import validateRequest from "@middlewares/validate.middleware";
import { ROLES } from "@config/role";
import { createTheater, getAllTheaters } from "@controllers/theater.controller";
import {
    createTheaterSchema,
    getAllTheatersSchema,
} from "@schemas/theater.schema";

const router = express.Router();

router.post(
    "/",
    verifyAuthentication,
    verifyAuthorization(ROLES.ADMIN),
    validateRequest(createTheaterSchema, "body"),
    createTheater
);

router.get(
    "/",
    verifyAuthentication,
    validateRequest(getAllTheatersSchema, "query"),
    getAllTheaters
);

export default router;
