import {NextFunction, Request, Response} from "express";
import {PostService} from "../../application/services/PostService";
import {autoInjectable, container} from "tsyringe";
import {PostRepository} from "../repositories/PostRepository";
import {DtoInValidation} from "../../interfaces/DtoInValidation";
import {isRight} from 'fp-ts/lib/Either';
import createError from "http-errors";
import {PostDtoIn} from "../../interfaces/Interfaces";


const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({storage});

container.register(
    "IPostRepository", {
        useClass: PostRepository
    });

@autoInjectable()
export class PostController {
    private static postService: PostService = container.resolve(PostService);

    static async createPost(req: Request, res: Response, next: NextFunction) {
        try {
            const postData = req.body;

            // Validar los datos con la clase DtoIn
            const validationResult = DtoInValidation.validatePostDto(postData);

            if (!isRight(validationResult)) {
                // Si la validación falla, devolver un error
                throw createError(400, "Invalid post data!");
            }

            // Si la validación es correcta, accedemos a los datos validados
            const validatedData = validationResult.right;


            // Asignar el Buffer de la imagen si existe y es válida
            let image;
            if (req.file) {
                image = req.file.buffer;
            }


            const post: PostDtoIn = {
                title: validatedData.title,
                post: validatedData.post,
                image: image || null,
                author: validatedData.author,
            }

            const result = await this.postService.createPost(post);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }
}