import { Router } from "express";
import verifyAuthentication from "@middlewares/authentication.middleware";
import validateRequest from "@middlewares/validate.middleware";
import {
    createReviewSchema,
    deleteReviewSchema,
    getAllReviewsSchema,
    getSingleReviewSchema,
    updateReviewBodySchema,
    updateReviewParamsSchema,
} from "@schemas/review.schema";
import {
    createReview,
    deleteReview,
    getAllReviews,
    getSingleReview,
    updateReview,
} from "@controllers/review.controller";

const router = Router();

router
    .route("/")
    .post(
        verifyAuthentication,
        validateRequest(createReviewSchema, "body"),
        createReview
    )
    .get(validateRequest(getAllReviewsSchema, "query"), getAllReviews);

router
    .route("/:id")
    .patch(
        verifyAuthentication,
        validateRequest(updateReviewParamsSchema, "params"),
        validateRequest(updateReviewBodySchema, "body"),
        updateReview
    )
    .delete(
        verifyAuthentication,
        validateRequest(deleteReviewSchema, "params"),
        deleteReview
    )
    .get(validateRequest(getSingleReviewSchema, "params"), getSingleReview);

export default router;
