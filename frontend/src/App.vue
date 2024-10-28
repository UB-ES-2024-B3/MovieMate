<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col">
    <header class="bg-header-color flex items-center justify-between p-4">
      <router-link to="/" class="self-center text-2xl font-semibold whitespace-nowrap dark:text-black">
        <h1>MovieMate</h1>
      </router-link>

      <router-link :to="isAuthenticated ? `/user/${username}` : '/register'">
        <button class="btn btn-dark p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" />
          </svg>
        </button>
      </router-link>
    </header>

    <main class="flex-grow">
      <router-view></router-view>
    </main>

    <footer class="bg-gray-800 text-center text-sm p-4">
      <p>&copy; 2024 MovieMate. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAuthenticated: false, // iniciaremos el token como false al inciar la app
      username: ''
    };
  },
  mounted() {
    // Verificamos si el token existe en sessionStorage
    const token = sessionStorage.getItem("auth_token");
    this.isAuthenticated = !!token;

    // Almacenar en session storage después del Login
    if (this.isAuthenticated) {
      this.username = 'username'; // Este valor se debe actualizar después del login (N6)
    }
  },
};
</script>



