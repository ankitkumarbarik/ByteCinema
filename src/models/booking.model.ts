import { Schema, model, Document } from "mongoose";

export interface IBooking extends Document {
    user: { type: Schema.Types.ObjectId; ref: "User"; required: true };
    showtime: { type: Schema.Types.ObjectId; ref: "Showtime"; required: true };
    seatsBooked: string[];
    totalPrice: number;
    status: "booked" | "cancelled";
    paymentId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        showtime: {
            type: Schema.Types.ObjectId,
            ref: "Showtime",
            required: true,
        },
        seatsBooked: [
            {
                type: String,
                required: true,
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["booked", "cancelled"],
            default: "booked",
        },
        paymentId: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const Booking = model<IBooking>("Booking", bookingSchema);

export default Booking;
