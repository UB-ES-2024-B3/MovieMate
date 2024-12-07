<template>
  <div class="flex flex-col h-[100vh]">
      <header class="bg-cyan-600 h-16 flex items-center justify-between">
        <div class="flex flex-1">
          <!-- Botón de Películas -->
          <button
            :class="`flex-1 text-2xl p-2 flex items-center justify-center transition ${
              isMovies ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`"
            @click="isMovies = true"
          >
            <i class="fas fa-home"></i>
          </button>

          <!-- Botón de Fórum -->
          <button
            :class="`flex-1 text-2xl p-2 flex items-center justify-center transition ${
              !isMovies ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`"
            @click="isMovies = false"
          >
            <i class="fas fa-globe"></i>
          </button>
        </div>
      </header>
      <div class="flex h-[calc(100vh-4rem)]">
        <!-- Lateral izquierdo -->
        <aside class="bg-cyan-600 w-64 p-6 flex flex-col justify-between h-full">
          <div v-if="isMovies">
            <h2 class="text-white text-xl font-bold">PELÍCULAS</h2>
            <button class="mt-4 bg-gray-800 text-white rounded py-2 px-4 mb-2">CATEGORÍA 1</button>
            <button class="bg-gray-800 text-white rounded py-2 px-4 mb-2">CATEGORÍA 2</button>
            <button class="bg-gray-800 text-white rounded py-2 px-4">CATEGORÍA 3</button>
          </div>
          <div v-else>
            <h2 class="text-white text-xl font-bold">FÓRUM</h2>
            <button class="mt-4 bg-gray-800 text-white rounded py-2 px-4 mb-2">TEMA 1</button>
            <button class="bg-gray-800 text-white rounded py-2 px-4 mb-2">TEMA 2</button>
            <button class="bg-gray-800 text-white rounded py-2 px-4">TEMA 3</button>
          </div>
        </aside>

        <main class="flex-1 bg-gray-900 flex items-start justify-center pt-8">
          <div
            v-if="showMessage"
            :class="[
              'fixed top-4 right-4 p-4 rounded-md text-white shadow-lg',
              toastError ? 'bg-red-500' : 'bg-green-500'
            ]"
          >
            {{ message }}
          </div>

          <section v-if="isMovies && movies.length > 0" class="relative w-full">
            <h3 class="text-cyan-600 text-3xl font-bold mb-6 text-center">TOP 10 PELÍCULAS</h3>
            <div class="relative overflow-hidden w-full">
              <!-- Flecha Izquierda -->
              <button
                class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full w-12 h-12 z-10 flex items-center justify-center shadow hover:bg-gray-700"
                @click="scrollLeft"
              >
                &#8592;
              </button>

              <!-- Carrusel -->
              <div
                ref="scrollContainer"
                class="flex items-center overflow-x-hidden scroll-smooth w-full px-16"
              >
                <div
                  v-for="movie in movies"
                  :key="movie._id"
                  class="flex-shrink-0 bg-gray-700 text-center w-64 h-96 mx-4 rounded-lg shadow-lg p-4 flex flex-col items-center justify-between"
                >
                  <router-link :to="`/movie/${movie._title}`">
                    <img
                      v-if="movie?._image"
                      :src="movie._image"
                      alt="Movie Poster"
                      class="h-72 w-full object-cover rounded-lg hover:scale-105 transition duration-300"
                    />
                    <img
                      v-else
                      :src="'https://via.placeholder.com/100?text=' + movie._title"
                      alt="Movie Poster"
                      class="h-72 w-full object-cover rounded-lg hover:scale-105 transition duration-300"
                    />
                  </router-link>
                  <p class="text-white text-lg font-bold mt-4">{{ movie._title }}</p>
                </div>
              </div>

              <!-- Flecha Derecha -->
              <button
                class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full w-12 h-12 z-10 flex items-center justify-center shadow hover:bg-gray-700"
                @click="scrollRight"
              >
                &#8594;
              </button>
            </div>
          </section>
          <section v-else class="w-full px-6">
            <div v-for="post in forumPosts" :key="post.id" class="bg-gray-800 text-white p-6 rounded-lg mb-4 shadow-md flex flex-col w-full">
              <!-- Encabezado del post -->
              <div class="flex items-center mb-4">
                <i class="fas fa-user-circle text-4xl text-gray-400 mr-4"></i>
                <span class="font-bold text-cyan-400 text-lg">@{{ post.user }}</span>
              </div>

              <!-- Contenido del post -->
              <p class="text-gray-300 mb-4">{{ post.text }}</p>

              <!-- Botones de interacción -->
              <div class="flex justify-between items-center">
                <div class="flex space-x-4 text-gray-400">
                  <button class="hover:text-cyan-400 transition">
                    <i class="fas fa-thumbs-up"></i>
                  </button>
                  <button class="hover:text-cyan-400 transition">
                    <i class="fas fa-thumbs-down"></i>
                  </button>
                  <button class="hover:text-cyan-400 transition">
                    <i class="fas fa-comment"></i>
                  </button>
                </div>
                <button class="hover:text-cyan-400 transition text-gray-400">
                  <i class="fas fa-share"></i>
                </button>
              </div>
            </div>

            <!-- Botón "+" -->
            <button
              class="fixed bottom-6 right-6 bg-cyan-600 text-white text-4xl rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-cyan-500"
              @click="openModal"
            >
              <i class="fas fa-plus"></i>
            </button>

            <!-- Modal -->
            <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div class="bg-gray-800 rounded-lg w-96 p-6">
                <h2 class="text-white text-xl font-bold mb-4">Agregar Post</h2>

                <!-- Campo Título -->
                <label class="text-white text-sm mb-2 block" for="title">Título</label>
                <input
                  id="title"
                  v-model="newPost.title"
                  type="text"
                  class="w-full mb-4 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />

                <!-- Campo Post -->
                <label class="text-white text-sm mb-2 block" for="content">Post</label>
                <textarea
                  id="content"
                  v-model="newPost.content"
                  class="w-full mb-4 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  rows="4"
                ></textarea>

                <!-- Botones del Modal -->
                <div class="flex justify-end space-x-4">
                  <button
                    class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                    @click="closeModal"
                  >
                    Cancelar
                  </button>
                  <button
                    class="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-500"
                    @click="publishPost"
                  >
                    Publicar
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
    name: "HomeView",
    data(){
        return{
          forumPosts: [
            { id: 1, user: "usuario1", text: "Este es un comentario en el fórum." },
          ],
          isMovies: true,
          movies: [],
          autoScroll: null,
          isAuthenticated: false,
          username_actual: "",
          showMessage: false, // Controlar la visibilidad del mensaje
          message: "", // Mensaje a mostrar
          toastError: false, //Para enseñar si es error o no
          showModal: false,
          newPost: {
            title: "",
            content: "",
          },
        };
    },
    created() {
      // Verificamos si el token y el nombre de usuario están en sessionStorage
      const token = sessionStorage.getItem("auth_token");
      this.isAuthenticated = !!token;

      if (this.isAuthenticated) {
        this.username_actual = sessionStorage.getItem("username");
      }
    },
    mounted() {
        this.fetchMovies();
        this.startAutoScroll();
    },
    beforeUnmount() {
        this.stopAutoScroll();
    },

    methods:{
        async fetchMovies(){
            try{
                const BASE_URL = process.env['VUE_APP_API_BASE_URL']
                const response = await axios.get(`${BASE_URL}/movie/top10`, );
                this.movies = response.data;

                this.$nextTick(() => {
                    this.startAutoScroll();
                })
            }catch (error){
                console.error("Error fetching movies: ", error);
            }
        },

        scrollLeft(){
            const container = this.$refs.scrollContainer;
            if (!container) return;
            container.scrollLeft -= 300;
            this.restartAutoScroll();
        },

        scrollRight(){
            const container = this.$refs.scrollContainer;
            if (!container) return;
            container.scrollLeft += 300;
            this.restartAutoScroll();
        },

        startAutoScroll(){
            this.$nextTick(() => {
                const container = this.$refs.scrollContainer;
                if (!container) return;
                this.autoScroll = setInterval(() => {
                    if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
                        container.scrollLeft = 0;
                    } else {
                        container.scrollLeft += 300;
                    }
                }, 3000);
            });
        },

        stopAutoScroll(){
            if(this.autoScroll){
                clearInterval(this.autoScroll);
                this.autoScroll = null;
            }
        },

        restartAutoScroll(){
            this.stopAutoScroll();
            this.startAutoScroll();
        },

        displayMessage(message, error, callback) {
          this.message = message;
          this.showMessage = true;
          this.toastError = error;
          setTimeout(() => {
            this.showMessage = false;
            if (callback) callback();
          }, 5000);
        },

        openModal() {
          if (!this.isAuthenticated) {
            this.displayMessage("Debes iniciar sesión para agregar un post.", true);
            return;
          }
          this.showModal = true;
        },
        closeModal() {
          this.showModal = false;
          this.newPost.title = "";
          this.newPost.content = "";
        },

        publishPost() {
          if (!this.newPost.title || !this.newPost.content) {
            this.displayMessage("Todos los campos son obligatorios.", true);
            return;
          }

          // Agregar lógica para guardar el post
          this.forumPosts.push({
            id: this.forumPosts.length + 1,
            user: this.username_actual,
            text: this.newPost.content,
          });

          this.displayMessage("Post publicado exitosamente.", false);
          this.closeModal();
        },
    }
}
</script>

<style scoped>
.overflow-x-auto > div {
  scroll-snap-align: start;
}
::-webkit-scrollbar {
  display: none;
}
.scroll-smooth {
  scroll-behavior: smooth;
}
</style>
