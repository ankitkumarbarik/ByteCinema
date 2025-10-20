import { Router } from "express";
import verifyAuthentication from "@middlewares/authentication.middleware";
import validateRequest from "@middlewares/validate.middleware";
import {
    createBookingSchema,
    getAllBookingsSchema,
} from "@schemas/booking.schema";
import {
    createBooking,
    getAllBookings,
    getUserBookings,
} from "@controllers/booking.controller";
import verifyAuthorization from "@middlewares/authorization.middleware";
import { ROLES } from "@config/role";

const router = Router();

router
    .route("/")
    .post(
        verifyAuthentication,
        validateRequest(createBookingSchema, "body"),
        createBooking
    )
    .get(
        verifyAuthentication,
        verifyAuthorization(ROLES.ADMIN),
        validateRequest(getAllBookingsSchema, "query"),
        getAllBookings
    );

router.route("/me").get(verifyAuthentication, getUserBookings);

router;

export default router;
