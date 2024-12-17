import axios from 'axios';
import {createTestUser} from "./testUtilsUsers";

const baseURL = 'http://localhost:3000/post/';

export const deletePost = async (postId: number) => {
  if (!postId) {
    throw new Error('postId es requerido para borrar un post');
  }
  try {
    const deleteResponse = await axios.delete(`${baseURL}${postId}`);
    return deleteResponse.data;
  } catch (error) {
    console.error('Error deleting post:', error.response?.data || error.message);
    throw error;
  }
};


export const createPost = async (data: {
  title: string;
  post: string;
  author: string;
}) => {
  try {
    // Crear usuario de prueba si no se pasa un autor

    const postResponse = await axios.post(`${baseURL}`, data);

    if (postResponse.status === 200) {
      const getResponse = await axios.get(`${baseURL}/all/${data.author}`);
      const posts = getResponse.data;

      const createdPost = posts.find(
        (post: any) =>
          post.allPosts.title === data.title &&
          post.allPosts.content === data.post &&
          post.allPosts.author.userName === data.author
      );

      if (createdPost) {
        return createdPost;
      }

      throw new Error('No se encontró el post creado.');
    }

    throw new Error('Error al crear el post.');
  } catch (error) {
    console.error('Error creating post:', error.response?.data || error.message);
    throw error;
  }
};



export const getPost = async (postId: string | number) => {
  if (!postId) {
    throw new Error('postId es requerido para obtener un post');
  }
  try {
    const response = await axios.get(`${postId}`);
    return response.data; // Ya devuelve un único post
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Error fetching post:', error.response?.data || error.message);
    throw error;
  }
};


