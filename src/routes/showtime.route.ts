import { Router } from "express";
import verifyAuthentication from "@middlewares/authentication.middleware";
import verifyAuthorization from "@middlewares/authorization.middleware";
import validateRequest from "@middlewares/validate.middleware";
import {
    createShowtime,
    deleteShowtime,
    getAllShowtimes,
    getSingleShowtime,
    updateShowtime,
} from "@controllers/showtime.controller";
import {
    createShowtimeSchema,
    deleteShowtimeParamsSchema,
    getAllShowtimesSchema,
    getSingleShowtimeSchema,
    updateShowtimeBodySchema,
    updateShowtimeParamsSchema,
} from "@schemas/showtime.schema";
import { ROLES } from "@config/role";

const router = Router();

router
    .route("/")
    .post(
        verifyAuthentication,
        verifyAuthorization(ROLES.ADMIN),
        validateRequest(createShowtimeSchema, "body"),
        createShowtime
    )
    .get(
        verifyAuthentication,
        validateRequest(getAllShowtimesSchema, "query"),
        getAllShowtimes
    );

router
    .route("/:id")
    .get(
        verifyAuthentication,
        validateRequest(getSingleShowtimeSchema, "params"),
        getSingleShowtime
    )
    .patch(
        verifyAuthentication,
        verifyAuthorization("ADMIN"),
        validateRequest(updateShowtimeParamsSchema, "params"),
        validateRequest(updateShowtimeBodySchema, "body"),
        updateShowtime
    )
    .delete(
        verifyAuthentication,
        verifyAuthorization("ADMIN"),
        validateRequest(deleteShowtimeParamsSchema, "params"),
        deleteShowtime
    );

export default router;
