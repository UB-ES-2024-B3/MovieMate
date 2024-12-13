import axios from 'axios';
import {createTestUser, deleteTestUser, getUserTest} from "../../test_utils/testUtilsUsers";
import {afterAll} from "@jest/globals";

const baseURL = 'http://localhost:3000/user';

describe('Registration Tests', () => {
  let userName: string;

  afterAll(async () => {
      await deleteTestUser(userName);
  });

  test('should register a user', async () => {
    const response = await axios.post(`${baseURL}/register`, {
      userName: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
      birthDate: '2002-11-17',
      gender: 'male',
      isAdmin: false,
    });
    userName = 'testuser'
    expect(response.status).toBe(200);
    expect(response.data).toEqual("Registration successful");
  });

  test('should not register a user with existing username', async () => {
    await axios.post(`${baseURL}/register`, {
      userName: 'testuser', // Mismo nombre de usuario
      email: 'another@example.com',
      password: 'Password123!',
      birthDate: new Date(),
      gender: 'male',
      isAdmin: false,
    }).catch(err => {
      expect(err.response.status).toBe(409);
      expect(err.response.data.error.message).toBe('UserName is already in use.');
      expect(err.response.data.error.status).toBe(409);
    });
  });

  test('should not register a user with existing email', async () => {
    await axios.post(`${baseURL}/register`, {
      userName: 'anotheruser',
      email: 'test@example.com',
      password: 'Password123!',
      birthDate: '2002-11-17',
      gender: 'male',
      isAdmin: false,
    }).catch(err => {
      expect(err.response.status).toBe(409);
      expect(err.response.data.error.message).toBe('Email is already registered.');
      expect(err.response.data.error.status).toBe(409);
    });
  });
});
