import express from "express";
import verifyAuthentication from "@middlewares/authentication.middleware";
import verifyAuthorization from "@middlewares/authorization.middleware";
import validateRequest from "@middlewares/validate.middleware";
import { ROLES } from "@config/role";
import {
    createTheater,
    deleteTheater,
    getAllTheaters,
    getSingleTheater,
    updateTheater,
} from "@controllers/theater.controller";
import {
    createTheaterSchema,
    deleteTheaterParamsSchema,
    getAllTheatersSchema,
    getSingleTheaterSchema,
    updateTheaterBodySchema,
    updateTheaterParamsSchema,
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
    )
    .patch(
        verifyAuthentication,
        verifyAuthorization(ROLES.ADMIN),
        validateRequest(updateTheaterParamsSchema, "params"),
        validateRequest(updateTheaterBodySchema, "body"),
        updateTheater
    )
    .delete(
        verifyAuthentication,
        verifyAuthorization(ROLES.ADMIN),
        validateRequest(deleteTheaterParamsSchema, "params"),
        deleteTheater
    );

export default router;
