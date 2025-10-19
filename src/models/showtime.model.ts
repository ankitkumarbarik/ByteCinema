import { Schema, model, Document } from "mongoose";

export interface IShowtime extends Document {
    movie: Schema.Types.ObjectId;
    theater: Schema.Types.ObjectId;
    date: string;
    time: string;
    price: number;
    availableSeats: number;
    totalSeats: number;
}

const showtimeSchema = new Schema<IShowtime>(
    {
        movie: {
            type: Schema.Types.ObjectId,
            ref: "Movie",
            required: [true, "Movie is required"],
        },
        theater: {
            type: Schema.Types.ObjectId,
            ref: "Theater",
            required: [true, "Theater is required"],
        },
        date: {
            type: String,
            required: [true, "Show date is required"],
        },
        time: {
            type: String,
            required: [true, "Show time is required"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
        },
        totalSeats: {
            type: Number,
            required: [true, "Total seats are required"],
        },
        availableSeats: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const Showtime = model<IShowtime>("Showtime", showtimeSchema);

export default Showtime;
