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
        const response = await axios.get(`${baseURL}/${testMovieId}`);
        expect(response.status).toBe(200);
        expect(response.data).toEqual(expect.objectContaining({
            _id: testMovieId,
            title: 'Test Movie',
            description: 'Description of Test Movie',
            genres: 'Action, Adventure',
            directors: 'Test Director',
            actors: 'Actor 1, Actor 2',
            premiereDate: '2024-01-01',
            duration: 120,
            classification: 'PG-13',
            score: 4.5,
        }));
    });

    test('should return 404 for a non-existent movie', async () => {
        const response = await axios.get(`${baseURL}/nonexistent`).catch(err => err.response);
        expect(response.status).toBe(404);
        expect(response.data.error.message).toBe('Movie with title nonexistent does not exist');
    });

    test('should return 400 for malformed movie title', async () => {
        const response = await axios.get(`${baseURL}/?title=`).catch(err => err.response);
        expect(response.status).toBe(400);
        expect(response.data.error.message).toBe('Invalid title format');
    });

});
