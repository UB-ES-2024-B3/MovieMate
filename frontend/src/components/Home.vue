<template>
  <div class="flex h-[calc(100vh-64px)]">
    <!-- Barra izquierda -->
    <div class="w-1/3 p-4 space-y-6">

      <!-- Buscador  -->
        <div class="flex items-center justify-center space-x-2">
            <span class="material-icons text-cyan-300">search</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="search"
              @input="search"
              class="px-4 py-2 border border-cyan-300 rounded-l-full bg-transparent text-white focus:outline-none"
            />
        <button @click="search" class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-r-full hover:bg-blue-600 focus:outline-none">
          Search
        </button>

        <div v-if="loading" class="mt-4 text-center">Loading...</div>

        <div v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</div>

          <div v-if="results">


            <!--USUARIOS-->
            <div v-if="results.users.length" class="mt-4">
                <h2 class="font-bold text-lg mb-2">Users</h2>
                <ul class="space-y-2 max-h-96 overflow-y-auto">
                    <li
                            v-for="user in results.users"
                            :key="user.userName"
                            class="flex items-center space-x-3 p-2 border border-gray-200 rounded-md"
                    >

                        <router-link :to="`/user/${user.userName}`" class="w-full">
                            <div class="flex items-center space-x-3">
                                <img
                                        v-if="user?.image"
                                        :src="user.image"
                                        alt="Profile"
                                        class="w-full h-full object-cover"
                                />
                                <span v-else class="text-white text-5xl">&#128100;</span>
                                <div>
                                    <div class="font-semibold">{{ user.userName }}</div>
                                    <p>{{ user.description }}</p>
                                </div>
                            </div>
                        </router-link>
                    </li>
                </ul>
            </div>

            <!-- PELICULAS -->
            <div v-if="results.movies.length" class="mt-4">
                <h2 class="font-bold text-lg mb-2">Movies</h2>
                <ul class="space-y-2 max-h-96 overflow-y-auto">
                    <li
                            v-for="movie in results.movies"
                            :key="movie.title"
                            class="flex items-center space-x-3 p-2 border border-gray-200 rounded-md"
                    >
                        <router-link :to="`/movie/${movie.title}`" class="w-full">
                            <div class="flex items-center space-x-3">
                                <img
                                        v-if="movie?.image"
                                        :src="movie.image"
                                        alt="Movie image"
                                        class="w-10 h-10 rounded-full"
                                />
                                <img
                                        v-else
                                        :src="'https://via.placeholder.com/100?text=' + movie._title"
                                        :alt="movie._title"
                                        class="h-20 object-cover rounded mb-2"
                                />
                                <div>
                                    <div class="font-semibold">{{ movie._title }}</div>
                                    <p>{{ movie._description }}</p>
                                </div>
                            </div>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
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
        results: {
            users: [],
            movies: [],
        },
      searchQuery: "",
      loading: false,
      errorMessage: false,
        movies: [],
    };
  },
  mounted() {
    this.fetchMovies();
  },
  methods: {
      async search() {
          if (!this.searchQuery.trim()) {
              this.errorMessage = "Please enter a search query";
              this.results = { users: [], movies: [] }; // Inicializado correctamente
              return;
          }

          this.loading = true;
          this.errorMessage = "";
          try {
            const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
            console.log("BASE_URL:", BASE_URL);


            const [usersResponse, moviesResponse] = await Promise.all([
              axios.get(`${BASE_URL}/user/search`, { params: { query: this.searchQuery } }),
              axios.get(`${BASE_URL}/movie/search`, { params: { query: this.searchQuery } }),
            ]);

            console.log(usersResponse);
            console.log(moviesResponse);


            this.results = {
                users: Array.isArray(usersResponse.data) ? usersResponse.data : [],
                movies: Array.isArray(moviesResponse.data) ? moviesResponse.data : [],
            };


            this.results = {
              users: Array.isArray(usersResponse.data) ? usersResponse.data : [],
              movies: Array.isArray(moviesResponse.data) ? moviesResponse.data : [],
            };

          } catch (error) {
            this.errorMessage = error.response?.data?.error || "An error occurred.";
            this.results = { users: [], movies: [] };
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
  },
};
</script>

<style scoped>
</style>
