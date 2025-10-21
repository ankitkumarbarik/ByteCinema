import { Router } from "express";
import verifyAuthentication from "@middlewares/authentication.middleware";
import validateRequest from "@middlewares/validate.middleware";
import { createPaymentSchema } from "@schemas/payment.schema";
import { createPayment } from "@controllers/payment.controller";

const router = Router();

router
    .route("/create-session")
    .post(
        verifyAuthentication,
        validateRequest(createPaymentSchema, "body"),
        createPayment
    );

export default router;
