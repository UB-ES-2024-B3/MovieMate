<template>
  <div class="movie-card-container p-4 max-w-3xl mx-auto">
    <!-- Botón para regresar -->
    <button @click="goBack" class="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md">
      ⬅ Back
    </button>

    <!-- Imagen de la película -->
    <div class="movie-image mb-4">
      <img :src="movie.image" alt="Movie Poster" class="w-full h-auto object-cover rounded-md" />
    </div>

    <!-- Detalles de la película -->
    <div class="movie-details">
      <h2 class="text-2xl font-bold text-cyan-400 mb-2">{{ movie.title }}</h2>
      <p class="text-lg mb-4">{{ movie.description }}</p>

      <!-- Géneros -->
      <div class="genres mb-4">
        <span class="font-semibold">Genres:</span>
        <ul class="flex space-x-2">
          <li v-for="genre in movie.genres" :key="genre" class="bg-gray-200 px-2 py-1 rounded-md">
            {{ genre }}
          </li>
        </ul>
      </div>

      <!-- Directores -->
      <div class="directors mb-4">
        <span class="font-semibold">Directors:</span>
        <ul>
          <li v-for="director in movie.directors" :key="director">{{ director }}</li>
        </ul>
      </div>

      <!-- Actores -->
      <div class="actors mb-4">
        <span class="font-semibold">Actors:</span>
        <ul>
          <li v-for="actor in movie.actors" :key="actor">{{ actor }}</li>
        </ul>
      </div>

      <!-- Fecha de estreno -->
      <div class="premiere mb-4">
        <span class="font-semibold">Premiere Date:</span>
        <p>{{ movie.premiereDate }}</p>
      </div>

      <!-- Duración -->
      <div class="duration mb-4">
        <span class="font-semibold">Duration:</span>
        <p>{{ movie.duration }} minutes</p>
      </div>

      <!-- Clasificación -->
      <div class="classification mb-4">
        <span class="font-semibold">Classification:</span>
        <p>{{ movie.classification }}</p>
      </div>

      <!-- Puntuación -->
      <div class="score mb-4">
        <span class="font-semibold">Score:</span>
        <p>{{ movie.score }} / 10</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MovieCard",
  data() {
    return {
      movie: {
        title: "",
        description: "",
        genres: [],
        directors: [],
        actors: [],
        premiereDate: "",
        duration: "",
        classification: "",
        score: "",
        image: "",
      },
      errorMessage: "",
    };
  },
  mounted() {
    let movieTitle = this.$route.params.title; // Obtiene el título de la película desde la URL
      movieTitle = movieTitle.replace("%20", ""); // Remueve el espacio codificado
      movieTitle.toString();
    this.fetchMovie(movieTitle); // Llama a la función para obtener los detalles de la película
  },
  methods: {
    async fetchMovie(title) {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const response = await axios.get(`${BASE_URL}/movie/${title}`); // Llama al backend con el titulo de la película
          console.log(title);
        const movieData = response.data;

        // Asigna la información de la película a la propiedad movie
        this.movie = {
          title: movieData.title,
          description: movieData.description,
          genres: movieData.genres,
          directors: movieData.directors,
          actors: movieData.actors,
          premiereDate: movieData.premiereDate,
          duration: movieData.duration,
          classification: movieData.classification,
          score: movieData.score,
          image: movieData.image ? `data:image/jpeg;base64,${movieData.image}` : 'default-image.jpg', // Convierte la imagen a base64 si existe
        };
      } catch (error) {
        this.errorMessage = "Error fetching movie details.";
        console.error("Error fetching movie details: ", error);
      }
    },
    goBack() {
      this.$router.go(-1); // Vuelve a la página anterior
    },
  },
};
</script>

<style scoped>
.movie-card-container {
  background-color: #1a202c; /* Fondo oscuro */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.movie-details {
  color: #f7fafc;
}

.movie-details h2 {
  color: #fbbf24;
}

.movie-details ul {
  list-style-type: none;
  padding-left: 0;
}

.movie-details ul li {
  color: #e2e8f0;
  margin-bottom: 0.5rem;
}
</style>
