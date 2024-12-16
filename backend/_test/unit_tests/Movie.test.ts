import 'reflect-metadata';
import {beforeEach, describe, expect, jest} from '@jest/globals';
import {MovieService} from '../../src/application/services/MovieService';
import {Movie} from '../../src/domain/models/Movie';
import {IMovieRepository} from '../../src/domain/repositories/IMovieRepository';
// @ts-ignore
import createError from 'http-errors';
import {Filters, MovieWithReviewsDtoOut} from "../../src/interfaces/Interfaces";
import {undefined} from "io-ts";

// Mock del repositorio
const mockMovieRepository: jest.Mocked<IMovieRepository> = {
    createMovie: jest.fn(),
    deleteMovie: jest.fn(),
    search: jest.fn(),
    getAll: jest.fn(),
    getbyId: jest.fn(),
    get: jest.fn(),
    reviewMovie: jest.fn(),
    addFavorites: jest.fn(),
    getTop10: jest.fn(),
    getMoviesFiltered: jest.fn(),
    getDurationRange: jest.fn(),
    getScoreRange: jest.fn(),
    getTotalReviewsRange: jest.fn(),
    getUniqueActors: jest.fn(),
    getUniqueClassifications: jest.fn(),
    getUniqueDirectors: jest.fn(),
    getUniqueGenres: jest.fn(),
    getUniquePremiereYears: jest.fn(),
    getTop10Reviewed: jest.fn()
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
                ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
                new Date('2010-07-16'),
                148,
                'PG-13',
                8.8,
                null // Imagen omitida
            );

            const movieWithReview: MovieWithReviewsDtoOut = {
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
            const mockTop10Movies = Array.from({length: 10}, (_, i) => {
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

    describe('getMoviebyId', () => {
        it('should return a movie successfully by ID', async () => {
            const mockMovie = new Movie(
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
            );

            mockMovieRepository.getbyId.mockResolvedValue(mockMovie);

            const result = await movieService.getMoviebyId(1);

            expect(result.title).toBe('Inception');
            expect(result.directors).toEqual(['Christopher Nolan']);
            expect(mockMovieRepository.getbyId).toHaveBeenCalledWith(1);
            expect(mockMovieRepository.getbyId).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if movie by ID is not found', async () => {
            const id = 999;

            mockMovieRepository.getbyId.mockRejectedValue(createError(404, `Movie with id < ${id} > does not exist`));

            await expect(movieService.getMoviebyId(id)).rejects.toThrow(`Movie with id < ${id} > does not exist`);
            expect(mockMovieRepository.getbyId).toHaveBeenCalledWith(id);
            expect(mockMovieRepository.getbyId).toHaveBeenCalledTimes(1);
        });
    });

    describe('searchMovies', () => {
        it('should return movies matching the search query', async () => {
            const mockMovies = [
                {title: 'Inception', premiereDate: new Date(), genres: ['Sci-Fi'], directors: ['Nolan'], image: null},
                {title: 'Interstellar', premiereDate: new Date(), genres: ['Sci-Fi'], directors: ['Nolan'], image: null}
            ];

            mockMovieRepository.search.mockResolvedValue(mockMovies);

            const result = await movieService.searchMovies('Inception');

            expect(result).toHaveLength(2);
            expect(result[0].title).toBe('Inception');
            expect(mockMovieRepository.search).toHaveBeenCalledWith('Inception');
            expect(mockMovieRepository.search).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if no movies match the search query', async () => {
            mockMovieRepository.search.mockRejectedValue(createError(404, 'Movies not found'));

            await expect(movieService.searchMovies('Unknown')).rejects.toThrow('Movies not found');
            expect(mockMovieRepository.search).toHaveBeenCalledWith('Unknown');
            expect(mockMovieRepository.search).toHaveBeenCalledTimes(1);
        });
    });

    describe('reviewMovie', () => {
        it('should successfully add or update a review for a movie', async () => {
            const mockReview = {totalReview: 10, score: 8.5};
            mockMovieRepository.reviewMovie.mockResolvedValue(mockReview);

            const result = await movieService.reviewMovie('user1', 1, 9);

            expect(result.score).toBe(8.5);
            expect(mockMovieRepository.reviewMovie).toHaveBeenCalledWith('user1', 1, 9);
            expect(mockMovieRepository.reviewMovie).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if the user or movie does not exist', async () => {
            mockMovieRepository.reviewMovie.mockRejectedValue(createError(404, 'User or movie not found'));

            await expect(movieService.reviewMovie('user1', 999, 9)).rejects.toThrow('User or movie not found');
            expect(mockMovieRepository.reviewMovie).toHaveBeenCalledWith('user1', 999, 9);
        });
    });

    describe('addFavorites', () => {
        it('should successfully add a movie to favorites', async () => {
            mockMovieRepository.addFavorites.mockResolvedValue('Movie added to favorites');

            const result = await movieService.addFavorites('user1', 1);

            expect(result).toBe('Movie added to favorites');
            expect(mockMovieRepository.addFavorites).toHaveBeenCalledWith('user1', 1);
            expect(mockMovieRepository.addFavorites).toHaveBeenCalledTimes(1);
        });

        it('should successfully remove a movie from favorites', async () => {
            mockMovieRepository.addFavorites.mockResolvedValue('Movie removed from favorites');

            const result = await movieService.addFavorites('user1', 1);

            expect(result).toBe('Movie removed from favorites');
            expect(mockMovieRepository.addFavorites).toHaveBeenCalledWith('user1', 1);
            expect(mockMovieRepository.addFavorites).toHaveBeenCalledTimes(1);
        });
    });

    describe('getMoviesFiltered', () => {
        it('should return filtered movies successfully', async () => {
            const filters = {
                genres: 'Sci-Fi',
                directors: 'Christopher Nolan',
                actors: 'Leonardo DiCaprio',
                premiereYear: 2010,
                duration: 120,
                classification: 'PG-13',
                score: 8.0,
                totalReviews: 5
            };

            const mockFilteredMovies = {
                movies: [
                    {id: 1, title: 'Inception', image: null},
                    {id: 2, title: 'Interstellar', image: null}
                ],
                paginationInfo: {moviesFound: 2, actualPage: 1, totalPages: 1}
            };

            mockMovieRepository.getMoviesFiltered.mockResolvedValue(mockFilteredMovies);

            const result = await movieService.getMoviesFiltered(1, 10, filters);

            expect(result.movies).toHaveLength(2);
            expect(result.paginationInfo.moviesFound).toBe(2);
            expect(mockMovieRepository.getMoviesFiltered).toHaveBeenCalledWith(1, 10, filters);
            expect(mockMovieRepository.getMoviesFiltered).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if no movies match the filters', async () => {
            let filters: Filters = {
                genres: "Unknown"
            };
            mockMovieRepository.getMoviesFiltered.mockRejectedValue(createError(404, 'Any movie matches this filters'));

            await expect(movieService.getMoviesFiltered(1, 10, filters)).rejects.toThrow(
                'Any movie matches this filters'
            );
            expect(mockMovieRepository.getMoviesFiltered).toHaveBeenCalledWith(1, 10, filters);
        });
    });

    describe('getUniqueActors', () => {
        it('should return all unique actors', async () => {
            const mockActors = ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Christian Bale'];

            mockMovieRepository.getUniqueActors.mockResolvedValue(mockActors);

            const result = await movieService.getAllActors();

            expect(result).toEqual(mockActors);
            expect(mockMovieRepository.getUniqueActors).toHaveBeenCalledTimes(1);
        });

        it('should return an empty array if no actors are found', async () => {
            mockMovieRepository.getUniqueActors.mockResolvedValue([]);

            const result = await movieService.getAllActors();

            expect(result).toEqual([]);
            expect(mockMovieRepository.getUniqueActors).toHaveBeenCalledTimes(1);
        });
    });

    describe('getUniqueDirectors', () => {
        it('should return all unique directors', async () => {
            const mockDirectors = ['Christopher Nolan', 'Quentin Tarantino'];

            mockMovieRepository.getUniqueDirectors.mockResolvedValue(mockDirectors);

            const result = await movieService.getAllDirectors();

            expect(result).toEqual(mockDirectors);
            expect(mockMovieRepository.getUniqueDirectors).toHaveBeenCalledTimes(1);
        });

        it('should return an empty array if no directors are found', async () => {
            mockMovieRepository.getUniqueDirectors.mockResolvedValue([]);

            const result = await movieService.getAllDirectors();

            expect(result).toEqual([]);
            expect(mockMovieRepository.getUniqueDirectors).toHaveBeenCalledTimes(1);
        });
    });

    describe('getUniqueGenres', () => {
        it('should return all unique genres', async () => {
            const mockGenres = ['Action', 'Drama', 'Sci-Fi'];

            mockMovieRepository.getUniqueGenres.mockResolvedValue(mockGenres);

            const result = await movieService.getAllGenres();

            expect(result).toEqual(mockGenres);
            expect(mockMovieRepository.getUniqueGenres).toHaveBeenCalledTimes(1);
        });

        it('should return an empty array if no genres are found', async () => {
            mockMovieRepository.getUniqueGenres.mockResolvedValue([]);

            const result = await movieService.getAllGenres();

            expect(result).toEqual([]);
            expect(mockMovieRepository.getUniqueGenres).toHaveBeenCalledTimes(1);
        });
    });

    describe('getUniqueClassifications', () => {
        it('should return all unique classifications', async () => {
            const mockClassifications = ['PG-13', 'R', 'PG'];

            mockMovieRepository.getUniqueClassifications.mockResolvedValue(mockClassifications);

            const result = await movieService.getAllClassifications();

            expect(result).toEqual(mockClassifications);
            expect(mockMovieRepository.getUniqueClassifications).toHaveBeenCalledTimes(1);
        });

        it('should return an empty array if no classifications are found', async () => {
            mockMovieRepository.getUniqueClassifications.mockResolvedValue([]);

            const result = await movieService.getAllClassifications();

            expect(result).toEqual([]);
            expect(mockMovieRepository.getUniqueClassifications).toHaveBeenCalledTimes(1);
        });
    });

    describe('getUniquePremiereYears', () => {
        it('should return all unique premiere years', async () => {
            const mockYears = [2010, 2008, 2023];

            mockMovieRepository.getUniquePremiereYears.mockResolvedValue(mockYears);

            const result = await movieService.getAllPremiereYears();

            expect(result).toEqual(mockYears);
            expect(mockMovieRepository.getUniquePremiereYears).toHaveBeenCalledTimes(1);
        });

        it('should return an empty array if no years are found', async () => {
            mockMovieRepository.getUniquePremiereYears.mockResolvedValue([]);

            const result = await movieService.getAllPremiereYears();

            expect(result).toEqual([]);
            expect(mockMovieRepository.getUniquePremiereYears).toHaveBeenCalledTimes(1);
        });
    });

    describe('getDurationRange', () => {
        it('should return the duration range successfully', async () => {
            const mockRange = { min: 90, max: 180 };

            mockMovieRepository.getDurationRange.mockResolvedValue(mockRange);

            const result = await movieService.getDurationRange();

            expect(result).toEqual(mockRange);
            expect(mockMovieRepository.getDurationRange).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if the range cannot be retrieved', async () => {
            mockMovieRepository.getDurationRange.mockRejectedValue(createError(500, 'Unable to fetch duration range'));

            await expect(movieService.getDurationRange()).rejects.toThrow('Unable to fetch duration range');
            expect(mockMovieRepository.getDurationRange).toHaveBeenCalledTimes(1);
        });
    });

    describe('getScoreRange', () => {
        it('should return the score range successfully', async () => {
            const mockRange = { min: 5.0, max: 9.8 };

            mockMovieRepository.getScoreRange.mockResolvedValue(mockRange);

            const result = await movieService.getScoreRange();

            expect(result).toEqual(mockRange);
            expect(mockMovieRepository.getScoreRange).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if the range cannot be retrieved', async () => {
            mockMovieRepository.getScoreRange.mockRejectedValue(createError(500, 'Unable to fetch score range'));

            await expect(movieService.getScoreRange()).rejects.toThrow('Unable to fetch score range');
            expect(mockMovieRepository.getScoreRange).toHaveBeenCalledTimes(1);
        });
    });

    describe('getTotalReviewsRange', () => {
        it('should return the total reviews range successfully', async () => {
            const mockRange = { min: 1, max: 150 };

            mockMovieRepository.getTotalReviewsRange.mockResolvedValue(mockRange);

            const result = await movieService.getTotalReviewsRange();

            expect(result).toEqual(mockRange);
            expect(mockMovieRepository.getTotalReviewsRange).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if the range cannot be retrieved', async () => {
            mockMovieRepository.getTotalReviewsRange.mockRejectedValue(
                createError(500, 'Unable to fetch total reviews range')
            );

            await expect(movieService.getTotalReviewsRange()).rejects.toThrow('Unable to fetch total reviews range');
            expect(mockMovieRepository.getTotalReviewsRange).toHaveBeenCalledTimes(1);
        });
    });
});
