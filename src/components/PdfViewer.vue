<template>
  <div class="page-container">
    <div class="pdf-viewer-header">
      <h1 class="page-title">{{ title }}</h1>
      <a :href="pdfUrl" class="download-button" download>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Download PDF
      </a>
    </div>

    <div v-if="loading" class="loading-message">Laden van PDF...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>

    <div v-else class="pdf-container">
      <iframe :src="pdfUrl" frameborder="0"></iframe>
    </div>

    <button @click="router.back()" class="back-button">Terug</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const title = ref('');
const pdfUrl = ref('');
const loading = ref(true);
const error = ref<string | null>(null);

const fetchPdf = async () => {
  const { type, id } = route.params;
  let apiEndpoint = '';

  if (type === 'student' && typeof id === 'string') {
    title.value = 'Registratiedocument';
    apiEndpoint = `/api/students/${id}/registration-document`;
  } else if (type === 'invoice' && typeof id === 'string') {
    title.value = `Factuur ${id.substring(0, 8)}...`;
    apiEndpoint = `/api/invoices/file/${id}`;
  } else {
    error.value = 'Ongeldige documentparameters.';
    loading.value = false;
    return;
  }

  try {
    const response = await axios.get(apiEndpoint, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    pdfUrl.value = URL.createObjectURL(blob);
  } catch (err) {
    console.error(`Fout bij het laden van de PDF vanaf ${apiEndpoint}:`, err);
    error.value = 'Kan de PDF niet laden. Probeer het opnieuw.';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchPdf);
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
  font-size: 1.875rem; /* 30px */
  font-weight: 600;
  color: var(--color-text-dark);
  margin: 0;
}

.download-button {
  background-color: var(--color-primary);
  color: var(--color-background-light);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.download-button:hover {
  background-color: #b0753a;
}

.pdf-container {
  border: 1px solid var(--color-border);
  height: 80vh;
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
  background-color: var(--color-text-light);
  color: var(--color-background-light);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  margin-top: 2rem;
  transition: background-color 0.2s ease;
}

.back-button:hover {
  background-color: #8a939e;
}
</style>