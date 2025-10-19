import { Request, Response } from "express";
import asyncHandler from "@utils/asyncHandler";
import ApiError from "@utils/ApiError";
import ApiResponse from "@utils/ApiResponse";
import Theater from "@models/theater.model";

export const createTheater = asyncHandler(
    async (req: Request, res: Response) => {
        const { name, location, city, totalScreens } = req.body;

        const existing = await Theater.findOne({
            name: name.trim(),
            city: city.trim(),
        });

        if (existing)
            throw new ApiError(
                409,
                "A theater with this name already exists in this city"
            );

        const theater = await Theater.create({
            name: name.trim(),
            location: location.trim(),
            city: city.trim(),
            totalScreens: Number(totalScreens),
            owner: req.user?._id,
        });

        return res
            .status(201)
            .json(
                new ApiResponse(201, theater, "Theater created successfully")
            );
    }
);

export const getAllTheaters = asyncHandler(
    async (req: Request, res: Response) => {
        const { city, name } = req.query;

        const filter: any = {};
        if (city) filter.city = { $regex: String(city), $options: "i" };
        if (name) filter.name = { $regex: String(name), $options: "i" };

        const theaters = await Theater.find(filter)
            .sort({ createdAt: -1 })
            .exec();

        if (!theaters.length) throw new ApiError(404, "No theaters found");

        return res
            .status(200)
            .json(
                new ApiResponse(200, theaters, "Theaters fetched successfully")
            );
    }
);

export const getSingleTheater = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const theater = await Theater.findById(id);
        if (!theater) throw new ApiError(404, "Theater not found");

        return res
            .status(200)
            .json(
                new ApiResponse(200, theater, "Theater fetched successfully")
            );
    }
);
