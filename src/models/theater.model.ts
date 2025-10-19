import { Schema, Document, model } from "mongoose";

export interface ITheater extends Document {
    name: string;
    location: string;
    city: string;
    totalScreens: number;
    owner?: Schema.Types.ObjectId;
}

const theaterSchema = new Schema<ITheater>(
    {
        name: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        totalScreens: { type: Number, required: true, min: 1 },
        owner: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

const Theater = model<ITheater>("Theater", theaterSchema);

export default Theater;
