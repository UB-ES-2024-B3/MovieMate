import axios from 'axios';

const baseURL = 'http://localhost:3000/movie';

/**
 * Crea una película de prueba en la base de datos.
 * @param {Object} movieData - Datos de la película.
 * @returns {Object} - Película creada.
 */
export const createTestMovie = async (movieData = {}) => {
    const defaultData = {
        title: 'Test Movie',
        description: 'Test Description',
        genres: 'Drama',
        directors: 'Test Director',
        actors: 'Actor 1, Actor 2',
        premiereDate: '2023-12-01',
        duration: 120,
        classification: 'PG-13',
        score: 4.5,
    };

    const movie = { ...defaultData, ...movieData };

    const response = await axios.post(`${baseURL}/create`, movie);
    return response.data;
};

/**
 * Elimina una película de la base de datos por ID.
 * @param {string} movieId - ID de la película a eliminar.
 */
export const deleteTestMovie = async (movieId) => {
    await axios.delete(`${baseURL}/${movieId}`);
};
