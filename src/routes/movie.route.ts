import { Router } from "express";
import verifyAuthentication from "@middlewares/authentication.middleware";
import verifyAuthorization from "@middlewares/authorization.middleware";
import { ROLES } from "@config/role";
import upload from "@middlewares/multer.middleware";
import validateRequest from "@middlewares/validate.middleware";
import { createMovieSchema } from "@schemas/movie.schema";
import { createMovie } from "@controllers/movie.controller";

const router = Router();

router
    .route("/create-movie")
    .post(
        verifyAuthentication,
        verifyAuthorization(ROLES.ADMIN),
        upload.single("poster"),
        validateRequest(createMovieSchema, "body"),
        createMovie
    );

export default router;
