import axios from 'axios';

const userBaseURL = 'http://localhost:3000/user';

export const createTestUser = async (addData = {}) => {
    const defaultData = {
        userName: 'TestUser',
        email: 'test@example.com',
        password: '1234#User',
        birthDate: '2000-01-01',
        gender: 'male',
        isAdmin: false,
    };

    const user = { ...defaultData, ...addData };

    await axios.post(`${userBaseURL}/register`, user);

    const response = await axios.get(`${userBaseURL}/${user.userName}`);

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
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            // Si el user no existe, retorna null
            return null;
        }
        console.error('Error getting test movie:', error.response?.data || error.message);
        throw error;
    }
};
