<template>
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
              <div class="flex w-full h-full">
                  <!-- Lateral izquierdo -->
                  <aside class="bg-cyan-600 w-64 p-6 flex flex-col justify-between fixed top-16 left-0 h-[calc(100vh-64px)]">
                      <!-- Aquí puedes agregar contenido para el menú lateral -->
                  </aside>
                        <!-- Contenido principal -->
                  <div class="ml-64 flex-grow p-8">
                      <div class="max-w-6xl mx-auto">
                          <!-- Botón para volver atrás -->
                          <div class="mb-4">
                              <button @click="goBack" class="flex items-center bg-gray-800 text-[#5ce1e6] font-bold px-4 py-2 rounded-md border-2 border-[#5ce1e6] shadow-lg hover:bg-[#5ce1e6] hover:text-gray-800 transition-all duration-300">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5 mr-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                  <path
                                      fill-rule="evenodd"
                                      d="M10 18a1 1 0 01-.707-.293l-7-7a1 1 0 010-1.414l7-7a1 1 0 011.414 1.414L4.414 10l6.293 6.293A1 1 0 0110 18z"
                                      clip-rule="evenodd"
                                  />
                                </svg>
                                Back
                              </button>
                          </div>

      <div class="flex flex-col items-center">
        <div
                v-if="review && user && movie"
          class="w-full sm:w-[700px] max-w-2xl form_background_input rounded-lg shadow-lg md:mt-0 sm:max-w-md xl:p-6"
        >
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <!-- Mostrar el Título de la Reseña -->
            <h1
              class="text-xl font-bold leading-tight tracking-tight form_title_text md:text-2xl"
            >
              {{ review.title }}
            </h1>

            <!-- Mostrar el nombre del autor (username) y el título de la película -->
            <div class="text-sm text-gray-600">
              <p><strong>Autor:</strong> {{ user.userName }}</p>
              <p><strong>Pelicula: </strong> {{ movie.title }}</p>
            </div>

            <div class="space-y-4 md:space-y-6">
              <!-- RESEÑA -->
              <div>
                <p
                  class="form_text_input text-sm rounded-lg block w-full p-2.5"
                >
                  <strong></strong> {{ review.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
          <div class="flex justify-center items-center mt-4 space-x-4">


              <!-- Botón de intracción-->
              <button class="text-gray-400 hover:text-cyan-400 transition text-3xl">
                  <i class="fas fa-thumbs-up"></i>
              </button>

              <button class="text-gray-400 hover:text-cyan-400 transition text-3xl">
                  <i class="fas fa-thumbs-down"></i>
              </button>

              <button class="text-gray-400 hover:text-cyan-400 transition text-3xl">
                  <i class="fas fa-comment"></i>
              </button>

          </div>
      </div>
      </div>
                  </div>
              </div>
      </div>
</template>

<script>
import axios from "axios";

export default {
    data(){
        return{
            review: null,
            movie: null,
            user: null,
        }
    },

    mounted() {
        this.fetchReviewData();
    },

    methods: {
        async fetchReviewData() {
            try {
                const BASE_URL = process.env['VUE_APP_API_BASE_URL']
                const response = await axios.get(`${BASE_URL}/review/${this.$route.params.id}`);

                console.log(response.data);

                const review = response.data;
                this.review = {
                    id: review.id,
                    title: review.title,
                    content: review.content,
                };
                this.user = review.author;
                this.movie = review.movie;

            } catch (error) {
                this.error = 'No se puede cargar la información de la reseña';
                console.error("Error al obtener los datos de la reseña:", error);
            }
        },

        goBack(){
            this.$router.go(-1);
        },

    }
}

</script>

<style scoped>

</style>