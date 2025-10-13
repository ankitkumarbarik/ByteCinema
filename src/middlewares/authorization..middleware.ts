import { NextFunction, Request, Response } from "express";
import ApiError from "@utils/ApiError";

const verifyAuthorization =
    (...allowedRoles: string[]) =>
    (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) throw new ApiError(401, "unauthorized: no user found");

        if (!allowedRoles.includes(req.user.role || ""))
            throw new ApiError(403, "forbidden: access denied");

        next();
    };

export default verifyAuthorization;
