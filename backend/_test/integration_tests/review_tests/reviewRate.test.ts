import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';
import {createTestMovie, deleteTestMovie, getTestMovie} from '../../test_utils/testUtilsMovies';
import {createTestUser, deleteTestUser, getUserTest} from '../../test_utils/testUtilsUsers';
import axios from 'axios';
import {createReview, deleteReview, deleteReviewFromUser, getReview} from "../../test_utils/testUtilsReviews";

const baseURL = 'http://localhost:3000/review';
let movieId: string;
let userId: string;
let userName: string;
let reviewId: string;

describe('Review Rate Integration', () => {
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

        const existingReview = await getReview('ReviewTitleTest');
        if(!existingReview){
            const review = await createReview({
                title: 'ReviewTitleTest',
                review: 'ReviewTest',
                author: Number(userId),
                movie: Number(movieId)
            })
            reviewId = review.id;
        }else{
            reviewId = existingReview.id;
        }
    });

    afterAll(async () => {
        await deleteReview(Number(reviewId));
        await deleteTestMovie(movieId);
        await deleteTestUser(userName);
    });

    test('should add a like in a review', async () => {
        try {
            const reviewLikeResponse = await axios.put(`${baseURL}/like`, {
                userName: userName,
                idReview: Number(reviewId)
            });
            expect(reviewLikeResponse.status).toBe(200);
            expect(reviewLikeResponse.data).toBe('Review liked')
        } catch (error) {
            console.error('Error al darle like:', error.response?.data || error.message);
            throw error;
        }
    });

    test('should add a dislike in a review', async () => {
        try {
            const reviewLikeResponse = await axios.put(`${baseURL}/dislike`, {
                userName: userName,
                idReview: Number(reviewId)
            });
            expect(reviewLikeResponse.status).toBe(200);
            expect(reviewLikeResponse.data).toBe('Review disliked')
        } catch (error) {
            console.error('Error al darle like:', error.response?.data || error.message);
            throw error;
        }
    });


});
