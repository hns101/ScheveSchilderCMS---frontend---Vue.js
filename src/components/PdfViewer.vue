<template>
  <div class="page-container">
    <div class="pdf-viewer-header">
      <div class="header-left">
        <button @click="router.back()" class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Terug
        </button>
        <h1 class="page-title">{{ title }}</h1>
      </div>
      <a v-if="pdfUrl && !loading && !error" :href="pdfUrl" class="download-button" download>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="button-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Download PDF
      </a>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">
        <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p class="loading-text">Laden van PDF...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 class="error-title">Kan PDF niet laden</h3>
      <p class="error-message">{{ error }}</p>
      <div class="error-actions">
        <button @click="retryLoad" class="retry-button">
          <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8.002 8.002 0 0015.357 2m-15.357 0H4m15.357 0v5h-.582M19.418 15A8.001 8.001 0 004.582 15m0 0V15a8.002 8.002 0 0015.357-2m-15.357 0H4" />
          </svg>
          Opnieuw proberen
        </button>
        <button @click="router.back()" class="back-error-button">Terug gaan</button>
      </div>
    </div>

    <div v-else-if="pdfUrl" class="pdf-container">
      <iframe
          :src="pdfUrl"
          frameborder="0"
          @load="onIframeLoad"
          @error="onIframeError"
          title="PDF Viewer"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const title = ref('');
const pdfUrl = ref('');
const loading = ref(true);
const error = ref<string | null>(null);

const fetchPdf = async () => {
  loading.value = true;
  error.value = null;

  const { type, id } = route.params;

  console.log('Fetching PDF - Type:', type, 'ID:', id);

  // Validate parameters
  if (!type || !id || typeof type !== 'string' || typeof id !== 'string') {
    error.value = 'Ongeldige documentparameters.';
    loading.value = false;
    return;
  }

  let apiEndpoint = '';
  let documentTitle = '';

  // Set endpoint and title based on type
  if (type === 'student') {
    documentTitle = 'Registratiedocument';
    apiEndpoint = `/api/students/${id}/registration-document`;
  } else if (type === 'invoice') {
    documentTitle = `Factuur ${id.substring(0, 8)}...`;
    apiEndpoint = `/api/invoices/file/${id}`;
  } else {
    error.value = 'Onbekend documenttype.';
    loading.value = false;
    return;
  }

  title.value = documentTitle;

  try {
    console.log('Making request to:', apiEndpoint);

    // Add timestamp to prevent caching issues
    const timestamp = new Date().getTime();
    const response = await axios.get(`${apiEndpoint}?t=${timestamp}`, {
      responseType: 'blob',
      timeout: 30000, // 30 second timeout
      headers: {
        'Accept': 'application/pdf'
      }
    });

    console.log('Response received, type:', response.data.type, 'size:', response.data.size);

    // Check if response is actually a PDF
    if (response.data.type && !response.data.type.includes('pdf')) {
      throw new Error('Het bestand is geen geldige PDF');
    }

    // Create blob URL for PDF
    const blob = new Blob([response.data], { type: 'application/pdf' });

    // Check if blob has content
    if (blob.size === 0) {
      throw new Error('Het PDF bestand is leeg');
    }

    pdfUrl.value = URL.createObjectURL(blob);
    console.log('PDF URL created successfully');

  } catch (err: any) {
    console.error(`Error loading PDF from ${apiEndpoint}:`, err);

    // Handle different error types
    if (err.code === 'ECONNABORTED') {
      error.value = 'Time-out bij het laden van de PDF. Probeer het opnieuw.';
    } else if (err.response) {
      if (err.response.status === 404) {
        error.value = 'Document niet gevonden. Het bestand bestaat mogelijk niet meer.';
      } else if (err.response.status === 403) {
        error.value = 'Geen toegang tot dit document.';
      } else if (err.response.status >= 500) {
        error.value = 'Server fout bij het laden van het document.';
      } else {
        error.value = `Fout bij het laden: ${err.response.data?.message || err.message}`;
      }
    } else if (err.request) {
      error.value = 'Geen verbinding met de server. Controleer uw internetverbinding.';
    } else {
      error.value = err.message || 'Onbekende fout bij het laden van de PDF.';
    }
  } finally {
    loading.value = false;
  }
};

const retryLoad = () => {
  // Clear current PDF URL
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value);
    pdfUrl.value = '';
  }
  fetchPdf();
};

const onIframeLoad = () => {
  console.log('PDF loaded successfully in iframe');
};

const onIframeError = () => {
  console.error('Error loading PDF in iframe');
  error.value = 'Fout bij het weergeven van de PDF in de browser.';
  loading.value = false;
};

// Initialize on mount
onMounted(() => {
  console.log('PDF Viewer mounted with params:', route.params);
  fetchPdf();
});

// Cleanup blob URL when component is unmounted
onUnmounted(() => {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value);
  }
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
  height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;
}

.pdf-viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--color-text-dark);
  margin: 0;
}

.back-button {
  background-color: var(--color-text-light);
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

.back-button:hover {
  background-color: #8a939e;
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

.button-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 1rem;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  color: var(--color-primary);
}

.loading-text {
  color: var(--color-text-regular);
  font-size: 1.125rem;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 1rem;
  text-align: center;
  padding: 2rem;
}

.error-icon {
  width: 4rem;
  height: 4rem;
  color: #ef4444;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-background);
  margin: 0;
}

.error-message {
  color: var(--color-text-light);
  font-size: 1rem;
  max-width: 400px;
  margin: 0;
}

.error-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.retry-button {
  background-color: var(--color-primary);
  color: var(--color-background-light);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.retry-button:hover {
  background-color: #b67949;
}

.back-error-button {
  background-color: var(--color-text-light);
  color: var(--color-background-light);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.back-error-button:hover {
  background-color: #8a939e;
}

.pdf-container {
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  flex: 1;
  overflow: hidden;
  background-color: #f5f5f5;
}

.pdf-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>