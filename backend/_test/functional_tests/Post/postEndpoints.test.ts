import request from 'supertest';
import app from '../../../src/main/app'; // Ajusta esta ruta según tu proyecto
import { createTestUser, deleteTestUser } from '../../test_utils/testUtilsUsers';
import { createPost, deletePost, getPost } from '../../test_utils/testUtilsPost';
import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';
import { PostgreTypeOrmDataSource } from '../../../src/main/config/postgreDatabaseTypeOrm';

describe('Post Functional Tests', () => {
  let userName: string;
  let userId: string;
  let postId: number;

  beforeAll(async () => {
    if (!PostgreTypeOrmDataSource.isInitialized) {
      await PostgreTypeOrmDataSource.initialize();
    }

    // Crear un usuario para asociar el post
    const user = await createTestUser();
    userId = user.user.id;
    userName = user.user.userName;
  });

  afterAll(async () => {
    // Eliminar el post
    await deletePost(postId);

    // Eliminar el usuario
    await deleteTestUser(userName);

    if (PostgreTypeOrmDataSource.isInitialized) {
      await PostgreTypeOrmDataSource.destroy();
    }
  });

  it('should create a post', async () => {
    const postData = {
      title: 'Test Post Title',
      post: 'This is a test post content.',
      author: userId,
    };

    // Crear el post usando la función utilitaria
    const createdPost = await createPost(postData);

    // Verificar que el post se creó correctamente
    expect(createdPost).toHaveProperty('id');
    expect(createdPost.title).toBe(postData.title);
    expect(createdPost.content).toBe(postData.post);
    expect(createdPost.author.id).toBe(postData.author);

    // Guardar el ID del post para pruebas posteriores
    postId = createdPost.id;
  });

  it('should get the created post', async () => {
    // Usar la función de utilitaria para obtener el post
    const retrievedPost = await getPost(postId);

    // Verificar que el post recuperado es el mismo que el creado
    expect(retrievedPost).toBeDefined();
    expect(retrievedPost.id).toBe(postId);
    expect(retrievedPost.title).toBe('Test Post Title');
    expect(retrievedPost.content).toBe('This is a test post content.');
  });

  it('should update the post', async () => {
    const updateData = {
      title: 'Updated Test Post Title',
      post: 'This is the updated content of the test post.',
    };

    // Realizar una actualización en el post
    const response = await request(app)
      .put(`/post/${postId}`)
      .send(updateData);

    // Verificar que la actualización fue exitosa
    expect(response.status).toBe(200);
    expect(response.body).toEqual('Post updated successfully');

    // Verificar que el post fue actualizado
    const updatedPost = await getPost(postId);
    expect(updatedPost.title).toBe(updateData.title);
    expect(updatedPost.content).toBe(updateData.post);
  });

  it('should delete the post', async () => {
    // Eliminar el post utilizando la función utilitaria
    const response = await deletePost(postId);

    // Verificar que la eliminación fue exitosa
    expect(response).toEqual('Post deleted successfully');

    // Intentar obtener el post eliminado
    const deletedPost = await getPost(postId);
    expect(deletedPost).toBeNull();
  });
});
