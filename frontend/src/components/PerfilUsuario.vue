<template>
  <div class="flex h-[calc(100vh-4rem)]">
    <!-- Lateral izquierdo -->
    <aside class="bg-cyan-600 w-64 p-6 flex flex-col justify-between h-full">
      <div>
      </div>
      <button class="flex items-center justify-center text-red-500 rounded-md px-4 py-2 border-2 border-red-500 hover:bg-red-500 hover:text-white transition duration-200">
        <img src="@/assets/bloqueo.png" alt="Bloquear Cuenta" class="w-5 h-5 mr-2" />
        <span class="font-bold text-lg">BLOQUEAR CUENTA</span>
      </button>
    </aside>

    <!-- Contenido principal -->
    <main class="bg-gray-900 text-white flex-grow p-6 overflow-y-auto flex items-start justify-center">
      <!-- Contenedor para la información del usuario -->
      <div class="text-center mt-8">
        <!-- Información del perfil -->
        <div class="flex items-center">
          <div class="w-24 h-24 bg-gray-500 rounded-full mr-4"></div>
          <div class="flex flex-col items-start">
            <h3 class="text-xl font-bold">@USUARIO_TEST</h3>
            <p class="text-gray-400">Breve descripción del usuario</p>
            <div class="flex mt-2">
              <button class="bg-cyan-600 text-white rounded-full px-4 py-1 mr-2">0 FOLLOWERS</button>
              <button class="bg-cyan-600 text-white rounded-full px-4 py-1 mr-2">0 FOLLOWING</button>
            </div>
            <button class="bg-gray-900 text-cyan-600 border-2 border-cyan-600 rounded-full px-4 py-1 mt-2 w-full hover:bg-gray-800">SEGUIR</button>
          </div>
        </div>

        <!-- Publicaciones del usuario -->
        <div class="mt-8">
          <h4 class="text-lg font-semibold">Publicaciones</h4>
          <div class="mt-4">
            <p class="text-gray-300">Aquí aparecerán las publicaciones del usuario...</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
html, body {
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
</style>




