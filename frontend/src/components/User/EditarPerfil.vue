<template>
  <div class="flex h-[calc(100vh-4rem)]">
    <aside class="bg-cyan-600 w-64 p-6 flex flex-col justify-between h-full">
      <div class="flex flex-col space-y-4 mb-6">
      </div>

      <!-- DELETE -->
      <button @click="comfirmDeleteAccount" class="flex items-center justify-center text-red-500 rounded-md px-4 py-2 border-2 border-red-500 hover:bg-red-500 hover:text-white transition duration-200">
        <img src="../../assets/papelera.png" class="w-12 h-12" alt="papelera">
        <span class="font-bold text-lg">BORRAR CUENTA</span>
      </button>
    </aside>

    <main class="bg-gray-900 text-white flex-grow p-6 overflow-y-auto flex items-start justify-center">
    <div class="text-center w-full max-w-4xl mt-6 relative">

      <!-- Toast de notificación centrado encima del título -->
      <div v-if="showToast" class="flex items-center w-full max-w-md p-4 mb-6 mx-auto text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
        <div v-if="toastError" class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
          </svg>
        </div>
        <div v-else class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
        </div>
        <div class="ms-3 text-sm font-normal">{{ toastMessage }}</div>
        <button type="button" @click="hideToast" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700">
          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>
      </div>

      <div class="flex items-center justify-between mb-8 relative">
        <button @click="goBack" class="absolute -left-16 transform -translate-y-1/2 w-auto h-auto flex items-center justify-center">
          <img src="../../assets/flecha.png" alt="Flecha de retorno" class="w-12 h-12">
        </button>

        <div class="flex items-center mx-auto">
            <div class="text-left">
              <h2 class="text-3xl font-bold text-cyan-400">Edit profile</h2>
              <p class="text-cyan-400 mt-1">Update your profile information here.</p>
            </div>
          </div>
        </div>

        <div class="border-t border-cyan-400 w-full mt-8"></div>

        <div class="w-full max-w-md bg-gray-800 rounded-lg shadow-lg mt-10 mx-auto p-6">
          <form @submit.prevent="updateUserProfile" class="space-y-4">

              <!-- FOTO DE PERFIL -->
              <div class="flex flex-col items-center justify-center">
                  <label class="block mb-2 text-sm font-medium text-cyan-400">Profile Photo</label>
                  <div class="w-28 h-28 bg-gray-500 rounded-full relative">
                      <img
                              v-if="formData.image"
                              :src="formData.image"
                              alt="Profile"
                              class="w-full h-full object-cover rounded-full"
                      />
                      <span v-else class="text-white text-lg flex items-center justify-center h-full">&#128100;</span>
                      <input type="file" @change="imageChange" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer">
                  </div>
              </div>
            <!-- USERNAME -->
            <div>
              <label for="nombre" class="block mb-2 text-sm font-medium text-cyan-400">UserName</label>
              <input type="text" name="userName" v-model="formData.userName" id="nombre" class="form_text_input text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 bg-gray-700 text-white" placeholder="Your username">
            </div>

            <!-- EMAIL -->
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-cyan-400">Email</label>
              <input type="email" name="email" v-model="formData.email" id="email" class="form_text_input text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 bg-gray-700 text-white" placeholder="Your email">
            </div>

            <!-- GENDER -->
            <div>
              <label for="gender" class="block mb-2 text-sm font-medium text-cyan-400">Gender</label>
              <select id="gender" name="gender" v-model="formData.gender" class="form_text_input text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 bg-gray-700 text-white">
                <option value="" disabled selected>Select a gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <!-- DESCRIPTION -->
            <div>
              <label for="description" class="block mb-2 text-sm font-medium text-cyan-400">Description</label>
              <textarea
                v-model="formData.description"
                id="description"
                class="form_text_input text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 bg-gray-700 text-white"
                placeholder="Your Description"
              ></textarea>
            </div>

            <!-- UPDATE -->
            <button type="submit" class="w-full bg-cyan-600 hover:bg-cyan-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-gray-900">Save Information</button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>


<script>
import { mapState } from 'vuex';
import axios from 'axios';

export default {
  name: "EditarUsuario",
  computed: {
    ...mapState(['userData'])
  },
  data() {
    return {
      formData: {
        id: "",
        userName: "",
        email: "",
        gender: "",
        description: "",
        image: "",
          imageFile: null,
      },
      // Toast
      showToast: false,
      toastMessage: '',
      toastError: false,
        username: "",
        isAuthenticated: false,
    };
  },
  created() {
    console.log(this.userData)
    if (this.userData) {
      const {id, userName, email, gender, description, image} = this.userData;
      this.formData = {id, userName, email, gender, description, image, imageFile: null};
    }

    this.checkAuthStatus();
    window.addEventListener('storage', this.checkAuthStatus);
  },
  methods: {
    async updateUserProfile() {
      try {
        const BASE_URL = process.env['VUE_APP_API_BASE_URL']
          const token = sessionStorage.getItem("auth_token")

          //Subir imagen si se ha seleccionado
          if(this.formData.imageFile){
              const  imageFormData = new FormData();
              imageFormData.append("image", this.formData.imageFile);

              console.log("FormData de la imagen:", imageFormData);

              for(let pair of imageFormData.entries()){
                  console.log(pair[0] + ": " + pair[1]);
              }

              const imageResponse = await axios.put(`${BASE_URL}/user/update-image/${this.formData.id}`, imageFormData,
                  {headers:{
                      "Content-Type": "multipart/form-data",
                          Authorization: `Bearer ${token}`,
                      },
                  }
              );


              if(imageResponse.status==200){
                  this.formData.image = imageResponse.data.image;
              }else{
                  this.showToastWithMessage("Error al subir la imagen", true);
                  return
              }
          }
          const response = await axios.put(
              `${BASE_URL}/user/update/${this.formData.id}`,
              this.formData, {
                  headers:{
                      Authorization: `Bearer ${token}`,
                  }
              }
          );
        if (response.status === 200) {
          sessionStorage.setItem("username", this.formData.userName);
          sessionStorage.setItem("auth_token", response.data);
          this.showToastWithMessage("Perfil actualizado con éxito", false, () => {
            window.location.href = '/user/${this.username}';
          });
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          const errorMessage = error.response.data.error.message;
          this.showToastWithMessage(errorMessage, true)
        } else {
            this.showToastWithMessage('Request failed. Please try again.', true);
        }
      }
    },
    async goBack() {
      this.$router.go(-1);
    },
    async comfirmDeleteAccount() {
      const confirmacion = window.confirm("¿Estás seguro de querer eliminar tu cuenta?");

      if (confirmacion) {
        this.deleteAccount();
      }
    },
    async deleteAccount() {
      try {
        await axios.delete(`http://localhost:3000/user/${this.$route.params.userName}`);

        this.$router.push('/login');
        sessionStorage.removeItem("auth_token");
        sessionStorage.removeItem("username");

        this.checkAuthStatus();
        this.isAuthenticated = false;

        this.$router.replace('/login').then(() => {
            window.location.reload();
        });
      } catch (error) {
        console.error('Error al eliminar la cuenta: ', error);
      }
    },
    hideToast() {
      this.showToast = false;
    },
    showToastWithMessage(message, error, callback) {
      this.toastMessage = message;
      this.showToast = true;
      this.toastError = error;
      setTimeout(() => {
        this.showToast = false;
        if (callback) callback();
      }, 3000);
    },

      checkAuthStatus(){
        const token = sessionStorage.getItem("auth_token");
        this.isAuthenticated = !!token;
        this.username = token ? sessionStorage.getItem('username'):'';
      },

      imageChange(event){
        const file = event.target.files[0];
        console.log("Archivo seleccionado:", file);
        this.formData.imageFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log("Imagen cargada en base64:", e.target.result);
            this.formData.image = e.target.result;
        };
        reader.readAsDataURL(file);
      },


  }
};
</script>

<style scoped>
@import '../../style/form.css';
</style>
