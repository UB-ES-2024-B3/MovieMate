import axios from 'axios';

const userBaseURL = 'http://localhost:3000/user';

export const createTestUser = async (userData = {}) => {
    const defaultData = {
        userName: 'TestUser',
        email: 'test@example.com',
        password: '1234#User',
        birthDate: '2000-01-01',
        gender: 'male',
        isAdmin: false,
    };

    const user = { ...defaultData, ...userData };

    await axios.post(`${userBaseURL}/register`, user)

    const response = await axios.get(`${userBaseURL}/${defaultData.userName}`);

    return response.data;
};

export const deleteTestUser = async (userId) => {
    await axios.delete(`${userBaseURL}/${userId}`);
};

export const getUserTest = async (userName: string) => {
    try {
        const response = await axios.get(`${userBaseURL}/${userName}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Retorna los datos del username
    } catch (error) {
        if (error.response?.status === 404) {
            // Si el user no existe, retorna null
            return null;
        }
        console.error('Error getting test movie:', error.response?.data || error.message);
        throw error;
    }
};
