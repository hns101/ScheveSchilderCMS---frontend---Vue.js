<template>
  <div class="page-container">
    <div class="pdf-viewer-header">
      <h1 class="page-title">{{ title }}</h1>
      <a :href="pdfUrl" class="download-button" download>
        <svg xmlns="http://www.w3.org/2000/svg" class="download-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download PDF
      </a>
    </div>

    <div v-if="loading" class="loading-message">Laden van PDF...</div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <div class="pdf-container">
      <!-- We'll use a simple iframe to embed the PDF -->
      <iframe :src="pdfUrl" frameborder="0"></iframe>
    </div>

    <button @click="router.back()" class="back-button">Terug</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const title = ref('PDF Viewer');
const pdfUrl = ref('');
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(() => {
  const fileId = route.params.id as string;
  const fileType = route.params.type as string; // 'student' or 'invoice'

  if (fileId && fileType) {
    if (fileType === 'student') {
      title.value = 'Registratiedocument';
      pdfUrl.value = `/api/students/${fileId}/registration-document`;
    } else if (fileType === 'invoice') {
      title.value = `Factuur: ${fileId}`;
      pdfUrl.value = `/api/invoices/file/${fileId}`;
    }
  } else {
    error.value = 'Geen PDF-bestand geselecteerd.';
  }
  loading.value = false;
});
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

.pdf-viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--color-text-dark);
  margin-bottom: 0;
}

.download-button {
  background-color: var(--color-primary);
  color: var(--color-background-light);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.download-button:hover {
  background-color: #b67949;
}

.download-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
}

.pdf-container {
  border: 1px solid var(--color-border);
  height: 70vh;
  margin-bottom: 1rem;
}

.pdf-container iframe {
  width: 100%;
  height: 100%;
}

.loading-message, .error-message {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  text-align: center;
}

.loading-message {
  background-color: var(--color-background-hover);
  color: var(--color-text-regular);
}

.error-message {
  background-color: #fee2e2;
  color: #ef4444;
}

.back-button {
  background-color: var(--color-primary);
  color: var(--color-background-light);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s ease;
}

.back-button:hover {
  background-color: #b67949;
}
</style>
