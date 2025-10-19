import { Request, Response } from "express";
import asyncHandler from "@utils/asyncHandler";
import ApiError from "@utils/ApiError";
import ApiResponse from "@utils/ApiResponse";
import Showtime from "@models/showtime.model";
import Movie from "@models/movie.model";
import Theater from "@models/theater.model";

export const createShowtime = asyncHandler(
    async (req: Request, res: Response) => {
        const { movieId, theaterId, date, time, price, totalSeats } = req.body;

        const movie = await Movie.findById(movieId);
        if (!movie) throw new ApiError(404, "Movie not found");

        const theater = await Theater.findById(theaterId);
        if (!theater) throw new ApiError(404, "Theater not found");

        const existingShowtime = await Showtime.findOne({
            movie: movieId,
            theater: theaterId,
            date,
            time,
        });
        if (existingShowtime)
            throw new ApiError(
                409,
                "Showtime already exists for this movie and theater at the given time"
            );

        const showtime = new Showtime({
            movie: movieId,
            theater: theaterId,
            date,
            time,
            price: Number(price),
            totalSeats: Number(totalSeats),
            availableSeats: Number(totalSeats),
        });

        await showtime.save();

        return res
            .status(201)
            .json(
                new ApiResponse(201, showtime, "Showtime created successfully")
            );
    }
);

export const getAllShowtimes = asyncHandler(
    async (req: Request, res: Response) => {
        const { movieId, theaterId, date, page = 1, limit = 10 } = req.query;

        const query: any = {};
        if (movieId) query.movie = movieId;
        if (theaterId) query.theater = theaterId;
        if (date) query.date = date;

        const skip = (Number(page) - 1) * Number(limit);

        const showtimes = await Showtime.find(query)
            .populate("movie", "title")
            .populate("theater", "name location")
            .sort({ date: 1, time: 1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Showtime.countDocuments(query);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    showtimes,
                    total,
                    page: Number(page),
                    limit: Number(limit),
                },
                "Showtimes fetched successfully"
            )
        );
    }
);

export const getSingleShowtime = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const showtime = await Showtime.findById(id)
            .populate("movie")
            .populate("theater");

        if (!showtime) throw new ApiError(404, "Showtime not found");

        return res
            .status(200)
            .json(
                new ApiResponse(200, showtime, "Showtime fetched successfully")
            );
    }
);

export const updateShowtime = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const { movieId, theaterId, date, time, price, totalSeats } = req.body;

        const showtime = await Showtime.findById(id);
        if (!showtime) throw new ApiError(404, "Showtime not found");

        if (movieId) {
            const movie = await Movie.findById(movieId);
            if (!movie) throw new ApiError(404, "Movie not found");
            showtime.movie = movieId;
        }

        if (theaterId) {
            const theater = await Theater.findById(theaterId);
            if (!theater) throw new ApiError(404, "Theater not found");
            showtime.theater = theaterId;
        }

        if (date) showtime.date = date;
        if (time) showtime.time = time;
        if (price !== undefined) showtime.price = Number(price);
        if (totalSeats !== undefined) {
            const bookedSeats = showtime.totalSeats - showtime.availableSeats;
            if (Number(totalSeats) < bookedSeats)
                throw new ApiError(
                    400,
                    "Total seats cannot be less than already booked seats"
                );
            showtime.totalSeats = Number(totalSeats);
            showtime.availableSeats = Number(totalSeats) - bookedSeats;
        }

        await showtime.save();

        return res
            .status(200)
            .json(
                new ApiResponse(200, showtime, "Showtime updated successfully")
            );
    }
);

export const deleteShowtime = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const showtime = await Showtime.findById(id);
        if (!showtime) throw new ApiError(404, "Showtime not found");

        await Showtime.findByIdAndDelete(id);

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Showtime deleted successfully"));
    }
);
