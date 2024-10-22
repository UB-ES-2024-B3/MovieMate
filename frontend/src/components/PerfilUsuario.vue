<template>
    <div class="flex h-[calc(100vh-4rem)]">
        <!-- Lateral izquierdo -->
        <aside class="bg-cyan-600 w-64 p-6 flex flex-col justify-between h-full">
            <div></div>
            <button class="flex items-center justify-center text-red-500 rounded-md px-4 py-2 border-2 border-red-500 hover:bg-red-500 hover:text-white transition duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
                <span class="font-bold text-lg">BLOQUEAR CUENTA</span>
            </button>
        </aside>

        <!-- Flecha retorno -->
        <button class="absolute left-[20rem] top-[20%] transform -translate-y-1/2 w-auto h-auto flex items-center justify-center">
            <img src="@/assets/flecha.png" alt="Flecha de retorno" class="w-12 h-12">
        </button>

        <!-- Contenido principal -->
        <main class="bg-gray-900 text-white flex-grow p-6 overflow-y-auto flex items-start justify-center">

            <!-- Contenedor para la información del usuario -->
            <div class="text-center w-full max-w-4xl mt-6">
                <div class="flex items-center mb-8">
                    <div class="w-28 h-28 bg-gray-500 rounded-full mr-8"></div>

                    <!-- Información del perfil -->
                    <div class="text-left" v-if="user">
                        <h3 class="text-3xl font-bold text-cyan-400">@{{ user.userName }}</h3>
                        <p class="text-cyan-400 mt-1">Breve descripción del usuario ...</p>
                        <p class="text-cyan-400">...</p>

                        <!-- Contenedor para botones de seguidores/seguidos -->
                        <div class="flex mt-2 space-x-4">
                            <button class="bg-cyan-600 text-white rounded-full px-6 py-2 text-base">0 FOLLOWERS</button>
                            <button class="bg-cyan-600 text-white rounded-full px-6 py-2 text-base">0 FOLLOWING</button>
                        </div>

                        <!-- Botón de seguir -->
                        <button class="bg-cyan-600 text-white rounded-full px-6 py-2 mt-4 w-full hover:bg-gray-800 transition duration-200">SEGUIR</button>
                    </div>
                </div>

                <!-- Línea divisoria -->
                <div class="border-t border-cyan-400 w-full mt-8"></div>

                <!-- Publicaciones del usuario -->
                <div class="mt-10">
                    <h4 class="text-lg font-semibold">Publicaciones</h4>
                    <div class="mt-4">
                        <p class="text-gray-300">Aquí aparecerán las publicaciones del usuario...</p>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>



<script>
import axios from 'axios';

export default {
    data() {
        return {
        user: null,
        error: null,
        };
    },

    mounted() {
        this.fetchUserData();
    },

    methods: {
        async fetchUserData() {
            try {
                const response = await axios.get(`http://localhost:3000/user/${this.$route.params.userName}`);
                console.log(response.data)
                const userData = response.data;
                this.user = {
                    userName: userData._name,
                    email: userData._email,
                    gender: userData._gender
                };
                console.log(this.user)
            } catch (error) {
                this.error = 'No se puede cargar la información del usuario';
                console.error("Error al obtener los datos del usuario:", error);
            }
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
</style>

