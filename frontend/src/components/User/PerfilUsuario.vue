<template>
  <div class="flex h-[calc(100vh-4rem)]" v-if="user">
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
        <div class="flex items-center justify-between mb-8">
          <!-- Avatar y descripción -->
          <div class="flex items-center">
            <div class="w-28 h-28 bg-gray-500 rounded-full mr-8 overflow-hidden flex items-center justify-center">
              <!-- Mostrar imagen si existe -->
              <img v-if="user?.image" :src="user.image" alt="Profile" class="w-full h-full object-cover" />
              <!-- Mostrar ícono por defecto si no hay imagen -->
              <span v-else class="text-white text-5xl">&#128100;</span>
            </div>

            <!-- Información del perfil -->
            <div class="text-left">
              <router-link :to="`/user/${user.userName}`" class="text-3xl font-bold text-cyan-400">
                <h3>@{{ user.userName }}</h3>
              </router-link>

              <p class="text-cyan-400 mt-1">{{ user.description }}</p>

              <!-- Botones de seguidores/seguidos -->
              <div class="flex mt-2 space-x-4">
                <button class="bg-cyan-600 text-white rounded-full px-6 py-2 text-base">0 FOLLOWERS</button>
                <button class="bg-cyan-600 text-white rounded-full px-6 py-2 text-base">0 FOLLOWING</button>
              </div>

              <!-- Botón editar o seguir -->
              <router-link v-if="isLogged" to="/editar">
                <button class="bg-cyan-600 text-white rounded-full px-6 py-2 mt-4 w-full hover:bg-gray-800 transition duration-200">EDIT PROFILE</button>
              </router-link>
              <button
                  v-else
                  @click="openConfirmation"
                  :class="isFollowing ? 'bg-red-600' : 'bg-cyan-600'"
                  class="text-white rounded-full px-6 py-2 mt-4 w-full hover:bg-gray-800 transition duration-200"
              >
                {{ isFollowing ? 'DEJAR DE SEGUIR' : 'SEGUIR' }}
              </button>

              <!-- Mensaje de éxito -->
              <div v-if="followMessage" class="mt-4 text-center">
                <p class="text-cyan-400 font-semibold">{{ followMessage }}</p>
              </div>
            </div>
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
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: null,
      isLogged: null, // Si es el propio perfil
      isFollowing: false, // Estado del botón de seguir
      followMessage: null, // Mensaje de éxito/error
      showConfirmation: false, // Control del modal
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
    async fetchUserData() {
      try {
        const token = sessionStorage.getItem("auth_token");
        const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
        const response = await axios.get(`${BASE_URL}/user/${this.$route.params.userName}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { user, isOwnProfile, isFollowing } = response.data;

        this.user = {
          id: user.id,
          userName: user.userName,
          email: user.email,
          description: user.description,
          isAdmin: user.isAdmin,
          image: user.image,
        };
        this.isLogged = isOwnProfile; // Determina si es el propio perfil
        this.isFollowing = isFollowing; // Estado inicial del botón de seguir
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    },

    async toggleFollow() {
      const token = sessionStorage.getItem("auth_token");
      const BASE_URL = process.env["VUE_APP_API_BASE_URL"];
      const userName1 = sessionStorage.getItem("username");
      const userName2 = this.user.userName;

      try {
        await axios.put(`${BASE_URL}/user/${userName2}/${userName1}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.isFollowing = !this.isFollowing;
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
</style>
