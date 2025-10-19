import { z } from "zod";

export const createMovieSchema = z.object({
    title: z.string().nonempty("Title is required").trim(),
    description: z.string().trim().optional(),
    genre: z
        .union([z.array(z.string().nonempty()), z.string().nonempty()])
        .transform((val) => (typeof val === "string" ? [val] : val))
        .refine((arr) => arr.length > 0, "Genre is required"),
    releaseYear: z
        .number({ message: "Release year must be a number" })
        .int()
        .min(1888, "Release year must be valid"),
    duration: z
        .number({ message: "Duration must be a number" })
        .int()
        .positive("Duration must be greater than 0"),
    director: z.string().trim().optional(),
    language: z.string().trim().optional(),
    cast: z
        .union([z.array(z.string().nonempty()), z.string().nonempty()])
        .optional()
        .transform((val) =>
            !val
                ? []
                : typeof val === "string"
                ? val.split(",").map((s) => s.trim())
                : val
        ),
    trailerUrl: z.string().url("Invalid trailer URL").optional(),
    posterUrl: z.string().url("Invalid poster URL").optional(),
});

export const getAllMoviesSchema = z.object({
    genre: z.string().optional(),
    title: z.string().optional(),
    releaseYear: z
        .string()
        .regex(/^\d{4}$/, "releaseYear must be a 4-digit year")
        .optional(),
    page: z.string().regex(/^\d+$/, "page must be a number").optional(),
    limit: z.string().regex(/^\d+$/, "limit must be a number").optional(),
});

export const getSingleMovieSchema = z.object({
    id: z
        .string()
        .nonempty("Movie ID is required")
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid movie ID format"),
});

export const updateMovieParamsSchema = z.object({
    id: z.string().nonempty("Movie ID is required").trim(),
});

export const updateMovieBodySchema = z.object({
    title: z.string().min(1, "Title cannot be empty").trim().optional(),
    description: z.string().trim().optional(),
    genre: z
        .union([z.array(z.string().nonempty()), z.string().nonempty()])
        .optional()
        .transform((val) => (typeof val === "string" ? [val] : val))
        .refine((arr) => !arr || arr.length > 0, "Genre cannot be empty"),
    releaseYear: z
        .number({ message: "Release year must be a number" })
        .int()
        .min(1888, "Release year must be valid")
        .optional(),
    duration: z
        .number({ message: "Duration must be a number" })
        .int()
        .positive("Duration must be greater than 0")
        .optional(),
    director: z.string().trim().optional(),
    language: z.string().trim().optional(),
    cast: z
        .union([z.array(z.string().nonempty()), z.string().nonempty()])
        .optional()
        .transform((val) =>
            !val
                ? []
                : typeof val === "string"
                ? val.split(",").map((s) => s.trim())
                : val
        ),
    trailerUrl: z.string().url("Invalid trailer URL").optional(),
    posterUrl: z.string().url("Invalid poster URL").optional(),
});

export const deleteMovieSchema = z.object({
    id: z
        .string()
        .trim()
        .nonempty("Movie ID is required")
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
});
