import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';
import axios from 'axios';
import {createTestMovie, deleteTestMovie, getTestMovie} from "../../test_utils/testUtilsMovies";
import {createTestUser, deleteTestUser, getUserTest} from "../../test_utils/testUtilsUsers";
let movieId: string;
let movieTitle: string;

describe('Movies API Tests', () => {
    const baseURL = 'http://localhost:3000/movie';

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
    });

    afterAll(async () => {
        await deleteTestMovie(movieId);
    });

    test('should fetch top 10 movies', async () => {
        const response = await axios.get('http://localhost:3000/movie/top10');
        expect(response.status).toBe(200);
        const existingMovie = await getTestMovie('TestMovie');
        expect(response.data[0]).toStrictEqual(existingMovie.movie)
    });
});