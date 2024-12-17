<template>
  <div class="min-h-screen grid place-items-center font-mono bg-gray-900">
    <div class="flex w-full h-full">

      <!-- Contenido principal -->
      <div class="w-full">
        <div class="max-w-6xl mx-auto">
          <!-- Botón para volver atrás -->
          <div class="mb-4">
            <button
                class="flex items-center bg-gray-800 text-[#5ce1e6] font-bold px-4 py-2 rounded-md border-2 border-[#5ce1e6] shadow-lg hover:bg-[#5ce1e6] hover:text-gray-800 transition-all duration-300"
                @click="goBack"
            >
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

          <!-- Tarjeta de película -->
          <div class="bg-[#5ce1e6] rounded-md shadow-lg relative">
            <div class="md:flex px-8 py-6 leading-none">
              <!-- Imagen de la película -->
              <div class="flex-none mr-8 relative">
                <img
                    :src="movie.image"
                    alt="Movie Poster"
                    class="h-80 w-64 rounded-md shadow-2xl border-4 border-gray-300"
                />

                <!-- Botón de Añadir a Favoritos -->
                <button
                    class="absolute top-4 right-4 bg-gray-800 text-[#5ce1e6] p-3 rounded-full shadow-md hover:bg-[#5ce1e6] hover:text-gray-800 transition-all duration-300"
                    @click="toggleFavorite"
                    @mouseleave="showTooltip = false"
                    @mouseover="showTooltip = true"
                >
                  <svg
                      :class="{ 'fill-red-500': isFavorite }"
                      class="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                  </svg>
                </button>

                <!-- Tooltip -->
                <div
                    v-if="showTooltip"
                    class="absolute top-16 right-4 bg-gray-800 text-white text-sm px-4 py-2 rounded shadow-md"
                >
                  {{ isFavorite ? "Eliminar de Favoritos" : "Añadir a Favoritos" }}
                </div>

              </div>

              <!-- Detalles de la película -->
              <div class="flex-col text-[#545454]">
                <p class="pt-4 text-3xl font-bold">
                  {{ movie.title }} ({{ movie.year }})
                </p>
                <hr class="custom-hr"/>
                <div class="text-md flex justify-between my-4">
                  <span class="font-bold">
                    {{ movie.duration }} min | {{ movie.genres.join(", ") }}
                  </span>
                </div>
                <p class="my-4 text-sm">
                  {{ movie.description }}
                </p>
                <p class="text-md">
                  Rating: {{ movie.score }} / 5
                  <span class="font-bold px-2">|</span>
                  Classification: {{ movie.classification }}
                </p>
              </div>
            </div>
          </div>


          <!-- Sistema de Puntuación -->
          <div class="bg-gray-800 text-white rounded-md mt-6 p-6 shadow-lg">
            <h3 class="text-xl font-bold mb-4">Puntúa esta película</h3>
            <div class="stars flex justify-center">
              <span
                  v-for="star in 5"
                  :key="star"
                  :class="{ selected: star <= currentRating }"
                  class="star"
                  @click="rateMovie(star)"
              >
                ★
              </span>
            </div>
            <div class="flex justify-center mt-4">
              <button class="btn-publicar" @click="publicarResena">
                PUBLICAR RESEÑA
              </button>
            </div>

            <p v-if="hasRated" class="text-center text-green-500 font-bold">
              Has puntuado esta película con {{ currentRating }} estrellas.
              <button
                  class="ml-2 text-sm bg-cyan-500 text-white px-2 py-1 rounded"
                  @click="modifyRating"
              >
                Modificar Puntuación
              </button>
            </p>

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

          <div class="mt-10">
            <div class="review-container">
              <div v-if="reviews.length > 0">
                <div v-for="(review, index) in reviews" :key="index"
                     class="review-card bg-gray-800 text-white rounded-md p-4 mb-4 shadow-lg">

                  <h5 class="text-[#5ce1e6] font-semibold text-lg mb-2">
                    <router-link :to="`/review/${review.id}`">{{ review.title }}</router-link>
                  </h5>
                  <p class="text-gray-400 text-sm mb-4">@{{ review.author.userName }}</p>
                  <p class="text-gray-200 mb-4">{{ review.content }}</p>
                  <!-- Botones de Comentar y Me gusta dentro de la reseña -->
                  <div class="flex justify-center items-center mt-4 space-x-4">
                    <!-- Botón de like -->
                    <button
                        class="flex items-center text-gray-400 hover:text-cyan-400 transition text-3xl"
                        @click="handleLike(review.id)"
                    >
                      <i class="fas fa-thumbs-up"></i>
                      <span class="ml-2 text-base text-gray-600">{{ review.like }}</span>
                    </button>

                    <!-- Botón de dislike -->
                    <button
                        class="flex items-center text-gray-400 hover:text-cyan-400 transition text-3xl"
                        @click="handleDislike(review.id)"
                    >
                      <i class="fas fa-thumbs-down"></i>
                      <span class="ml-2 text-base text-gray-600">{{ review.disLike }}</span>
                    </button>

                    <!-- Botón de comentarios -->
                    <button class="flex items-center text-gray-400 hover:text-cyan-400 transition text-3xl"  @click="openCommentModal(review.id)">
                      <i class="fas fa-comment"></i>
                      <span class="ml-2 text-base text-gray-600">{{ review.totalComments }}</span>
                    </button>
                  </div>

                </div>
              </div>
              <p v-else class="text-gray-400 flex justify-center">No hay publicaciones disponibles.</p>

              <div v-if="showCommentModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div class="bg-gray-800 rounded-lg w-96 p-6">
                  <h2 class="text-white text-xl font-bold mb-4">Añadir Comentario</h2>
                  <textarea
                      v-model="newComment.content"
                      placeholder="Escribe tu comentario aquí..."
                      class="w-full mb-4 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      rows="4"
                  ></textarea>
                  <div class="flex justify-end space-x-4">
                    <button
                        class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                        @click="closeCommentModal"
                    >
                      Cancelar
                    </button>
                    <button
                        class="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-500"
                        @click="submitComment"
                    >
                      Comentar
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import MovieReview from "./MovieReview.vue";

const BASE_URL = process.env.VUE_APP_API_BASE_URL;

export default {
  name: "MovieCard",
  path: '/review',
  component: {MovieReview},
  meta: { isReviewPage: true },
  data() {
    return {
      movie: {
        id: 0,
        title: "",
        description: "",
        genres: [],
        directors: [],
        actors: [],
        premiereDate: "",
        duration: "",
        classification: "",
        score: "",
        totalReviews: "",
        image: "",
        year: "",
      },
      errorMessage: "",
      currentRating: 0,
      hasRated: false,
      showMessage: false, // Controlar la visibilidad del mensaje
      message: "", // Mensaje a mostrar
      toastError: false, //Para enseñar si es error o no
      isAuthenticated: false,
      user: null,
      reviews: [],
      //Comments
      showCommentModal: false,
      newComment: {
        content: "",
        reviewId: null,
      },
    };
  },
  created() {
    // Verificamos si el token y el nombre de usuario están en sessionStorage
    const token = sessionStorage.getItem("auth_token");
    this.isAuthenticated = !!token;

    if (this.isAuthenticated) {
      this.username = sessionStorage.getItem("username");
      this.fetchUserData(this.username);
    }
  },
  mounted() {
    this.loadMovie();
  },
  watch: {
    "$route.params.title": "loadMovie",
  },

  methods: {
    async fetchMovie(title) {
      try {
        const BASE_URL = process.env.VUE_APP_API_BASE_URL;
        const response = await axios.get(`${BASE_URL}/movie/${title}`);

        // Ajusta la desestructuración con los nombres correctos
        const {movie, reviews} = response.data;

        console.log(response.data);

        // Asigna los datos correctamente al objeto `movie`
        this.movie = {
          id: movie._id,
          title: movie._title,
          description: movie._description,
          genres: Array.isArray(movie._genres) ? movie._genres : [movie._genres],
          directors: movie._directors || [],
          actors: movie._actors || [],
          premiereDate: movie._premiereDate || "",
          duration: movie._duration || 0,
          classification: movie._classification || "No clasificado",
          score: movie._score || 0,
          image: movie._image || "",
          year: movie._premiereDate ? new Date(movie._premiereDate).getFullYear() : "N/A",
        };

        // Asigna las reseñas, con un manejo seguro de datos
        this.reviews = Array.isArray(reviews) ? reviews : [];
        console.log(this.reviews);
      } catch (error) {
        // Manejando errores de forma más detallada
        this.errorMessage = "Error al obtener los detalles de la película.";
        console.error("Error fetching movie details:", error.message);
      }
    },

    async fetchUserData(username) {
      try {

        const token = sessionStorage.getItem("auth_token");
        const BASE_URL = process.env['VUE_APP_API_BASE_URL']
        const response = await axios.get(`${BASE_URL}/user/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const {user} = response.data;
        this.user = {
          id: user.id || null, // Verifica si `id` existe
          userName: user.userName || "",
          email: user.email || "",
          gender: user.gender || "",
          description: user.description || "",
          isAdmin: user.isAdmin || false,
          image: user.image || "",
        };

      } catch (error) {
        this.error = 'No se puede cargar la información del usuario';
      }
    },

    loadMovie() {
      let movieTitle = this.$route.params.title.replace(/%20/g, " ").trim();
      this.fetchMovie(movieTitle);
    },
    goBack() {
      this.$router.push({ path: "/", query: { view: "forum" } });
    },
    rateMovie(rating) {
      if (!this.isAuthenticated) {
        // Mostrar mensaje si no está autenticado
        this.displayMessage("Debes iniciar sesión para puntuar películas.", true);
        return;
      }

      // Enviar puntuación al backend
      const payload = {
        userName: this.username,
        idMovie: this.movie.id,
        puntuacion: rating,
      };

      axios
          .put(`${BASE_URL}/movie/score`, payload)
          .then(() => {
            if (!this.hasRated) {
              this.currentRating = rating;
              this.hasRated = true;
              this.displayMessage(`Has puntuado esta película con ${rating} estrellas.`, false)
              // Volver a cargar los datos de la película para obtener el nuevo rating
              this.fetchMovie(this.movie.title);
            } else {
              this.displayMessage("Ya has puntuado esta película. Usa 'Modificar Puntuación' para cambiar tu voto.", true)
            }
          })
          .catch((error) => {
            console.error("Error al enviar la puntuación:", error);
            this.displayMessage("Hubo un error al enviar tu puntuación. Inténtalo de nuevo.", true);
          });

    },
    modifyRating() {
      this.hasRated = false;
    },

    async toggleFavorite() {
      if (!this.isAuthenticated) {
        this.displayMessage("Debes iniciar sesión para agregar a favoritos.", true);
        return;
      }

      try {
        // Enviar datos al backend
        const payload = {
          userName: this.username,
          idMovie: this.movie.id,
        };

        const response = await axios.put(`${BASE_URL}/movie/favorites`, payload);

        if (response.status === 200) {
          this.isFavorite = !this.isFavorite; // Cambiar estado local
          const message = this.isFavorite
              ? "Añadido a favoritos."
              : "Eliminado de favoritos.";

          this.displayMessage(message, !this.isFavorite);
        } else {
          throw new Error("No se pudo procesar la solicitud.");
        }
      } catch (error) {
        console.error("Error al añadir/eliminar de favoritos:", error);
        this.displayMessage("Hubo un error al procesar tu solicitud. Inténtalo de nuevo.", true);
      }

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

    publicarResena() {
      if (!this.isAuthenticated) {
        this.displayMessage("Debes iniciar sesión para publicar una reseña", true);
        return;
      }

      let userId = this.user.id;
      this.$router.push({path: `/resena/${this.movie.id}/${userId}`});
    },

    handleLike(reviewId) {
      if (!this.isAuthenticated) {
        this.displayMessage("Debes iniciar sesión para dar like.", true);
        return;
      }
      const review = this.reviews.find(r => r.id === reviewId);
      if (review) {
        // Lógica para enviar la acción al backend
        axios
            .put(`${BASE_URL}/review/like`, {userName: this.username, idReview: reviewId})
            .then(() => {
              // Después de la acción PUT, obtener los datos actualizados con GET
              return axios.get(`${BASE_URL}/review/${reviewId}`);
            })
            .then(response => {
              const updatedReview = response.data;

              // Actualizar el valor de likes y dislikes en la UI con los datos actualizados
              review.like = updatedReview.like;
              review.disLike = updatedReview.disLike;

            })
            .catch(error => {
              console.error("Error al dar like:", error);
            });
      }
    },

    handleDislike(reviewId) {
      if (!this.isAuthenticated) {
        this.displayMessage("Debes iniciar sesión para dar dislike.", true);
        return;
      }
      const review = this.reviews.find(r => r.id === reviewId);
      if (review) {

        // Lógica para enviar la acción al backend
        axios
            .put(`${BASE_URL}/review/dislike`, {userName: this.username, idReview: reviewId})
            .then(() => {
              // Después de la acción PUT, obtener los datos actualizados con GET
              return axios.get(`${BASE_URL}/review/${reviewId}`);
            })
            .then(response => {
              const updatedReview = response.data;

              // Actualizar el valor de likes y dislikes en la UI con los datos actualizados
              review.like = updatedReview.like;
              review.disLike = updatedReview.disLike;

            })
            .catch(error => {
              console.error("Error al dar dislike:", error);
            });
      }
    },

    openCommentModal(reviewId) {
      this.newComment = { content: "", reviewId };
      this.showCommentModal = true;
    },
    closeCommentModal() {
      this.showCommentModal = false;
      this.newComment = { content: "", reviewId: null };
    },
    async submitComment() {
      if (!this.newComment.content.trim()) {
        this.displayMessage("El comentario no puede estar vacío.", true);
        return;
      }

      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const payload = {
          content: this.newComment.content,
          author: this.username,
          review: this.newComment.reviewId,
        };
        console.log(payload);
        const response = await axios.post(`${BASE_URL}/comment`, payload);
        if (response.status === 200) {
          this.displayMessage("Comentario añadido correctamente.", false);
            // Después de la acción PUT, obtener los datos actualizados con GET
          const response1 = axios.get(`${BASE_URL}/review/${this.newComment.reviewId}`);

          const updatedReview = response.data;
          console.log(response1);
          // Actualizar el valor de comentarios
          this.newComment = updatedReview;

          this.closeCommentModal();
        }
      } catch (error) {
        console.error("Error añadiendo comentario:", error);
        this.displayMessage("Hubo un error al añadir el comentario.", true);
      }
    },
  },
};

</script>

<style scoped>
.stars {
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.star {
  font-size: 2rem;
  cursor: pointer;
  color: gray;
}

.star.selected {
  color: gold;
}

body {
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background-color: #222;
}

.btn-publicar {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  background-color: #3ce3e3;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
  color: #000;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-publicar:hover {
  background-color: #34c5c5;
  transform: scale(1.05);
}

.btn-publicar:active {
  transform: scale(0.95);
}

button svg {
  transition: all 0.3s ease;
}

button svg.fill-red-500 {
  transform: scale(1.1);
}

.review-container {
  height: 12rem;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scrollbar-width: thin;
}

.review-container::-webkit-scrollbar {
  width: 8px;
}

.review-container::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

.review-container::-webkit-scrollbar-track {
  background: #1f2937;
}

.review-card {
  background-color: #374151;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: white;
  scroll-snap-align: start;
}

.review-card h5 {
  margin-bottom: 0.5rem;
}

.review-card p {
  margin-top: 0.5rem;
}

.review-card .flex {
  margin-top: auto;
  gap: 1rem;
  justify-content: flex-end;
}

.review-card button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.review-card button:hover {
  color: #5ce1e6;
}
</style>