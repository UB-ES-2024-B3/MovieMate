import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';
import axios from 'axios';

const baseURL = 'http://localhost:3000/movie';
let testMovieId: string;

describe('Movies API Tests', () => {

    beforeAll(async () => {
        try {
            const response = await axios.get(`${baseURL}/'Movie 4'`);
            console.log(response.data); // Verifica la estructura de la respuesta
            if (response.data && response.data._id) {
                testMovieId = response.data._id; // Accede al _id si está presente
            } else {
                throw new Error('Movie not found');
            }
        } catch (error) {
            console.error('Error fetching movie:', error);
        }
    });


    test('should fetch movie details successfully', async () => {
        const response = await axios.get(`${baseURL}/Movie 4`);
        expect(response.status).toBe(200);
    });

    test('should return 404 for a non-existent movie', async () => {
        const response = await axios.get(`${baseURL}/nonexistent`).catch(err => err.response);
        expect(response.status).toBe(404);
        expect(response.data.error.message.trim()).toBe("Movie with title < nonexistent > does not exist");

    });

});
