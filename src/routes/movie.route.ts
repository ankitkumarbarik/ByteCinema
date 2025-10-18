import { Router } from "express";
import verifyAuthentication from "@middlewares/authentication.middleware";
import verifyAuthorization from "@middlewares/authorization.middleware";
import { ROLES } from "@config/role";
import upload from "@middlewares/multer.middleware";
import validateRequest from "@middlewares/validate.middleware";
import { createMovieSchema, getAllMoviesSchema } from "@schemas/movie.schema";
import { createMovie, getAllMovies } from "@controllers/movie.controller";

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

router
    .route("/all-movies")
    .get(
        verifyAuthentication,
        validateRequest(getAllMoviesSchema, "query"),
        getAllMovies
    );

export default router;
