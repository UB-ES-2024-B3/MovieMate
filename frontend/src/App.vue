<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col">
    <header class="bg-header-color flex items-center justify-between p-4">
      <h1 class="text-black text-2xl font-semibold">MovieMate</h1>
      <router-link to="/login">
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
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  height: 100%;
}

#app {
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

header {
  background-color: #00BCD4;
}
</style>


