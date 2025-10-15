import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";
import ApiError from "@utils/ApiError";

const validateRequest =
    (schema: ZodType<any>, property: "body" | "query" | "params" = "body") =>
    (req: Request, _res: Response, next: NextFunction) => {
        try {
            schema.parse(req[property]); // body/query/params dynamically
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                const fieldErrors: Record<string, string[]> = {};
                const errorMessages: string[] = [];

                err.issues.forEach((issue) => {
                    const field = issue.path.join(".") || "root";
                    const message = issue.message;

                    if (!fieldErrors[field]) fieldErrors[field] = [];
                    fieldErrors[field].push(message);

                    errorMessages.push(
                        field !== "root" ? `${field}: ${message}` : message
                    );
                });

                const mainMessage =
                    Object.keys(fieldErrors).length === 1
                        ? errorMessages[0]
                        : `Validation failed for ${
                            Object.keys(fieldErrors).length
                        } field(s)`;

                return next(
                    new ApiError(400, mainMessage, errorMessages, {
                        fields: fieldErrors,
                    })
                );
            }

            return next(new ApiError(400, "Invalid request data"));
        }
    };

export default validateRequest;
