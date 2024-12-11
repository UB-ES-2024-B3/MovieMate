<template>
  <div class="flex h-screen">
    <!-- Lado izquierdo -->
    <aside class="bg-cyan-600 w-64 p-6 flex flex-col justify-between h-full">
      <!-- Menú lateral (opcional, puedes llenarlo según tu necesidad) -->
    </aside>

    <!-- Contenido Principal -->
    <main class="flex-1 bg-gray-900 p-6">
      <div
        v-if="showMessage"
        :class="[
          'fixed top-4 right-4 p-4 rounded-md text-white shadow-lg',
          toastError ? 'bg-red-500' : 'bg-green-500'
        ]"
      >
        {{ message }}
      </div>

      <button
        class="flex items-center text-cyan-400 hover:text-cyan-300 mb-6"
        @click="navigateToForum"
      >
        <i class="fas fa-arrow-left mr-2"></i> Volver
      </button>


      <div
        v-if="post"
        class="bg-gray-800 text-white p-6 rounded-lg shadow-md flex flex-col"
      >
        <!-- Encabezado del post -->
        <div class="flex items-center justify-between mb-4">
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
            <span class="font-bold text-cyan-400 text-lg ml-4">
              @{{ post.author.userName }}
            </span>
          </div>

          <!-- Opciones de editar/eliminar si el post pertenece al usuario actual -->
          <div v-if="post.author.userName === username_actual" class="relative">
            <button
              class="text-gray-400 hover:text-cyan-400"
              @click="toggleDropdown"
            >
              <i class="fas fa-ellipsis-v"></i>
            </button>
            <div
              v-if="dropdownVisible"
              class="absolute right-0 bg-gray-700 text-white rounded shadow-md w-32"
              @mouseleave="closeDropdown"
            >
              <button
                class="block w-full px-4 py-2 text-left hover:bg-gray-600"
                @click="editPost"
              >
                Editar
              </button>
              <button
                class="block w-full px-4 py-2 text-left hover:bg-gray-600"
                @click="openDeleteModal"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- Título del post -->
        <h2 class="text-2xl font-bold text-cyan-400 mb-4">
          {{ post.title }}
        </h2>

        <!-- Contenido del post -->
        <p class="text-gray-300 mb-4">{{ post.post }}</p>

        <!-- Reacciones -->
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4 text-gray-400">
            <button class="hover:text-cyan-400 transition">
              <i class="fas fa-thumbs-up"></i>
            </button>
            <button class="hover:text-cyan-400 transition">
              <i class="fas fa-thumbs-down"></i>
            </button>
            <button class="hover:text-cyan-400 transition">
              <i class="fas fa-comment"></i>
            </button>
            <span class="text-xs text-gray-500">{{ formatDate(post.createdAt) }}</span>
          </div>

          <button class="hover:text-cyan-400 transition text-gray-400">
            <i class="fas fa-share"></i>
          </button>
        </div>
      </div>

      <!-- Mensaje de carga -->
      <div v-else class="text-white text-center">
        Cargando post...
      </div>

      <!-- Modal para editar el post -->
      <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-gray-800 rounded-lg w-96 p-6">
          <h2 class="text-white text-xl font-bold mb-4">Editar Post</h2>
          <label class="text-white text-sm mb-2 block" for="title">Título</label>
          <input
            id="title"
            v-model="editPostData.title"
            type="text"
            class="w-full mb-4 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <label class="text-white text-sm mb-2 block" for="content">Contenido</label>
          <textarea
            id="content"
            v-model="editPostData.post"
            class="w-full mb-4 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            rows="4"
          ></textarea>
          <div class="flex justify-end space-x-4">
            <button
              class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
              @click="closeModal"
            >
              Cancelar
            </button>
            <button
              class="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-500"
              @click="updatePost"
            >
              Guardar
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
    </main>
  </div>
</template>



<script>
import axios from "axios";

export default {
  name: "PostCard",
  data() {
    return {
      post: null,
      username_actual: sessionStorage.getItem("username"),
      showMessage: false, // Controlar la visibilidad del mensaje
      message: "", // Mensaje a mostrar
      toastError: false, //Para enseñar si es error o no
      showModal: false,
      editPostData: {
        title: "",
        post: "",
      },
      showDeleteModal: false,
      dropdownVisible: false,
    };
  },
  async created() {
    const postId = this.$route.params.postId; // Obtiene el ID del post de la URL
    await this.fetchPost(postId);
  },
  methods: {
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    },
    displayMessage(message, error, callback) {
      this.message = message;
      this.showMessage = true;
      this.toastError = error;
      setTimeout(() => {
        this.showMessage = false;
        if (callback) callback();
      }, 1000);
    },
    async fetchPost(postId) {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const response = await axios.get(`${BASE_URL}/post/${postId}`);
        this.post = response.data;
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    },
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    closeDropdown() {
      this.dropdownVisible = false;
    },
    openDeleteModal() {
      this.showDeleteModal = true;
      this.closeDropdown();
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
    },
    editPost() {
      this.editPostData = {
        title: this.post.title,
        post: this.post.post,
      };
      this.showModal = true;
      this.closeDropdown();
    },
    async updatePost() {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const response = await axios.put(
          `${BASE_URL}/post/update/${this.post.id}`,
          this.editPostData
        );
        if (response.status === 200) {
          this.displayMessage("Post editado correctamente.", false);
          this.post = { ...this.post, ...this.editPostData };
          this.showModal = false;
        }
      } catch (error) {
        console.error("Error updating post:", error);
      }
    },
    async confirmDelete() {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        await axios.delete(`${BASE_URL}/post/${this.post.id}`);
        this.displayMessage("Post eliminado correctamente.", true, () => {this.$router.push("/")});
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    },
    closeModal() {
      this.showModal = false;
    },
    navigateToForum() {
      this.$router.push({ path: "/", query: { view: "forum" } });
    },
  },
};
</script>


<style scoped>

</style>

