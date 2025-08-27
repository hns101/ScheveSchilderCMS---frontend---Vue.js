<template>
  <div id="app" class="flex h-screen bg-gray-100 font-sans">
    <!-- Sidebar -->
    <aside class="flex flex-col w-64 bg-white border-r border-gray-200">
      <div class="flex items-center justify-center h-16 border-b border-gray-200">
        <span class="text-xl font-bold text-gray-800">scheveSchilderCMS</span>
      </div>
      <nav class="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        <router-link to="/students" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h-10a2 2 0 01-2-2V8a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2zM12 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
          Ledenboek
        </router-link>
        <router-link to="/invoices" class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Incasso boekingen
        </router-link>
      </nav>
    </aside>

    <!-- Main content area -->
    <main class="flex-1 p-8 overflow-y-auto">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

export default defineComponent({
  name: 'App',
  components: {
    RouterLink,
    RouterView
  }
});
</script>

<style>
@import 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';

#app {
  font-family: 'Inter', sans-serif;
}

.router-link-active {
  background-color: #F3F4F6;
  font-weight: 600;
}
</style>
    