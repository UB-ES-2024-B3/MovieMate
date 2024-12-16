import request from 'supertest';
import app from '../../../src/main/app';
import { PostgreTypeOrmDataSource } from '../../../src/main/config/postgreDatabaseTypeOrm';
import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';
import {deleteTestUser, getUserTest} from "../../test_utils/testUtilsUsers";

let existingUser;

describe('Functional Tests for User Registration and Login', () => {
    beforeAll(async () => {
        if (!PostgreTypeOrmDataSource.isInitialized) {
            await PostgreTypeOrmDataSource.initialize();
        }

        existingUser = await getUserTest('TestUser');
        if(existingUser){
            await deleteTestUser(existingUser.user.userName);
        }
    });

    afterAll(async () => {
        if (PostgreTypeOrmDataSource.isInitialized) {
            await PostgreTypeOrmDataSource.destroy();
        }
        await deleteTestUser('TestUser');
    });

    it('should register a new user and login successfully', async () => {
        const registrationResponse = await request(app)
          .post('/user/register')
          .send({
            userName: 'TestUser',
            email: 'test@example.com',
            password: '1234#User',
            birthDate: '2000-01-01',
            gender: 'male',
            isAdmin: false,
          });

        expect(registrationResponse.status).toBe(200);
        expect(registrationResponse.body).toEqual('Registration successful');

        const loginResponse = await request(app)
          .post('/user/login')
          .send({
            userName: 'TestUser',
            password: '1234#User',
          });

        expect(loginResponse.status).toBe(200);
        expect(typeof loginResponse.body).toBe('string');
    });
});
