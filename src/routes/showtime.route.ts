import { Router } from "express";
import verifyAuthentication from "@middlewares/authentication.middleware";
import verifyAuthorization from "@middlewares/authorization.middleware";
import validateRequest from "@middlewares/validate.middleware";
import { createShowtime } from "@controllers/showtime.controller";
import { createShowtimeSchema } from "@schemas/showtime.schema";
import { ROLES } from "@config/role";

const router = Router();

router
    .route("/")
    .post(
        verifyAuthentication,
        verifyAuthorization(ROLES.ADMIN),
        validateRequest(createShowtimeSchema, "body"),
        createShowtime
    );

export default router;
