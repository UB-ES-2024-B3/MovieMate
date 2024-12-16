<template>
  <div v-if="review && user && movie" class="flex h-screen">
    <!-- Contenido Principal -->

    <main class="flex flex-col flex-1 bg-gray-900 p-6">
      <div
          v-if="showMessage"
          :class="[
          'fixed top-4 right-4 p-4 rounded-md text-white shadow-lg',
          toastError ? 'bg-red-500' : 'bg-green-500'
        ]"
      >
        {{ message }}
      </div>

      <router-link
          :to="`/movie/${movie.title}`"
          class="flex items-center text-cyan-400 hover:text-cyan-300 mb-6"
      >
        <i class="fas fa-arrow-left mr-2"></i> Volver
      </router-link>


      <div class="bg-gray-800 text-white p-6 rounded-lg shadow-md flex flex-col">
        <!-- Encabezado del review -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <!-- Imagen del Usuario -->
            <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-400 flex-shrink-0">
              <img
                  v-if="user.image"
                  :src="user.image"
                  alt="Profile"
                  class="w-full h-full object-cover"
              />
              <i v-else class="fas fa-user-circle text-4xl text-gray-400"></i>
            </div>

            <!-- Nombre del Usuario -->
            <router-link
                :to="`/user/${user.userName}`"
                class="font-bold text-cyan-400 text-lg hover:underline ml-4"
            >
              @{{ user.userName }}
            </router-link>

          </div>
        </div>
        <!-- Título del review -->
        <h2 class="text-2xl font-bold text-cyan-400 mb-4">
          {{ review.title }}
        </h2>

        <!-- Contenido del review -->
        <p class="text-gray-300 mb-4">{{ review.content }}</p>

        <!-- Reacciones -->
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4 text-gray-400">
            <!-- Botón de Like -->
            <button
                class="hover:text-cyan-400 transition"
                @click="handleLike"
            >
              <i class="fas fa-thumbs-up"></i>
            </button>
            <span>{{ review.like }}</span>

            <!-- Botón de Dislike -->
            <button
                class="hover:text-cyan-400 transition"
                @click="handleDislike"
            >
              <i class="fas fa-thumbs-down"></i>
            </button>
            <span>{{ review.disLike }}</span>

            <button
                class="hover:text-cyan-400 transition"
                @click="addComment"
            >
              <i class="fas fa-comment"></i>
            </button>
            <span>{{ review.totalComments }}</span>

          </div>

        </div>


      </div>
      <div class="flex-1 bg-gray-800 p-6 rounded-lg shadow-md overflow-y-auto mt-2">
        <h3 class="text-cyan-400 text-xl font-bold mb-4">Comentarios</h3>

        <div v-if="comments.length === 0" class="text-center text-gray-400 py-8">
          No hay comentarios aún
        </div>

        <div v-else class="space-y-4">
          <comment-item
              v-for="comment in comments"
              :key="comment.id"
              :comment="comment"
              :level="0"
              class="bg-gray-700 rounded-lg p-4 shadow-md"
              @reply="replyToComment"
              @navigateToComment="navigateToComment"
              @like-comment="addLikeComment"
              @dislike-comment="addDislikeComment"
          />
        </div>
      </div>

      <div class="sticky bottom-6 right-6 flex justify-end">
        <button
            class="bg-cyan-600 text-white text-4xl rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-cyan-500"
            @click=addComment
        >
          <i class="fas fa-plus"></i>
        </button>
      </div>

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
    </main>
  </div>
</template>

<script>
import axios from "axios";
import CommentItem from "@/components/Comment/CommentCard.vue";

export default {
  components: {CommentItem},
  data() {
    return {
      review: null,
      movie: null,
      user: null,
      comments: [],
      newComment: "",
      username_actual: sessionStorage.getItem("username"),
      isAuthenticated: false,
      showMessage: false, // Controlar la visibilidad del mensaje
      message: "", // Mensaje a mostrar
      toastError: false, //Para enseñar si es error o no
      dropdownVisible: false,
      showAddCommentModal: false,
    }
  },

  created() {
    // Verificamos si el token y el nombre de usuario están en sessionStorage
    const token = sessionStorage.getItem("auth_token");
    this.isAuthenticated = !!token;

    if (this.isAuthenticated) {
      this.username = sessionStorage.getItem("username");
    }
  },
  mounted() {
    this.fetchReviewData();
  },

  methods: {
    async fetchReviewData() {
      try {
        const BASE_URL = process.env['VUE_APP_API_BASE_URL']
        const response = await axios.get(`${BASE_URL}/review/${this.$route.params.id}`);

        console.log(response.data);

        const review = response.data;
        this.review = {
          id: review.id,
          title: review.title,
          content: review.content,
          like: review.like,
          disLike: review.disLike,
          totalComments: review.totalComments,
        };
        console.log(this.review);
        this.user = review.author;
        this.movie = review.movie;
        await this.getComments(this.review.id);
      } catch (error) {
        this.error = 'No se puede cargar la información de la reseña';
        console.error("Error al obtener los datos de la reseña:", error);
      }
    },

    goBack() {
      this.$router.go(-1);
    },

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
      }, 5000);
    },
    handleLike() {
      console.log(this.isAuthenticated);
      if (!this.isAuthenticated) {
        this.displayMessage("Debes iniciar sesión para dar like.", true);
        return;
      }


      // Lógica para enviar la acción al backend
      const BASE_URL = process.env['VUE_APP_API_BASE_URL']
      console.log(this.username);
      axios
          .put(`${BASE_URL}/review/like`, {userName: this.username, idReview: this.review.id})
          .then(() => {
            // Después de la acción PUT, obtener los datos actualizados con GET
            return axios.get(`${BASE_URL}/review/${this.review.id}`);
          })
          .then(response => {
            const updatedReview = response.data;

            // Actualizar el valor de likes y dislikes en la UI con los datos actualizados
            this.review.like = updatedReview.like;
            this.review.disLike = updatedReview.disLike;

          })
          .catch(error => {
            console.error("Error al dar like:", error);
          });

    },

    handleDislike() {
      if (!this.isAuthenticated) {
        this.displayMessage("Debes iniciar sesión para dar dislike.", true);
        return;
      }

      // Lógica para enviar la acción al backend
      const BASE_URL = process.env['VUE_APP_API_BASE_URL']
      console.log(this.username);
      axios
          .put(`${BASE_URL}/review/dislike`, {userName: this.username, idReview: this.review.id})
          .then(() => {
            // Después de la acción PUT, obtener los datos actualizados con GET
            return axios.get(`${BASE_URL}/review/${this.review.id}`);
          })
          .then(response => {
            const updatedReview = response.data;

            // Actualizar el valor de likes y dislikes en la UI con los datos actualizados
            this.review.like = updatedReview.like;
            this.review.disLike = updatedReview.disLike;
            console.log(this.review);

          })
          .catch(error => {
            console.error("Error al dar dislike:", error);
          });

    },
    addComment() {
      this.showAddCommentModal = true;
    },
    closeAddCommentModal() {
      this.newComment = "";
      this.showAddCommentModal = false;
    },
    async getComments(reviewId){
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const response = await axios.get(
            `${BASE_URL}/comment/review/${reviewId}`
        );
        console.log(response.data)
        this.comments = this.mapComments(response.data);
      } catch (error) {
        console.error("Error updating post:", error);
      }
    },
    mapComments(comments) {
      const map = {};
      comments.forEach((comment) => {
        comment.replies = [];
        map[comment.id] = comment;
      });
      comments.forEach((comment) => {
        if (comment.parentId) {
          map[comment.parentId].replies.push(comment);
        }
      });
      return comments.filter((comment) => !comment.parentId);
    },
    async replyToComment({ parentId, content }) {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const payload = {
          comment: parentId,
          content: content,
          author: this.username_actual,
        };
        await axios.post(`${BASE_URL}/comment/`, payload);
        await this.getComments(this.review.id);
      } catch (error) {
        console.error("Error replying to comment:", error);
      }
    },
    navigateToComment(commentId) {
      console.log(commentId)
      this.$router.push({ path: `/comment/${commentId}` });
    },
    async submitComment() {
      if (!this.newComment.trim()) this.displayMessage("El comentario no puede estar vacio", true);

      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const payload = {
          review: this.review.id,
          content: this.newComment,
          author: this.username_actual,
        };
        const response = await axios.post(`${BASE_URL}/comment/`, payload);

        if (response.status === 200) {
          this.newComment = "";
          this.displayMessage("Comentario agregado correctamente.", false);
          await this.getComments(this.review.id);
          await this.fetchReviewData(this.review.id);
          this.showAddCommentModal = false;
        }
      } catch (error) {
        console.error("Error adding comment:", error);
        this.displayMessage("Error al agregar el comentario.", true);
      }
    },

    async addLikeComment(commentId, callback) {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const payload = { userName: this.username_actual, commentId };
        const comment = this.comments.find((c) => c.id === commentId);

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

        if (callback) await callback(); // Llama al callback en el hijo
      } catch (error) {
        console.error("Error añadiendo/removiendo like:", error);
        this.displayMessage("Error al procesar el like.", true);
      }
    },

    async addDislikeComment(commentId, callback) {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const payload = { userName: this.username_actual, commentId };
        const comment = this.comments.find((c) => c.id === commentId);

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

        if (callback) await callback(); // Llama al callback en el hijo
      } catch (error) {
        console.error("Error añadiendo/removiendo dislike:", error);
        this.displayMessage("Error al procesar el dislike.", true);
      }
    },

  }
}

</script>

<style scoped>

</style>