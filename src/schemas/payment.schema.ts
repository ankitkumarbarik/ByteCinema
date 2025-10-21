import { z } from "zod";

export const createPaymentSchema = z.object({
    bookingId: z
        .string({
            message: "Booking ID is required",
        })
        .min(1, "Booking ID cannot be empty"),
});
