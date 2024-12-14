import axios from 'axios';

const userBaseURL = 'http://localhost:3000/user';

export const createTestUser = async () => {
    const defaultData = {
        userName: 'TestUser',
        email: 'test@example.com',
        password: '1234#User',
        birthDate: '2000-01-01',
        gender: 'male',
        isAdmin: false,
    };
    await axios.post(`${userBaseURL}/register`, defaultData);

    const response = await axios.get(`${userBaseURL}/${defaultData.userName}`);

    return response.data;
};

export const deleteTestUser = async (userName) => {
    await axios.delete(`${userBaseURL}/${userName}`);
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
