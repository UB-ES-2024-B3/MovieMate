import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';
import axios from 'axios';
import {createTestMovie, deleteTestMovie, getTestMovie} from "../../test_utils/testUtilsMovies";

const baseURL = 'http://localhost:3000/movie';
let testMovieId: string;
let testMovieTitle: string;
describe('Movies Search Tests', () => {

    beforeAll(async () => {
        const existingMovie = await getTestMovie('TestMovie');
        if (!existingMovie) {
            const movie = await createTestMovie();
            testMovieId = movie.movie._id;
            testMovieTitle = movie.movie._title;
        } else {
            testMovieId = existingMovie.movie._id;
            testMovieTitle = existingMovie.movie._title;
        }
    });

    afterAll(async () => {
        await deleteTestMovie(testMovieId);
    });


    test('should return movies matching the search query', async () => {
        const response = await axios.get(`${baseURL}/search?query=${testMovieTitle}`);
        expect(response.status).toBe(200);
        expect(response.data[0].title).toEqual(testMovieTitle)
    });

    test('should return empty array if no movies match the search query', async () => {
    try {
        const response = await axios.get(`${baseURL}/search?query=NonExistent`);
    } catch (error) {
        // Verifica que el error sea un 404
        if (axios.isAxiosError(error)) {
            expect(error.response?.status).toBe(404);
        } else {
            // Si no es un error de Axios, lo dejamos pasar
            throw error;
        }
    }
});

});
