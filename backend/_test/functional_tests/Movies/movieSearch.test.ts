import request from 'supertest';
import app from '../../../src/main/app';
import {afterAll, beforeAll} from "@jest/globals";
import {PostgreTypeOrmDataSource} from "../../../src/main/config/postgreDatabaseTypeOrm";
import {createTestMovie, deleteTestMovie, getTestMovie} from "../../test_utils/testUtilsMovies";
import {createTestUser, deleteTestUser, getUserTest} from "../../test_utils/testUtilsUsers";  // Ajusta la ruta

describe('Functional Tests for Movie Search', () => {
    let userToken: string;
  let userId: string;
  let movieId: string;
  let existingUser;
  let userName: string;
  let movieName: string;

  beforeAll(async () => {
    if (!PostgreTypeOrmDataSource.isInitialized) {
        await PostgreTypeOrmDataSource.initialize();
    }

    const existingMovie = await getTestMovie('TestMovie');
    if (!existingMovie) {
        const movie = await createTestMovie();
        movieId = movie.movie._id;
        movieName = movie.movie._title;
    } else {
        movieId = existingMovie.movie._id;
        movieName = existingMovie.movie._title;
    }

    const existingUser = await getUserTest('TestUser');
    if (!existingUser) {
        const user = await createTestUser();
        userId = user.user.id;
        userName = user.user.userName;
    } else {
        userId = existingUser.user.id;
        userName = existingUser.user.userName;
    }

    const loginResponse = await request(app)
      .post('/user/login')
      .send({
        userName: 'TestUser',
        password: '1234#User',
      });
    userToken = loginResponse.body;
  });

  afterAll(async () => {
      if (PostgreTypeOrmDataSource.isInitialized) {
          await PostgreTypeOrmDataSource.destroy();
      }
      await deleteTestUser(userName);
      await deleteTestMovie(movieId);
  });

  it('should return movie details when searching by title', async () => {
    const response = await request(app)
      .get('/movie/search')
      .query({ query: movieName });

    expect(response.status).toBe(200);
    expect(response.body[0].title).toBe(movieName);
  });

  it('should return 404 when searching for a non-existent movie', async () => {
    const response = await request(app)
      .get('/movie/search')
      .query({ query: "NonExistingMovie" });

    expect(response.status).toBe(404);
    expect(response.body.error.message).toBe('Movies not found');
  });
});
