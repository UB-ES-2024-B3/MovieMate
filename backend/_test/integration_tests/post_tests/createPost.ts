import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';
import { createPost, deletePost, getPost } from '../../test_utils/testUtilsPost';
import { createTestUser, deleteTestUser, getUserTest } from '../../test_utils/testUtilsUsers';
import axios from 'axios';

const baseURL = 'http://localhost:3000/post/';
let postId: string;
let userId: string;
let userName: string;

// hi

describe('Post Test Integration', () => {
    beforeAll(async () => {
        // Crear un post de prueba con el formato esperado
        const post = await createPost({
            title: 'Test Post Title',
            post: 'This is the test post content.',
            author: userName  // Usamos el nombre de usuario como el autor
        });
        postId = post._id;  // Asumiendo que el post tiene un _id que podemos usar para eliminarlo después
    });

    afterAll(async () => {
        await deletePost(postId); // Borra el post de prueba
        await deleteTestUser(userName); // Borra el usuario de prueba
    });

    test('should create a post successfully', async () => {
        const postAddResponse = await axios.post(`${baseURL}`, {
            title: 'PostTitleTest',
            post: 'PostContentTest',
            author: userName // Usamos el userName como autor
        });

        expect(postAddResponse.status).toBe(200);
        expect(postAddResponse.data).toBe("Post created successfully");
    });
});