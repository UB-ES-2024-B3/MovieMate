<template>
  <div class="flex h-[calc(100vh-4rem)] items-center justify-center">
    <!-- Contenedor del formulario de login -->
    <div class="bg-gray-900 text-white p-8 rounded-md shadow-lg w-96">
      <h2 class="text-3xl font-bold text-center text-cyan-400 mb-6">Log in</h2>

      <form @submit.prevent="login">
        <!-- Input para nombre de usuario -->
        <div class="mb-4">
          <label class="block text-cyan-400 text-sm font-bold mb-2" for="email">Username</label>
          <input
            v-model="username"
            type="text"
            id="username"
            placeholder="Ingresa tu usuario"
            class="w-full p-2 rounded-md bg-gray-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>

        <!-- Input para contraseña -->
        <div class="mb-4">
          <label class="block text-cyan-400 text-sm font-bold mb-2" for="password">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Ingresa tu contraseña"
            class="w-full p-2 rounded-md bg-gray-800 text-white border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>

        <!-- Mensaje de error -->
        <div v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</div>

        <!-- Botón de login -->
        <button
          type="submit"
          class="bg-cyan-600 text-white rounded-full px-6 py-2 mt-4 w-full hover:bg-gray-800 transition duration-200"
        >
          Log in
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      error: null,
    };
  },
  methods: {
    async login() {
      try {

          const data = {
        userName: this.username.toString(),
        password: this.password.toString()
      };

        const response = await axios.post('http://localhost:3000/user/login', data);

        console.log(response)
      // Verificamos si la autenticación fue exitosa y guardamos el token (LAIA)
      if (response.status === 200) {
          // usamos sessionStorage como temporal
        sessionStorage.setItem("auth_token", response.data);
        sessionStorage.setItem("username", this.username.toString());
        //this.$router.push(`/user/${this.username}`); // Si dona problemas fer-ho així
        window.location.href = '/user/${this.username}';
      } else {
        this.error = 'Wrong user or password buddy!';
      }
    } catch (error) {
      console.error("Something is not working as expected...:", error);
      this.error = 'Please, try again later';
    }
    },
  },
};
</script>

<style scoped>
@import '../style/form.css';
</style>
