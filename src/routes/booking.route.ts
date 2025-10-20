import { Router } from "express";
import verifyAuthentication from "@middlewares/authentication.middleware";
import validateRequest from "@middlewares/validate.middleware";
import { createBookingSchema } from "@schemas/booking.schema";
import { createBooking } from "@controllers/booking.controller";

const router = Router();

router.post(
    "/",
    verifyAuthentication,
    validateRequest(createBookingSchema, "body"),
    createBooking
);

export default router;
