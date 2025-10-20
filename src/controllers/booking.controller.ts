import { Request, Response } from "express";
import asyncHandler from "@utils/asyncHandler";
import ApiError from "@utils/ApiError";
import ApiResponse from "@utils/ApiResponse";
import Booking from "@models/booking.model";
import Showtime from "@models/showtime.model";

export const createBooking = asyncHandler(
    async (req: Request, res: Response) => {
        const { showtimeId, seatsBooked } = req.body;
        const userId = req.user?._id;

        if (!userId) throw new ApiError(401, "Unauthorized");

        if (!showtimeId) throw new ApiError(400, "Showtime ID is required");

        if (!Array.isArray(seatsBooked) || seatsBooked.length === 0) {
            throw new ApiError(400, "Seats must be a non-empty array");
        }

        const showtime = await Showtime.findById(showtimeId);
        if (!showtime) throw new ApiError(404, "Showtime not found");

        if (showtime.availableSeats < seatsBooked.length) {
            throw new ApiError(400, "Not enough available seats");
        }

        const existingBookings = await Booking.find({
            showtime: showtimeId,
            seatsBooked: { $in: seatsBooked },
        });

        if (existingBookings.length > 0) {
            throw new ApiError(
                400,
                "One or more selected seats are already booked"
            );
        }

        const totalPrice = showtime.price * seatsBooked.length;

        const booking = await Booking.create({
            user: userId,
            showtime: showtimeId,
            seatsBooked,
            totalPrice,
            status: "booked",
        });

        showtime.availableSeats -= seatsBooked.length;
        await showtime.save();

        return res
            .status(201)
            .json(
                new ApiResponse(201, booking, "Booking created successfully")
            );
    }
);

export const getUserBookings = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;
        if (!userId) throw new ApiError(401, "Unauthorized");

        const bookings = await Booking.find({ user: userId })
            .populate("showtime", "movie theater date time price")
            .sort({ createdAt: -1 })
            .exec();

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    bookings,
                    "User bookings fetched successfully"
                )
            );
    }
);
