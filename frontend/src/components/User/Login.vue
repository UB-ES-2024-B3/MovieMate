<template>
  <div class="flex h-[calc(100vh-4rem)] items-center justify-center">
    <!-- Contenedor del formulario de login -->
    <div class="w-full form_background_input rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h2 class="text-xl font-bold text-center leading-tight tracking-tight form_title_text md:text-2xl">Log in</h2>
        <form @submit.prevent="login">
          <!-- Input para nombre de usuario -->
          <div class="mb-4">
            <label for="nombre" class="block mb-2 text-sm font-medium form_title_text">UserName</label>
            <input
              v-model="username"
              type="text"
              name="userName"
              id="nombre"
              placeholder="Your username"
              class="form_text_input text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              required
            />
          </div>

          <!-- Input para contraseña -->
          <div class="mb-4">
            <label for="password" class="block mb-2 text-sm font-medium form_title_text">Password</label>
            <input
              v-model="password"
              type="password"
              id="password"
              placeholder="••••••••"
              class="form_text_input text-sm rounded-lg block w-full p-2.5 pr-10"
              required
            />
          </div>

          <!-- Mensaje de error -->
          <div v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</div>

          <!-- Botón de login -->
          <button
            type="submit"
            class="w-full submit_button font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Log in
          </button>

            <!-- Botón recuperar contraseña -->
            <button
                    type="button"
                    class="text-sm font-light text-gray-500 dark:text-gray-400 hover:underline"
                    @click="openModal"
            >
                Forgot your password?
                <span class="font-medium text-primary-600 dark:text-primary-500">Recover here</span>
            </button>

        </form>
      </div>
    </div>

      <!-- Modal recuperación contraseña -->
      <div v-if="isModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="form_background_input rounded-lg shadow-lg w-full max-w-md p-6">
              <h2 class="text-lg font-bold text-center form_title_text mb-4">Recover Password</h2>
              <input
                      type="email"
                      placeholder="Enter your email address"
                      class="form_text_input text-sm rounded-lg w-full p-2.5 mb-4"
              />
              <div class="flex space-x-4">
                  <button
        class="w-1/2 text-red-500 font-medium rounded-lg px-5 py-2.5 border-2 border-red-500 hover:bg-red-500 hover:text-white transition duration-200"
                          @click="closeModal"
                  > Cancelar </button>
                  <button
        class="w-1/2 text-black font-medium rounded-lg px-5 py-2.5 border-2 border-black hover:bg-black hover:text-white transition duration-200"
                  >Recover</button>
              </div>
          </div>
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
        isModal: false,
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
      openModal(){
        this.isModal=true;
      },

      closeModal(){
        this.isModal=false;
      }
  },
};
</script>

<style scoped>
@import '../../style/form.css';
</style>
