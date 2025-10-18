import { Router } from "express";
import verifyAuthentication from "@middlewares/authentication.middleware";
import verifyAuthorization from "@middlewares/authorization.middleware";
import { ROLES } from "@config/role";
import upload from "@middlewares/multer.middleware";
import validateRequest from "@middlewares/validate.middleware";
import {
    createMovieSchema,
    getAllMoviesSchema,
    getSingleMovieSchema,
    updateMovieBodySchema,
    updateMovieParamsSchema,
} from "@schemas/movie.schema";
import {
    createMovie,
    getAllMovies,
    getSingleMovie,
    updateMovie,
} from "@controllers/movie.controller";

const router = Router();

router
    .route("/")
    .post(
        verifyAuthentication,
        verifyAuthorization(ROLES.ADMIN),
        upload.single("poster"),
        validateRequest(createMovieSchema, "body"),
        createMovie
    );

router
    .route("/")
    .get(
        verifyAuthentication,
        validateRequest(getAllMoviesSchema, "query"),
        getAllMovies
    );

router
    .route("/:id")
    .get(
        verifyAuthentication,
        validateRequest(getSingleMovieSchema, "params"),
        getSingleMovie
    );

router
    .route("/:id")
    .patch(
        verifyAuthentication,
        verifyAuthorization(ROLES.ADMIN),
        upload.single("poster"),
        validateRequest(updateMovieParamsSchema, "params"),
        validateRequest(updateMovieBodySchema, "body"),
        updateMovie
    );

export default router;
