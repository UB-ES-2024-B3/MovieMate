<template>
  <div :class="`ml-${level * 4}`">
    <div
      v-if="showMessage"
      :class="[
        'fixed top-4 right-4 p-4 rounded-md text-white shadow-lg',
        toastError ? 'bg-red-500' : 'bg-green-500'
      ]"
    >
      {{ message }}
    </div>
    <!-- Comentario -->
    <div class="flex items-start mb">
      <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-400 flex-shrink-0">
        <img
          v-if="comment.author.image"
          :src="comment.author.image"
          alt="Profile"
          class="w-full h-full object-cover"
        />
        <i v-else class="fas fa-user-circle text-4xl text-gray-400"></i>
      </div>
      <div class="ml-4 flex-1">
        <div class="flex items-center justify-between">
          <router-link
            :to="`/user/${comment.author.userName}`"
            class="font-bold text-cyan-400 cursor-pointer"
          >
            @{{ comment.author.userName }}
          </router-link>
          <div v-if="comment.author.userName === username_actual && localContent !== 'Comentario Eliminado'" class="relative">
            <button
              class="text-gray-400 hover:text-cyan-400"
              @click="toggleDropdown"
            >
              <i class="fas fa-ellipsis-v"></i>
            </button>
            <div
              v-if="dropdownVisible"
              class="absolute top-0 right-0 bg-gray-700 text-white rounded shadow-md w-32"
              @mouseleave="closeDropdown"
            >
              <button
                class="block w-full px-4 py-2 text-left hover:bg-gray-600"
                @click="editComment"
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
        <span v-if="localTotalComments > 0" class="text-gray-300 mt-3 text-base cursor-pointer hover:text-cyan-400">
          <p @click="$emit('navigateToComment', comment.id)">
            {{ localContent }}
          </p>
        </span>
        <span v-else>
          <p>
            {{ localContent }}
          </p>
        </span>
        <div class="flex items-center space-x-4 text-gray-400">
          <button
            class="hover:text-cyan-400 transition"
            :class="comment.likedBy.includes(username_actual) ? 'text-cyan-400' : ''"
            @click="handleLike"
          >
            <i class="fas fa-thumbs-up"></i>
          </button>
          <span>{{ localLike }}</span>

          <!-- Botón de Dislike -->
          <button
            class="hover:text-cyan-400 transition"
            :class="comment.dislikeBy.includes(username_actual) ? 'text-cyan-400' : ''"
            @click="handleDislike"
          >
            <i class="fas fa-thumbs-down"></i>
          </button>
          <span>{{ localDislike }}</span>

          <button
            class="hover:text-cyan-400 transition"
            @click="addComment"
          >
            <i class="fas fa-comment"></i>
          </button>
          <span>{{ localTotalComments }}</span>
          <span class="text-xs text-gray-500">{{ formatDate(comment.createdAt) }}</span>
        </div>
      </div>
    </div>

    <!-- Modal para agregar comentario -->
    <div
      v-if="showAddCommentModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-gray-800 rounded-lg w-96 p-6">
        <h2 class="text-white text-xl font-bold mb-4">Agregar Comentario</h2>
        <textarea
          v-model="newComment"
          placeholder="Escribe tu comentario..."
          class="w-full mb-4 p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          rows="4"
        ></textarea>
        <div class="flex justify-end space-x-4">
          <button
            class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
            @click="closeAddCommentModal"
          >
            Cancelar
          </button>
          <button
            class="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-500"
            @click="submitComment"
          >
            Publicar
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
</template>

<script>
import axios from "axios";

export default {
  name: "CommentItem",
  props: {
    comment: Object,
    level: Number
  },
  data() {
    return {
      replying: false,
      showMessage: false, // Controlar la visibilidad del mensaje
      message: "", // Mensaje a mostrar
      toastError: false, //Para enseñar si es error o no
      username_actual: sessionStorage.getItem("username"),
      replyText: "",
      newComment: "",
      showAddCommentModal: false,
      localTotalComments: this.comment.totalComments,
      localContent: this.comment.content,
      localLike: this.comment.like,
      localDislike: this.comment.disLike,
      showModal: false,
      showDeleteModal: false,
      editCommentData: {
        content: "",
      },
      dropdownVisible: false,
    };
  },
  methods: {
    async confirmDelete() {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        await axios.delete(`${BASE_URL}/comment/${this.comment.id}`);
        await this.fetchUpdatedComment()
        this.displayMessage("Comentario eliminado correctamente.", true);
        this.showDeleteModal = false;
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    },
    async updateComment() {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const response = await axios.put(
          `${BASE_URL}/comment/update/${this.comment.id}`,
          this.editCommentData
        );
        if (response.status === 200) {
          this.displayMessage("Comentario editado correctamente.", false);
          await this.fetchUpdatedComment()
          this.showModal = false;
        }
      } catch (error) {
        console.error("Error updating post:", error);
      }
    },
    editComment() {
      this.editCommentData = {
        content: this.localContent,
      };
      this.showModal = true;
      this.closeDropdown();
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
    closeModal() {
      this.showModal = false;
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
    formatDate(dateString) {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString("es-ES", options);
    },
    addComment() {
      this.showAddCommentModal = true;
    },
    closeAddCommentModal() {
      this.newComment = "";
      this.showAddCommentModal = false;
    },
    async submitComment() {
      if (!this.newComment.trim()) {
        this.displayMessage("El comentario no puede estar vacío", true);
        return;
      }
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const payload = {
          comment: this.comment.id,
          content: this.newComment,
          author: this.username_actual,
        };
        const response = await axios.post(`${BASE_URL}/comment/`, payload);

        if (response.status === 200 || response.status === 201) {
          this.newComment = "";
          this.displayMessage("Comentario agregado correctamente.", false);
          this.showAddCommentModal = false;
          await this.fetchUpdatedComment();
        }
      } catch (error) {
        console.error("Error adding comment:", error);
        this.displayMessage("Error al agregar el comentario.", true);
      }
    },
    async fetchUpdatedComment() {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const response = await axios.get(`${BASE_URL}/comment/${this.comment.id}`);
        this.localTotalComments = response.data.totalComments;
        this.localContent = response.data.content;
        this.localDislike = response.data.disLike;
        this.localLike = response.data.like;
      } catch (error) {
        console.error("Error fetching updated comment:", error);
      }
    },
    async handleLike() {
      this.$emit("like-comment", this.comment.id, this.fetchUpdatedComment);
    },
    async handleDislike() {
      this.$emit("dislike-comment", this.comment.id, this.fetchUpdatedComment);
    },
  },
};
</script>
