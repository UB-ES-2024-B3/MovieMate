import axios from 'axios';

const baseURL = 'http://localhost:3000/review/';

export const deleteReviewFromUser = async (userName, movieId) => {
  try {
    const getReviewsResponse = await axios.get(`${baseURL}`);
    const reviews = getReviewsResponse.data;

    const reviewToDelete = reviews.find((review: any) =>
      review.author.userName === userName && review.movie.id === movieId
    );

    if (!reviewToDelete) {
      throw new Error(`No review found for user "${userName}" and movie ID "${movieId}"`);
    }

    const deleteResponse = await axios.delete(`${baseURL}${reviewToDelete.id}`);
    return deleteResponse.data;
  } catch (error) {
    console.error('Error deleting review:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const deleteResponse = await axios.delete(`${baseURL}${reviewId}`);
    return deleteResponse.data;
  } catch (error) {
    console.error('Error deleting review:', error.response?.data || error.message);
    throw error;
  }
};

export const createReview = async (data: {
  title: string;
  review: string;
  author: number;
  movie: number;
}) => {
  try {
    const postResponse = await axios.post(`${baseURL}`, data);

    if (postResponse.status === 200) {
      const getResponse = await axios.get(`${baseURL}`);

      const reviews = getResponse.data;


      const createdReview = reviews.find(
        (review: any) =>
          review.title === data.title &&
          review.content === data.review &&
          review.author.id === data.author &&
          review.movie.id === data.movie
      );


      if (createdReview) {
        return createdReview;
      }

      throw new Error('Failed to find created review');
    }

    throw new Error('Failed to create review');
  } catch (error) {
    console.error('Error creating review:', error.response?.data || error.message);
    throw error;
  }
};

export const getReview = async (title: string) => {
  try {
    const response = await axios.get(`${baseURL}`);
    const reviews = response.data;

    return reviews.find((r: any) => r.title === title);
  } catch (error) {
    if (error.response?.status === 404) {
        return null;
    }
    console.error('Error fetching review:', error.response?.data || error.message);
    throw error;
  }
};

