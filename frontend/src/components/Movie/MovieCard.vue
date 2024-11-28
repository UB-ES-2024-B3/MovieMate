<template>
  <div class="min-h-screen grid place-items-center font-mono bg-gray-900">
    <div class="flex w-full h-full">
      <!-- Lateral izquierdo -->
      <aside class="bg-cyan-600 w-64 p-6 flex flex-col justify-between fixed top-16 left-0 h-[calc(100vh-64px)]">
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
          <div class="bg-[#5ce1e6] rounded-md shadow-lg">
            <div class="md:flex px-8 py-6 leading-none">
              <!-- Imagen de la película -->
              <div class="flex-none mr-8">
                <img
                  :src="movie.image"
                  alt="Movie Poster"
                  class="h-80 w-64 rounded-md shadow-2xl border-4 border-gray-300"
                />
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
                  Rating: {{ movie.score }} / 10
                  <span class="font-bold px-2">|</span>
                  Classification: {{ movie.classification }}
                </p>
              </div>
            </div>
          </div>
        </div>
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
          totalReviews: "",
        image: "",
          year: "",
      },
      errorMessage: "",
    };
  },
  mounted() {
      this.loadMovie();
  },
    watch: {
      "$route.params.title": "loadMovie", // Observa cambios y llama a la función directamente
  },
  methods: {
    async fetchMovie(title) {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const response = await axios.get(`${BASE_URL}/movie/${title}`);
        const movieData = response.data;

        // Asigna la información de la película
        this.movie = {
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
      loadMovie(){
        let movieTitle = this.$route.params.title;
        movieTitle = movieTitle.replace(/%20/g, "");
        this.fetchMovie(movieTitle);
      },
    goBack() {
      this.$router.go(-1);
    },
      beforeRouteUpdate(to, from, next){
        if(to.params.title !== from.params.title){
            this.loadMovie();
        }
        next();
      }
  },
};
</script>

<style scoped>
.custom-hr {
  border: 0;
  border-top: 1px solid #545454; /* Color del texto */
  margin: 16px 0;
}
</style>
