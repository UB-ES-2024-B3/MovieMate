<template>
  <div class="flex h-[calc(100vh-4rem)]" >
      <!-- Lateral izquierdo -->
      <aside class="bg-cyan-600 w-64 p-6 flex flex-col justify-between h-full">

      </aside>

      <main class="flex-1 bg-gray-900 p-6">
          <section class="mb-8">
              <h3 class="text-cyan-400 text-xl font-bold mb-4">TOP 10 PELICULAS</h3>
              <div class="grid grid-cols-5 gap-4">
                  <div
                          v-for="movie in movies"
                          :key="movie._id"
                          class="bg-gray-600 h-32 flex flex-col items-center justify-center rounded"
                  >
                      <router-link :to=" `/movie/${movie._id}` " >
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
      </main>


  </div>
</template>
<script>
import axios from "axios";
export default {
    name: "HomeView",
    data(){
        return{
            movies: []
        };
    },
    mounted() {
        this.fetchMovies();
    },

    methods:{
        async fetchMovies(){
            try{
                const BASE_URL = process.env['VUE_APP_API_BASE_URL']
                const response = await axios.get(`${BASE_URL}/movie/top10`, );
                this.movies = response.data;
            }catch (error){
                console.error("Error fetching movies: ", error);
            }
        }
    }
}
</script>

<style scoped>

</style>