import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';
import { createTestMovie, deleteTestMovie } from '../../test_utils/testUtilsMovies';

import axios from 'axios';

const baseURL = 'http://localhost:3000/movie';
let movieId: string;

describe('PUT /movie/score', () => {
    beforeAll(async () => {
        const movie = await createTestMovie({ title: 'Test Movie', score: 3.5 });
        movieId = movie.id;
    });

    afterAll(async () => {
        await deleteTestMovie(movieId);
    });

    test('should update the score of an existing movie', async () => {
        const newScore = 4.8;
        const response = await axios.put(`${baseURL}/score`, {
            movieId,
            score: newScore,
        });

        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Score updated successfully');

        const updatedMovie = await axios.get(`${baseURL}/${movieId}`);
        expect(updatedMovie.data.score).toBe(newScore);
    });

    test('should return error for non-existent movie', async () => {
        const response = await axios
            .put(`${baseURL}/score`, { movieId: 'nonexistent-id', score: 4.8 })
            .catch((err) => err.response);

        expect(response.status).toBe(404);
        expect(response.data.message).toBe('Movie not found');
    });
});
