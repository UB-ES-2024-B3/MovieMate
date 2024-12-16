import request from 'supertest';
import app from '../../../src/main/app'; // Ajusta esta ruta según tu proyecto
import {createTestUser, deleteTestUser, getUserTest} from '../../test_utils/testUtilsUsers';
import {createTestMovie, deleteTestMovie, getTestMovie} from '../../test_utils/testUtilsMovies';
import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';
import { PostgreTypeOrmDataSource } from '../../../src/main/config/postgreDatabaseTypeOrm';
import {deleteReview} from "../../test_utils/testUtilsReviews";

describe('Review Functional Tests', () => {
  let userName: string;
  let userId: string;
  let movieId: string;
  let reviewId: string;

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
  });

  afterAll(async () => {
    await deleteReview(Number(reviewId))

    await deleteTestMovie(movieId);

    await deleteTestUser(userName);

    if (PostgreTypeOrmDataSource.isInitialized) {
      await PostgreTypeOrmDataSource.destroy();
    }
  });

  it('should create a review', async () => {
    const response = await request(app)
      .post('/review')
      .send({
        title: 'ReviewTitleTest',
        review: 'ReviewTest',
        author: Number(userId),
        movie: Number(movieId),
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual('Review Published');
  });

  it('should get the test review', async () => {
      const response = await request(app).get(`/review`);

      expect(response.status).toBe(200);

      const review = response.body.find(
        (r: any) =>
          r.title === 'ReviewTitleTest' &&
          r.content === 'ReviewTest' &&
          r.author.id === Number(userId) &&
          r.movie.id === Number(movieId)
      );

      expect(review).toBeDefined();
      reviewId = review.id;


      expect(review).toEqual(
        expect.objectContaining({
          id: reviewId,
          title: 'ReviewTitleTest',
          content: 'ReviewTest',
          author: expect.objectContaining({ id: Number(userId), userName: userName }),
          movie: expect.objectContaining({ id: Number(movieId) }),
        })
      );
    });


  it('should like the review', async () => {
    const response = await request(app)
      .put('/review/like')
      .send({
        userName: userName,
        idReview: Number(reviewId),
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual('Review liked');
  });

  it('should dislike the review', async () => {
    const response = await request(app)
      .put('/review/dislike')
      .send({
        userName: userName,
        idReview: Number(reviewId),
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual('Review disliked');
  });
});
