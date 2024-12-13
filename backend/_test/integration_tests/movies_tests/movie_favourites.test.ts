import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';
import {createTestMovie, deleteTestMovie, getTestMovie} from '../../test_utils/testUtilsMovies';
import {createTestUser, deleteTestUser, getUserTest} from '../../test_utils/testUtilsUsers';
import axios from 'axios';

const baseURL = 'http://localhost:3000/movie';
const userURL = 'http://localhost:3000/user';
let movieId: string;
let userId: string;
let userName: string;

describe('PUT /movie/favorites', () => {
    beforeAll(async () => {
        const existingMovie = await getTestMovie('TestMovie');
        if (!existingMovie) {
            const movie = await createTestMovie();
            movieId = movie.movie._id;
        } else {
            movieId = existingMovie.movie._id;
        }

        const existingUser = await getUserTest('TestUser');
        if (!existingUser) {
            const user = await createTestUser();
            userId = user.user.id;
            userName = user.user.userName;
        } else {
            userId = existingUser.user.id;
            userName = existingUser.user.userName;
        }
    });

    afterAll(async () => {
        await deleteTestMovie(movieId);
        await deleteTestUser(userName);
    });

    test('should add a movie to favorites', async () => {
        const response = await axios.put(`${baseURL}/favorites`, {
            userName,
            idMovie: movieId,
        });

        expect(response.status).toBe(200);
        expect(response.data).toBe('Movie added to favorites');

        const favorites = await axios.get(`${userURL}/${userName}/favorites`);
        expect(favorites.data).toContainEqual(expect.objectContaining({ id: movieId }));
    });

    test('should remove a movie from favorites', async () => {
        const response = await axios.put(`${baseURL}/favorites`, {
            userName,
            idMovie: movieId,
        });

        expect(response.status).toBe(200);
        expect(response.data).toBe('Movie removed from favorites');

        const favorites = await axios.get(`${userURL}/${userName}/favorites`);
        expect(favorites.data).not.toContainEqual(expect.objectContaining({ id: movieId }));
    });
});
