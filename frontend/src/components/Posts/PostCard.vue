<template>
  <div class="flex h-screen">
    <!-- Lado izquierdo -->
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
            <router-link
                :to="`/user/${post.author.userName}`"
                class="font-bold text-cyan-400 text-lg hover:underline ml-4"
            >
              @{{ post.author.userName }}
            </router-link>
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
            <!-- Botón de Like -->
            <button
                :class="post.likedBy.includes(username_actual) ? 'text-cyan-400' : ''"
                class="hover:text-cyan-400 transition"
                @click="addLike(post.id)"
            >
              <i class="fas fa-thumbs-up"></i>
            </button>
            <span>{{ post.like }}</span>

            <!-- Botón de Dislike -->
            <button
                :class="post.dislikedBy.includes(username_actual) ? 'text-cyan-400' : ''"
                class="hover:text-cyan-400 transition"
                @click="addDislike(post.id)"
            >
              <i class="fas fa-thumbs-down"></i>
            </button>
            <span>{{ post.disLike }}</span>

            <button
                class="hover:text-cyan-400 transition"
                @click="addComment"
            >
              <i class="fas fa-comment"></i>
            </button>
            <span>{{ post.totalComments }}</span>

            <span class="text-xs text-gray-500">{{ formatDate(post.createdAt) }}</span>
          </div>

          <button class="hover:text-cyan-400 transition text-gray-400" @click="openShareModal">
            <i class="fas fa-share"></i>
          </button>

        </div>
      </div>
      <div v-else class="text-white text-center">
        Cargando post...
      </div>

      <!-- Modal para Compartir -->
      <transition name="fade">
        <div v-if="isShareModalOpen" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div
              class="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 scale-95 hover:scale-100">
            <h2 class="text-xl font-semibold text-white mb-6">Compartir Post</h2>
            <p class="text-sm text-gray-400 mb-4">Copia el enlace para compartir este post:</p>
            <div class="flex items-center space-x-2">
              <input
                  :value="shareLink"
                  class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none bg-gray-900 text-white"
                  readonly
                  type="text"
              />
              <button
                  class="bg-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-cyan-700 transition-all duration-300"
                  @click="copyToClipboard"
              >
                Copiar
              </button>
            </div>
            <button
                class="mt-6 text-gray-400 hover:text-white text-sm underline"
                @click="closeShareModal"
            >
              Cerrar
            </button>
          </div>
        </div>
      </transition>
      <!-- Mensaje de éxito -->
      <div v-if="copySuccessMessage"
           class="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
        <p class="text-sm">Enlace copiado al portapapeles</p>
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
              @navigateToComment="navigateToComment"
              @reply="replyToComment"
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


      <!-- Modal para editar el post -->
      <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-gray-800 rounded-lg w-96 p-6">
          <h2 class="text-white text-xl font-bold mb-4">Editar Post</h2>
          <label class="text-white text-sm mb-2 block" for="title">Título</label>
          <input
              id="title"
              v-model="editPostData.title"
              class="w-full mb-4 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              type="text"
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
      <div
          v-if="showAddCommentModal"
          class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <div class="bg-gray-800 rounded-lg w-96 p-6">
          <h2 class="text-white text-xl font-bold mb-4">Agregar Comentario</h2>
          <textarea
              v-model="newComment"
              class="w-full mb-4 p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Escribe tu comentario..."
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
  name: "PostCard",
  components: {CommentItem},
  data() {
    return {
      post: null,
      comments: [],
      newComment: "",
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
      showAddCommentModal: false,
      //Sorts
      sortByDate: 'recent',
      sortByVotes: 'votes',
      isShareModalOpen: false, // Controla la visibilidad del modal
      shareLink: "", // Almacena el enlace único para compartir
      copySuccessMessage: false, // Controla la visibilidad del mensaje de éxito
    };
  },
  async created() {
    const postId = this.$route.params.postId; // Obtiene el ID del post de la URL
    await this.fetchPost(postId);
    await this.getComments(postId)
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
        this.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (this.sortByDate === 'oldest') {
        this.comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }

      if (this.sortByVotes === 'votes') {
        this.comments.sort((a, b) => {
          if (b.like === a.like) {
            return a.disLike - b.disLike;
          }
          return b.like - a.like;
        });
      } else if (this.sortByVotes === 'less_votes') {
        this.comments.sort((a, b) => {
          if (a.like === b.like) {
            return b.disLike - a.disLike;
          }
          return a.like - b.like;
        });
      }
    },
    formatDate(dateString) {
      const options = {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'};
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
        this.post = response.data.post;
        this.post.likedBy = response.data.likedUsers;
        this.post.dislikedBy = response.data.dislikedUsers;
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    },
    addComment() {
      this.showAddCommentModal = true;
    },
    closeAddCommentModal() {
      this.newComment = "";
      this.showAddCommentModal = false;
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
          this.post = {...this.post, ...this.editPostData};
          this.showModal = false;
        }
      } catch (error) {
        console.error("Error updating post:", error);
      }
    },
    async getComments(postId) {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const response = await axios.get(
            `${BASE_URL}/comment/post/${postId}`
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
    async replyToComment({parentId, content}) {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const payload = {
          comment: parentId,
          content: content,
          author: this.username_actual,
        };
        await axios.post(`${BASE_URL}/comment/`, payload);
        await this.getComments(this.post.id);
      } catch (error) {
        console.error("Error replying to comment:", error);
      }
    },
    navigateToComment(commentId) {
      console.log(commentId)
      this.$router.push({path: `/comment/${commentId}`});
    },
    async addLikeComment(commentId, callback) {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const payload = {userName: this.username_actual, commentId};
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
        const payload = {userName: this.username_actual, commentId};
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
    async submitComment() {
      if (!this.newComment.trim()) this.displayMessage("El comentario no puede estar vacio", true);

      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const payload = {
          post: this.post.id,
          content: this.newComment,
          author: this.username_actual,
        };
        const response = await axios.post(`${BASE_URL}/comment/`, payload);

        if (response.status === 200) {
          this.newComment = "";
          this.displayMessage("Comentario agregado correctamente.", false);
          await this.getComments(this.post.id);
          await this.fetchPost(this.post.id);
          this.showAddCommentModal = false;
          this.sortPosts()
        }
      } catch (error) {
        console.error("Error adding comment:", error);
        this.displayMessage("Error al agregar el comentario.", true);
      }
    },
    async confirmDelete() {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        await axios.delete(`${BASE_URL}/post/${this.post.id}`);
        this.displayMessage("Post eliminado correctamente.", true, () => {
          this.$router.push("/")
        });
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    },
    closeModal() {
      this.showModal = false;
    },
    navigateToForum() {
      this.$router.push({path: "/", query: {view: "forum"}});
    },

    async addLike(postId) {
      try {
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const payload = {
          userName: this.username_actual, // Usuario autenticado
          postId: postId, // ID del post
        };
        //En caso que tenga un like añadido...y quiera sacarlo
        if (this.post.likedBy.includes(this.username_actual)) {
          const response = await axios.put(`${BASE_URL}/post/like`, payload);
          if (response.status === 200) {
            this.displayMessage("¡Like retirado!", false);
            this.post.likedBy = this.post.likedBy.filter(user => user !== this.username_actual);
            this.post.like--;
          }
        } else {
          // En caso contrario, lo añade
          const response = await axios.put(`${BASE_URL}/post/like`, payload);
          if (response.status === 200) {
            this.displayMessage("¡Like añadido!", false);
            this.post.likedBy.push(this.username_actual);
            this.post.like++;
            // Saca el dislike si esta añadido, no puedes darle a las dos
            if (this.post.dislikedBy.includes(this.username_actual)) {
              this.post.dislikedBy = this.post.dislikedBy.filter(user => user !== this.username_actual);
              this.post.disLike--;
            }
          }
        }
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

        //En caso que tenga un like añadido...y quiera sacarlo
        if (this.post.dislikedBy.includes(this.username_actual)) {
          const response = await axios.put(`${BASE_URL}/post/dislike`, payload);
          if (response.status === 200) {
            this.displayMessage("¡Dislike retirado!", false);
            this.post.dislikedBy = this.post.dislikedBy.filter(user => user !== this.username_actual);
            this.post.disLike--;
          }
        } else {
          // En caso contrario, lo añade
          const response = await axios.put(`${BASE_URL}/post/dislike`, payload);
          if (response.status === 200) {
            this.displayMessage("¡Dislike añadido!", false);
            this.post.dislikedBy.push(this.username_actual);
            this.post.disLike++;
            // Saca el like si esta añadido, no puedes darle a las dos
            if (this.post.likedBy.includes(this.username_actual)) {
              this.post.likedBy = this.post.likedBy.filter(user => user !== this.username_actual);
              this.post.like--;
            }
          }
        }
      } catch (error) {
        console.error("Error añadiendo/removiendo dislike:", error);
        this.displayMessage("Error al procesar el dislike.", true);
      }
    },
    openShareModal() {
      // Genera el enlace único basado en el ID del post

      this.shareLink = `${window.location.origin}${this.$route.fullPath}\``;
      this.isShareModalOpen = true; // Abre el modal
    },
    closeShareModal() {
      this.isShareModalOpen = false; // Cierra el modal
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.shareLink)
          .then(() => {
            // Cierra el modal al copiar el enlace
            this.isShareModalOpen = false;

            // Muestra el mensaje de éxito
            this.copySuccessMessage = true;

            // Oculta el mensaje después de 2 segundos
            setTimeout(() => {
              this.copySuccessMessage = false;
            }, 2000);
          })
          .catch(err => {
            console.error("Error al copiar el enlace: ", err);
          });
    },

  },
};
</script>


<style scoped>

/* Estilo del mensaje de éxito */
.bg-green-500 {
  background-color: #38a169;
}

.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}
</style>
