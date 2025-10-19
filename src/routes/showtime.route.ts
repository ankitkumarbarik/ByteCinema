import { Router } from "express";
import verifyAuthentication from "@middlewares/authentication.middleware";
import verifyAuthorization from "@middlewares/authorization.middleware";
import validateRequest from "@middlewares/validate.middleware";
import {
    createShowtime,
    getAllShowtimes,
    getSingleShowtime,
} from "@controllers/showtime.controller";
import {
    createShowtimeSchema,
    getAllShowtimesSchema,
    getSingleShowtimeSchema,
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

router.get(
    "/:id",
    verifyAuthentication,
    validateRequest(getSingleShowtimeSchema, "params"),
    getSingleShowtime
);

export default router;
