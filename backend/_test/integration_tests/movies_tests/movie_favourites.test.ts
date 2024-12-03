import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';
import { createTestMovie, deleteTestMovie } from '../../test_utils/testUtilsMovies';
import { createTestUser, deleteTestUser } from '../../test_utils/testUtilsUsers';
import axios from 'axios';

const baseURL = 'http://localhost:3000/movie';
let movieId: string;
let userId: string;

describe('PUT /movie/favorites', () => {
    beforeAll(async () => {
        const movie = await createTestMovie({ title: 'Favorite Movie' });
        const user = await createTestUser({ username: 'testUser' });
        movieId = movie.id;
        userId = user.id;
    });

    afterAll(async () => {
        await deleteTestMovie(movieId);
        await deleteTestUser(userId);
    });

    test('should add a movie to favorites', async () => {
        const response = await axios.put(`${baseURL}/favorites`, {
            userId,
            movieId,
        });

        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Movie added to favorites');

        const favorites = await axios.get(`${baseURL}/favorites/${userId}`);
        expect(favorites.data).toContainEqual(expect.objectContaining({ id: movieId }));
    });

    test('should remove a movie from favorites', async () => {
        await axios.put(`${baseURL}/favorites`, { userId, movieId }); // Agregar primero

        const response = await axios.delete(`${baseURL}/favorites`, {
            data: { userId, movieId }, // DELETE con body
        });

        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Movie removed from favorites');

        const favorites = await axios.get(`${baseURL}/favorites/${userId}`);
        expect(favorites.data).not.toContainEqual(expect.objectContaining({ id: movieId }));
    });
});
