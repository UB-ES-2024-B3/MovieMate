<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col">
    <header class="bg-header-color flex items-center justify-between p-4 border-gray-200">
      <router-link to="/" class="self-center text-2xl font-semibold whitespace-nowrap dark:text-black">
        <h1>MovieMate</h1>
      </router-link>

        <!-- Buscador  -->
        <div   class="relative flex items-center" data-twe-input-wrapper-init data-twe-input-group-ref>
            <input
              v-model="searchQuery"
              type="search"
              class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
              aria-label="Search"
              placeholder="Search"
              id="search-input"
              @input="search"
              aria-describedby="search-button"
            />

            <label
                    for="search-input"
                    class = "pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[twe-input-state-active]:-translate-y-[0.9rem] peer-data-[twe-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-400 dark:peer-focus:text-primary">
                Search
            </label>

            <button
              class="relative z-[2] -ms-0.5 flex items-center rounded-e bg-blue-500 px-5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-600 hover:shadow-lg focus:bg-blue-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-700 active:shadow-lg dark:shadow-black/30 dark:hover:shadow-lg dark:focus:shadow-lg dark:active:shadow-lg"
              type="button"
              id="search-button"
              @click="search">
              <span class="[&>svg]:h-5 [&>svg]:w-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </span>
            </button>

        <div v-if="loading" class="mt-4 text-center">Loading...</div>

        <div v-if="results" class="bg-gray-800 rounded-lg p-4 space-y-2 max-h-96 overflow-y-auto">
          <!-- Usuarios -->
          <div v-if="results.users.length">
            <h2 class="text-lg font-bold text-white">Users</h2>
            <ul class="space-y-2">
              <li
                v-for="user in results.users"
                :key="user.userName"
                class="flex items-center space-x-3 p-2 border border-gray-200 rounded-md dark:border-gray-700">
                <img
                  v-if="user?.image"
                  :src="user.image"
                  alt="Profile"
                  class="w-10 h-10 rounded-full object-cover" />
                <span v-else class="text-white text-5xl">&#128100;</span>
                <div>
                  <div class="font-semibold text-white">{{ user.userName }}</div>
                  <p class="text-gray-400">{{ user.description }}</p>
                </div>
              </li>
            </ul>
          </div>

          <!-- Películas -->
          <div v-if="results.movies.length">
            <h2 class="text-lg font-bold text-white">Movies</h2>
            <ul class="space-y-2">
              <li
                v-for="movie in results.movies"
                :key="movie._title"
                class="flex items-center space-x-3 p-2 border border-gray-200 rounded-md dark:border-gray-700">
                <img
                  v-if="movie?._image"
                  :src="movie._image"
                  alt="Movie image"
                  class="w-10 h-10 rounded-full object-cover" />
                <img
                  v-else
                  :src="'https://via.placeholder.com/100?text=' + movie._title"
                  :alt="movie._title"
                  class="h-20 object-cover rounded mb-2" />
                <div>
                  <div class="font-semibold text-white">{{ movie._title }}</div>
                  <p class="text-gray-400">{{ movie._description }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>


      <router-link :to="isAuthenticated ? `/user/${username}` : '/register'">
        <button class="btn btn-dark p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" />
          </svg>
        </button>
      </router-link>
    </header>

    <main class="flex-grow">
      <router-view></router-view>
    </main>

    <footer class="bg-gray-800 text-center text-sm p-4">
      <p>&copy; 2024 MovieMate. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      isAuthenticated: false,
      username: '',
        results: {
            users: [],
            movies: [],
        },
      searchQuery: "",
      loading: false,
      errorMessage: false,
    };
  },
  created() {
    // Verificamos si el token y el nombre de usuario están en sessionStorage
    const token = sessionStorage.getItem("auth_token");

    this.isAuthenticated = !!token;

    if (this.isAuthenticated) {
      this.username = sessionStorage.getItem('username');
    }
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
    },
  watch: {
    isAuthenticated(newVal) {
      if (newVal && this.username) {
        // Redirige a la página del usuario cuando se autentique
        this.$router.push(`/user/${this.username}`);
      }
    }
  }
};
</script>

