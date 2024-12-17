<template>
  <div class="flex h-[calc(100vh-4rem)]" v-if="user">
    <div
      v-if="showMessage"
      :class="[
        'fixed top-4 right-4 p-4 rounded-md text-white shadow-lg',
        toastError ? 'bg-red-500' : 'bg-green-500'
      ]"
    >
      {{ message }}
    </div>
    <!-- Lateral izquierdo -->
    <aside class="bg-cyan-600 w-64 p-6 flex flex-col justify-between h-full">
      <div v-if="isLogged" class="flex flex-col space-y-4 mb-6">
        <!-- Botón mi lista -->
        <button class="flex items-center justify-center text-black rounded-md px-4 py-2 border-2 border-black hover:bg-black hover:text-cyan-400 transition duration-200 gap-8">
          <img src="../../assets/lista.png" class="w-12 h-12" />
          <span class="font-bold text-lg">MI LISTA</span>
        </button>

        <!-- Botón guardado -->
        <button @click="goToFavorites" class="flex items-center justify-center text-black rounded-md px-4 py-2 border-2 border-black hover:bg-black hover:text-cyan-400 transition duration-200 gap-4">
          <img src="../../assets/guardado.png" class="w-12 h-12" />
          <span class="font-bold text-lg">PELÍCULAS FAVORITAS</span>
        </button>

        <button v-if="isLogged" @click=cerrarSesion  class="flex items-center justify-center text-black rounded-md px-4 py-2 border-2 border-black hover:bg-black hover:text-cyan-400 transition duration-200 gap-6">
          <img src="../../assets/cerrar_sesion.png" class="w-12 h-12" />
          <span class="font-bold text-lg">CERRAR SESION</span>
        </button>

        <!-- Botón moderar -->
        <button v-if="user.isAdmin" class="flex items-center justify-center text-black rounded-md px-4 py-2 border-2 border-black hover:bg-black hover:text-cyan-400 transition duration-200 gap-6">
          <img src="../../assets/moderar.png" class="w-12 h-12" />
          <span class="font-bold text-lg">MODERAR</span>
        </button>
      </div>
    </aside>

    <!-- Contenido principal -->
    <main class="bg-gray-900 text-white flex-grow p-6 overflow-y-auto flex items-start justify-center">
      <div class="text-center w-full max-w-4xl mt-6 relative">
        <!-- Contenedor principal con Flexbox -->
        <div class="flex items-start justify-start space-x-8 mb-8">
          <!-- Avatar -->
          <div class="w-28 h-28 bg-gray-500 rounded-full overflow-hidden flex items-center justify-center">
            <!-- Mostrar imagen si existe -->
            <img v-if="user?.image" :src="user.image" alt="Profile" class="w-full h-full object-cover" />
            <!-- Mostrar ícono por defecto si no hay imagen -->
            <span v-else class="text-white text-5xl">&#128100;</span>
          </div>

          <!-- Información del perfil y botones -->
          <div class="text-left flex-1">
            <router-link :to="`/user/${user.userName}`" class="text-3xl font-bold text-cyan-400">
              <h3>@{{ user.userName }}</h3>
            </router-link>
            <p class="text-cyan-400 mt-1">{{ user.description }}</p>

            <!-- Botones followers y following -->
            <div class="flex mt-2 space-x-4">
              <button @click="viewFollowers" class="bg-cyan-600 text-white rounded-full px-6 py-2 text-base">
                {{ this.followersCount || 0 }} FOLLOWERS
              </button>
              <button @click="viewFollowings" class="bg-cyan-600 text-white rounded-full px-6 py-2 text-base">
                {{ this.followingCount || 0 }} FOLLOWING
              </button>
            </div>

            <!-- Botón EDIT PROFILE -->
            <div class="mt-4">
              <router-link v-if="isLogged" to="/editar">
                <button class="bg-cyan-600 text-white rounded-full px-28 py-2 text-base transition duration-200">
                  EDIT PROFILE
                </button>
              </router-link>
              <button
                v-else
                @click="openConfirmation"
                :class="isFollowing ? 'bg-red-600' : 'bg-cyan-600'"
                class="bg-cyan-600 text-white rounded-full px-28 py-2 text-base transition duration-200"
              >
                {{ isFollowing ? 'DEJAR DE SEGUIR' : 'SEGUIR' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Línea divisoria -->
        <div class="border-t border-cyan-400 w-full mt-8"></div>

        <!-- Publicaciones del usuario -->
        <div class="mt-10">
          <div class="review-container">
            <div v-if="reviews.length > 0">
              <div v-for="(review, index) in reviews" :key="index"
                   class="review-card bg-gray-800 text-white rounded-md p-4 mb-4 shadow-lg">
                <router-link :to="`/review/${review.id}`">
                  <h5 class="text-[#5ce1e6] font-semibold text-lg mb-2 text-left">{{ review.title }}</h5>
                  <p class="text-gray-400 text-sm mb-4 text-left">{{ review.movie.title }}</p>
                  <p class="text-gray-200 mb-4 text-left">{{ review.content }}</p>
                  <!-- Botones de Comentar y Me gusta dentro de la reseña -->
                  <div class="flex justify-end space-x-4 mt-4">
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
                </router-link>
              </div>
            </div>
            <p v-else class="text-gray-400 flex justify-center">No hay publicaciones disponibles.</p>
          </div>
        </div>
      </div>
    </main>


    <!-- Modal de confirmación -->
    <transition name="fade">
      <div
          v-if="showConfirmation"
          class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      >
        <div class="bg-gray-800 rounded-lg p-6 w-96 text-center shadow-lg">
          <h3 class="text-xl font-semibold text-white">
            {{ isFollowing
              ? `¿Dejar de seguir a @${user.userName}?`
              : `¿Seguir a @${user.userName}?` }}
          </h3>
          <p class="text-gray-400 mt-2">
            {{ isFollowing
              ? "Ya no verás las publicaciones de este usuario."
              : "Comenzarás a ver las publicaciones de este usuario en tu feed." }}
          </p>
          <div class="flex justify-around mt-6">
            <button
                @click="confirmToggleFollow"
                class="bg-cyan-600 text-white px-6 py-2 rounded-full hover:bg-cyan-700 transition"
            >
              Confirmar
            </button>
            <button
                @click="closeConfirmation"
                class="bg-gray-700 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>

  <!-- Modal de seguidores y seguidos -->
  <transition name="fade">
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto shadow-lg">
        <h3 class="text-2xl font-semibold text-white mb-4">
          {{ showFollowersList ? 'Followers' : 'Followings' }}
        </h3>

        <!-- Lista de seguidores/seguidos -->
        <ul class="space-y-3">
          <li
              v-for="item in (showFollowersList ? followers : followings)"
              :key="item.userName"
              class="flex items-center text-gray-300 space-x-4"
          >
            <router-link :to="`/user/${item.userName}`" class="flex items-center w-full hover:underline"  @click="closeModal">

              <!-- Imagen de perfil -->
              <img
                  v-if="item?.image"
                  :src="item.image"
                  alt="Profile"
                  class="w-8 h-8 rounded-full object-cover"
              />
              <span v-else class="w-8 h-8 flex items-center justify-center bg-gray-600 rounded-full text-white text-sm font-semibold">
        {{ item.userName.charAt(0).toUpperCase() }}
      </span>

              <!-- Nombre de usuario -->
              <div class="ml-3">
                <div class="font-semibold text-cyan-400">@{{ item.userName }}</div>
              </div>
            </router-link>
          </li>
        </ul>


        <div class="mt-4 flex justify-center space-x-4">
          <button @click="closeModal" class="bg-cyan-600 text-white px-6 py-2 rounded-full hover:bg-cyan-700 transition duration-200">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from "axios";
import {mapActions} from "vuex";

export default {
  data() {
    return {
      user: null,
      isLogged: null, // Si es el propio perfil
      isFollowing: this.fetchFollowingCount(), // Estado del botón de seguir
      followMessage: null, // Mensaje de éxito/error
      showConfirmation: false, // Control del modal
      followersCount: 0,
      followingCount: 0,
      followers: [],
      followings: [],
      reviews: [],
      showFollowersList: false,
      showFollowingsList: false,
      showModal: false,
      showMessage: false, // Controlar la visibilidad del mensaje
      message: "", // Mensaje a mostrar
      toastError: false //Para enseñar si es error o no
    };
  },

  created() {
    this.checkAuthStatus();
    window.addEventListener("storage", this.checkAuthStatus);
  },

  watch: {
    "$route.params.userName": "fetchUserData",
  },

  mounted() {
    this.fetchUserData();
  },

  methods: {
    ...mapActions(['setUserData', "clearUserData"]),
    async fetchFollowingCount() {
      try {
        const token = sessionStorage.getItem("auth_token");
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const response = await axios.get(`${BASE_URL}/user/${this.$route.params.userName}/following`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const followingList = response.data; // Assuming the API returns an array of following users
        this.followingCount = followingList.length; // Count the number of users

      } catch (error) {
        console.error("Error fetching the following list:", error);
      }
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
    async cerrarSesion() {
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("username");
      this.isLogged = false;

      this.displayMessage("Has Cerrado Sesion Correctamente", true, () => window.location.href = '/');
    },
    async fetchFollowersCount() {
      try {
        const token = sessionStorage.getItem("auth_token");
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const response = await axios.get(`${BASE_URL}/user/${this.$route.params.userName}/followers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const followersList = response.data; // Assuming the API returns an array of followers
        this.followersCount = followersList.length; // Count the number of followers
        // Comprueba si el username del perfil actual está en la lista de followings
        const currentProfileUserName = sessionStorage.getItem("username");
        this.isFollowing = followersList.some((user) => user.userName === currentProfileUserName);
        return this.isFollowing
      } catch (error) {
        console.error("Error fetching the followers list:", error);
      }
    },

    async fetchUserData() {
      try {
        const token = sessionStorage.getItem("auth_token");
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const response = await axios.get(`${BASE_URL}/user/${this.$route.params.userName}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { user, isOwnProfile, isFollowing, reviews} = response.data;
        this.user = {
          id: user.id,
          userName: user.userName,
          email: user.email,
          description: user.description,
          isAdmin: user.isAdmin,
          image: user.image,
        };
        this.isLogged = isOwnProfile;
        this.isFollowing = isFollowing;
        this.reviews = reviews;
        await this.setUserData(this.user)
        // Set follower and following counts
        await this.fetchFollowingCount();
        await this.fetchFollowersCount()
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    },

    async toggleFollow() {
      const token = sessionStorage.getItem("auth_token");
      const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
      const userName1 = sessionStorage.getItem("username");
      const userName2 = this.user.userName; // Usuario a seguir

      try {
        await axios.put(`${BASE_URL}/user/${userName2}/${userName1}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });

        await this.fetchUserData();
        this.followMessage = this.isFollowing
            ? "Ahora sigues a este usuario."
            : "Has dejado de seguir a este usuario.";


        setTimeout(() => (this.followMessage = null), 3000);
      } catch (error) {
        console.error("Error al seguir/dejar de seguir al usuario:", error);
        this.followMessage = "Ocurrió un error. Intenta nuevamente.";
        setTimeout(() => (this.followMessage = null), 3000);
      }
    },

    async viewFollowers() {
      try {
        this.showFollowersList = true;
        this.showFollowingsList = false;
        this.showModal = true;
        const token = sessionStorage.getItem("auth_token");
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const response = await axios.get(`${BASE_URL}/user/${this.user.userName}/followers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.followers = response.data; // Asumiendo que la API devuelve una lista de seguidores
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    },

    async viewFollowings() {
      try {
        this.showFollowersList = false;
        this.showFollowingsList = true;
        this.showModal = true;
        const token = sessionStorage.getItem("auth_token");
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const response = await axios.get(`${BASE_URL}/user/${this.user.userName}/following`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.followings = response.data; // Asumiendo que la API devuelve una lista de seguidos
        console.log(this.followings);
      } catch (error) {
        console.error("Error fetching followings:", error);
      }
    },
    closeModal() {
      this.showModal = false;
    },

    checkAuthStatus() {
      const token = sessionStorage.getItem("auth_token");
      this.isLogged = !!token;
    },

    openConfirmation() {
      this.showConfirmation = true;
    },

    closeConfirmation() {
      this.showConfirmation = false;
    },

    confirmToggleFollow() {
      this.toggleFollow();
      this.closeConfirmation();
    },

    goToFavorites() {
      this.$router.push("/favorites");
    },
  },

};
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #000;
}

button {
  transition: all 0.3s ease;
}

button:hover {
  transform: scale(1.05);
}

/* Mejorar el estilo de la lista */
ul {
  list-style: none;
  padding: 0;
}

li {
  transition: background-color 0.3s ease;
}

li:hover {
  background-color: #2d3748;
  cursor: pointer;
}
</style>
