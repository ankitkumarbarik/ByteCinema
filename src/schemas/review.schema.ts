import { z } from "zod";

export const createReviewSchema = z.object({
    movieId: z
        .string()
        .nonempty("Movie ID is required")
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid movie ID format")
        .trim(),
    rating: z
        .number({ message: "Rating must be a number" })
        .int()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot exceed 5"),
    comment: z
        .string()
        .trim()
        .max(500, "Comment cannot exceed 500 characters")
        .optional(),
});
