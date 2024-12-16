import request from 'supertest';
import app from '../../../src/main/app';
import {afterAll, beforeAll, it} from "@jest/globals";
import {PostgreTypeOrmDataSource} from "../../../src/main/config/postgreDatabaseTypeOrm";
import {createTestUser, deleteTestUser, getUserTest} from "../../test_utils/testUtilsUsers";  // Ajusta la ruta

let existingUser;
let userId: string;
let userName: string;

describe('Functional Tests for User Search', () => {
  beforeAll(async () => {
      if (!PostgreTypeOrmDataSource.isInitialized) {
          await PostgreTypeOrmDataSource.initialize();
      }
      const existingUser = await getUserTest('TestUser');
      if (!existingUser) {
          const user = await createTestUser();
          userName = user.user.userName;
          userId = user.user.id;
      } else {
          userName = existingUser.user.userName;
          userId = existingUser.user.id;
      }
  });

  afterAll(async () => {
      if (PostgreTypeOrmDataSource.isInitialized) {
          await PostgreTypeOrmDataSource.destroy();
      }
      await deleteTestUser(userName);
  });

  it('should return user details when searching by username', async () => {
    const response = await request(app)
      .get('/user/search')
      .query({ query: userName });


    expect(response.status).toBe(200);
    expect(response.body[0].userName).toBe(userName);
  });
});
