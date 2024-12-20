import {ILike, Repository} from "typeorm";
import {PostgreTypeOrmDataSource} from "../../main/config/postgreDatabaseTypeOrm";
import {IUserRepository} from "../../domain/repositories/IUserRepository";
import {UserEntity} from "../entities/UserEntity";
import {User} from "../../domain/models/User";
import {createHash} from 'crypto';
import createError from 'http-errors';
import {
    MoviesInFavsDtoOut,
    MovieDtoOut,
    ReviewDtoOut,
    UpdateUserData,
    UserDtoOut,
    UsersList,
    UserWithReviewsDtoOut, PostDtoOut, UsersInfoDtoOut, AuthorDtoOut
} from "../../interfaces/Interfaces";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import {EnviromentUtils} from "../../../context/env";
import {ReviewEntity} from "../entities/ReviewEntity";
import {PostEntity} from "../entities/PostEntity";

export class UserRepository implements IUserRepository {
    private readonly repository: Repository<UserEntity>;
    private readonly reviewRepo: Repository<ReviewEntity>;
    private readonly postRepo: Repository<PostEntity>;

    constructor() {
        this.repository = PostgreTypeOrmDataSource.getRepository(UserEntity);
        this.reviewRepo = PostgreTypeOrmDataSource.getRepository(ReviewEntity);
        this.postRepo = PostgreTypeOrmDataSource.getRepository(PostEntity);
    }

    async getByEmail(email: string): Promise<UserEntity | null> {
        return await this.repository.findOne({where: {email}});
    }

    async getByUsername(userName: string): Promise<UserEntity | null> {
        return await this.repository.findOne({where: {userName}});
    }

    async register(user: User): Promise<string> {
        // Check if the username is unique
        const existingUserName = await this.repository.findOneBy({userName: user.name});
        if (existingUserName) {
            throw createError(409, "UserName is already in use.");
        }

        // Check if the email is unique
        const existingEmail = await this.getByEmail(user.email);
        if (existingEmail) {
            throw createError(409, "Email is already registered.");
        }

        // Hash the password
        user.password = createHash('sha256').update(user.password).digest('hex');

        // Save user using the repository
        await this.repository.save(this.userToUserEntity(user));

        // Return a success message or the new user's ID
        return "Registration successful";
    }

    async update(userId: number, userData: UpdateUserData): Promise<string> {
        // Fetch the existing user
        const userFromBD = await this.repository.findOneBy({id: userId});
        if (!userFromBD) {
            throw createError(404, `User with Id < ${userId} > does not exist`);
        }
        if (userData.email) {// Check if the email is unique
            const existingEmail = await this.repository.findOneBy({email: userData.email});
            if (existingEmail && existingEmail.id != userId) {
                throw createError(409, "Email is already registered.");
            }
        }
        if (userData.userName) {
            // Check if the username is unique
            const existingUserName = await this.repository.findOneBy({userName: userData.userName});
            if (existingUserName && existingUserName.id != userId) {
                throw createError(409, "UserName is already in use.");
            }
        }
        if (userData.password) {
            // Hash the password
            userData.password = createHash('sha256').update(userData.password).digest('hex');
        }
        userFromBD.userName = userData.userName || userFromBD.userName
        userFromBD.description = userData.description || userFromBD.description
        userFromBD.gender = userData.gender || userFromBD.gender
        userFromBD.password = userData.password || userFromBD.password
        userFromBD.email = userData.email || userFromBD.email

        // Save the updated user
        await this.repository.save(userFromBD);

        // Update token
        const token = jwt.sign({userName: userFromBD.userName}, EnviromentUtils.getEnvVar('SECRET_KEY'));

        return token;

    }

    async login(userName: string, password: string): Promise<string> {
        const existingUser = await this.getByUsername(userName);

        const hashedPassword = createHash('sha256').update(password).digest('hex');

        if (!existingUser || existingUser.password != hashedPassword) {
            throw createError(401, "Username or password are incorrect");
        }

        const token = jwt.sign({userName: existingUser.userName}, EnviromentUtils.getEnvVar('SECRET_KEY'));

        return token;
    }

    async delete(userName: string): Promise<string> {
        const userFromDB = await this.repository.findOneBy({userName: userName});
        if (!userFromDB) {
            throw createError(404, `User with username < ${userName} > does not exist`);
        }
        await this.repository.remove(userFromDB)
        return `user with username < ${userName} > deleted successfully`;
    }

    async get(userName: string, auth_token: string): Promise<UsersInfoDtoOut> {
        const userFromDB = await this.repository.findOneBy({userName: userName});
        if (!userFromDB) {
            throw createError(404, `User with username < ${userName} > does not exist`);
        }

        const reviewsFromDB = await this.reviewRepo.find({
            where: {author: {id: userFromDB.id}},
            order: {createdAt: 'DESC'},
            relations: ['author', 'movie'],
        });

        const reviews: ReviewDtoOut[] = reviewsFromDB.map((reviewFromDB: ReviewEntity) => {
            const movie: MovieDtoOut = {
                id: reviewFromDB.movie.id,
                title: reviewFromDB.movie.title,
                image: reviewFromDB.movie.image ? this.imageToBase64(reviewFromDB.movie.image) : null
            };
            return {
                id: reviewFromDB.id,
                title: reviewFromDB.title,
                content: reviewFromDB.review,
                movie: movie,
                like: reviewFromDB.like,
                disLike: reviewFromDB.disLike,
                totalComments: reviewFromDB.totalComments
            };
        });

        const postsFromDB = await this.postRepo.find({
            where: {author: {id: userFromDB.id}},
            order: {createdAt: 'DESC'},
            relations: ['author'],
        });

        const posts: PostDtoOut[] = postsFromDB.map((postFromDB: PostEntity) => {
            return {
                id: postFromDB.id,
                title: postFromDB.title,
                createdAt: postFromDB.createdAt,
                post: postFromDB.post,
                image: postFromDB.image ? this.imageToBase64(postFromDB.image) : null,
                like: postFromDB.like,
                disLike: postFromDB.disLike,
                totalComments: postFromDB.totalComments,
            }
        })

        const user: UserDtoOut = {
            id: userFromDB.id,
            userName: userFromDB.userName,
            email: userFromDB.email,
            birthDate: userFromDB.birthDate, // Convertir a cadena (YYYY-MM-DD)
            password: userFromDB.password,
            gender: userFromDB.gender,
            description: userFromDB.description,
            isAdmin: userFromDB.isAdmin,
            image: this.imageToBase64(userFromDB.image), // Convertir la imagen a base64 o null
            totalFollowers: userFromDB.totalFollowers,
            totalFollowing: userFromDB.totalFollowing,
        };

        const decoded = jwt.decode(auth_token) as jwt.JwtPayload;

        let isOwnProfile = false;

        if (decoded != null && decoded.userName == user.userName) {
            isOwnProfile = true;
        }
        const result: UsersInfoDtoOut = {
            user: user,
            isOwnProfile: isOwnProfile,
            reviews: reviews,
            posts: posts
        };

        return result;
    }

    async sendRecoveryEmail(email: string): Promise<string> {
        const userFromDB = await this.repository.findOneBy({email: email});
        if (!userFromDB) {
            throw createError(404, `User with email < ${email} > does not exist`);
        }

        const token = jwt.sign({email: userFromDB.email}, EnviromentUtils.getEnvVar('SECRET_KEY'), {expiresIn: '1h'});

        const transporter = nodemailer.createTransport({
            host: 'smtp.zoho.eu',
            port: 587,
            secure: false,
            auth: {
                user: EnviromentUtils.getEnvVar('MAIL_USER'),
                pass: EnviromentUtils.getEnvVar('MAIL_PASS'),
            }
        });

        const baseUrl = "http://localhost:8000/recovery/"
        const url = `${baseUrl}${token}`;

        await transporter.sendMail({
            from: EnviromentUtils.getEnvVar('MAIL_USER'),
            to: email,
            subject: 'Password Recovery',
            html: `<p> Click <a href="${url}">here</a> to reset your password.</p>`
        });

        return url;
    }

    async recoverPassword(password: string, token: string): Promise<string> {
        try {
            const decoded = jwt.verify(token, EnviromentUtils.getEnvVar('SECRET_KEY')) as jwt.JwtPayload;

            const userFromDB = await this.repository.findOneBy({email: decoded.email});

            const newPassword = createHash('sha256').update(password).digest('hex');

            userFromDB.password = newPassword;

            await this.repository.save(userFromDB);

        } catch (e) {
            throw createError(404, `The token is invalid or has expired`);
        }

        return 'Password changed successfully';
    }

    async updateUserImage(image: Buffer, userId: number): Promise<string> {
        const userFromBD = await this.repository.findOneBy({id: userId});
        if (!userFromBD) {
            throw createError(404, `User with Id < ${userId} > does not exist`);
        }
        // Verificar que es un Buffer antes de asignar
        if (image && Buffer.isBuffer(image)) {
            userFromBD.image = image;  // Asigna el buffer de la imagen si es válido
        }
        // Save the updated user
        await this.repository.save(userFromBD);
        return this.imageToBase64(userFromBD.image);
    }

    imageToBase64(image: Buffer | null): string | null {
        return image ? `data:image/jpeg;base64,${image.toString('base64')}` : null;
    }

    async search(query: string): Promise<UsersList[]> {
        const users = await this.repository.find({
            where: [{userName: ILike(`%${query}%`)}], order: {userName: 'ASC'},
        });

        if (users.length === 0) {
            throw createError(404, "Users not found");
        }

        return users.map(user => ({
            userName: user.userName,
            description: user.description || "No description available",
            image: this.imageToBase64(user.image) || "No image available",
        }));

    }

    userToUserEntity(user: User): UserEntity {
        const userEntity = new UserEntity();
        userEntity.userName = user.userName;
        userEntity.email = user.email;
        userEntity.password = user.password;
        userEntity.favs = [];  // Al inicio siempre estara vacio
        userEntity.gender = user.gender;
        userEntity.birthDate = user.birthDate;
        userEntity.description = user.description;
        userEntity.isAdmin = user.isAdmin;

        return userEntity;
    }

    async getAllFavorites(userName: string): Promise<MoviesInFavsDtoOut[]> {
        const user = await this.repository.findOne({
            where: { userName: userName },
            relations: ["favs"],
        });

        if (!user) {
            throw createError(404, `User does not exist`);
        }

        const favoritesList: MoviesInFavsDtoOut[] = user.favs.map(movie => ({
            id: movie.id,
            title: movie.title,
            image: this.imageToBase64(movie.image) || "No image available",
        }));

        return favoritesList
    }

    async follow(userName1: string, userName2: string): Promise<string> {
        const user1 = await this.repository.findOne({where: { userName: userName1 }, relations: ["following"],});
        if(!user1){
            throw createError(404, `User ${userName1} does not exist`);
        }

        const user2 = await this.repository.findOne({where: {userName: userName2}});
        if(!user2){
            throw createError(404, `User ${userName1} does not exist`);
        }

        if(user1.id == user2.id){
            throw createError(404, `You can't follow yourself`);
        }


        const isFollowing = user1.following?.some(followingUser => followingUser.id === user2.id);
        if(isFollowing){
            user1.following = user1.following?.filter(followingUser => followingUser.id !== user2.id) || null;
            user2.followers = user2.followers?.filter(followerUser => followerUser.id !== user1.id) || null;

            user1.totalFollowing = Math.max(0, user1.totalFollowing-1);
            user2.totalFollowers = Math.max(0, user2.totalFollowers-1);

            await this.repository.save(user1);
            await this.repository.save(user2);

            return `${userName1} has unfollowed ${userName2}`;
        }else{
            user1.following = user1.following ? [...user1.following, user2] : [user2];
            user2.followers = user2.followers ? [...user2.followers, user1] : [user1];

            user1.totalFollowing += 1;
            user2.totalFollowers += 1;

            await this.repository.save(user1);
            await this.repository.save(user2);

            return `${userName1} has followed ${userName2}`;
        }


    }
    async getFollowers(userName: string): Promise<AuthorDtoOut[]> {
        const user = await this.repository.findOne({
            where: { userName: userName }, relations: ['followers'],
        });

        if (!user) {
            throw createError(404, `User ${userName} does not exist`);
        }

        const followers: AuthorDtoOut[] = user.followers.map(follower => ({
            id: follower.id,
            userName: follower.userName,
            image: follower.image ? this.imageToBase64(follower.image) : null
        }));

        return followers;
    }

    async getFollowing(userName: string): Promise<AuthorDtoOut[]> {
        const user = await this.repository.findOne({where: {userName: userName}, relations:['following']});

        if(!user){
            throw createError(404, `User ${userName} does not exist`);
        }

        const following: AuthorDtoOut[] = user.following.map(following => ({
            id: following.id,
            userName: following.userName,
            image: following.image ? this.imageToBase64(following.image) : null
        }));

        return following;
    }


}