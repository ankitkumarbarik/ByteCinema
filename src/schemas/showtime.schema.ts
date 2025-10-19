import { z } from "zod";

export const createShowtimeSchema = z.object({
    movieId: z.string().nonempty("Movie ID is required"),
    theaterId: z.string().nonempty("Theater ID is required"),
    date: z.string().nonempty("Date is required"),
    time: z.string().nonempty("Time is required"),
    price: z.number().min(0, "Price must be >= 0"),
    totalSeats: z.number().int().min(1, "Total seats must be at least 1"),
});

export const getAllShowtimesSchema = z.object({
    movieId: z.string().optional(),
    theaterId: z.string().optional(),
    date: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
});

export const getSingleShowtimeSchema = z.object({
    id: z.string().min(1, "Showtime ID is required"),
});

export const updateShowtimeParamsSchema = z.object({
    id: z.string(),
});

export const updateShowtimeBodySchema = z.object({
    movieId: z.string().optional(),
    theaterId: z.string().optional(),
    date: z.string().optional(),
    time: z.string().optional(),
    price: z.preprocess(
        (val) => (val !== undefined ? Number(val) : undefined),
        z.number().positive().optional()
    ),
    totalSeats: z.preprocess(
        (val) => (val !== undefined ? Number(val) : undefined),
        z.number().int().positive().optional()
    ),
});
