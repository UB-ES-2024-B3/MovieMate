import 'reflect-metadata';
import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { MovieService } from '../../src/application/services/MovieService';
import { Movie } from '../../src/domain/models/Movie';
import { IMovieRepository } from '../../src/domain/repositories/IMovieRepository';
// @ts-ignore
import createError from 'http-errors';
import {number, string} from "fp-ts";
import {MovieReviewDtoOut, MovieWithReviewsDtoOut} from "../../src/interfaces/Interfaces";
import {undefined} from "io-ts";

// Mock del repositorio
const mockMovieRepository: jest.Mocked<IMovieRepository> = {
    get: jest.fn(),
    getbyId: jest.fn(),
    getAll: jest.fn(),
    getTop10: jest.fn(),
    search: jest.fn(),
    reviewMovie: jest.fn(),
    addFavorites: jest.fn()
};

describe('MovieService Unit Tests', () => {
    let movieService: MovieService;

    beforeEach(() => {
        jest.clearAllMocks(); // Limpia los mocks antes de cada prueba
        movieService = new MovieService(mockMovieRepository); // Inyecta el mock
    });

    describe('getMovie', () => {
        it('should return a movie successfully', async () => {
            const mockMovie = new Movie(
                1,
                'Inception',
                'A mind-bending thriller',
                ['Sci-Fi', 'Thriller'],
                ['Christopher Nolan'],
                ['Leonardo DiCaprio',  'Joseph Gordon-Levitt'],
                new Date('2010-07-16'),
                148,
                'PG-13',
                8.8,
                null // Imagen omitida
            );

            const movieWithReview: MovieWithReviewsDtoOut={
                movie: mockMovie, reviews: []
            }

            mockMovieRepository.get.mockResolvedValue(movieWithReview);

            const result = await movieService.getMovie('Inception');

            // Verifica que los datos devueltos sean correctos
            expect(result.movie.title).toBe('Inception');
            expect(result.movie.description).toBe('A mind-bending thriller');
            expect(result.movie.genres).toEqual(['Sci-Fi', 'Thriller']);
            expect(result.movie.directors).toEqual(['Christopher Nolan']);
            expect(result.movie.score).toBe(8.8);

            // Verifica que el repositorio sea llamado correctamente
            expect(mockMovieRepository.get).toHaveBeenCalledWith('Inception');
            expect(mockMovieRepository.get).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if movie does not exist', async () => {
            const title = 'NonExistentMovie';

            mockMovieRepository.get.mockRejectedValue(createError(404, `Movie with title < ${title} > does not exist`));

            await expect(movieService.getMovie(title)).rejects.toThrow(
                `Movie with title < ${title} > does not exist`
            );

            expect(mockMovieRepository.get).toHaveBeenCalledWith(title);
            expect(mockMovieRepository.get).toHaveBeenCalledTimes(1);
        });
    });

    describe('getAllMovies', () => {
        it('should return all movies successfully', async () => {
            const mockMovies = [
                new Movie(
                    1,
                    'Inception',
                    'A mind-bending thriller',
                    ['Sci-Fi', 'Thriller'],
                    ['Christopher Nolan'],
                    ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
                    new Date('2010-07-16'),
                    148,
                    'PG-13',
                    8.8,
                    null
                ),
                new Movie(
                    2,
                    'The Dark Knight',
                    'A gritty superhero movie',
                    ['Action', 'Crime'],
                    ['Christopher Nolan'],
                    ['Christian Bale', 'Heath Ledger'],
                    new Date('2008-07-18'),
                    152,
                    'PG-13',
                    9.0,
                    null
                ),
            ];

            mockMovieRepository.getAll.mockResolvedValue(mockMovies);

            const result = await movieService.getAllMovies();

            // Verifica que se devuelvan las películas correctas
            expect(result).toHaveLength(2);
            expect(result[0].title).toBe('Inception');
            expect(result[1].title).toBe('The Dark Knight');

            // Verifica que el repositorio sea llamado correctamente
            expect(mockMovieRepository.getAll).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if no movies are found', async () => {
            mockMovieRepository.getAll.mockRejectedValue(createError(404, 'No movies found'));

            await expect(movieService.getAllMovies()).rejects.toThrow('No movies found');

            expect(mockMovieRepository.getAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('getTop10', () => {
        it('should return the top 10 movies successfully', async () => {
            const mockTop10Movies = Array.from({ length: 10 }, (_, i) => {
                return new Movie(
                    i + 1,
                    `Movie ${i + 1}`,
                    `Description for movie ${i + 1}`,
                    ['Genre1', 'Genre2'],
                    ['Director1'],
                    ['Actor1', 'Actor2'],
                    new Date(`2023-01-${i + 1}`),
                    120,
                    'PG',
                    10 - i * 0.1, // Puntuaciones decrecientes
                    null
                );
            });

            mockMovieRepository.getTop10.mockResolvedValue(mockTop10Movies);

            const result = await movieService.getTop10();

            // Verifica que se devuelvan exactamente 10 películas
            expect(result).toHaveLength(10);
            expect(result[0].title).toBe('Movie 1'); // Primera película
            expect(result[9].title).toBe('Movie 10'); // Última película

            // Verifica que el repositorio sea llamado correctamente
            expect(mockMovieRepository.getTop10).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if no top 10 movies are found', async () => {
            mockMovieRepository.getTop10.mockRejectedValue(createError(404, 'No top 10 movies found'));

            await expect(movieService.getTop10()).rejects.toThrow('No top 10 movies found');

            expect(mockMovieRepository.getTop10).toHaveBeenCalledTimes(1);
        });
    });
});
