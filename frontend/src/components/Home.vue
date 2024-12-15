<template>
  <div class="flex flex-col h-screen">
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
            @click="navigateToForum"
          >
            <i class="fas fa-globe"></i>
          </button>
        </div>
      </header>

    <!-- Panel de Filtros Horizontal -->
    <div v-if="isMovies" class="flex justify-center bg-gray-800 py-4 mb-6 rounded-lg shadow-md w-full min-h-59">
      <div class="flex items-center space-x-4 w-full max-w-screen-xl">
        <!-- Filtro de Género -->
        <div class="filter-group">
          <label for="genre" class="text-white font-semibold">Género</label>
          <select v-model="filters.genre" id="genre" class="bg-gray-700 text-white px-4 py-2 rounded-md shadow-md">
            <option value="">Todos</option>
            <option value="Acción">Acción</option>
            <option value="Comedia">Comedia</option>
            <option value="Drama">Drama</option>
            <option value="Terror">Terror</option>
          </select>
        </div>

        <!-- Filtro de Directores -->
        <div class="filter-group">
          <label for="director" class="text-white font-semibold">Director</label>
          <input
              v-model="filters.director"
              type="text"
              id="director"
              placeholder="Buscar Director"
              class="bg-gray-700 text-white px-4 py-2 rounded-md shadow-md"
          />
        </div>

        <!-- Filtro de Actores -->
        <div class="filter-group">
          <label for="actors" class="text-white font-semibold">Actores</label>
          <input
              v-model="filters.actors"
              type="text"
              id="actors"
              placeholder="Buscar Actores"
              class="bg-gray-700 text-white px-4 py-2 rounded-md shadow-md"
          />
        </div>

        <!-- Filtro de Año de Estreno -->
        <div class="filter-group">
          <label for="year" class="text-white font-semibold">Año de Estreno</label>
          <input
              v-model="filters.year"
              type="number"
              id="year"
              placeholder="Ej. 2010"
              class="bg-gray-700 text-white px-4 py-2 rounded-md shadow-md"
          />
        </div>

        <!-- Filtro de Duración -->
        <div class="filter-group">
          <label for="duration" class="text-white font-semibold">Duración (min)</label>
          <input
              v-model="filters.duration"
              type="number"
              id="duration"
              placeholder="Ej. 120"
              class="bg-gray-700 text-white px-4 py-2 rounded-md shadow-md"
          />
        </div>

        <!-- Filtro de Clasificación -->
        <div class="filter-group">
          <label for="classification" class="text-white font-semibold">Clasificación</label>
          <select v-model="filters.classification" id="classification" class="bg-gray-700 text-white px-4 py-2 rounded-md shadow-md">
            <option value="PG">PG</option>
            <option value="PG-13">PG-13</option>
            <option value="R">R</option>
            <option value="NC-17">NC-17</option>
          </select>
        </div>

        <!-- Filtro de Puntuación -->
        <div class="filter-group">
          <label for="score" class="text-white font-semibold">Puntuación</label>
          <input
              v-model="filters.score"
              type="number"
              id="score"
              min="0"
              max="10"
              step="0.1"
              placeholder="Ej. 8.0"
              class="bg-gray-700 text-white px-4 py-2 rounded-md shadow-md"
          />
        </div>

        <!-- Filtro de Total de Reseñas -->
        <div class="filter-group">
          <label for="reviews" class="text-white font-semibold">Total de Reseñas</label>
          <input
              v-model="filters.reviews"
              type="number"
              id="reviews"
              placeholder="Ej. 50"
              class="bg-gray-700 text-white px-4 py-2 rounded-md shadow-md"
          />
        </div>

        <!-- Botón Aplicar Filtros -->
        <div class="ml-4">
          <button
              @click="applyFilters"
              class="bg-cyan-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-cyan-700 transition duration-300"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>



    <div class="flex h-[calc(100vh-4rem)]">
        <!-- Lateral izquierdo -->
        <aside  v-if="!isMovies" class="bg-cyan-600 w-64 p-6 flex flex-col justify-between h-full">
          <div>
            <h2 class="text-white text-xl font-bold mb-4">Ordenar por:</h2>
            <div class="space-y-6">
              <!-- Grupo Recientes/Antiguos -->
              <div>
                <h3 class="text-gray-300 font-semibold mb-2">Por fecha:</h3>
                <div class="grid grid-cols-1 gap-2">
                  <button
                    :class="`w-full py-3 px-4 text-white font-medium rounded transition ${
                      sortByDate === 'recent'
                        ? 'bg-cyan-500 hover:bg-cyan-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`"
                    @click="setSortOrder('recent', 'date')"
                  >
                    <i class="fas fa-clock mr-2"></i> Más recientes
                  </button>
                  <button
                    :class="`w-full py-3 px-4 text-white font-medium rounded transition ${
                      sortByDate === 'oldest'
                        ? 'bg-cyan-500 hover:bg-cyan-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`"
                    @click="setSortOrder('oldest', 'date')"
                  >
                    <i class="fas fa-history mr-2"></i> Menos recientes
                  </button>
                </div>
              </div>

              <!-- Grupo Votados -->
              <div>
                <h3 class="text-gray-300 font-semibold mb-2">Por votos:</h3>
                <div class="grid grid-cols-1 gap-2">
                  <button
                    :class="`w-full py-3 px-4 text-white font-medium rounded transition ${
                      sortByVotes === 'votes'
                        ? 'bg-cyan-500 hover:bg-cyan-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`"
                    @click="setSortOrder('votes', 'votes')"
                  >
                    <i class="fas fa-thumbs-up mr-2"></i> Más votados
                  </button>
                  <button
                    :class="`w-full py-3 px-4 text-white font-medium rounded transition ${
                      sortByVotes === 'less_votes'
                        ? 'bg-cyan-500 hover:bg-cyan-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`"
                    @click="setSortOrder('less_votes', 'votes')"
                  >
                    <i class="fas fa-thumbs-down mr-2"></i> Menos votados
                  </button>
                </div>
              </div>
            </div>
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
          <section v-else class="w-full px-6 flex flex-col h-full">
            <!-- Contenedor con Scroll -->
            <div class="overflow-y-auto flex-1 pr-4" style="max-height: calc(100vh - 10rem);">
              <div
                v-for="post in forumPosts"
                :key="post.id"
                class="bg-gray-800 text-white p-6 rounded-lg mb-4 shadow-md flex flex-col w-full"
              >
                <!-- Encabezado del post -->
                <div class="flex items-center justify-between mb-4">
                  <!-- Información del Usuario -->
                  <div class="flex items-center">
                    <!-- Imagen del Usuario -->
                    <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-400 flex-shrink-0">
                      <img
                        v-if="post.author.image"
                        :src="post.author.image"
                        alt="Profile"
                        class="w-full h-full object-cover"
                      />
                      <i v-else class="fas fa-user-circle text-4xl text-gray-400"></i>
                    </div>

                    <!-- Nombre del Usuario -->
                    <router-link
                      :to="`/user/${post.author.userName}`"
                      class="font-bold text-cyan-400 text-lg hover:underline ml-4"
                    >
                      @{{ post.author.userName }}
                    </router-link>
                  </div>

                  <!-- Menú desplegable para tus posts -->
                  <div v-if="post.author.userName === username_actual" class="relative">
                    <button
                      class="text-gray-400 hover:text-cyan-400"
                      @click.stop="toggleDropdown(post.id)"
                    >
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <div
                      v-if="dropdownPost === post.id"
                      class="absolute right-0 bg-gray-700 text-white rounded shadow-md w-32"
                      @mouseleave="closeDropdown"
                    >
                      <button
                        class="block w-full px-4 py-2 text-left hover:bg-gray-600"
                        @click="editPost(post)"
                      >
                        Editar
                      </button>
                      <button
                        class="block w-full px-4 py-2 text-left hover:bg-gray-600"
                        @click="deletePost(post.id)"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Título del post con router-link -->
                <router-link
                  :to="{ path: `/post/${post.id}` }"
                  class="text-xl font-bold text-cyan-400 mb-2 hover:underline"
                >
                  {{ post.title }}
                </router-link>

                <!-- Contenido del post -->
                <p class="text-gray-300 mb-4">{{ post.post }}</p>

                <!-- Botones de interacción -->
                <div class="flex justify-between items-center">
                  <div class="flex items-center space-x-4 text-gray-400">
                    <!-- Botón de Like -->
                    <button
                      class="hover:text-cyan-400 transition"
                      :class="post.likedBy.includes(username_actual) ? 'text-cyan-400' : ''"
                      @click="addLike(post.id)"
                    >
                      <i class="fas fa-thumbs-up"></i>
                    </button>
                    <span>{{ post.like }}</span>

                    <!-- Botón de Dislike -->
                    <button
                      class="hover:text-cyan-400 transition"
                      :class="post.dislikedBy.includes(username_actual) ? 'text-cyan-400' : ''"
                      @click="addDislike(post.id)"
                    >
                      <i class="fas fa-thumbs-down"></i>
                    </button>
                    <span>{{ post.disLike }}</span>

                    <button class="hover:text-cyan-400 transition" @click="openCommentModal(post.id)">
                      <i class="fas fa-comment"></i>
                    </button>
                    <span>{{ post.totalComments }}</span>

                    <span class="text-xs text-gray-500">{{ formatDate(post.createdAt) }}</span>
                  </div>

                  <button class="hover:text-cyan-400 transition text-gray-400">
                    <i class="fas fa-share"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Botón "+" -->
            <button
              class="fixed bottom-6 right-6 bg-cyan-600 text-white text-4xl rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-cyan-500"
              @click="openModal"
            >
              <i class="fas fa-plus"></i>
            </button>

            <!-- Modal Add -->
            <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div class="bg-gray-800 rounded-lg w-96 p-6">
                <h2 class="text-white text-xl font-bold mb-4">
                  {{ isEditing ? "Editar Post" : "Agregar Post" }}
                </h2>

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
                    {{ isEditing ? "Editar" : "Publicar" }}
                  </button>
                </div>
              </div>
            </div>

            <div
              v-if="showDeleteModal"
              class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            >
              <div class="bg-gray-800 rounded-lg w-96 p-6">
                <h2 class="text-white text-xl font-bold mb-4">¿Seguro que quiere eliminar este post?</h2>

                <!-- Botones de Confirmación -->
                <div class="flex justify-end space-x-4">
                  <button
                    class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                    @click="closeDeleteModal"
                  >
                    No
                  </button>
                  <button
                    class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
                    @click="confirmDelete"
                  >
                    Sí
                  </button>
                </div>
              </div>
            </div>

            <div v-if="showCommentModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div class="bg-gray-800 rounded-lg w-96 p-6">
                <h2 class="text-white text-xl font-bold mb-4">Añadir Comentario</h2>
                <textarea
                  v-model="newComment.content"
                  placeholder="Escribe tu comentario aquí..."
                  class="w-full mb-4 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  rows="4"
                ></textarea>
                <div class="flex justify-end space-x-4">
                  <button
                    class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                    @click="closeCommentModal"
                  >
                    Cancelar
                  </button>
                  <button
                    class="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-500"
                    @click="submitComment"
                  >
                    Comentar
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
          forumPosts: [],
          isMovies: true,
          movies: [],
          autoScroll: null,
          isAuthenticated: false,
          username_actual: "",
          showMessage: false, // Controlar la visibilidad del mensaje
          message: "", // Mensaje a mostrar
          toastError: false, //Para enseñar si es error o no

          //Posts
          showModal: false,
          newPost: {
            title: "",
            content: "",
          },
          isEditing: false,
          dropdownPost: null,

          //Deletes
          showDeleteModal: false,
          postToDelete: null,

          //Sorts
          sortByDate: 'recent',
          sortByVotes: 'votes',

          //Comments
          showCommentModal: false,
          newComment: {
            content: "",
            postId: null,
          },

          filters: {
            genre: "",
            director: "",
            actors: "",
            year: "",
            duration: "",
            classification: "",
            score: "",
            reviews: "",
          },
        };
    },
    created() {
      this.initializeComponent();
    },
    mounted() {
        this.fetchMovies();
        this.startAutoScroll();
    },
    beforeUnmount() {
        this.stopAutoScroll();
    },

    methods:{
      setSortOrder(order, group) {
        if (group === 'date') {
          this.sortByDate = order;
        } else if (group === 'votes') {
          this.sortByVotes = order;
        }
        this.sortPosts();
      },
      sortPosts() {
        if (this.sortByDate === 'recent') {
          this.forumPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (this.sortByDate === 'oldest') {
          this.forumPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        if (this.sortByVotes === 'votes') {
          this.forumPosts.sort((a, b) => {
              if (b.like === a.like) {
                  return a.disLike - b.disLike;
              }
              return b.like - a.like;
          });
        } else if (this.sortByVotes === 'less_votes') {
          this.forumPosts.sort((a, b) => {
              if (a.like === b.like) {
                  return b.disLike - a.disLike;
              }
              return a.like - b.like;
          });
        }
      },
      formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
      },
      initializeComponent() {
        // Verificamos si el token y el nombre de usuario están en sessionStorage
        const token = sessionStorage.getItem("auth_token");
        this.isAuthenticated = !!token;

        if (this.isAuthenticated) {
          this.username_actual = sessionStorage.getItem("username")
          this.fetchPosts();
        }
      },
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
      async fetchPosts() {
        try {
          const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
          const response = await axios.get(`${BASE_URL}/post/all/${this.username_actual}`);
          const allPosts = response.data.allPosts;
          const likedPosts = new Set(response.data.likedPosts || []);
          const dislikedPosts = new Set(response.data.dislikedPosts || []);

          this.forumPosts = allPosts.map(post => ({
            ...post,
            likedBy: likedPosts.has(post.id) ? [this.username_actual] : [],
            dislikedBy: dislikedPosts.has(post.id) ? [this.username_actual] : [],
          }));

          this.sortPosts();
        } catch (error) {
          console.error("Error fetching posts:", error);
          this.displayMessage("Hubo un error al obtener los posts.", true);
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
      navigateToForum() {
        if (!this.isAuthenticated) {
          this.displayMessage("Debes iniciar sesión para acceder al fórum.", true);
          return;
        }
        this.isMovies = false;
      },
      openModal() {
        if (!this.isAuthenticated) {
          this.displayMessage("Debes iniciar sesión para agregar un post.", true);
          return;
        }
        this.isEditing = false;
        this.showModal = true;
        this.newPost = { title: "", content: "" };
      },
      editPost(post) {
        if (!this.isAuthenticated) {
          this.displayMessage("Debes iniciar sesión para editar un post.", true);
          return;
        }
        this.dropdownPost = post.id;
        this.isEditing = true;
        this.newPost = { id: post.id, title: post.title, content: post.post };
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
        this.newPost.title = "";
        this.newPost.content = "";
      },

      async publishPost() {
        if (!this.newPost.title || !this.newPost.content) {
          this.displayMessage("Todos los campos son obligatorios.", true);
          return;
        }

        try {
          const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
          const data = {
            title: this.newPost.title,
            post: this.newPost.content,
            author: this.username_actual,
          };
          let response = null;
          if (this.isEditing) {
            response = await axios.put(`${BASE_URL}/post/update/${this.newPost.id}`, data);
            if (response.status === 200) {
              this.displayMessage("Post editado exitosamente.", false);
            }
          } else {
            response = await axios.post(`${BASE_URL}/post`, data);
            if (response.status === 200) {
              this.displayMessage("Post publicado exitosamente.", false);
            }
          }
          await this.fetchPosts();
          this.closeModal()
        } catch (error) {
          console.error("Error publicando el post:", error);
          this.displayMessage("Hubo un error al conectarse con el servidor.", true);
        }
      },
      toggleDropdown(postId) {
        this.dropdownPost = this.dropdownPost === postId ? null : postId;
      },
      async deletePost(postId) {
        this.postToDelete = postId;
        this.showDeleteModal = true;
      },

      closeDeleteModal() {
        this.postToDelete = null;
        this.showDeleteModal = false;
      },

      closeDropdown() {
        this.dropdownPost = null;
      },

      async confirmDelete() {
        try {
          const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
          const response = await axios.delete(`${BASE_URL}/post/${this.postToDelete}`);
          if (response.status === 200) {
            this.displayMessage("Post eliminado correctamente.", true);
          }
          this.showDeleteModal = false;
          await this.fetchPosts();

        } catch (error) {
          console.error("Error deleting post:", error);
        }
      },
      async addLike(postId) {
        try {
          const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
          const payload = {
            userName: this.username_actual, // Usuario autenticado
            postId: postId, // ID del post
          };
          const post = this.forumPosts.find(post => post.id === postId);
          //En caso que tenga un like añadido...y quiera sacarlo
          if (post && post.likedBy.includes(this.username_actual)) {
            const response = await axios.put(`${BASE_URL}/post/like`, payload);
            if (response.status === 200) {
              this.displayMessage("¡Like retirado!", false);
              post.likedBy = post.likedBy.filter(user => user !== this.username_actual);
              post.like--;
            }
          } else {
            // En caso contrario, lo añade
            const response = await axios.put(`${BASE_URL}/post/like`, payload);
            if (response.status === 200) {
              this.displayMessage("¡Like añadido!", false);
              post.likedBy.push(this.username_actual);
              post.like++;
              // Saca el dislike si esta añadido, no puedes darle a las dos
              if (post.dislikedBy.includes(this.username_actual)) {
                post.dislikedBy = post.dislikedBy.filter(user => user !== this.username_actual);
                post.disLike--;
              }
            }
          }
          this.sortPosts()
        } catch (error) {
          console.error("Error añadiendo/removiendo like:", error);
          this.displayMessage("Error al procesar el like.", true);
        }
      },

      async addDislike(postId) {
        try {
          const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
          const payload = {
            userName: this.username_actual, // Usuario autenticado
            postId: postId, // ID del post
          };
          const post = this.forumPosts.find(post => post.id === postId);

          //En caso que tenga un like añadido...y quiera sacarlo
          if (post && post.dislikedBy.includes(this.username_actual)) {
            const response = await axios.put(`${BASE_URL}/post/dislike`, payload);
            if (response.status === 200) {
              this.displayMessage("¡Dislike retirado!", false);
              post.dislikedBy = post.dislikedBy.filter(user => user !== this.username_actual);
              post.disLike--;
            }
          } else {
            // En caso contrario, lo añade
            const response = await axios.put(`${BASE_URL}/post/dislike`, payload);
            if (response.status === 200) {
              this.displayMessage("¡Dislike añadido!", false);
              post.dislikedBy.push(this.username_actual);
              post.disLike++;
              // Saca el like si esta añadido, no puedes darle a las dos
              if (post.likedBy.includes(this.username_actual)) {
                post.likedBy = post.likedBy.filter(user => user !== this.username_actual);
                post.like--;
              }
            }
          }
          this.sortPosts()
        } catch (error) {
          console.error("Error añadiendo/removiendo dislike:", error);
          this.displayMessage("Error al procesar el dislike.", true);
        }
      },
      openCommentModal(postId) {
        this.newComment = { content: "", postId };
        this.showCommentModal = true;
      },
      closeCommentModal() {
        this.showCommentModal = false;
        this.newComment = { content: "", postId: null };
      },
      async submitComment() {
        if (!this.newComment.content.trim()) {
          this.displayMessage("El comentario no puede estar vacío.", true);
          return;
        }

        try {
          const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
          const payload = {
            content: this.newComment.content,
            author: this.username_actual,
            post: this.newComment.postId,
          };
          const response = await axios.post(`${BASE_URL}/comment`, payload);
          if (response.status === 200) {
            this.displayMessage("Comentario añadido correctamente.", false);
            this.fetchPosts();
            this.closeCommentModal();
          }
        } catch (error) {
          console.error("Error añadiendo comentario:", error);
          this.displayMessage("Hubo un error al añadir el comentario.", true);
        }
      },

      // Método para aplicar los filtros
      async applyFilters() {

        try {
          const payload = {
            genre: this.filters.genre || '', // Asignar vacío si no está seleccionado
            director: this.filters.director || '',
            actors: this.filters.actors || '',
            premiereYear: this.filters.year || '',
            duration: this.filters.duration || '',
            classification: this.filters.classification || '',
            score: this.filters.score || '',
            totalReviews: this.filters.reviews || ''
          };
          const BASE_URL = process.env['VUE_APP_API_BASE_URL']
          const response = await axios.post(`${BASE_URL}/movie/get-filtered?pageNumber=1&maxPageSize=10`, payload);

          if (response.status === 200) {
            console.log(response.data.movies); // Ajusta según la estructura de tu respuesta
          } else {
            this.showMessage = true;
            this.toastError = true;
            this.message = "Error al obtener las películas.";
          }
        } catch (error) {
          this.showMessage = true;
          this.toastError = true;
          this.message = "Hubo un error al procesar la solicitud.";
        }
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
.filter-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.filter-group label {
  font-size: 0.875rem;
  margin-bottom: 8px;
}

.filter-group select,
.filter-group input {
  font-size: 1rem;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 8px;
  background-color: #2d2d2d;
  color: white;
}

.filter-group input::placeholder {
  color: #888;
}

.filter-group select,
.filter-group input {
  transition: all 0.3s ease;
}

.filter-group select:hover,
.filter-group input:hover {
  border-color: #00b5e2;
}

.filter-button {
  transition: all 0.3s ease;
}
.filter-button:hover {
  transform: scale(1.05);
}

</style>
