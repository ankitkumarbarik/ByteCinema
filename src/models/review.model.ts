import { Schema, model, Document } from "mongoose";

export interface IReview extends Document {
    movie: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    rating: number;
    comment?: string;
}

const reviewSchema = new Schema<IReview>(
    {
        movie: {
            type: Schema.Types.ObjectId,
            ref: "Movie",
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

reviewSchema.index({ movie: 1, user: 1 }, { unique: true });

const Review = model<IReview>("Review", reviewSchema);

export default Review;
