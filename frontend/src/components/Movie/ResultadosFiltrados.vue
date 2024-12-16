<template>
  <div class="min-h-screen grid place-items-center font-mono bg-gray-900">
    <div class="flex w-full h-full">
      <!-- Contenido principal -->
      <div class="w-full">
        <div class="max-w-6xl mx-auto">
          <!-- Botón de retroceso -->
          <div class="mb-4">
            <button
                class="flex items-center bg-gray-800 text-[#5ce1e6] font-bold px-4 py-2 rounded-md border-2 border-[#5ce1e6] shadow-lg hover:bg-[#5ce1e6] hover:text-gray-800 transition-all duration-300"
                @click="goBack"
            >
              <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                    clip-rule="evenodd"
                    d="M10 18a1 1 0 01-.707-.293l-7-7a1 1 0 010-1.414l7-7a1 1 0 011.414 1.414L4.414 10l6.293 6.293A1 1 0 0110 18z"
                    fill-rule="evenodd"
                />
              </svg>
              Back
            </button>
          </div>

          <!-- Mostrar películas filtradas -->
          <div v-if="movies.length > 0">
            <div v-for="(movie, index) in movies" :key="index" class="bg-[#5ce1e6] rounded-md shadow-lg relative mb-6">
              <div class="md:flex px-8 py-4 leading-none"> <!-- Reduje el padding en el contenedor de la película -->
                <div class="flex-none mr-6 relative"> <!-- Reducí el margen derecho -->
                  <img :src="movie.image" alt="Movie Poster" class="h-56 w-48 rounded-md shadow-2xl border-4 border-gray-300" /> <!-- Imagen más pequeña -->
                </div>
                <div class="flex-col text-[#545454]">
                  <p class="pt-4 text-2xl font-bold"> <router-link :to="`/movie/${movie.title}`">{{ movie.title }} ({{ movie.year }})</router-link></p> <!-- Reduje el tamaño del texto -->
                  <hr class="custom-hr" />
                  <div class="text-md flex justify-between my-4">
                    <span class="font-bold">{{ movie.duration }} min | {{ movie.genres}}</span>
                  </div>
                  <p class="text-md">
                    Rating: {{ movie.score }} / 5
                    <span class="font-bold px-2">|</span>
                    Classification: {{ movie.classification }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Información de paginación con números de página -->
          <div v-if="paginationInfo" class="mt-6 text-center text-gray-400">
            <p>Películas encontradas: {{ paginationInfo.moviesFound }}</p>

            <!-- Paginador con números de página -->
            <div class="flex justify-center space-x-2 mt-4">
              <button
                  v-if="paginationInfo.actualPage > 1"
                  @click="fetchMovies(paginationInfo.actualPage - 1)"
                  class="bg-blue-500 text-white p-2 rounded-md"
              >
                Anterior
              </button>

              <!-- Mostrar números de página -->
              <button
                  v-for="page in pageNumbers"
                  :key="page"
                  :class="{
                  'bg-blue-500 text-white': page === paginationInfo.actualPage,
                  'bg-gray-800 text-[#5ce1e6]': page !== paginationInfo.actualPage
                }"
                  @click="fetchMovies(page)"
                  class="p-2 rounded-md"
              >
                {{ page }}
              </button>

              <button
                  v-if="paginationInfo.actualPage < paginationInfo.totalPages"
                  @click="fetchMovies(paginationInfo.actualPage + 1)"
                  class="bg-blue-500 text-white p-2 rounded-md"
              >
                Siguiente
              </button>
            </div>
          </div>

          <div v-else class="text-center text-gray-400">No se encontraron películas.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: 'FilteredMovies',
  data() {
    const storedData = JSON.parse(sessionStorage.getItem('filteredMovies')) || {};
    return {
      movies: [],  // Almacena las películas filtradas
      paginationInfo: null,  // Almacena la información de paginación
      filters: storedData.filters || {},  // Filtros aplicados, si existen
      pageNumbers: []  // Números de página a mostrar
    };
  },

  watch: {
    'paginationInfo.totalPages'(newVal) {
      this.updatePageNumbers(newVal);
    },
    'paginationInfo.actualPage'() {
      this.updatePageNumbers(this.paginationInfo.totalPages);
    }
  },

  methods: {
    goBack() {
      this.$router.push({ path: '/', query: { view: 'forum' } });
    },

    // Actualiza los números de página según la paginación
    updatePageNumbers(totalPages) {
      const start = Math.max(1, this.paginationInfo.actualPage - 10);
      const end = Math.min(totalPages, this.paginationInfo.actualPage + 10);
      this.pageNumbers = [];
      for (let i = start; i <= end; i++) {
        this.pageNumbers.push(i);
      }
    },

    // Realizar la solicitud cuando el componente se monta
    async fetchMovies(page) {
      try {
        const BASE_URL = process.env['VUE_APP_API_BASE_URL'];

        // Realiza la solicitud GET al backend
        const response = await axios.post(`${BASE_URL}/movie/get-filtered?pageNumber=${page}&maxPageSize=10`, this.filters);
        console.log(response.data);

        // Actualiza las películas y la información de la paginación
        this.movies = response.data.movies;
        this.paginationInfo = response.data.paginationInfo;
        this.updatePageNumbers(this.paginationInfo.totalPages);

        // Para cada película, hacer un "fetch" de los detalles adicionales
        this.movies.forEach((movie, index) => {
          this.fetchMovie(movie.title, index);
        });
      } catch (error) {
        console.error('Error al cargar las películas:', error);
      }
    },

    // Fetch detalles adicionales de cada película
    async fetchMovie(title, index) {
      try {
        const BASE_URL = process.env.VUE_APP_API_BASE_URL;
        const response = await axios.get(`${BASE_URL}/movie/${title}`);

        // Ajusta los datos de la película con los detalles completos
        const movie = response.data.movie;

        console.log(movie);
        this.movies[index] = {
          ...this.movies[index],  // Mantiene los datos originales
          directors: movie._directors || [],
          actors: movie._actors || [],
          premiereDate: movie._premiereDate || "",
          genres: Array.isArray(movie._genres) ? movie._genres : [movie._genres],
          duration: movie._duration || 0,
          classification: movie._classification || "No clasificado",
          score: movie._score || 0,
          year: movie._premiereDate ? new Date(movie._premiereDate).getFullYear() : "N/A",
        };

        console.log(this.movies[index]);
      } catch (error) {
        console.error('Error al obtener los detalles de la película:', error);
      }
    }
  },

  mounted() {
    // Llama a la función para cargar las películas de la primera página
    this.fetchMovies(1);
  }
};

</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background-color: #222;
}
</style>
