import { Request, Response } from "express";
import asyncHandler from "@utils/asyncHandler";
import ApiResponse from "@utils/ApiResponse";
import ApiError from "@utils/ApiError";
import Booking from "@models/booking.model";
import stripe from "@config/stripe.config";
import { config } from "@config/env.config";

export const createPayment = asyncHandler(
    async (req: Request, res: Response) => {
        const { bookingId } = req.body;
        const userId = req.user?._id;

        if (!bookingId) throw new ApiError(400, "Booking ID is required");
        if (!userId) throw new ApiError(401, "User not authenticated");

        const booking = await Booking.findById(bookingId).populate("showtime");
        if (!booking) throw new ApiError(404, "Booking not found");

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `Movie Ticket - ${booking.showtime}`,
                        },
                        unit_amount: booking.totalPrice * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${config.FRONTEND_BASE_URL}/success`,
            cancel_url: `${config.FRONTEND_BASE_URL}/cancel`,
            metadata: {
                bookingId: booking._id?.toString() || "",
                userId: userId?.toString() || "",
            },
        });

        res.status(200).json(
            new ApiResponse(
                200,
                { url: session.url },
                "stripe checkout session created"
            )
        );
    }
);
