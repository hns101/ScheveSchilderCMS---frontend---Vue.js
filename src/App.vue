<template>
  <div id="app">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <img src="./assets/logo.svg" alt="logo" width="184px">
      </div>
      <nav class="sidebar-nav">
        <router-link to="/students" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h-10a2 2 0 01-2-2V8a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2zM12 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
          Ledenboek
        </router-link>
        <router-link to="/invoices" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Incasso boekingen
        </router-link>
        <router-link to="/pdf-layout" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          PDF Layout
        </router-link>
        <router-link to="/settings" class="nav-item">
          <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Instellingen
        </router-link>
      </nav>
    </aside>

    <!-- Main content area -->
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<style scoped>
@import 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';

#app {
  display: flex;
  height: 100vh;
  font-family: 'Inter', sans-serif;
  background-color: var(--color-background-light);
}

/* Sidebar Styling */
.sidebar {
  display: flex;
  flex-direction: column;
  width: 256px;
  background-color: var(--color-white);
  border-right: 1px solid var(--color-border);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 134px;
  border-bottom: 3px solid var(--color-border);
}

.logo-text {
  font-size: 1.25rem; /* 20px */
  font-weight: 700;
  color: var(--color-text-dark);
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: var(--color-text-regular);
  transition: background-color 0.2s ease;
  border-radius: 0.5rem;
  text-decoration: none;
}

.nav-item:hover, .router-link-active {
  background-color: var(--color-background-hover);
  font-weight: 600;
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
  color: var(--color-text-regular);
}

/* Main Content Styling */
.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}
</style>