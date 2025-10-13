import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import ApiError from "@utils/ApiError";

const validateRequest = (
    schema: ZodType<any>,
    property: "body" | "params" | "query" = "body"
) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            schema.parse(req[property]);
            next();
        } catch (err: any) {
            const message =
                err.errors
                    ?.map((e: any) => `${e.path.join(".")}: ${e.message}`)
                    .join(", ") || "Invalid request data";
            next(new ApiError(400, message));
        }
    };
};

export default validateRequest;
