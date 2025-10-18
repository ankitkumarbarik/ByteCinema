import { Request, Response } from "express";
import asyncHandler from "@utils/asyncHandler";
import ApiError from "@utils/ApiError";
import ApiResponse from "@utils/ApiResponse";
import Movie, { IMovie } from "@models/movie.model";
import { uploadOnCloudinary } from "@services/cloudinary.service";

export const createMovie = asyncHandler(async (req: Request, res: Response) => {
    const {
        title,
        description,
        genre,
        releaseYear,
        duration,
        director,
        cast,
        trailerUrl,
        posterUrl,
    } = req.body;

    const createdBy = req.user?._id;
    if (!createdBy) throw new ApiError(401, "Unauthorized");

    const existing = await Movie.findOne({ title }).exec();
    if (existing)
        throw new ApiError(409, "Movie with the same title already exists");

    const movieDoc: Partial<any> = {
        title: String(title).trim(),
        description: description ? String(description).trim() : undefined,
        genre: Array.isArray(genre)
            ? genre
            : typeof genre === "string"
            ? [genre]
            : [],
        releaseYear: Number(releaseYear),
        duration: Number(duration),
        director: director ? String(director).trim() : undefined,
        cast: Array.isArray(cast)
            ? cast
            : cast
            ? String(cast)
                  .split(",")
                  .map((s: string) => s.trim())
            : [],
        trailerUrl: trailerUrl ? String(trailerUrl).trim() : undefined,
        createdBy,
    };

    const posterFile = req.file;
    if (posterFile) {
        const uploadResult: any = await uploadOnCloudinary(posterFile.buffer);
        if (!uploadResult) throw new ApiError(500, "Failed to upload poster");
        movieDoc.poster = {
            public_id: uploadResult.public_id,
            url: uploadResult.secure_url,
        };
    } else if (posterUrl) {
        movieDoc.poster = {
            public_id: "",
            url: String(posterUrl).trim(),
        };
    }

    const movie = new Movie(movieDoc);
    await movie.save();

    return res
        .status(201)
        .json(new ApiResponse(201, movie, "movie created successfully"));
});

export const getAllMovies = asyncHandler(
    async (req: Request, res: Response) => {
        const { genre, title, releaseYear, page = 1, limit = 10 } = req.query;

        const query: any = {};

        if (genre)
            query.genre = { $in: Array.isArray(genre) ? genre : [genre] };
        if (title) query.title = { $regex: String(title), $options: "i" };
        if (releaseYear) query.releaseYear = Number(releaseYear);

        const skip = (Number(page) - 1) * Number(limit);

        const movies = await Movie.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .exec();

        const total = await Movie.countDocuments(query);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { movies, total, page: Number(page), limit: Number(limit) },
                    "movies fetched successfully"
                )
            );
    }
);
