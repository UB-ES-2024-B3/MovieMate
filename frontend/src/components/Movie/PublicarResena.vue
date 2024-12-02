<template>
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    <div v-if="showToast" class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
      <div v-if="toastError" class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
        </svg>
        <span class="sr-only">Error icon</span>
      </div>

      <div v-else class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
        <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
        </svg>
        <span class="sr-only">Check icon</span>
      </div>

      <div class="ms-3 text-sm font-normal">{{ toastMessage }}</div>
      <button type="button" @click="hideToast" class="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700">
        <span class="sr-only">Close</span>
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
      </button>
    </div>

    <div
      class="w-full sm:w-[700px] max-w-2xl form_background_input rounded-lg shadow-lg md:mt-0 sm:max-w-md xl:p-6"
    >
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1
          class="text-xl font-bold leading-tight tracking-tight form_title_text md:text-2xl"
        >
          NUEVA RESEÑA
        </h1>
        <form @submit.prevent="handleSubmit" class="space-y-4 md:space-y-6">
          <!-- TITULO -->
          <div>
            <input
              type="text"
              name="titulo"
              v-model="titulo"
              id="titulo"
              class="form_text_input text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Titulo"
              required=""
            />
          </div>
          <!-- RESEÑA -->
          <div>
            <textarea
              name="resena"
              v-model="resena"
              id="resena"
              rows="6"
              class="form_text_input text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Comparte aqui tu opinión"
              required=""
            ></textarea>
          </div>
        </form>
      </div>
    </div>

          <div class="flex justify-between items-center mt-6 space-x-3">


      <!-- Botón de Publicar -->
      <button
        type="submit"
        @click="handleSubmit"
        class="px-6 py-2 bg-cyan-400 text-white rounded-lg hover:bg-cyan-300 text-sm w-1/2"
        style="background-color: #22d3ee;"
      >
        PUBLICAR
      </button>
              <button
        type="button"
        @click="handleDelete"
        class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 text-sm w-1/2"
      >
        ELIMINAR
      </button>
</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
    name: "PublicarReseña",
    data(){
        return{
            titulo: '',
            resena: '',
            movieId: 0,
            userId: 0,

            showToast: false,
            toastMessage: '',
            toastError: false,
        }
    },

    methods:{
        hideToast() {
            this.showToast = false;
        },

        showToastWithMessage(message, error, callback){
            this.toastMessage = message;
            this.showToast = true;
            this.toastError = error;
            setTimeout(()=> {
                this.showToast = false;
                if (callback) callback();
            }, 5000);
        },

        async handleSubmit(){
            if(this.titulo == ''){
                this.showToastWithMessage('Enter the title', true);
                return;
            }

            if(this.resena == ''){
                this.showToastWithMessage('Enter the review', true);
                return;
            }

            let movieID = this.$route.params.movieId;
            let userID = this.$route.params.userId;

            const data = {
                title: this.titulo.toString(),
                review: this.resena.toString(),
                author: Number(userID),
                movie: Number(movieID),
            }

            console.log(data);

            try{
                const BASE_URL = process.env['VUE_APP_API_BASE_URL']
                const response = await axios.post(`${BASE_URL}/review`, data);

                if(response.status == 200){
                    this.showToastWithMessage(response.data.message || 'Reseña publicada',
                        false,
                        ()=> this.$router.go(-1));
                }
            }catch (error){
                console.error('Error del servidor:', error.response?.data || error.message);
                this.showToastWithMessage(error.response?.data?.message || 'Request failed. Please try again', true);
            }
        },

        handleDelete(){
            this.titulo.nextSibling;
            this.resena.nextSibling;
            this.$router.go(-1);
        }
    }
}
</script>

<style scoped>

</style>