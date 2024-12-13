import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';
import axios from 'axios';
import {createTestMovie, deleteTestMovie, getTestMovie} from "../../test_utils/testUtilsMovies";
import {deleteTestUser} from "../../test_utils/testUtilsUsers";

const baseURL = 'http://localhost:3000/movie';
let testMovieId: string;

describe('Movies API Tests', () => {
    beforeAll(async () => {
        const existingMovie = await getTestMovie('TestMovie');
        if (!existingMovie) {
            const movie = await createTestMovie();
            testMovieId = movie.movie._id;
        } else {
            testMovieId = existingMovie.movie._id;
        }
    });

    afterAll(async () => {
        await deleteTestMovie(testMovieId);
    });


    test('should fetch movie details successfully', async () => {
        const response = await axios.get(`${baseURL}/TestMovie`);
        expect(response.status).toBe(200);
    });

    test('should return 404 for a non-existent movie', async () => {
        const response = await axios.get(`${baseURL}/nonexistent`).catch(err => err.response);
        expect(response.status).toBe(404);
        expect(response.data.error.message.trim()).toBe("Movie with title < nonexistent > does not exist");

    });

});
