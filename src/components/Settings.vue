<template>
  <div class="page-container">
    <h1 class="page-title">Instellingen</h1>
    <p class="page-description">Beheer systeem instellingen en factuur template.</p>

    <!-- Template Management Section -->
    <div class="form-card">
      <h2 class="form-title">Factuur Template</h2>

      <!-- Current Template Status -->
      <div class="template-status-section">
        <h3 class="section-subtitle">Huidige Template</h3>
        <div v-if="loadingTemplateInfo" class="loading-message">Laden template informatie...</div>
        <div v-else-if="templateInfo?.hasTemplate" class="current-template">
          <div class="template-info">
            <div class="info-row">
              <span class="info-label">Bestandsnaam:</span>
              <span class="info-value">{{ templateInfo.fileName }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Bestandsgrootte:</span>
              <span class="info-value">{{ formatFileSize(templateInfo.fileSize) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Laatst gewijzigd:</span>
              <span class="info-value">{{ formatDate(templateInfo.lastModified) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Bestandstype:</span>
              <span class="info-value">{{ templateInfo.extension?.toUpperCase() }}</span>
            </div>
          </div>

          <div class="template-actions">
            <button @click="viewCurrentTemplate" class="action-button view-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Bekijk Template
            </button>
            <button @click="generatePreview" class="action-button preview-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Genereer Preview
            </button>
          </div>
        </div>
        <div v-else class="no-template">
          <div class="no-template-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h4>Geen Template Geüpload</h4>
          <p>Upload een afbeelding om facturen te kunnen genereren.</p>
        </div>
      </div>

      <!-- Upload New Template -->
      <div class="upload-section">
        <h3 class="section-subtitle">Nieuwe Template Uploaden</h3>
        <div class="upload-area">
          <input
              type="file"
              ref="fileInput"
              @change="handleFileSelection"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff"
              class="file-input"
              id="template-upload"
          />
          <label for="template-upload" class="file-label">
            <div class="upload-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div class="upload-text">
              <span v-if="!selectedFile" class="upload-instruction">Klik om afbeelding te selecteren</span>
              <span v-else class="selected-file">{{ selectedFile.name }}</span>
            </div>
            <div class="upload-hint">
              Ondersteunde formaten: JPG, PNG, GIF, BMP, TIFF (Max 5MB)
            </div>
          </label>
        </div>

        <div v-if="selectedFile" class="file-info">
          <div class="file-details">
            <span class="file-name">{{ selectedFile.name }}</span>
            <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
          </div>
          <div class="upload-actions">
            <button @click="uploadTemplate" :disabled="uploading" class="action-button upload-button">
              <svg v-if="uploading" class="button-icon animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4" />
              </svg>
              {{ uploading ? 'Uploaden...' : 'Upload Template' }}
            </button>
            <button @click="clearSelection" :disabled="uploading" class="action-button cancel-button">
              Annuleren
            </button>
          </div>
        </div>

        <div v-if="uploadMessage" :class="['message', uploadStatus]">
          {{ uploadMessage }}
        </div>
      </div>
    </div>

    <!-- Template Requirements -->
    <div class="info-card">
      <h3 class="info-title">Template Vereisten</h3>
      <ul class="requirements-list">
        <li>✅ Ondersteunde formaten: JPG, JPEG, PNG, GIF, BMP, TIFF</li>
        <li>✅ Maximale bestandsgrootte: 5MB</li>
        <li>✅ Aanbevolen resolutie: 1240 x 1754 pixels (A4 formaat)</li>
        <li>✅ De template wordt gebruikt als achtergrond voor facturen</li>
        <li>⚠️ Zorg ervoor dat er ruimte is voor tekstuele informatie</li>
      </ul>
    </div>
    <div class="info-card">
      <h3 class="info-title">PDF Layout Instellingen</h3>
      <p class="info-description">
        Pas de positionering van tekst elementen in de gegenereerde facturen aan.
        U kunt de locatie, lettergrootte en opmaak van alle tekst elementen wijzigen.
      </p>

      <div class="layout-actions">
        <router-link to="/settings/pdf-layout" class="action-button layout-button">
          <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H9z" />
          </svg>
          PDF Layout Configureren
        </router-link>
      </div>

      <div class="layout-info">
        <h4>Functies:</h4>
        <ul class="features-list">
          <li>✅ Positionering van student informatie aanpassen</li>
          <li>✅ Factuur gegevens plaatsing wijzigen</li>
          <li>✅ Bedragen uitlijning configureren</li>
          <li>✅ Lettergrootte en vetdruk instellen</li>
          <li>✅ Live preview van wijzigingen</li>
          <li>✅ Terugzetten naar standaardwaarden</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Reactive state
const templateInfo = ref<any>(null);
const loadingTemplateInfo = ref(true);
const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const uploadMessage = ref<string | null>(null);
const uploadStatus = ref<'success' | 'error' | null>(null);

// Fetch current template information
const fetchTemplateInfo = async () => {
  loadingTemplateInfo.value = true;
  try {
    const response = await axios.get('/api/invoices/template/info');

    // Handle both old and new API response formats
    if (response.data && response.data.success !== undefined) {
      templateInfo.value = response.data.success ? response.data.data : { hasTemplate: false };
    } else {
      templateInfo.value = response.data;
    }
  } catch (err: any) {
    console.error("Fout bij het ophalen van template info:", err);
    templateInfo.value = { hasTemplate: false };
    uploadMessage.value = 'Kon template informatie niet laden';
    uploadStatus.value = 'error';
  } finally {
    loadingTemplateInfo.value = false;
  }
};

// Handle file selection
const handleFileSelection = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];

    // Validate file
    if (!validateFile(file)) {
      return;
    }

    selectedFile.value = file;
    uploadMessage.value = null;
    uploadStatus.value = null;
  }
};

// Validate selected file
const validateFile = (file: File): boolean => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];

  // Check file size
  if (file.size > maxSize) {
    uploadMessage.value = 'Bestand is te groot. Maximaal 5MB toegestaan.';
    uploadStatus.value = 'error';
    return false;
  }

  // Check file type
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!allowedTypes.includes(extension)) {
    uploadMessage.value = 'Ongeldig bestandstype. Alleen afbeeldingen zijn toegestaan.';
    uploadStatus.value = 'error';
    return false;
  }

  return true;
};

// Upload template
const uploadTemplate = async () => {
  if (!selectedFile.value) return;

  uploading.value = true;
  uploadMessage.value = null;
  uploadStatus.value = null;

  try {
    const formData = new FormData();
    formData.append('file', selectedFile.value);

    const response = await axios.post('/api/invoices/template', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    uploadMessage.value = 'Template succesvol geüpload!';
    uploadStatus.value = 'success';

    // Refresh template info
    await fetchTemplateInfo();

    // Clear selection
    clearSelection();

  } catch (err: any) {
    console.error("Fout bij het uploaden van template:", err);
    uploadMessage.value = err.response?.data?.message || 'Fout bij het uploaden van template';
    uploadStatus.value = 'error';
  } finally {
    uploading.value = false;
  }
};

// Clear file selection
const clearSelection = () => {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  uploadMessage.value = null;
  uploadStatus.value = null;
};

// View current template
const viewCurrentTemplate = () => {
  window.open('/api/invoices/template', '_blank');
};

// Generate preview
const generatePreview = () => {
  window.open('/api/invoices/template/preview', '_blank');
};

// Helper functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Onbekend';
  return new Date(dateString).toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Initialize on mount
onMounted(() => {
  fetchTemplateInfo();
});

// Prevent unused variable warnings
void formatFileSize;
void formatDate;
</script>

<style scoped>
.page-container {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  padding: 2rem;
  background-color: var(--color-white);
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.page-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--color-text-dark);
  margin-bottom: 1rem;
}

.page-description {
  color: var(--color-text-regular);
  margin-bottom: 2rem;
}

.form-card, .info-card {
  background-color: var(--color-background-light);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.form-title, .info-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-background);
  margin-bottom: 1.5rem;
}

.section-subtitle {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-background);
  margin-bottom: 1rem;
}

.template-status-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
}

.current-template {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.template-info {
  flex: 1;
  background-color: var(--color-white);
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: 500;
  color: var(--color-background);
}

.info-value {
  color: var(--color-background);
  text-align: right;
}

.template-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.no-template {
  text-align: center;
  padding: 3rem 2rem;
  background-color: var(--color-white);
  border-radius: 0.5rem;
  border: 2px dashed var(--color-border);
}

.no-template-icon {
  margin: 0 auto 1rem;
  width: 4rem;
  height: 4rem;
  color: var(--color-text-light);
}

.no-template h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-background);
  margin-bottom: 0.5rem;
}

.no-template p {
  color: var(--color-text-light);
}

.upload-area {
  margin-bottom: 1rem;
}

.file-input {
  display: none;
}

.file-label {
  display: block;
  padding: 2rem;
  border: 2px dashed var(--color-border);
  border-radius: 0.75rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
  background-color: var(--color-white);
}

.file-label:hover {
  border-color: var(--color-primary);
  background-color: var(--color-background-light);
}

.upload-icon {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
  color: var(--color-primary);
}

.upload-text {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--color-background);
  margin-bottom: 0.5rem;
}

.upload-hint {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.selected-file {
  color: var(--color-primary);
}

.file-info {
  background-color: var(--color-white);
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  margin-bottom: 1rem;
}

.file-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.file-name {
  font-weight: 500;
  color: var(--color-background);
}

.file-size {
  color: var(--color-text-light);
  font-size: 0.875rem;
}

.upload-actions {
  display: flex;
  gap: 1rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  text-decoration: none;
}

.button-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.view-button {
  background-color: var(--color-primary);
  color: var(--color-background-light);
}

.view-button:hover {
  background-color: #b67949;
}

.preview-button {
  background-color: var(--color-secondary);
  color: var(--color-background);
}

.preview-button:hover {
  background-color: #e6c200;
}

.upload-button {
  background-color: var(--color-primary);
  color: var(--color-background-light);
  flex: 1;
}

.upload-button:hover:not(:disabled) {
  background-color: #b67949;
}

.upload-button:disabled {
  background-color: var(--color-text-light);
  cursor: not-allowed;
}

.cancel-button {
  background-color: var(--color-text-light);
  color: var(--color-background-light);
}

.cancel-button:hover:not(:disabled) {
  background-color: #8a939e;
}

.message {
  padding: 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  text-align: center;
}

.message.success {
  background-color: #d1fae5;
  color: #059669;
}

.message.error {
  background-color: #fee2e2;
  color: #ef4444;
}

.loading-message {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-light);
}

.requirements-list {
  list-style: none;
  padding: 0;
}

.requirements-list li {
  padding: 0.5rem 0;
  color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
}

.requirements-list li:last-child {
  border-bottom: none;
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

.info-description {
  color: var(--color-text-light);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.layout-actions {
  margin-bottom: 1.5rem;
}

.layout-button {
  background-color: var(--color-secondary);
  color: var(--color-background);
}

.layout-button:hover {
  background-color: #e6c200;
}

.layout-info h4 {
  font-weight: 600;
  color: var(--color-background);
  margin-bottom: 0.75rem;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features-list li {
  padding: 0.25rem 0;
  color: var(--color-background);
  font-size: 0.875rem;
}
</style>