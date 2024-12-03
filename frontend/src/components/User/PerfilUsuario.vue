<template>
    <div class="flex h-[calc(100vh-4rem)]"  v-if="user">

        <!-- Lateral izquierdo -->
        <aside class="bg-cyan-600 w-64 p-6 flex flex-col justify-between h-full">

            <div v-if="isLogged" class="flex flex-col space-y-4 mb-6">
                <!-- Boton mi lista -->
                <button class="flex items-center justify-center text-black rounded-md px-4 py-2 border-2 border-black hover:bg-black hover:text-cyan-400 transition duration-200 gap-8">
                    <img src="../../assets/lista.png" class="w-12 h-12">
                    <span class="font-bold text-lg">MI LISTA</span>
                </button>

                <!-- Boton guardado -->
                <button  @click="goToFavorites" class="flex items-center justify-center text-black rounded-md px-4 py-2 border-2 border-black hover:bg-black hover:text-cyan-400 transition duration-200 gap-4">
                    <img src="../../assets/guardado.png" class="w-12 h-12">
                    <span class="font-bold text-lg">PELÍCULAS FAVORITAS</span>
                </button>

                <!-- Boton moderar -->
                <button v-if="user.isAdmin" class="flex items-center justify-center text-black rounded-md px-4 py-2 border-2 border-black hover:bg-black hover:text-cyan-400 transition duration-200 gap-6">
                    <img src="../../assets/moderar.png" class="w-12 h-12">
                    <span class="font-bold text-lg">MODERAR</span>
                </button>
            </div>

            <div></div>

            <!-- Boton eliminar cuenta -->
            <button v-if="isLogged" @click="comfirmDeleteAccount" class="flex items-center justify-center text-red-500 rounded-md px-4 py-2 border-2 border-red-500 hover:bg-red-500 hover:text-white transition duration-200">
                <img src="../../assets/papelera.png" class="w-12 h-12">
                <span class="font-bold text-lg">BORRAR CUENTA</span>
            </button>

            <!-- Boton bloquear cuenta -->
            <button v-else class="flex items-center justify-center text-red-500 rounded-md px-4 py-2 border-2 border-red-500 hover:bg-red-500 hover:text-white transition duration-200">
                <img src="../../assets/bloqueo.png" class="w-12 h-12">
                <span class="font-bold text-lg">BLOQUEAR CUENTA</span>
            </button>
        </aside>

        <!-- Flecha retorno -->
        <button @click="goBack" class="absolute left-[20rem] top-[20%] transform -translate-y-1/2 w-auto h-auto flex items-center justify-center">
            <img src="../../assets/flecha.png" alt="Flecha de retorno" class="w-12 h-12">
        </button>

        <!-- Contenido principal -->
        <main class="bg-gray-900 text-white flex-grow p-6 overflow-y-auto flex items-start justify-center">

            <!-- Contenedor para la información del usuario -->
            <div class="text-center w-full max-w-4xl mt-6 relative">
                <div class="flex items-center justify-between mb-8">
                    <!-- Avatar y descripción -->
                    <div class="flex items-center">
                        <div class="w-28 h-28 bg-gray-500 rounded-full mr-8 overflow-hidden flex items-center justify-center">
                            <!-- Mostrar imagen si existe -->
                            <img
                                v-if="user?.image"
                                :src="user.image"
                                alt="Profile"
                                class="w-full h-full object-cover"
                            />
                            <!-- Mostrar ícono por defecto si no hay imagen -->
                            <span v-else class="text-white text-5xl">&#128100;</span>
                        </div>

                        <!-- Información del perfil -->
                        <div class="text-left">
                            <router-link :to="`/user/${user.userName}`" class="text-3xl font-bold text-cyan-400">
                              <h3>@{{ user.userName }}</h3>
                            </router-link>

                            <p class="text-cyan-400 mt-1">{{ user.description }}</p>

                            <!-- Contenedor para botones de seguidores/seguidos -->
                            <div class="flex mt-2 space-x-4">
                                <button class="bg-cyan-600 text-white rounded-full px-6 py-2 text-base">0 FOLLOWERS</button>
                                <button class="bg-cyan-600 text-white rounded-full px-6 py-2 text-base">0 FOLLOWING</button>
                            </div>

                            <!-- Botón de seguir -->
                            <router-link v-if="isLogged" to="/editar">
                                <button class="bg-cyan-600 text-white rounded-full px-6 py-2 mt-4 w-full hover:bg-gray-800 transition duration-200">EDIT PROFILE</button>
                            </router-link>
                            <button v-else class="bg-cyan-600 text-white rounded-full px-6 py-2 mt-4 w-full hover:bg-gray-800 transition duration-200">SEGUIR</button>

                        </div>
                    </div>
                </div>

                <!-- Línea divisoria -->
                <div class="border-t border-cyan-400 w-full mt-8"></div>
                <!-- Publicaciones del usuario -->
                <div class="mt-10">
                  <div class="review-container">
                      <div v-if= "reviews.length > 0">
                          <div v-for="(review, index) in reviews" :key="index"
                               class="review-card bg-gray-800 text-white rounded-md p-4 mb-4 shadow-lg">
                              <router-link :to="`/review/${review.id}`">
                              <h5 class="text-[#5ce1e6] font-semibold text-lg mb-2 text-left">{{ review.title }}</h5>
                              <p class="text-gray-400 text-sm mb-4 text-left">{{ review.movie.title}}</p>
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
    </div>
</template>



<script>
import axios from 'axios';
import { mapActions } from 'vuex';

export default {
    data() {
        return {
            user: null,
            error: null,
            isLogged: null,
            isAuthenticated: false,
            username: "",
            reviews: [],
        };
    },

    created() {
        this.checkAuthStatus();

        window.addEventListener('storage', this.checkAuthStatus);
    },

    watch:{
        "$route.params.userName": "fetchUserData",
    },

    mounted() {
        this.fetchUserData();
    },

    methods: {
        ...mapActions(['setUserData']),
        async fetchUserData() {
            try {
                const token = sessionStorage.getItem("auth_token");
                const BASE_URL = process.env['VUE_APP_API_BASE_URL']
                const response = await axios.get(`${BASE_URL}/user/${this.$route.params.userName}`, {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                });
                const {user, isOwnProfile, reviews} = response.data;
                this.user = {
                    id: user.id,
                    userName: user.userName,
                    email: user.email,
                    gender: user.gender,
                    description: user.description,
                    isAdmin: user.isAdmin,
                    image: user.image,
                };
                this.isLogged = isOwnProfile;
                this.reviews = reviews || [];
                await this.setUserData(this.user);

            } catch (error) {
                this.error = 'No se puede cargar la información del usuario';
                console.error("Error al obtener los datos del usuario:", error);
            }
        },

        async comfirmDeleteAccount() {
            const confirmacion = window.confirm("¿Estás seguro de querer eliminar tu cuenta?");

            if(confirmacion){
                this.deleteAccount();
            }
        },

        async deleteAccount(){
            try{
                const BASE_URL = process.env['VUE_APP_API_BASE_URL']
                await axios.delete(`${BASE_URL}/user/${this.$route.params.userName}`);

                sessionStorage.removeItem("auth_token");
                sessionStorage.removeItem("username");

                this.checkAuthStatus();
                this.isAuthenticated = false;

                this.$router.replace('/login').then(() => {
                    window.location.reload();
                });
            }catch (error){
                console.error('Error al eliminar la cuenta: ', error);
            }
        },

        async goBack(){
            this.$router.go(-1);
        },

        checkAuthStatus(){
            const token = sessionStorage.getItem("auth_token");
            this.isAuthenticated = !!token;
            this.username = token ? sessionStorage.getItem('username'):'';
        },

      goToFavorites() {
        this.$router.push("/favorites"); // Redirige a la página de favoritos
      }
    }
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

#app {
  height: 100%;
}

* {
  box-sizing: border-box;
}

button svg {
  width: 24px;
  height: 24px;
}

.review-container {
  height: 24rem;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scrollbar-width: thin;
}

.review-container::-webkit-scrollbar {
  width: 8px;
}

.review-container::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

.review-container::-webkit-scrollbar-track {
  background: #1f2937;
}

.review-card {
  background-color: #374151;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: white;
  scroll-snap-align: start;
  text-align: left;
}


.review-card h5 {
  margin-bottom: 0.5rem;
}

.review-card p {
  margin-top: 0.5rem;
}

.review-card .flex {
  margin-top: auto;
  gap: 1rem;
  justify-content: flex-end;
}

.review-card button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.review-card button:hover {
  color: #5ce1e6;
}
</style>

