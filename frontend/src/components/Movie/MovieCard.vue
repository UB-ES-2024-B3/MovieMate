<template>
  <div class="min-h-screen grid place-items-center font-mono bg-gray-900">
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
                @click="goBack"
                class="flex items-center bg-gray-800 text-[#5ce1e6] font-bold px-4 py-2 rounded-md border-2 border-[#5ce1e6] shadow-lg hover:bg-[#5ce1e6] hover:text-gray-800 transition-all duration-300"
            >
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
                    @click="toggleFavorite"
                    @mouseover="showTooltip = true"
                    @mouseleave="showTooltip = false"
                    class="absolute top-4 right-4 bg-gray-800 text-[#5ce1e6] p-3 rounded-full shadow-md hover:bg-[#5ce1e6] hover:text-gray-800 transition-all duration-300"
                >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      :class="{ 'fill-red-500': isFavorite }"
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
                <hr class="custom-hr" />
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
            <div class="stars flex justify-center mb-4">
              <span
                  v-for="star in 5"
                  :key="star"
                  class="star"
                  :class="{ selected: star <= currentRating }"
                  @click="rateMovie(star)"
              >
                ★
              </span>
            </div>
            <p v-if="hasRated" class="text-center text-green-500 font-bold">
              Has puntuado esta película con {{ currentRating }} estrellas.
              <button
                  @click="modifyRating"
                  class="ml-2 text-sm bg-cyan-500 text-white px-2 py-1 rounded"
              >
                Modificar Puntuación
              </button>
            </p>
          </div>

          <!-- Mensaje de error -->
          <div
              v-if="showMessage"
              class="fixed top-4 right-4 p-4 rounded-md text-white shadow-lg bg-red-500"
          >
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
const BASE_URL = process.env.VUE_APP_API_BASE_URL;

export default {
  name: "MovieCard",
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
      isAuthenticated: false,
    };
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
    this.loadMovie();
  },
  watch: {
    "$route.params.title": "loadMovie",
  },
  methods: {
    async fetchMovie(title) {
      try {
        const response = await axios.get(`${BASE_URL}/movie/${title}`);
        const movieData = response.data;

        this.movie = {
          id: movieData._id,
          title: movieData._title,
          description: movieData._description,
          genres: Array.isArray(movieData._genres) ? movieData._genres : [movieData._genres],
          directors: movieData._directors,
          actors: movieData._actors,
          premiereDate: movieData._premiereDate,
          duration: movieData._duration,
          classification: movieData._classification,
          score: movieData._score,
          image: movieData._image,
          year: new Date(movieData._premiereDate).getFullYear(),
        };
      } catch (error) {
        this.errorMessage = "Error fetching movie details.";
        console.error("Error fetching movie details: ", error);
      }
    },
    loadMovie() {
      let movieTitle = this.$route.params.title;
      movieTitle = movieTitle.replace(/%20/g, " ");
      this.fetchMovie(movieTitle);
    },
    goBack() {
      this.$router.go(-1);
    },
    rateMovie(rating) {
      if (!this.isAuthenticated) {
        // Mostrar mensaje si no está autenticado
        this.displayMessage("Debes iniciar sesión para puntuar películas.");
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
              alert(`Has puntuado esta película con ${rating} estrellas.`);
              // Volver a cargar los datos de la película para obtener el nuevo rating
              this.fetchMovie(this.movie.title);
            } else {
              alert("Ya has puntuado esta película. Usa 'Modificar Puntuación' para cambiar tu voto.");
            }
          })
          .catch((error) => {
            console.error("Error al enviar la puntuación:", error);
            this.displayMessage("Hubo un error al enviar tu puntuación. Inténtalo de nuevo.");
          });

    },
    modifyRating() {
      this.hasRated = false;
    },

    async toggleFavorite() {
      if (!this.isAuthenticated) {
        this.displayMessage("Debes iniciar sesión para agregar a favoritos.");
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
          alert(message);
        } else {
          throw new Error("No se pudo procesar la solicitud.");
        }
      } catch (error) {
        console.error("Error al añadir/eliminar de favoritos:", error);
        this.displayMessage("Hubo un error al procesar tu solicitud. Inténtalo de nuevo.");
      }
    },

    displayMessage(message) {
      // Actualiza el mensaje y el estilo
      this.message = message;
      this.showMessage = true;

      // Oculta automáticamente el mensaje después de 3 segundos
      setTimeout(() => {
        this.showMessage = false;
        this.message = "";
      }, 3000);
    },
  },
};

</script>

<style scoped>
.custom-hr {
  border: 0;
  border-top: 1px solid #545454;
  margin: 16px 0;
}

.stars {
  display: flex;
  justify-content: center;
}

.star {
  font-size: 2rem;
  cursor: pointer;
  color: gray;
}

.star.selected {
  color: gold;
}

/* Tooltip y favoritos */
button svg {
  transition: all 0.3s ease;
}

button svg.fill-red-500 {
  transform: scale(1.1);
}

</style>