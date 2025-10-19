import express from "express";
import verifyAuthentication from "@middlewares/authentication.middleware";
import verifyAuthorization from "@middlewares/authorization.middleware";
import validateRequest from "@middlewares/validate.middleware";
import { ROLES } from "@config/role";
import {
    createTheater,
    getAllTheaters,
    getSingleTheater,
} from "@controllers/theater.controller";
import {
    createTheaterSchema,
    getAllTheatersSchema,
    getSingleTheaterSchema,
} from "@schemas/theater.schema";

const router = express.Router();

router
    .route("/")
    .post(
        verifyAuthentication,
        verifyAuthorization(ROLES.ADMIN),
        validateRequest(createTheaterSchema, "body"),
        createTheater
    )
    .get(
        verifyAuthentication,
        validateRequest(getAllTheatersSchema, "query"),
        getAllTheaters
    );

router
    .route("/:id")
    .get(
        verifyAuthentication,
        validateRequest(getSingleTheaterSchema, "params"),
        getSingleTheater
    );

export default router;
