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
        const theaters = await Theater.find().populate("owner", "name email");

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    theaters,
                    "All theaters fetched successfully"
                )
            );
    }
);

export const getTheaterById = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const theater = await Theater.findById(id).populate(
            "owner",
            "name email"
        );

        if (!theater) throw new ApiError(404, "Theater not found");

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    theater,
                    "Theater details fetched successfully"
                )
            );
    }
);

export const updateTheater = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const updates = req.body;

        const theater = await Theater.findById(id);
        if (!theater) throw new ApiError(404, "Theater not found");

        // Only admin or owner can update
        if (
            theater.owner?.toString() !== req.user?._id?.toString() &&
            req.user?.role !== "ADMIN"
        ) {
            throw new ApiError(
                403,
                "Forbidden: You are not allowed to update this theater"
            );
        }

        Object.assign(theater, updates);
        await theater.save();

        return res
            .status(200)
            .json(
                new ApiResponse(200, theater, "Theater updated successfully")
            );
    }
);

export const deleteTheater = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const theater = await Theater.findById(id);
        if (!theater) throw new ApiError(404, "Theater not found");

        if (
            theater.owner?.toString() !== req.user?._id?.toString() &&
            req.user?.role !== "ADMIN"
        ) {
            throw new ApiError(
                403,
                "Forbidden: You are not allowed to delete this theater"
            );
        }

        await Theater.findByIdAndDelete(id);

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Theater deleted successfully"));
    }
);
