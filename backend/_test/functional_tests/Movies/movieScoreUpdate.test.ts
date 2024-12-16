import request from 'supertest';
import app from '../../../src/main/app';
import {afterAll, beforeAll} from "@jest/globals";
import {PostgreTypeOrmDataSource} from "../../../src/main/config/postgreDatabaseTypeOrm";
import {createTestMovie, deleteTestMovie, getTestMovie} from "../../test_utils/testUtilsMovies";
import {createTestUser, deleteTestUser, getUserTest} from "../../test_utils/testUtilsUsers";  // Ajusta la ruta

describe('Functional Tests for Movie Score Update', () => {
  let userToken: string;
  let userId: string;
  let movieId: string;
  let existingUser;
  let userName: string;

  beforeAll(async () => {
    if (!PostgreTypeOrmDataSource.isInitialized) {
        await PostgreTypeOrmDataSource.initialize();
    }

    const existingMovie = await getTestMovie('TestMovie');
    if (!existingMovie) {
        const movie = await createTestMovie();
        movieId = movie.movie._id;
    } else {
        movieId = existingMovie.movie._id;
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

  it('should update the score of an existing movie', async () => {
    const newScore = 4.8
    const response = await request(app)
      .put('/movie/score')
      .send({
          userName,
          idMovie: movieId,
          puntuacion: newScore
      });

    expect(response.status).toBe(200);
    expect(response.body.score).toBe(newScore);
  });

  it('should return an error if the movie does not exist', async () => {
    const response = await request(app)
      .put('/movie/score')
      .send({
          userName,
          idMovie: 876787686,
          puntuacion: 4.8
      });

    expect(response.status).toBe(404);
    expect(response.body.error.message).toBe('Movie does not exist');
  });
});
