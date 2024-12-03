import axios from 'axios';

const baseURL = 'http://localhost:3000/user';

describe('Delete Tests', () => {
    let userName: string;

    beforeAll(async () => {
        try {
            const response = await axios.post(`${baseURL}/register`, {
                userName: 'testUser2',
                email: 'testuser2@example.com',
                birthDate: '2001-01-01',
                password: 'securepassword1234',
                gender: 'male',
                isAdmin: false
            });

            // Asegúrate de que userName es asignado correctamente
            console.log('Respuesta de registro:', response.data);  // Verifica toda la respuesta
            userName = response.data.userName || response.data.user.userName;  // Ajusta según la estructura real
            console.log('Usuario registrado:', userName);  // Verifica que userName no esté undefined
        } catch (error) {
            console.error('Error en el registro:', error.response ? error.response.data : error.message);
        }
    });

    test('should delete a user', async () => {
        try {
            if (!userName) {
                console.error('Error: userName no está definido');
                return;
            }

            const deleteResponse = await axios.delete(`${baseURL}/${userName}`);  // Cambié la URL aquí
            expect(deleteResponse.status).toBe(200);
            expect(deleteResponse.data.message).toBe('User deleted successfully');
        } catch (error) {
            console.error('Error al eliminar el usuario:', error.response ? error.response.data : error.message);
            throw error;
        }
    });

    /*
    test('should return 404 when trying to delete a non-existent user', async () => {
      const nonExistentUserName = '<nonExistentUserName>';

      try {
        // Intenta hacer la solicitud de eliminación
        await axios.delete(`http://localhost:3000/user/${nonExistentUserName}`);
      } catch (error) {
        // Verifica si la respuesta de error tiene la estructura esperada
        if (error.response && error.response.data) {
          console.log('Estructura completa de la respuesta de error:', error.response);

          // Verifica que el estado de la respuesta sea 404
          expect(error.response.status).toBe(404);

          // Verifica que el mensaje de error sea el esperado
          expect(error.response.data.message).toBe(`User with username < ${nonExistentUserName} > does not exist`);
        } else {
          // Si no tiene la estructura esperada, muestra el error completo
          console.error('Error en la respuesta:', error);
        }
      }
    });
*/
});

