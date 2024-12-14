import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';
import {createTestMovie, deleteTestMovie, getTestMovie} from '../../test_utils/testUtilsMovies';

import axios from 'axios';
import {createTestUser, deleteTestUser, getUserTest} from "../../test_utils/testUtilsUsers";

const baseURL = 'http://localhost:3000/movie';
let movieId: string;
let userId: string;
let movieTitle: string;
let userName: string;

describe('PUT /movie/score', () => {
    beforeAll(async () => {
        const existingMovie = await getTestMovie('TestMovie');
        if (!existingMovie) {
            const movie = await createTestMovie();
            movieId = movie.movie._id;
            movieTitle = movie.movie._title;
        } else {
            movieId = existingMovie.movie._id;
            movieTitle = existingMovie.movie._title;
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

    test('should update the score of an existing movie', async () => {
        const newScore = 4.8;
        const response = await axios.put(`${baseURL}/score`, {
            userName,
            idMovie: movieId,
            puntuacion: newScore,
        });

        expect(response.status).toBe(200);
        expect(response.data.score).toBe(newScore);

        const updatedMovie = await axios.get(`${baseURL}/${movieTitle}`);
        expect(updatedMovie.data.movie._score).toBe(newScore);
    });

    test('should return error for non-existent movie', async () => {
        const response = await axios
            .put(`${baseURL}/score`, { userName, idMovie: 876787686, puntuacion: 4.8 })
            .catch((err) => err.response);

        expect(response.status).toBe(404);
        expect(response.data.error.message).toBe('Movie does not exist');
    });
});
