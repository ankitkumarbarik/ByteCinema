import { Request, Response } from "express";
import asyncHandler from "@utils/asyncHandler";
import ApiError from "@utils/ApiError";
import ApiResponse from "@utils/ApiResponse";
import Movie from "@models/movie.model";
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
} from "@services/cloudinary.service";
import { logger } from "@utils/logger";

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

export const getSingleMovie = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const movie = await Movie.findById(id);
        if (!movie) throw new ApiError(404, "Movie not found");

        return res
            .status(200)
            .json(new ApiResponse(200, movie, "movie fetched successfully"));
    }
);

export const updateMovie = asyncHandler(async (req: Request, res: Response) => {
    const movieId = req.params.id;
    if (!movieId) throw new ApiError(400, "movie id is required");

    const movie = await Movie.findById(movieId);
    if (!movie) throw new ApiError(404, "movie not found");

    const {
        title,
        description,
        genre,
        releaseYear,
        duration,
        cast,
        director,
        trailerUrl,
        posterUrl,
    } = req.body;

    if (title) movie.title = title.trim();
    if (description) movie.description = description.trim();
    if (genre) movie.genre = Array.isArray(genre) ? genre : [genre];
    if (releaseYear) movie.releaseYear = Number(releaseYear);
    if (duration) movie.duration = Number(duration);
    if (cast)
        movie.cast = Array.isArray(cast)
            ? cast
            : cast.split(",").map((s: string) => s.trim());
    if (director) movie.director = director.trim();
    if (trailerUrl) movie.trailerUrl = trailerUrl.trim();

    const posterFile = req.file;
    if (posterFile || posterUrl) {
        if (movie.poster?.public_id) {
            await deleteFromCloudinary(movie.poster.public_id);
        }

        if (posterFile) {
            const result: any = await uploadOnCloudinary(posterFile.buffer);
            if (!result) throw new ApiError(500, "Failed to upload poster");
            movie.poster = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        } else if (posterUrl) {
            movie.poster = { public_id: "", url: posterUrl.trim() };
        }
    }

    await movie.save();

    return res
        .status(200)
        .json(new ApiResponse(200, movie, "movie updated successfully"));
});

export const deleteMovie = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const movie = await Movie.findById(id);
    if (!movie) throw new ApiError(404, "Movie not found");

    if (movie.poster?.public_id) {
        await deleteFromCloudinary(movie.poster.public_id);
        logger.info(
            `Deleted poster from Cloudinary: ${movie.poster.public_id}`
        );
    }

    await Movie.findByIdAndDelete(id);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Movie deleted successfully"));
});
