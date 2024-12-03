<template>
  <div class="favorites-container">
    <h2 class="title">Películas Favoritas</h2>

    <!-- Colección de tarjetas -->
    <div v-if="favoriteMovies.length > 0" class="card-grid">
      <div
          v-for="(movie) in favoriteMovies"
          :key="movie.id"
          class="movie-card"
      >
        <!-- Imagen de la película -->
        <div class="image-container">
          <img
              :src="movie.image"
              :alt="`Poster de ${movie.title}`"
              class="movie-poster"
          />
          <!-- Botón de corazón para eliminar -->
          <button
              @click="removeFromFavorites(movie.id)"
              class="favorite-button"
          >
            ❤️
          </button>
        </div>
        <!-- Título con enlace a la página de detalles -->
        <router-link
            :to="`/movie/${movie.title}`"
            class="movie-title"
        >
          {{ movie.title }}
        </router-link>
      </div>
    </div>

    <!-- Mensaje cuando no hay favoritos -->
    <p v-else class="no-favorites">
      No tienes películas en favoritos.
    </p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "FavoritesGrid",
  data() {
    return {
      favoriteMovies: [], // Lista de películas favoritas
      BASE_URL: process.env.VUE_APP_API_BASE_URL
    };
  },
  methods: {
    // Llama a la API para obtener las películas favoritas
    async fetchFavorites() {
      try {
        const userName = sessionStorage.getItem("username");
        const response = await axios.get(`${this.BASE_URL}/user/${userName}/favorites`);
        this.favoriteMovies = response.data; // Guarda los favoritos en el estado
      } catch (error) {
        console.error("Error fetching favorites:", error);
        alert("No se pudieron cargar tus películas favoritas.");
      }
    },

    // Llama a la API para eliminar una película de favoritos
    async removeFromFavorites(movieId) {
      try {
        // Enviar datos al backend
        const payload = {
          userName: sessionStorage.getItem("username"),
          idMovie: movieId,
        };

        const response = await axios.put(`${this.BASE_URL}/movie/favorites`, payload);

        if (response.status === 200) {
          // Actualiza la lista de favoritos
          this.favoriteMovies = this.favoriteMovies.filter(
              (movie) => movie.id !== movieId
          );
          alert("Película eliminada de tus favoritos.");
        }
      } catch (error) {
        console.error("Error removing favorite:", error);
        alert("No se pudo eliminar la película de favoritos.");
      }
    },
  },
  created() {
    // Carga las películas favoritas al montar el componente
    this.fetchFavorites();
  },
};
</script>

<style scoped>
.favorites-container {
  padding: 20px;
  background-color: #1a202c;
  color: white;
  font-family: Arial, sans-serif;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.movie-card {
  background-color: #2d3748;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.image-container {
  position: relative;
}

.movie-poster {
  width: 100%;
  height: auto;
  display: block;
}

.favorite-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: red;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease;
}

.favorite-button:hover {
  transform: scale(1.2);
}

.movie-title {
  display: block;
  padding: 10px;
  color: #61dafb;
  font-size: 16px;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
}

.movie-title:hover {
  text-decoration: underline;
}

.no-favorites {
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
}
</style>
