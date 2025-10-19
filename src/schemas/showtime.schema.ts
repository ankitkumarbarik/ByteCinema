import { z } from "zod";

export const createShowtimeSchema = z.object({
    movieId: z.string().nonempty("Movie ID is required"),
    theaterId: z.string().nonempty("Theater ID is required"),
    date: z.string().nonempty("Date is required"),
    time: z.string().nonempty("Time is required"),
    price: z.number().min(0, "Price must be >= 0"),
    totalSeats: z.number().int().min(1, "Total seats must be at least 1"),
});
