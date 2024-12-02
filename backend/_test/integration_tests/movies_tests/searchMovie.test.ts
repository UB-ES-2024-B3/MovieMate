import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';
import axios from 'axios';

const baseURL = 'http://localhost:3000/movie';
let testMovieId: string;

describe('Movies Search Tests', () => {
    beforeAll(async () => {
        // Inserta una película de prueba para la búsqueda
        const response = await axios.post(`${baseURL}`, {
            title: 'Searchable Movie',
            description: 'A movie that can be found via search',
            genres: 'Drama',
            directors: 'Search Director',
            actors: 'Actor A, Actor B',
            premiereDate: '2024-01-01',
            duration: 100,
            classification: 'PG-13',
            score: 4.0,
        });
        testMovieId = response.data._id;
    });

    afterAll(async () => {
        // Limpia la película de prueba después de los tests
        await axios.delete(`${baseURL}/${testMovieId}`);
    });

    test('should return movies matching the search query', async () => {
        const response = await axios.get(`${baseURL}/search?name=Searchable`);
        expect(response.status).toBe(200);
        expect(response.data).toBeInstanceOf(Array);
        expect(response.data.length).toBeGreaterThan(0);

        const movie = response.data.find((m: any) => m._id === testMovieId);
        expect(movie).toBeDefined();
        expect(movie._title).toBe('Searchable Movie');
    });

    test('should return empty array if no movies match the search query', async () => {
        const response = await axios.get(`${baseURL}/search?name=NonExistent`);
        expect(response.status).toBe(200);
        expect(response.data).toBeInstanceOf(Array);
        expect(response.data.length).toBe(0);
    });

    test('should return 400 if the search query is missing or malformed', async () => {
        const response = await axios.get(`${baseURL}/search?name=`).catch(err => err.response);
        expect(response.status).toBe(400);
        expect(response.data.error.message).toBe('Invalid search query');
    });
});
