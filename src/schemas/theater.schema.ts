import { z } from "zod";

export const createTheaterSchema = z.object({
    name: z
        .string({ message: "Theater name is required" })
        .trim()
        .min(2, "Theater name must be at least 2 characters long"),

    location: z
        .string({ message: "Location is required" })
        .trim()
        .min(3, "Location must be at least 3 characters long"),

    city: z
        .string({ message: "City is required" })
        .trim()
        .min(2, "City name must be at least 2 characters long"),

    totalScreens: z
        .number({ message: "Total screens are required" })
        .int()
        .positive("Total screens must be a positive number"),
});

export const getAllTheatersSchema = z.object({
    city: z.string().optional(),
    name: z.string().optional(),
});

export const getSingleTheaterSchema = z.object({
    id: z.string().min(1, "Theater ID is required"),
});
