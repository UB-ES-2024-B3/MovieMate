import request from 'supertest';
import app from '../../../src/main/app'; // Ajusta esta ruta según tu proyecto
import {createTestUser, deleteTestUser, getUserTest} from '../../test_utils/testUtilsUsers';
import { createPost, deletePost, getPost } from '../../test_utils/testUtilsPost';
import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';
import { PostgreTypeOrmDataSource } from '../../../src/main/config/postgreDatabaseTypeOrm';
import * as timers from "timers";

describe('Post Functional Tests', () => {
  let userName: string;
  let userId: string;
  let postId: number;

  beforeAll(async () => {
    if (!PostgreTypeOrmDataSource.isInitialized) {
      await PostgreTypeOrmDataSource.initialize();
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

    // Eliminar el usuario
    await deleteTestUser(userName);

    if (PostgreTypeOrmDataSource.isInitialized) {
      await PostgreTypeOrmDataSource.destroy();
    }
  });

  it('should create a post', async () => {
    const response = await request(app)
        .post('/post')
        .send({
          title: 'Test Post Title',
          post: 'This is a test post content.',
          author: userName,
        });

    expect(response.status).toBe(200);
    expect(response.body).toEqual('Post Published');

  });

  it('should get the created post', async () => {
    // Usar la función de utilitaria para obtener el post
    const response = await request(app).get(`/post/all/${userName}`);

    console.log(response.body.allPosts[0].author.userName);

    const post = response.body.allPosts.find(
        (r: any) =>
          r.title === 'Test Post Title' &&
          r.post === 'This is a test post content.' &&
          r.author.userName === userName
    );


    expect(post).toBeDefined();
    postId = post.id;

    console.log(postId);

    expect(post.title).toEqual('Test Post Title');
    expect(post.post).toEqual('This is a test post content.');
    expect(post.author.userName).toEqual(userName);

  });

  it('should delete the post', async () => {
    // Eliminar el post utilizando la función utilitaria
    const response = await deletePost(postId);

    // Verificar que la eliminación fue exitosa
    expect(response).toEqual('Post Deleted');

  });
});
