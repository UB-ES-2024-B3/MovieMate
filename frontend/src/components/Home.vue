<template>
  <div class="flex h-[calc(100vh-64px)]">
    <!-- Barra izquierda -->
    <div class="w-1/3 p-4 space-y-6">
      <!-- Buscador de Usuarios -->
      <div class="w-full">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search for users..."
          @input="searchUsers"
          class="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <button @click="searchUsers" class="w-full py-2 mt-2 bg-blue-500 text-white rounded-md">
          Search Users
        </button>

        <div v-if="loading" class="mt-4 text-center">Loading...</div>

        <div v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</div>

        <!-- Lista de usuarios -->
        <ul v-if="users.length" class="mt-4 space-y-2 max-h-96 overflow-y-auto">
          <li
            v-for="user in users"
            :key="user.userName"
            class="flex items-center space-x-3 p-2 border border-gray-200 rounded-md"
          >
            <router-link :to="`/user/${user.userName}`" class="w-full">
              <div class="flex items-center space-x-3">
                <img
                  :src="user.image || 'default-avatar.png'"
                  alt="User image"
                  class="w-10 h-10 rounded-full"
                />
                <div>
                  <div class="font-semibold">{{ user.userName }}</div>
                  <p>{{ user.description }}</p>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Buscador de Películas (por ahora no funciona) -->
      <div class="w-full mt-8">
        <input
          v-model="movieSearchQuery"
          type="text"
          placeholder="Search for movies..."
          @input="searchMovies"
          class="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <button @click="searchMovies" class="w-full py-2 mt-2 bg-green-500 text-white rounded-md">
          Search Movies Now
        </button>
      </div>
    </div>

    <!-- Barra derecha con el Top 10 de Películas -->
    <div class="w-2/3 p-4">
      <section v-if="movies.length > 0" class="mb-8">
        <h3 class="text-cyan-400 text-xl font-bold mb-4">TOP 10 PELÍCULAS</h3>
        <div class="grid grid-cols-5 gap-4">
          <div
            v-for="movie in movies"
            :key="movie._id"
            class="bg-gray-600 h-32 flex flex-col items-center justify-center rounded"
          >
            <router-link :to="`/movie/${movie._title}`">
              <button class="w-20 h-20 rounded mb-2 hover:brightness-110 hover:contrast-125 transition duration-300">
                              <img
                                      v-if="movie?._image"
                                      :src="movie._image"
                                      alt="Profile"
                                      class="h-20 object-cover rounded mb-2"
                              />

                              <img
                                  v-else
                                  :src="'https://via.placeholder.com/100?text=' + movie._title"
                                  :alt="movie._title"
                                  class="h-20 object-cover rounded mb-2"
                              />
                          </button>
            </router-link>
            <p class="text-white text-sm font-bold">{{ movie._title }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomeView",
  data() {
    return {
      users: [],
      movies: [],
      searchQuery: "",
      movieSearchQuery: "",
      loading: false,
      errorMessage: false,
    };
  },
  mounted() {
    this.fetchMovies();
  },
  methods: {
    // Buscar usuarios dinámicamente mientras el usuario escribe
    async searchUsers() {
      if (!this.searchQuery.trim()) {
        this.errorMessage = "Please enter a search query.";
        this.users = [];
        return;
      }

      this.loading = true;
      this.errorMessage = "";
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const response = await axios.get(`${BASE_URL}/user/search`, {
          params: { query: this.searchQuery },
        });
        this.users = response.data;
      } catch (error) {
        this.errorMessage = error.response?.data?.error || "An error occurred.";
        this.users = [];
      } finally {
        this.loading = false;
      }
    },

    // Obtener el Top 10 de películas al cargar el componente
    async fetchMovies() {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const response = await axios.get(`${BASE_URL}/movie/top10`);
        this.movies = response.data;
        console.log(this.movies)
      } catch (error) {
        console.error("Error fetching movies: ", error);
      }
    },

    // Función placeholder para la búsqueda de películas (por ahora no se usa)
    async searchMovies() {
      if (!this.movieSearchQuery.trim()) {
        this.errorMessage = "Please enter a search query.";
        this.movies = [];
        return;
      }

      this.loading = true;
      this.errorMessage = "";
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const response = await axios.get(`${BASE_URL}/movie/search`, {
          params: { query: this.movieSearchQuery },
        });
        this.movies = response.data;
      } catch (error) {
        this.errorMessage = error.response?.data?.error || "An error occurred.";
        this.movies = [];
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
</style>
