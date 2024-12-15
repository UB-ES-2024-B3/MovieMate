import axios from 'axios';
const baseURL = 'http://localhost:3000/post/';

export const deletePost = async (postId) => {
  try {
    const deleteResponse = await axios.delete(`${baseURL}${postId}`);
    return deleteResponse.data;
  } catch (error) {
    console.error('Error deleting review:', error.response?.data || error.message);
    throw error;
  }
};

export const createPost = async (data: { title: string; post: string; author: string }) => {
  try {
    const postResponse = await axios.post(`${baseURL}`);

    if (postResponse.status === 200) {
      const getResponse = await axios.get(`${baseURL}${0}`);

      const posts = getResponse.data;


      const createdPost = posts.find(
        (post: any) =>
          post.title === data.title &&
          post.content === data.post &&
          post.author.id === data.author
      );


      if (createdPost) {
        return createdPost;
      }

      throw new Error('Failed to find created posts');
    }

    throw new Error('Failed to create post');
  } catch (error) {
    console.error('Error creating post:', error.response?.data || error.message);
    throw error;
  }
};

export const getPost = async (postId: number) => {
  try {
    const response = await axios.get(`${baseURL}${postId}`);
    const posts = response.data;

    return posts.find((r: any) => r.id === postId);
  } catch (error) {
    if (error.response?.status === 404) {
        return null;
    }
    console.error('Error fetching post:', error.response?.data || error.message);
    throw error;
  }
};

