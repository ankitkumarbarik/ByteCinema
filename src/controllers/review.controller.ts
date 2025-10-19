import { Request, Response } from "express";
import asyncHandler from "@utils/asyncHandler";
import ApiError from "@utils/ApiError";
import ApiResponse from "@utils/ApiResponse";
import Review from "@models/review.model";
import Movie from "@models/movie.model";

export const createReview = asyncHandler(
    async (req: Request, res: Response) => {
        const { movieId, rating, comment } = req.body;

        const userId = req.user?._id;
        if (!userId) throw new ApiError(401, "Unauthorized");

        const movie = await Movie.findById(movieId);
        if (!movie) throw new ApiError(404, "Movie not found");

        const existingReview = await Review.findOne({
            movie: movieId,
            user: userId,
        });
        if (existingReview)
            throw new ApiError(409, "You have already reviewed this movie");

        const review = new Review({
            movie: movieId,
            user: userId,
            rating: Number(rating),
            comment: comment ? comment.trim() : "",
        });
        await review.save();

        const reviews = await Review.find({ movie: movieId });
        const totalReviews = reviews.length;
        const averageRating =
            reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

        movie.totalReviews = totalReviews;
        movie.averageRating = averageRating;
        await movie.save();

        return res
            .status(201)
            .json(new ApiResponse(201, review, "review created successfully"));
    }
);

export const updateReview = asyncHandler(
    async (req: Request, res: Response) => {
        const reviewId = req.params.id;
        const { rating, comment } = req.body;

        const review = await Review.findById(reviewId);
        if (!review) throw new ApiError(404, "Review not found");

        const userId = req.user?._id;

        // only review owner can update
        if (review.user.toString() !== userId?.toString())
            throw new ApiError(
                403,
                "Forbidden: Not allowed to update this review"
            );

        if (rating !== undefined) review.rating = Number(rating);
        if (comment !== undefined) review.comment = comment.trim();

        await review.save();

        return res
            .status(200)
            .json(new ApiResponse(200, review, "Review updated successfully"));
    }
);

export const deleteReview = asyncHandler(
    async (req: Request, res: Response) => {
        const reviewId = req.params.id;

        const review = await Review.findById(reviewId);
        if (!review) throw new ApiError(404, "Review not found");

        const userId = req.user?._id;
        const userRole = req.user?.role;

        // only owner or admin can delete
        if (
            review.user.toString() !== userId?.toString() &&
            userRole !== "ADMIN"
        ) {
            throw new ApiError(
                403,
                "Forbidden: Not allowed to delete this review"
            );
        }

        await Review.findByIdAndDelete(reviewId);

        const movie = await Movie.findById(review.movie);
        if (movie) {
            const reviews = await Review.find({ movie: movie._id });

            if (reviews.length > 0) {
                const totalRating = reviews.reduce(
                    (sum, r) => sum + r.rating,
                    0
                );
                movie.averageRating = totalRating / reviews.length;
                movie.totalReviews = reviews.length;
            } else {
                movie.averageRating = 0;
                movie.totalReviews = 0;
            }

            await movie.save();
        }

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Review deleted successfully"));
    }
);

export const getAllReviews = asyncHandler(
    async (req: Request, res: Response) => {
        const { movieId, page = 1, limit = 10 } = req.query;

        const skip = (Number(page) - 1) * Number(limit);

        const reviews = await Review.find({ movie: movieId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .populate("user", "name email");

        const total = await Review.countDocuments({ movie: movieId });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    reviews,
                    total,
                    page: Number(page),
                    limit: Number(limit),
                },
                "Reviews fetched successfully"
            )
        );
    }
);

export const getSingleReview = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const review = await Review.findById(id).populate("user", "name email");
        if (!review) throw new ApiError(404, "Review not found");

        return res
            .status(200)
            .json(new ApiResponse(200, review, "Review fetched successfully"));
    }
);
