import { Router } from "express";
import verifyAuthentication from "@middlewares/authentication.middleware";
import validateRequest from "@middlewares/validate.middleware";
import { createReviewSchema } from "@schemas/review.schema";
import { createReview } from "@controllers/review.controller";

const router = Router();

router
    .route("/")
    .post(
        verifyAuthentication,
        validateRequest(createReviewSchema, "body"),
        createReview
    );

export default router;
