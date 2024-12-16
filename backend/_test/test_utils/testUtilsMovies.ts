import axios from 'axios';
import {decode} from "node:querystring";

const baseURL = 'http://localhost:3000/movie';

/**
 * Crea una película de prueba en la base de datos.
 * @param {Object} movieData - Datos de la película.
 * @returns {Object} - Película creada.
 */

export const createTestMovie = async () => {
    const defaultData = {
        title: 'TestMovie',
        description: 'Description of TestMovie',
        genres: ['TestMovie'],
        directors: ['TestMovie'],
        actors: ['TestMovie'],
        premiereDate: '2023-11-20',
        duration: 140,
        classification: 'PG-13',
        score: 4.1,
        totalReviews: null,
    };

    try {
        await axios.post(`${baseURL}/create`, defaultData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const response = await axios.get(`${baseURL}/${defaultData.title}`);
        return response.data;
    } catch (error) {
        console.error('Error creating test movie:', error.response?.data || error.message);
        throw error;
    }
};

export const getTestMovie = async (title: string) => {
    try {
        const response = await axios.get(`${baseURL}/${title}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Retorna los datos de la película si existe
    } catch (error) {
        if (error.response?.status === 404) {
            // Si la película no existe, retorna null
            return null;
        }
        console.error('Error getting test movie:', error.response?.data || error.message);
        throw error;
    }
};


/**
 * Elimina una película de la base de datos por ID.
 * @param {string} movieId - ID de la película a eliminar.
 */
export const deleteTestMovie = async (movieId) => {
    await axios.delete(`${baseURL}/${movieId}`);
};
