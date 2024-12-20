import {NextFunction, Request, Response} from "express";
import {PostService} from "../../application/services/PostService";
import {autoInjectable, container} from "tsyringe";
import {PostRepository} from "../repositories/PostRepository";
import {DtoInValidation} from "../../interfaces/DtoInValidation";
import {isRight} from 'fp-ts/lib/Either';
import createError from "http-errors";
import {PostDtoIn, UpdatePostData} from "../../interfaces/Interfaces";
import { v4 as uuidv4 } from 'uuid';


const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({storage});

const uploadedImages: Record<string, Buffer> = {};

container.register(
    "IPostRepository", {
        useClass: PostRepository
    });

@autoInjectable()
export class PostController {
    private static postService: PostService = container.resolve(PostService);

    static imageToBase64(image: Buffer | null): string | null {
        return image ? `data:image/jpeg;base64,${image.toString('base64')}` : null;
    }

    static async uploadImage(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.file) {
                throw createError(400, "No image file provided");
            }

            // Validar el tipo MIME para asegurarse de que es una imagen válida
            const validMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validMimeTypes.includes(req.file.mimetype)) {
                throw createError(400, "Invalid image format. Only JPEG, PNG and JPG, are allowed.");
            }

            // Asignar el Buffer de la imagen si existe y es válida
            const image = req.file.buffer;
            const imageId = uuidv4();

            uploadedImages[imageId] = image;

            res.status(200).json({imageId: imageId, image: this.imageToBase64(image)});
        } catch (e) {
            next(e);
        }
    }

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


           const imageId = req.body.imageId;
           let image;
           if (imageId) {
               image = uploadedImages[imageId];
               if (!image) {
                   throw createError(400, "Invalid image data!");
               }
           }

           delete uploadedImages[imageId];

            const post: PostDtoIn = {
                title: validatedData.title,
                post: validatedData.post,
                image: image || null,
                author: validatedData.author,
                like: 0,
                disLike: 0
            }

            const result = await this.postService.createPost(post);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }


    static async getPost(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const result = await this.postService.getPost(id);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async getAllPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const userName = req.params.userName;

            if(!userName){
                throw createError(400, `Parameters are incorrect`);
            }

            const result = await this.postService.getAllPosts(userName);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async updatePost(req: Request, res: Response, next: NextFunction) {
        try {
            const postId = parseInt(req.params.postId);
            const postData = req.body;

            const validationResult = DtoInValidation.validateUpdatePostDto(postData);

            if (!isRight(validationResult)) {
                // Si la validación falla, devolver un error
                throw createError(400, "Invalid post data!");
            }

            const validatedData = validationResult.right;

            const postValidated: UpdatePostData = {
                title: validatedData.title,
                post: validatedData.post,
            };

            const result = await this.postService.updatePost(postId, postValidated);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async deletePost(req: Request, res: Response, next: NextFunction) {
        try {
            const postId = parseInt(req.params.postId);
            const result = await this.postService.deletePost(postId);
            return res.status(200).json(result);
        } catch (e) {
            next(e);
        }
    }

    static async addLike(req: Request, res:Response, next: NextFunction) {
        try {
            const userName = req.body.userName;
            const postId = parseInt(req.body.postId);


            if(!userName || isNaN(postId)){
                throw createError(400, `Parameters are incorrect`);
            }

            const result = await this.postService.addLike(userName, postId);
            return res.status(200).json(result);
        }catch (error){
            next(error);
        }
    }

    static async addDislike(req: Request, res: Response, next: NextFunction){
        try {
            const userName = req.body.userName;
            const postId = parseInt(req.body.postId);

            if(!userName || isNaN(postId)){
                throw createError(400, `Parameters are incorrect`);
            }

            const result = await this.postService.addDislike(userName, postId);
            return res.status(200).json(result);
        }catch (error){
            next(error);
        }
    }

}