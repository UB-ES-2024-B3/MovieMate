<template>
    <div class="flex h-[calc(100vh-4rem)]"  v-if="user">
        <!-- Lateral izquierdo -->
        <aside class="bg-cyan-600 w-64 p-6 flex flex-col justify-between h-full">
            <div v-if="isLogged" class="flex flex-col space-y-4 mb-6">
                <button class="flex items-center justify-center text-black rounded-md px-4 py-2 border-2 border-black hover:bg-black hover:text-cyan-400 transition duration-200 gap-8">
                    <img src="@/assets/lista.png" class="w-12 h-12">
                    <span class="font-bold text-lg">MI LISTA</span>
                </button>
                <button class="flex items-center justify-center text-black rounded-md px-4 py-2 border-2 border-black hover:bg-black hover:text-cyan-400 transition duration-200 gap-4">
                    <img src="@/assets/guardado.png" class="w-12 h-12">
                    <span class="font-bold text-lg">GUARDADO</span>
                </button>

                <button v-if="user.isAdmin" class="flex items-center justify-center text-black rounded-md px-4 py-2 border-2 border-black hover:bg-black hover:text-cyan-400 transition duration-200 gap-6">
                    <img src="@/assets/moderar.png" class="w-12 h-12">
                    <span class="font-bold text-lg">MODERAR</span>
                </button>
            </div>

            <div></div>
            <button v-if="isLogged" @click="comfirmDeleteAccount" class="flex items-center justify-center text-red-500 rounded-md px-4 py-2 border-2 border-red-500 hover:bg-red-500 hover:text-white transition duration-200">
                <img src="@/assets/papelera.png" class="w-12 h-12">
                <span class="font-bold text-lg">BORRAR CUENTA</span>
            </button>

            <button v-else class="flex items-center justify-center text-red-500 rounded-md px-4 py-2 border-2 border-red-500 hover:bg-red-500 hover:text-white transition duration-200">
                <img src="@/assets/bloqueo.png" class="w-12 h-12">
                <span class="font-bold text-lg">BLOQUEAR CUENTA</span>
            </button>
        </aside>

        <!-- Flecha retorno -->
        <button @click="retourn" class="absolute left-[20rem] top-[20%] transform -translate-y-1/2 w-auto h-auto flex items-center justify-center">
            <img src="@/assets/flecha.png" alt="Flecha de retorno" class="w-12 h-12">
        </button>

        <!-- Contenido principal -->
        <main class="bg-gray-900 text-white flex-grow p-6 overflow-y-auto flex items-start justify-center">

 <!-- Contenedor para la información del usuario -->
<div class="text-center w-full max-w-4xl mt-6 relative">
    <div class="flex items-center justify-between mb-8">
        <!-- Avatar y descripción -->
        <div class="flex items-center">
            <div class="w-28 h-28 bg-gray-500 rounded-full mr-8"></div>
            <!-- Información del perfil -->
            <div class="text-left">
                <h3 class="text-3xl font-bold text-cyan-400">@{{ user.userName }}</h3>
                <p class="text-cyan-400 mt-1">{{ user.description }}</p>

                <!-- Contenedor para botones de seguidores/seguidos -->
                <div class="flex mt-2 space-x-4">
                    <button class="bg-cyan-600 text-white rounded-full px-6 py-2 text-base">0 FOLLOWERS</button>
                    <button class="bg-cyan-600 text-white rounded-full px-6 py-2 text-base">0 FOLLOWING</button>
                </div>

                <!-- Botón de seguir -->
                <button class="bg-cyan-600 text-white rounded-full px-6 py-2 mt-4 w-full hover:bg-gray-800 transition duration-200">SEGUIR</button>
            </div>
        </div>


    </div>
    <div class="border-t border-cyan-400 w-full mt-8"></div>

                <!-- Publicaciones del usuario -->
                <div class="mt-10">
                    <h4 class="text-lg font-semibold">Publicaciones</h4>
                    <div class="mt-4">
                        <p class="text-gray-300">Aquí aparecerán las publicaciones del usuario...</p>
                    </div>
                </div>
</div>               <!-- Línea divisoria -->

        </main>
                <!-- Botón de editar -->
        <button class="absolute right-[20%] top-[20%] transform -translate-y-1/2 w-auto h-auto flex items-center justify-center">
            <img src="@/assets/editar.png" alt="Editar perfil" class="w-12 h-12">
        </button>
    </div>
</template>



<script>
import axios from 'axios';

export default {
    data() {
        return {
            user: null,
            error: null,
            isLogged: null,
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

                const {user, isOwnProfile} = response.data;
                this.user = {
                    userName: user._userName,
                    email: user._email,
                    gender: user._gender,
                    description: user._description,
                    isAdmin: user._isAdmin,
                };

                this.isLogged = isOwnProfile;
                console.log(this.user)

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
                await axios.delete(`http://localhost:3000/user/${this.$route.params.userName}`);

                this.$router.push('/login');
            }catch (error){
                console.error('Error al eliminar la cuenta: ', error);
            }
        },

        async retourn(){
            this.$router.go(-1);
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

