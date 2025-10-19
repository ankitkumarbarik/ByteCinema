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
    );

router
    .route("/:id")
    .patch(
        verifyAuthentication,
        validateRequest(updateReviewParamsSchema, "params"),
        validateRequest(updateReviewBodySchema, "body"),
        updateReview
    );

router
    .route("/:id")
    .delete(
        verifyAuthentication,
        validateRequest(deleteReviewSchema, "params"),
        deleteReview
    );

router
    .route("/")
    .get(validateRequest(getAllReviewsSchema, "query"), getAllReviews);

router
    .route("/:id")
    .get(validateRequest(getSingleReviewSchema, "params"), getSingleReview);

export default router;
