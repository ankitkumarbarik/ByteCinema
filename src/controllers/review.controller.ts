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
