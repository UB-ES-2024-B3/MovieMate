import request from 'supertest';
import app from '../../../src/main/app';
import {createTestUser, deleteTestUser, getUserTest} from "../../test_utils/testUtilsUsers";
import {afterAll, beforeAll, expect, it} from "@jest/globals";
import {PostgreTypeOrmDataSource} from "../../../src/main/config/postgreDatabaseTypeOrm"; // Ajusta la ruta

describe('Functional Tests for User Profile Update', () => {
  let userToken: string;
  let userName: string;
  let userId: string;
  let existingUser;

  beforeAll(async () => {
      if (!PostgreTypeOrmDataSource.isInitialized) {
          await PostgreTypeOrmDataSource.initialize();
      }

      existingUser = await getUserTest('TestUser');
      if(!existingUser){
          const user = await createTestUser();
          userId = user.user.id;
      }else{
          userId = existingUser.user.id;
      }

      const loginResponse = await request(app)
        .post('/user/login')
        .send({
          userName: 'TestUser',
          password: '1234#User',
        });
      userName = "TestUser"
      userToken = loginResponse.body;
  });

  afterAll(async () => {
      if (PostgreTypeOrmDataSource.isInitialized) {
          await PostgreTypeOrmDataSource.destroy();
      }
      await deleteTestUser(userName);
  });

  it('should allow the user to update their profile', async () => {
    const updatedData = {
      userName: 'updatedTestUser',
      email: 'updated@example.com' };


    const response = await request(app)
      .put(`/user/update/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(updatedData);

    userName = "updatedTestUser"
    expect(response.status).toBe(200);
    //Return New token
    expect(typeof response.body).toBe('string');
  });
});
