import { Schema, model, Document } from "mongoose";

export interface IMovie extends Document {
    title: string;
    description?: string;
    genre: string[];
    releaseYear: number;
    duration: number;
    cast?: string[];
    director?: string;
    trailerUrl?: string;
    poster?: {
        public_id: string;
        url: string;
    };
    averageRating?: number;
    totalReviews?: number;
    createdBy: { type: Schema.Types.ObjectId; ref: "User"; required: true };
}

const movieSchema = new Schema<IMovie>(
    {
        title: {
            type: String,
            required: [true, "Movie title is required"],
            trim: true,
            index: true,
        },
        description: {
            type: String,
            trim: true,
        },
        genre: {
            type: [String],
            required: [true, "Genre is required"],
        },
        releaseYear: {
            type: Number,
            required: [true, "Release year is required"],
        },
        duration: {
            type: Number,
            required: [true, "Duration is required"],
        },
        cast: [
            {
                type: String,
                trim: true,
            },
        ],
        director: {
            type: String,
            trim: true,
        },
        trailerUrl: {
            type: String,
            trim: true,
        },
        poster: {
            public_id: { type: String },
            url: { type: String },
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        totalReviews: {
            type: Number,
            default: 0,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Movie = model<IMovie>("Movie", movieSchema);
export default Movie;
