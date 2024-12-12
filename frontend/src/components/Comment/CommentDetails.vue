<template>
  <div class="flex h-screen">
    <!-- Menú lateral -->
    <aside class="bg-cyan-600 w-64 p-6 flex flex-col justify-between h-full">
      <div class="space-y-6">
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
      </div>
    </aside>

    <!-- Contenido Principal -->
    <main class="flex flex-col flex-1 bg-gray-900 p-6 overflow-y-auto">
      <div
        v-if="showMessage"
        :class="[
          'fixed top-4 right-4 p-4 rounded-md text-white shadow-lg',
          toastError ? 'bg-red-500' : 'bg-green-500'
        ]"
      >
        {{ message }}
      </div>

      <div class="flex flex-col items-center justify-center w-full">
        <button
          class="self-start mb-4 px-4 py-2 text-cyan-400 hover:text-cyan-300 rounded-lg"
          @click="$router.go(-1)"
        >
          <i class="fas fa-arrow-left mr-2"></i> Volver
        </button>

        <div v-if="loading" class="text-center">
          <p class="text-xl font-semibold">Cargando comentarios...</p>
        </div>

        <div v-else class="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-4xl">
          <h1 class="text-2xl font-bold text-cyan-400 mb-6">Comentarios</h1>
          <div
            v-for="comment in forumComments"
            :key="comment.id"
            class="flex items-start mb-6 bg-gray-700 p-4 rounded-lg hover:shadow-lg transition"
          >
            <!-- Imagen o ícono de perfil -->
            <div class="w-16 h-16 rounded-full overflow-hidden bg-gray-500 flex-shrink-0">
              <img
                v-if="comment.author.image"
                :src="comment.author.image"
                alt="Profile"
                class="w-full h-full object-cover"
              />
              <i v-else class="fas fa-user-circle text-5xl text-gray-400"></i>
            </div>

            <!-- Información del comentario -->
            <div class="ml-6 flex-grow">
              <div class="flex items-center justify-between">
                <router-link
                  :to="`/user/${comment.author.userName}`"
                  class="font-bold text-cyan-400 cursor-pointer"
                >
                  @{{ comment.author.userName }}
                </router-link>


                <div v-if="comment.author.userName === username_actual && comment.content !== 'Comentario Eliminado'" class="relative"> <!-- Moví el botón aquí -->
                  <button
                    class="text-gray-400 hover:text-cyan-400"
                    @click="toggleDropdown(comment.id)"
                  >
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                  <div
                    v-if="dropdownVisible === comment.id"
                    class="absolute top-0 right-0 bg-gray-700 text-white rounded shadow-md w-32"
                    @mouseleave="closeDropdown"
                  >
                    <button
                      class="block w-full px-4 py-2 text-left hover:bg-gray-600"
                      @click="editComment(comment.id, comment.content)"
                    >
                      Editar
                    </button>
                    <button
                      class="block w-full px-4 py-2 text-left hover:bg-gray-600"
                      @click="openDeleteModal(comment.id, comment.content)"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
              <span v-if="comment.totalComments > 0" class="text-gray-300 mt-3 text-base cursor-pointer hover:text-cyan-400" @click="navigateToComment(comment.id)">
                {{ comment.content }}
              </span>
              <span v-else>
                {{ comment.content }}
              </span>
              <div class="flex items-center space-x-4 text-gray-400">
                <button
                  class="hover:text-cyan-400 transition"
                  :class="comment.likedBy.includes(username_actual) ? 'text-cyan-400' : ''"
                  @click="addLikeComment(comment.id)"
                >
                  <i class="fas fa-thumbs-up"></i>
                </button>
                <span>{{ comment.like }}</span>

                <!-- Botón de Dislike -->
                <button
                  class="hover:text-cyan-400 transition"
                  :class="comment.dislikeBy.includes(username_actual) ? 'text-cyan-400' : ''"
                  @click="addDislikeComment(comment.id)"
                >
                  <i class="fas fa-thumbs-down"></i>
                </button>
                <span>{{ comment.disLike }}</span>
                <button
                  class="hover:text-cyan-400 transition"
                  @click="openReplyModal(comment.id)"
                >
                  <i class="fas fa-comment"></i>
                </button>
                <span>{{ comment.totalComments }}</span>
                <p class="text-sm text-gray-400">{{ formatDate(comment.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal de respuesta -->
        <div
          v-if="showReplyModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div class="bg-gray-800 p-6 rounded-lg w-1/2">
            <h3 class="text-lg font-bold text-cyan-400 mb-4">Responder comentario</h3>
            <textarea
              v-model="replyContent"
              class="w-full p-3 bg-gray-700 rounded-lg text-white mb-4"
              placeholder="Escribe tu respuesta aquí..."
            ></textarea>
            <div class="flex justify-end space-x-2">
              <button
                class="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
                @click="closeReplyModal"
              >
                Cancelar
              </button>
              <button
                class="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white"
                @click="submitReply"
              >
                Responder
              </button>
            </div>
          </div>
        </div>

        <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div class="bg-gray-800 rounded-lg w-96 p-6">
            <h2 class="text-white text-xl font-bold mb-4">Editar Comentario</h2>
            <label class="text-white text-sm mb-2 block" for="content">Contenido</label>
            <textarea
              id="content"
              v-model="editCommentData.content"
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
                @click="updateComment"
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
            <h2 class="text-white text-xl font-bold mb-4">¿Seguro que quiere eliminar este comentario?</h2>
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
      </div>
    </main>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      loading: true,
      commentId: null,
      forumComments: [],
      showReplyModal: false,
      replyContent: "",
      replyingTo: null,
      username_actual: sessionStorage.getItem("username"),
      showModal: false,
      showDeleteModal: false,
      showMessage: false, // Controlar la visibilidad del mensaje
      message: "", // Mensaje a mostrar
      toastError: false, //Para enseñar si es error o no
      editCommentData: {
        id: "",
        content: "",
      },
      dropdownVisible: false,
      //Sorts
      sortByDate: 'recent',
      sortByVotes: 'votes',
    };
  },
  methods: {
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
        this.forumComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (this.sortByDate === 'oldest') {
        this.forumComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }

      if (this.sortByVotes === 'votes') {
        this.forumComments.sort((a, b) => {
            if (b.like === a.like) {
                return a.disLike - b.disLike;
            }
            return b.like - a.like;
        });
      } else if (this.sortByVotes === 'less_votes') {
        this.forumComments.sort((a, b) => {
            if (a.like === b.like) {
                return b.disLike - a.disLike;
            }
            return a.like - b.like;
        });
      }
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
    async confirmDelete() {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const response = await axios.delete(`${BASE_URL}/comment/${this.editCommentData.id}`);

        if (response.status === 200) {
          const commentIndex = this.forumComments.findIndex(comment => comment.id === this.editCommentData.id);
          if (commentIndex !== -1) {
            this.forumComments[commentIndex].content = "Comentario Eliminado";
          }

          this.displayMessage("Comentario marcado como eliminado.", false);
          this.showDeleteModal = false;
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    },
    async updateComment() {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const { id, content } = this.editCommentData;
        const response = await axios.put(
          `${BASE_URL}/comment/update/${id}`, {content}
        );
        if (response.status === 200) {
          const commentIndex = this.forumComments.findIndex(comment => comment.id === id);
          if (commentIndex !== -1) {
            this.forumComments[commentIndex].content = content; // Actualiza directamente el contenido
          }

          this.displayMessage("Comentario editado correctamente.", false);
          this.showModal = false;


        }
      } catch (error) {
        console.error("Error updating comment:", error);
      }
    },
    editComment(commentId, content) {
      this.showModal = true;
      this.editCommentData = { id: commentId, content: content };
      this.dropdownVisible = null;
    },
    toggleDropdown(commentId) {
      this.dropdownVisible = this.dropdownVisible === commentId ? null : commentId;
    },
    closeDropdown() {
      this.dropdownVisible = null;
    },
    openDeleteModal(commentId, content) {
      this.showDeleteModal = true;
      this.editCommentData = { id: commentId, content: content };
      this.dropdownVisible = null;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
    },
    closeModal() {
      this.showModal = false;
    },
    async fetchComments(commentId) {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const response = await axios.get(`${BASE_URL}/comment/comment/${commentId}`);
        this.forumComments = response.data;
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    },
    navigateToComment(commentId) {
      this.$router.push(`/comment/${commentId}`);
    },
    openReplyModal(parentId) {
      this.replyingTo = parentId;
      this.replyContent = "";
      this.showReplyModal = true;
    },
    closeReplyModal() {
      this.showReplyModal = false;
    },
    async submitReply() {
      if (!this.replyContent.trim()) return;
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const payload = {
          comment: this.replyingTo,
          content: this.replyContent,
          author: this.username_actual,
        };
        await axios.post(`${BASE_URL}/comment/`, payload);
        this.closeReplyModal();
        await this.fetchComments(this.replyingTo);
      } catch (error) {
        console.error("Error replying to comment:", error);
      }
    },
    async addLikeComment(commentId) {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const payload = { userName: this.username_actual, commentId };
        const comment = this.forumComments.find((c) => c.id === commentId);

        if (comment.likedBy.includes(this.username_actual)) {
          const response = await axios.put(`${BASE_URL}/comment/like`, payload);
          if (response.status === 200) {
            this.displayMessage("¡Like retirado!", false);
            comment.likedBy = comment.likedBy.filter((user) => user !== this.username_actual);
            comment.like--;
          }
        } else {
          const response = await axios.put(`${BASE_URL}/comment/like`, payload);
          if (response.status === 200) {
            this.displayMessage("¡Like añadido!", false);
            comment.likedBy.push(this.username_actual);
            comment.like++;
            if (comment.dislikeBy.includes(this.username_actual)) {
              comment.dislikeBy = comment.dislikeBy.filter((user) => user !== this.username_actual);
              comment.disLike--;
            }
          }
        }
      } catch (error) {
        console.error("Error añadiendo/removiendo like:", error);
        this.displayMessage("Error al procesar el like.", true);
      }
    },

    async addDislikeComment(commentId) {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const payload = { userName: this.username_actual, commentId };
        const comment = this.forumComments.find((c) => c.id === commentId);

        if (comment.dislikeBy.includes(this.username_actual)) {
          const response = await axios.put(`${BASE_URL}/comment/dislike`, payload);
          if (response.status === 200) {
            this.displayMessage("¡Dislike retirado!", false);
            comment.dislikeBy = comment.dislikeBy.filter((user) => user !== this.username_actual);
            comment.disLike--;
          }
        } else {
          const response = await axios.put(`${BASE_URL}/comment/dislike`, payload);
          if (response.status === 200) {
            this.displayMessage("¡Dislike añadido!", false);
            comment.dislikeBy.push(this.username_actual);
            comment.disLike++;
            if (comment.likedBy.includes(this.username_actual)) {
              comment.likedBy = comment.likedBy.filter((user) => user !== this.username_actual);
              comment.like--;
            }
          }
        }
      } catch (error) {
        console.error("Error añadiendo/removiendo dislike:", error);
        this.displayMessage("Error al procesar el dislike.", true);
      }
    },
  },
  watch: {
    // Observa los cambios en el parámetro de la ruta
    "$route.params.commentId"(newCommentId) {
      this.fetchComments(newCommentId);
    },
  },
  async mounted() {
    this.commentId = this.$route.params.commentId;
    await this.fetchComments(this.commentId);
  },
};
</script>

<style>
</style>
