import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';
import {createTestMovie, deleteTestMovie, getTestMovie} from '../../test_utils/testUtilsMovies';
import {createTestUser, deleteTestUser, getUserTest} from '../../test_utils/testUtilsUsers';
import axios from 'axios';
import {deleteReviewFromUser} from "../../test_utils/testUtilsReviews";

const baseURL = 'http://localhost:3000/review/';
let movieId: string;
let userId: string;
let userName: string;

describe('Review Test Integration', () => {
    beforeAll(async () => {
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
        await deleteReviewFromUser(userName, Number(movieId));
        await deleteTestMovie(movieId);
        await deleteTestUser(userName);
    });

    test('should add a review in one movie', async () => {
        const reviewAddResponse = await axios.post(`${baseURL}`, {
            title: 'ReviewTitleTest',
            review: 'ReviewTest',
            author: Number(userId),
            movie: Number(movieId)
        });

        expect(reviewAddResponse.status).toBe(200);
        expect(reviewAddResponse.data).toBe("Review Published")
    });

});
