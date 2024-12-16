import request from 'supertest';
import app from '../../../src/main/app'; // Ajusta esta ruta según tu proyecto
import { createTestUser, deleteTestUser } from '../../test_utils/testUtilsUsers';
import { PostgreTypeOrmDataSource } from '../../../src/main/config/postgreDatabaseTypeOrm';
import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';

describe('Post Integration Tests', () => {
  let userName: string;
  let userId: string;
  let postId: number;

  beforeAll(async () => {
    if (!PostgreTypeOrmDataSource.isInitialized) {
      await PostgreTypeOrmDataSource.initialize();
    }

    const user = await createTestUser();
    userId = user.user.id;
    userName = user.user.userName;
  });

  afterAll(async () => {
    // Eliminar el usuario y cerrar conexión con la base de datos
    await deleteTestUser(userName);

    if (PostgreTypeOrmDataSource.isInitialized) {
      await PostgreTypeOrmDataSource.destroy();
    }
  });

  it('should create a post and store it in the database', async () => {
    // Crear un post
    const createResponse = await request(app)
      .post('/post')
      .send({
        title: 'Integration Test Post Title',
        post: 'This is the content of an integration test post.',
        author: userName,
      });

    expect(createResponse.status).toBe(200);
    expect(createResponse.body).toEqual('Post Published');

    // Verificar que el post existe en la base de datos
    const allPostsResponse = await request(app).get(`/post/all/${userName}`);
    const createdPost = allPostsResponse.body.allPosts.find(
      (p: any) =>
        p.title === 'Integration Test Post Title' &&
        p.post === 'This is the content of an integration test post.' &&
        p.author.userName === userName
    );

    expect(createdPost).toBeDefined();
    postId = createdPost.id;

    expect(createdPost.title).toBe('Integration Test Post Title');
    expect(createdPost.post).toBe('This is the content of an integration test post.');
  });

  it('should update the created post and reflect changes in the database', async () => {
    // Actualizar el post
    const updateResponse = await request(app)
      .put(`/post/update/${postId}`)
      .send({
        title: 'Updated Integration Test Post Title',
        post: 'This is the updated content of the integration test post.',
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toEqual('Post Updated');

    // Verificar que el post fue actualizado
    const allPostsResponse = await request(app).get(`/post/all/${userName}`);
    const updatedPost = allPostsResponse.body.allPosts.find((p: any) => p.id === postId);

    expect(updatedPost).toBeDefined();
    expect(updatedPost.title).toBe('Updated Integration Test Post Title');
    expect(updatedPost.post).toBe('This is the updated content of the integration test post.');
  });

  it('should delete the created post and confirm it no longer exists', async () => {
    // Eliminar el post
    const deleteResponse = await request(app).delete(`/post/${postId}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual('Post Deleted');

    // Verificar que el post fue eliminado
    const allPostsResponse = await request(app).get(`/post/all/${userName}`);
    const deletedPost = allPostsResponse.body.allPosts.find((p: any) => p.id === postId);

    expect(deletedPost).toBeUndefined();
  });
});
