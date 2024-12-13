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
            <button
                class="flex items-center bg-gray-800 text-[#5ce1e6] font-bold px-4 py-2 rounded-md border-2 border-[#5ce1e6] shadow-lg hover:bg-[#5ce1e6] hover:text-gray-800 transition-all duration-300"
                @click="goBack">
              <svg
                  class="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    clip-rule="evenodd"
                    d="M10 18a1 1 0 01-.707-.293l-7-7a1 1 0 010-1.414l7-7a1 1 0 011.414 1.414L4.414 10l6.293 6.293A1 1 0 0110 18z"
                    fill-rule="evenodd"
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
            <!-- Botones de Comentar y Me gusta dentro de la reseña -->
            <div v-if="review" class="flex justify-center items-center mt-4 space-x-4">
              <!-- Botón de like -->
              <button
                  class="flex items-center text-gray-400 hover:text-cyan-400 transition text-3xl"
                  @click="handleLike"
              >
                <i class="fas fa-thumbs-up"></i>
                <span class="ml-2 text-base text-gray-600">{{ review.like }}</span>
              </button>

              <!-- Botón de dislike -->
              <button
                  class="flex items-center text-gray-400 hover:text-cyan-400 transition text-3xl"
                  @click="handleDislike"
              >
                <i class="fas fa-thumbs-down"></i>
                <span class="ml-2 text-base text-gray-600">{{ review.disLike }}</span>
              </button>

              <!-- Botón de comentarios -->
              <button class="flex items-center text-gray-400 hover:text-cyan-400 transition text-3xl">
                <i class="fas fa-comment"></i>
                <span class="ml-2 text-base text-gray-600">{{ review.totalComments }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Mensaje de error -->
  <div
      v-if="showMessage"
      :class="[
              'fixed top-4 right-4 p-4 rounded-md text-white shadow-lg',
              toastError ? 'bg-red-500' : 'bg-green-500'
            ]"
  >
    {{ message }}
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      review: null,
      movie: null,
      user: null,
      isAuthenticated: false,
      showMessage: false, // Controlar la visibilidad del mensaje
      message: "", // Mensaje a mostrar
      toastError: false, //Para enseñar si es error o no
    }
  },

  created() {
    // Verificamos si el token y el nombre de usuario están en sessionStorage
    const token = sessionStorage.getItem("auth_token");
    this.isAuthenticated = !!token;

    if (this.isAuthenticated) {
      this.username = sessionStorage.getItem("username");
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
          like: review.like,
          disLike: review.disLike,
          totalComments: review.totalComments,
        };
        console.log(this.review);
        this.user = review.author;
        this.movie = review.movie;

      } catch (error) {
        this.error = 'No se puede cargar la información de la reseña';
        console.error("Error al obtener los datos de la reseña:", error);
      }
    },

    goBack() {
      this.$router.go(-1);
    },

    displayMessage(message, error, callback) {
      this.message = message;
      this.showMessage = true;
      this.toastError = error;
      setTimeout(() => {
        this.showMessage = false;
        if (callback) callback();
      }, 5000);
    },
    handleLike() {
      console.log(this.isAuthenticated);
      if (!this.isAuthenticated) {
        this.displayMessage("Debes iniciar sesión para dar like.", true);
        return;
      }


      // Lógica para enviar la acción al backend
      const BASE_URL = process.env['VUE_APP_API_BASE_URL']
      console.log(this.username);
      axios
          .put(`${BASE_URL}/review/like`, {userName: this.username, idReview: this.review.id})
          .then(() => {
            // Después de la acción PUT, obtener los datos actualizados con GET
            return axios.get(`${BASE_URL}/review/${this.review.id}`);
          })
          .then(response => {
            const updatedReview = response.data;

            // Actualizar el valor de likes y dislikes en la UI con los datos actualizados
            this.review.like = updatedReview.like;
            this.review.disLike = updatedReview.disLike;

          })
          .catch(error => {
            console.error("Error al dar like:", error);
          });

    },

    handleDislike() {
      if (!this.isAuthenticated) {
        this.displayMessage("Debes iniciar sesión para dar dislike.", true);
        return;
      }

      // Lógica para enviar la acción al backend
      const BASE_URL = process.env['VUE_APP_API_BASE_URL']
      console.log(this.username);
      axios
          .put(`${BASE_URL}/review/dislike`, {userName: this.username, idReview: this.review.id})
          .then(() => {
            // Después de la acción PUT, obtener los datos actualizados con GET
            return axios.get(`${BASE_URL}/review/${this.review.id}`);
          })
          .then(response => {
            const updatedReview = response.data;

            // Actualizar el valor de likes y dislikes en la UI con los datos actualizados
            this.review.like = updatedReview.like;
            this.review.disLike = updatedReview.disLike;
            console.log(this.review);

          })
          .catch(error => {
            console.error("Error al dar dislike:", error);
          });

    },
  }
}

</script>

<style scoped>

</style>