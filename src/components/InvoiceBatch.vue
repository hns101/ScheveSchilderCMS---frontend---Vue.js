<template>
  <div class="page-container">
    <h1 class="page-title">Incasso boekingen</h1>
    <p class="page-description">This page will be used to generate invoices in batches.</p>
  </div>
</template>

<script setup>
// This will be filled with logic to generate invoices
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 2rem;
  background-color: var(--color-white);
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.page-title {
  font-size: 1.875rem; /* 30px */
  font-weight: 600;
  color: var(--color-text-dark);
}

.page-description {
  margin-top: 0.5rem;
  color: var(--color-text-regular);
}
</style>