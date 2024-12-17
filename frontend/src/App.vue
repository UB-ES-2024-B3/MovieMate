<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col h-screen">
    <header class="bg-header-color flex items-center justify-between p-4 border-gray-200">
      <router-link to="/" class="self-center text-2xl font-semibold whitespace-nowrap dark:text-cyan-600">
        <h1>MovieMate</h1>
      </router-link>

        <!-- Buscador  -->
        <div v-if="!hideSearch" class="relative flex items-center border-b-0" data-twe-input-wrapper-init data-twe-input-group-ref>
            <input
              v-model="searchQuery"
              type="search"
              class="peer block min-h-[auto] h-[2.5rem] w-[calc(100%-2.5rem)] rounded-l-md border-2 border-cyan-400 bg-transparent text-cyan-400 px-3 py-[0.32rem] leading-[1.6] focus:border-cyan-400 focus:ring-0 focus:text-cyan-400 dark:text-white dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:focus:border-cyan-400"
              aria-label="Search"
              placeholder="Search"
              id="search-input"
              @input="hideResults = false; search"
              aria-describedby="search-button"
            />

            <button
                    class="relative z-[2] flex items-center justify-center h-[2.5rem] w-[2.5rem] bg-cyan-400 text-xs font-medium text-white shadow-md transition duration-150 ease-in-out hover:bg-cyan-500 focus:outline-none"
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


        <div v-if="results && !hideResults"
             class="absolute top-full left-0 w-full bg-gray-800 rounded-lg shadow-lg mt-2 z-50 max-h-96 overflow-y-auto border border-gray-300 dark:border-gray-600">

          <!-- Usuarios -->
          <div v-if="results.users.length" class="p-4">
            <ul class="space-y-2">
              <li
                v-for="user in results.users"
                :key="user.userName"
                class="flex items-center space-x-3 p-2 border border-gray-200 rounded-md dark:border-gray-700">
                <router-link
                  :to="`/user/${user.userName}`"
                  class="flex items-center space-x-3 w-full no-underline hover:bg-gray-700 p-2 rounded"
                  @click="hideSearchResults">
                  <img
                    v-if="user?.image"
                    :src="user.image"
                    alt=""
                    class="w-10 h-10 rounded-full object-cover" />
                  <span v-else class="text-white text-5xl">&#128100;</span>
                  <div>
                    <div class="font-semibold text-cyan-400">@{{ user.userName }}</div>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Películas -->
          <div v-if="results.movies.length" class="p-4">
            <ul class="space-y-2">
              <li
                v-for="movie in results.movies"
                :key="movie._id"
                class="flex items-center space-x-3 p-2 border border-gray-200 rounded-md dark:border-gray-700">
                <router-link
                  :to="`/movie/${movie.title}`"
                  class="flex items-center space-x-3 w-full no-underline hover:bg-gray-700 p-2 rounded"
                  @click="hideSearchResults">
                  <img
                    v-if="movie?.image"
                    :src="movie.image"
                    alt="Movie image"
                    class="w-10 h-10 rounded-full object-cover" />
                  <span v-else class="text-white text-5xl">&#127909;</span>
                  <div>
                    <div class="font-semibold text-cyan-400">{{ movie.title }}</div>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Mensaje de ninguna coincidencia -->
          <div v-if="hasSearched && !results.users.length && !results.movies.length" class="p-4">
            <p class="text-white text-center">No hay coincidencia</p>
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

    <main class="flex-1 overflow-y-auto">
      <router-view></router-view>
    </main>

    <footer class="bg-gray-800 text-center text-sm p-4 mt-6">
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
      errorMessage: "",
      hideResults: false,
      hideSearch: false,
      hasSearched: false,
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
              this.results = { users: [], movies: [] };
              return;
          }

          this.hideResults = false;
          this.loading = true;
          this.errorMessage = "";
          try {
            const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
            console.log(this.searchQuery)

            const [usersResponse, moviesResponse] = await Promise.allSettled([
              axios.get(`${BASE_URL}/user/search`, { params: { query: this.searchQuery } }),
              axios.get(`${BASE_URL}/movie/search`, { params: { query: this.searchQuery } }),
            ]);

            this.results = {
              users: usersResponse.status === 'fulfilled' ? usersResponse.value.data : [],
              movies: moviesResponse.status === 'fulfilled' ? moviesResponse.value.data : [],
            };

            this.hasSearched = true;

            if (!this.results.users.length && !this.results.movies.length) {
              this.errorMessage = "No hay coincidencia";
            }
          } catch (error) {
            this.errorMessage = error.message || "An unexpected error occurred.";
            this.results = { users: [], movies: [] };
          } finally {
            this.loading = false;
          }
      },
        hideSearchResults(){
          this.hideResults = true;
          this.searchQuery = "";
        },

        beforeRouteEnter(to, from, next){
          console.log("utilitzat");
          next(vm => {
              if(to.query.query){
                  vm.searchQuery = to.query.query;
                  vm.search();
              }
          });
        },

        beforeRouteUpdate(to, from, next){
          console.log("utilitzat");
          if(this.query.query !== from.query.query){
              this.searchQuery = to.query.query || "";
              this.search();
          }
          next();
        }
    },
  watch: {
      $route(to) {
        const hiddenRoutes = ['/login', '/register', '/editar', '/recovery/:token'];
        this.hideSearch = hiddenRoutes.includes(to.path);
      },
    isAuthenticated(newVal) {
      if (newVal && this.username) {
        this.$router.push(`/user/${this.username}`);
      }
    },

  },

    mounted() {
      if(this.searchQuery.trim()){
          this.search();
      }
    }
};
</script>

