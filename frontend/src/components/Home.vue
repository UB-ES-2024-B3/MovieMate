<template>
  <div class="flex h-[calc(100vh-4rem)]" >
      <!-- Lateral izquierdo -->
      <aside class="bg-cyan-600 w-64 p-6 flex flex-col justify-between h-full">

      </aside>

      <main class="flex-1 bg-gray-900 flex items-center justify-center">
      <section v-if="movies.length > 0" class="mb-8">
        <h3 class="text-cyan-400 text-3xl font-bold mb-4">TOP 10 PELÍCULAS</h3>
            <div class="overflow-x-auto flex justify-center items-center" style="width: 75rem;">
                <div
                        v-for="movie in movies"
                        :key="movie._id"
                        class="inline-block bg-gray-600 h-80 w-80 flex flex-col items-center justify-center rounded mx-6"
                >
                    <router-link :to="`/movie/${movie._title}`">
                        <button class="w-64 h-64 flex items-center justify-center rounded hover:brightness-110 hover:contrast-125 transition duration-300">
                            <img
                                    v-if="movie?._image"
                                    :src="movie._image"
                                    alt="Profile"
                                    class="h-64 w-64 object-contain rounded"
                            />
                            <img
                                    v-else
                                    :src="'https://via.placeholder.com/100?text=' + movie._title"
                                    :alt="movie._title"
                                    class="h-64 w-64 object-contain rounded"
                            />
                        </button>
                    </router-link>
                    <p class="text-white text-base font-bold">{{ movie._title }}</p>
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
.overflow-x-auto {
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
}
.overflow-x-auto > div {
  scroll-snap-align: start;
}
</style>