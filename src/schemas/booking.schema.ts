import { z } from "zod";

export const createBookingSchema = z.object({
    showtimeId: z
        .string({ message: "Showtime ID is required" })
        .min(1, "Showtime ID cannot be empty"),

    seatsBooked: z
        .array(z.string().min(1, "Seat number cannot be empty"), {
            message: "Seats are required",
        })
        .min(1, "At least one seat must be booked"),
});
