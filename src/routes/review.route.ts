import { Router } from "express";
import verifyAuthentication from "@middlewares/authentication.middleware";
import validateRequest from "@middlewares/validate.middleware";
import {
    createReviewSchema,
    deleteReviewSchema,
    updateReviewBodySchema,
    updateReviewParamsSchema,
} from "@schemas/review.schema";
import {
    createReview,
    deleteReview,
    updateReview,
} from "@controllers/review.controller";

const router = Router();

router
    .route("/")
    .post(
        verifyAuthentication,
        validateRequest(createReviewSchema, "body"),
        createReview
    );

router
    .route("/:id")
    .patch(
        verifyAuthentication,
        validateRequest(updateReviewParamsSchema, "params"),
        validateRequest(updateReviewBodySchema, "body"),
        updateReview
    );

router.delete(
    "/:id",
    verifyAuthentication,
    validateRequest(deleteReviewSchema, "params"),
    deleteReview
);

export default router;
