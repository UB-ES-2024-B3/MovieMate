<template>
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    <!-- Mensaje Toast de error o éxito -->
    <div v-if="showToast" class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
      <div v-if="toastError" class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
        </svg>
        <span class="sr-only">Error icon</span>
      </div>

      <div v-else class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
        </svg>
        <span class="sr-only">Check icon</span>
      </div>

      <div class="ms-3 text-sm font-normal">{{ toastMessage }}</div>
      <button type="button" @click="hideToast" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700">
        <span class="sr-only">Close</span>
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
      </button>
    </div>
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
                    v-model="email"
                    placeholder="Enter your email address"
                    class="form_text_input text-sm rounded-lg w-full p-2.5 mb-4"
            />
            <!-- Mensaje de error -->
            <div v-if="messageType=='error'" class="text-red-500 text-sm mb-4">{{ message }}</div>
            <div v-if="messageType=='success'" class="text-gray-500 text-sm mb-4">{{message}}</div>

            <div class="flex space-x-4">
                <button
                        class="w-1/2 text-red-500 font-medium rounded-lg px-5 py-2.5 border-2 border-red-500 hover:bg-red-500 hover:text-white transition duration-200"
                        @click="closeModal"
                > Cancelar </button>
                <button
                        class="w-1/2 text-black font-medium rounded-lg px-5 py-2.5 border-2 border-black hover:bg-black hover:text-white transition duration-200"
                        @click="recoverPassword"
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
      isModal: false,
      email: '',
      message:'',
      messageType:'',

      // Toast
      showToast: false,
      toastMessage: '',
      toastError: false
    };
  },
  methods: {
    showToastWithMessage(message, error, callback) {
      this.toastMessage = message;
      this.showToast = true;
      this.toastError = error;
      setTimeout(() => {
        this.showToast = false;
        if (callback) callback();
      }, 5000);
    },
    hideToast() {
      this.showToast = false;
    },
    async login() {
      try {
        const data = {
          userName: this.username.toString(),
          password: this.password.toString()
        };
        const BASE_URL = process.env['VUE_APP_API_BASE_URL']

        const response = await axios.post(`${BASE_URL}/user/login`, data);

        console.log(response)

        // Verificamos si la autenticación fue exitosa y guardamos el token (LAIA)
        if (response.status === 200) {
          // usamos sessionStorage como temporal
          sessionStorage.setItem("auth_token", response.data);
          sessionStorage.setItem("username", this.username.toString());
          //this.$router.push(`/user/${this.username}`); // Si dona problemas fer-ho així
          this.showToastWithMessage(
            response.data.message || 'Login successful.',
            false,
            () => window.location.href = '/user/${this.username}'
          );
        } else {
          this.showToastWithMessage('Wrong user or password buddy!', true);
        }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const errorMessage = error.response.data.error.message;
        this.showToastWithMessage(errorMessage, true);
      } else {
          this.showToastWithMessage('Request failed. Please try again.', true);
      }
    }
    },
      openModal(){
        this.isModal=true;
        this.message='';
        this.email='';
        this.messageType='';
      },

      closeModal(){
        this.isModal=false;
        this.message='';
        this.messageType='';
      },

      async recoverPassword(){
        if(!this.email){
            this.message = 'Please enter your email address';
            this.messageType='error';
            return;
        }

        try{
            const BASE_URL = process.env['VUE_APP_API_BASE_URL']
            // eslint-disable-next-line no-unused-vars
            const  response = await  axios.post(`${BASE_URL}/user/requestPasswordRecovery`, {email: this.email});

            this.message = 'Email sent';
            this.messageType = 'success';
        }catch(error){
            console.error("Error response:", error);
            if(error.response && error.response.data && error.response.status == 404){
                this.message = 'User with email does not exist';
                this.messageType = 'error';
            } else{
                this.message = 'An unexpected error occurred. Please try again later';
                this.messageType = 'error'
            }

        }
      }
  },
};
</script>

<style scoped>
@import '../../style/form.css';
</style>
