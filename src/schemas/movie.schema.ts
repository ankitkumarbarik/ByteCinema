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
        .min(1888, "Release year must be valid"), // First movie year
    duration: z
        .number({ message: "Duration must be a number" })
        .int()
        .positive("Duration must be greater than 0"),
    director: z.string().trim().optional(),
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
