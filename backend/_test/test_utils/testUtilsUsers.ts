import axios from 'axios';

const userBaseURL = 'http://localhost:3000/user';

export const createTestUser = async (userData = {}) => {
    const defaultData = {
        userName: 'TestUser',
        email: 'test@example.com',
        password: 'Password123!',
        birthDate: '2000-01-01',
        gender: 'male',
        isAdmin: false,
    };

    const user = { ...defaultData, ...userData };

    const response = await axios.post(`${userBaseURL}/register`, user);
    return response.data;
};

export const deleteTestUser = async (userId) => {
    await axios.delete(`${userBaseURL}/${userId}`);
};
