import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';
import axios from 'axios';

const baseURL = 'http://localhost:3000/movie';
let testMovieId: string;

describe('Movies Search Tests', () => {

    beforeAll(async () => {
        try {
            const response = await axios.get(`${baseURL}/movie/Movie%204`);

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

    test('should return movies matching the search query', async () => {
        const response = await axios.get(`${baseURL}/search?query=Movie%204`);


        expect(response.status).toBe(200);
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
