<template>
  <div>
     <header class="bg-sky-300 flex items-center justify-between p-4">
      <h1 class="text-black text-2xl font-semibold">MovieMate</h1>

      <router-link to="/login">
        <button class="btn btn-dark p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" />
          </svg>
        </button>
      </router-link>
    </header>




    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <router-view></router-view>
    </main>
  </div>
</template>


<script>

</script>

<style>

</style>
