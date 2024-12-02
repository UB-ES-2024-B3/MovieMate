<template>
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

        <div
          class="w-full sm:w-[700px] max-w-2xl form_background_input rounded-lg shadow-lg md:mt-0 sm:max-w-md xl:p-6"
        >
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <!-- Mostrar el Título de la Reseña -->
            <h1
              class="text-xl font-bold leading-tight tracking-tight form_title_text md:text-2xl"
            >
              {{ review.title }}
            </h1>

            <!-- Mostrar el nombre del autor (username) y el título de la película -->
            <div class="text-sm text-gray-600">
              <p><strong>Autor:</strong> {{ user.userName }}</p>
              <p><strong>Título de la película:</strong> {{ movie.title }}</p>
            </div>

            <div class="space-y-4 md:space-y-6">
              <!-- RESEÑA -->
              <div>
                <p
                  class="form_text_input text-sm rounded-lg block w-full p-2.5"
                >
                  <strong>Reseña:</strong> {{ review.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
          <div class="flex justify-between items-center mt-6 space-x-3">


              <!-- Botón de intracción-->
              <button class="text-gray-400 hover:text-cyan-400 transition">
                  <i class="fas fa-thumbs-up"></i>
              </button>

              <button class="text-gray-400 hover:text-cyan-400 transition">
                  <i class="fas fa-thumbs-down"></i>
              </button>

              <button class="text-gray-400 hover:text-cyan-400 transition">
                  <i class="fas fa-comment"></i>
              </button>

          </div>
      </div>

</template>

<script>
import axios from "axios";

export default {
    name: "Review",
    data(){
        return{
            review: null,
            movie: null,
            user: null,
        }
    },

    mounted() {
        this.fetchReviewData();
        this.fetchMovieData(review.movieId);
        this.fetchUserData(review.userId);
    },

    methods: {
        async fetchReviewData() {
            try {
                const BASE_URL = process.env['VUE_APP_API_BASE_URL']
                const response = await axios.get(`${BASE_URL}/review/${this.$route.params.id}`);

                const review = response.data;
                this.review = {
                    title: review.title,
                    content: review.review,
                    authorId: review.author,
                    movieId: review.movie,
                };

            } catch (error) {
                this.error = 'No se puede cargar la información de la reseña';
                console.error("Error al obtener los datos de la reseña:", error);
            }
        },

        async fetchMovieData(id){
            try {
                const BASE_URL = process.env.VUE_APP_API_BASE_URL;
                const response = await axios.get(`${BASE_URL}/movie/${id}`);

                // Ajusta la desestructuración con los nombres correctos
                const movie= response.data;

                // Asigna los datos correctamente al objeto `movie`
                this.movie = {
                  id: movie._id,
                  title: movie._title,
                  description: movie._description,
                  genres: Array.isArray(movie._genres) ? movie._genres : [movie._genres],
                  directors: movie._directors || [],
                  actors: movie._actors || [],
                  premiereDate: movie._premiereDate || "",
                  duration: movie._duration || 0,
                  classification: movie._classification || "No clasificado",
                  score: movie._score || 0,
                  image: movie._image || "",
                  year: movie._premiereDate ? new Date(movie._premiereDate).getFullYear() : "N/A",
                };
            } catch (error) {
                this.errorMessage = "Error al obtener los detalles de la película.";
                console.error("Error fetching movie details:", error.message);
            }
        },

        async fetchUserData(id){
            try {
                const BASE_URL = process.env.VUE_APP_API_BASE_URL;
                const response = await axios.get(`${BASE_URL}/user/${id}`);

                // Ajusta la desestructuración con los nombres correctos
                const { user,isOwnProfile, reviews } = response.data;

                // Asigna los datos correctamente al objeto `user`
                this.user = {
                    id: user.id,
                    userName: user.userName,
                    email: user.email,
                    gender: user.gender,
                    description: user.description,
                    isAdmin: user.isAdmin,
                    image: user.image,
                };
            } catch (error) {
                this.errorMessage = "Error al obtener los detalles del usuario.";
                console.error("Error fetching user details:", error.message);
            }
        },
    }
}

</script>

<style scoped>

</style>