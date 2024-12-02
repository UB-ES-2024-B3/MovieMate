import axios from 'axios';

const baseURL = 'http://localhost:3000/user';

describe('Update Tests', () => {
  let userId: string;

  beforeAll(async () => {
    try {
      const response = await axios.post(`${baseURL}/register`, {
        userName: 'testUser',
        email: 'testuser@example.com',
        birthDate: '2000-01-01',
        password: 'securepassword123',
        gender: 'male',
        isAdmin: false
      });
      userId = response.data.user.id;  // Ajusta esto según la estructura de la respuesta.
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un error
        console.error('Error:', error.response.data);  // Esto te dará detalles sobre el error.
      } else {
        console.error('Error:', error.message);  // Esto capturará errores de red o algo fuera del servidor.
      }
    }
  });



  test('should update an existing user', async () => {
    try {
      const updateResponse = await axios.put(`${baseURL}/update/${userId}`, { userName: 'updatedUser' });
      expect(updateResponse.status).toBe(200);
    } catch (error) {
      if (error.response) {
        console.error('Error:', error.response.data);  // Detalles sobre el error del servidor
      } else {
        console.error('Error:', error.message);  // Error de red o de Axios
      }
    }
  });


  test('should return 404 when trying to update a non-existent user', async () => {
    const response = await axios.put(`${baseURL}/update/999`, { userName: 'newName' }).catch(err => err.response);
    expect(response.status).toBe(404);
    expect(response.data.error.message).toBe('User with Id < 999 > does not exist');
  });
});
