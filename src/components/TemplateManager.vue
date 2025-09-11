<template>
  <div class="template-manager">
    <div class="template-header">
      <h3>Factuur Template Beheer</h3>
      <p class="template-description">
        Upload en beheer de factuur template voor PDF generatie
      </p>
    </div>

    <!-- Current Template Info -->
    <div v-if="templateInfo" class="current-template">
      <h4>Huidige Template</h4>

      <div v-if="templateInfo.hasTemplate" class="template-info-card">
        <div class="template-details">
          <div class="detail-row">
            <span class="label">Bestandsnaam:</span>
            <span class="value">{{ templateInfo.fileName }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Bestandsgrootte:</span>
            <span class="value">{{ formatFileSize(templateInfo.fileSize) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Laatst aangepast:</span>
            <span class="value">{{ formatDate(templateInfo.lastModified) }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Bestandstype:</span>
            <span class="value">{{ templateInfo.extension }}</span>
          </div>
        </div>

        <div class="template-actions">
          <button
              type="button"
              class="btn btn-secondary"
              @click="viewCurrentTemplate"
              :disabled="loading"
          >
            Template Bekijken
          </button>
          <button
              type="button"
              class="btn btn-primary"
              @click="generateTemplatePreview"
              :disabled="loading"
          >
            Voorbeeld Genereren
          </button>
        </div>
      </div>

      <div v-else class="no-template">
        <div class="no-template-icon">📄</div>
        <p>Geen template geüpload</p>
        <p class="no-template-subtitle">Upload een afbeelding om te beginnen</p>
      </div>
    </div>

    <!-- Upload Section -->
    <div class="upload-section">
      <h4>Nieuwe Template Uploaden</h4>

      <div class="upload-area"
           :class="{ 'drag-over': isDragOver, 'has-file': selectedFile }"
           @drop="handleDrop"
           @dragover="handleDragOver"
           @dragleave="handleDragLeave"
           @click="triggerFileInput">

        <input
            ref="fileInput"
            type="file"
            accept="image/*,.jpg,.jpeg,.png,.gif,.bmp,.tiff"
            @change="handleFileSelect"
            class="file-input"
        />

        <div v-if="!selectedFile" class="upload-placeholder">
          <div class="upload-icon">📁</div>
          <p class="upload-text">
            <strong>Klik om een bestand te selecteren</strong> of sleep het hier naartoe
          </p>
          <p class="upload-subtitle">
            Ondersteunde formaten: JPG, PNG, GIF, BMP, TIFF (max 5MB)
          </p>
        </div>

        <div v-else class="file-preview">
          <div class="file-info">
            <div class="file-icon">🖼️</div>
            <div class="file-details">
              <p class="file-name">{{ selectedFile.name }}</p>
              <p class="file-size">{{ formatFileSize(selectedFile.size) }}</p>
            </div>
            <button
                type="button"
                class="remove-file"
                @click.stop="removeSelectedFile"
            >
              ✕
            </button>
          </div>

          <div v-if="previewUrl" class="image-preview">
            <img :src="previewUrl" alt="Template preview" />
          </div>
        </div>
      </div>

      <div v-if="selectedFile" class="upload-controls">
        <button
            type="button"
            class="btn btn-success"
            @click="uploadTemplate"
            :disabled="loading || uploading"
        >
          {{ uploading ? 'Uploaden...' : 'Template Uploaden' }}
        </button>
        <button
            type="button"
            class="btn btn-secondary"
            @click="removeSelectedFile"
            :disabled="loading || uploading"
        >
          Annuleren
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-spinner">
      <div class="spinner"></div>
      <p>Bezig met laden...</p>
    </div>

    <!-- Error Messages -->
    <div v-if="error" class="error-message">
      <strong>Fout:</strong> {{ error }}
    </div>

    <!-- Success Messages -->
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import { templateApi } from '../services/api'

// Reactive data
const templateInfo = ref(null)
const selectedFile = ref(null)
const previewUrl = ref(null)
const loading = ref(false)
const uploading = ref(false)
const error = ref('')
const successMessage = ref('')
const isDragOver = ref(false)
const fileInput = ref(null)

// Emits
const emit = defineEmits(['template-updated'])

// Load template information
const loadTemplateInfo = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await templateApi.getTemplateInfo()
    templateInfo.value = response.data.data
  } catch (err) {
    error.value = 'Kon template informatie niet laden'
    console.error('Error loading template info:', err)
  } finally {
    loading.value = false
  }
}

// Handle file selection
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    setSelectedFile(file)
  }
}

// Handle drag and drop
const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false

  const files = event.dataTransfer.files
  if (files.length > 0) {
    setSelectedFile(files[0])
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event) => {
  event.preventDefault()
  isDragOver.value = false
}

// Set selected file and create preview
const setSelectedFile = (file) => {
  // Validate file
  if (!validateFile(file)) {
    return
  }

  selectedFile.value = file

  // Create preview URL for images
  if (file.type.startsWith('image/')) {
    previewUrl.value = URL.createObjectURL(file)
  }

  // Clear any existing messages
  error.value = ''
  successMessage.value = ''
}

// Validate file
const validateFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!allowedTypes.includes(file.type)) {
    error.value = 'Ongeldig bestandstype. Alleen afbeeldingen zijn toegestaan.'
    return false
  }

  if (file.size > maxSize) {
    error.value = 'Bestand is te groot. Maximum grootte is 5MB.'
    return false
  }

  return true
}

// Remove selected file
const removeSelectedFile = () => {
  selectedFile.value = null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Trigger file input click
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

// Upload template
const uploadTemplate = async () => {
  if (!selectedFile.value) return

  uploading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const response = await templateApi.uploadTemplate(formData)

    successMessage.value = 'Template succesvol geüpload!'
    emit('template-updated', response.data.data)

    // Refresh template info
    await loadTemplateInfo()

    // Clear selected file
    removeSelectedFile()

  } catch (err) {
    error.value = err.response?.data?.message || 'Kon template niet uploaden'
    console.error('Error uploading template:', err)
  } finally {
    uploading.value = false
  }
}

// View current template
const viewCurrentTemplate = async () => {
  try {
    const response = await templateApi.getCurrentTemplate()

    // Create blob and open in new tab
    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    window.open(url, '_blank')

  } catch (err) {
    error.value = 'Kon template niet laden'
    console.error('Error viewing template:', err)
  }
}

// Generate template preview
const generateTemplatePreview = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await templateApi.generatePreview()

    // Create blob and download
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `template_preview_${new Date().toISOString().slice(0, 10)}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    successMessage.value = 'Voorbeeld PDF gegenereerd en gedownload!'

  } catch (err) {
    error.value = 'Kon voorbeeld niet genereren'
    console.error('Error generating preview:', err)
  } finally {
    loading.value = false
  }
}

// Utility functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  if (!dateString) return 'Onbekend'
  return new Date(dateString).toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Initialize
onMounted(() => {
  loadTemplateInfo()
})

// Cleanup
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>

<style scoped>
.template-manager {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.template-header {
  margin-bottom: 2rem;
  text-align: center;
}

.template-header h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.template-description {
  color: #666;
  font-size: 0.9rem;
}

.current-template {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #f9f9f9;
}

.current-template h4 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.template-info-card {
  background: white;
  padding: 1.5rem;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.template-details {
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0;
}

.detail-row .label {
  font-weight: 500;
  color: #555;
}

.detail-row .value {
  color: #333;
}

.template-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.no-template {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.no-template-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-template-subtitle {
  font-size: 0.9rem;
  color: #999;
}

.upload-section {
  margin-bottom: 2rem;
}

.upload-section h4 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: #007bff;
  background-color: #f8f9fa;
}

.upload-area.drag-over {
  border-color: #007bff;
  background-color: #e7f3ff;
}

.upload-area.has-file {
  border-color: #28a745;
  background-color: #f8fff9;
}

.file-input {
  display: none;
}

.upload-placeholder {
  width: 100%;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #666;
}

.upload-text {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.upload-subtitle {
  font-size: 0.9rem;
  color: #666;
}

.file-preview {
  width: 100%;
}

.file-info {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.file-icon {
  font-size: 2rem;
  margin-right: 1rem;
}

.file-details {
  flex: 1;
  text-align: left;
}

.file-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
}

.file-size {
  font-size: 0.9rem;
  color: #666;
}

.remove-file {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-weight: bold;
}

.remove-file:hover {
  background: #c82333;
}

.image-preview {
  max-width: 100%;
  border-radius: 6px;
  overflow: hidden;
}

.image-preview img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
}

.upload-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #545b62;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #1e7e34;
}

.loading-spinner {
  text-align: center;
  padding: 2rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border: 1px solid #c3e6cb;
}

@media (max-width: 768px) {
  .template-manager {
    padding: 1rem;
  }

  .upload-area {
    padding: 1rem;
    min-height: 150px;
  }

  .template-actions,
  .upload-controls {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 300px;
  }

  .detail-row {
    flex-direction: column;
    gap: 0.25rem;
  }

  .file-info {
    flex-direction: column;
    text-align: center;
  }

  .file-icon {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
}
</style>