<template>
  <div class="pdf-layout-editor">
    <div class="pdf-layout-header">
      <h3>PDF Layout Instellingen</h3>
      <p class="pdf-layout-description">
        Pas de posities en opmaak van elementen op de factuur aan
      </p>
    </div>

    <div class="pdf-layout-controls">
      <div class="control-group">
        <button
            type="button"
            class="btn btn-secondary"
            @click="resetToDefaults"
            :disabled="loading"
        >
          Reset naar standaard
        </button>

        <button
            type="button"
            class="btn btn-primary"
            @click="generatePreview"
            :disabled="loading"
        >
          Genereer voorbeeld
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-spinner">
      Laden...
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <form @submit.prevent="saveSettings" v-if="layoutSettings">
      <div class="layout-sections">

        <!-- Student Information Section -->
        <div class="layout-section">
          <h4>Student Informatie</h4>
          <div class="element-grid">
            <PdfElementEditor
                v-model="layoutSettings.studentName"
                label="Student Naam"
                element-key="studentName"
            />
            <PdfElementEditor
                v-model="layoutSettings.studentAddress"
                label="Student Adres"
                element-key="studentAddress"
            />
          </div>
        </div>

        <!-- Invoice Information Section -->
        <div class="layout-section">
          <h4>Factuur Informatie</h4>
          <div class="element-grid">
            <PdfElementEditor
                v-model="layoutSettings.invoiceId"
                label="Factuur ID"
                element-key="invoiceId"
            />
            <PdfElementEditor
                v-model="layoutSettings.invoiceDate"
                label="Factuur Datum"
                element-key="invoiceDate"
            />
            <PdfElementEditor
                v-model="layoutSettings.invoiceDescription"
                label="Factuur Beschrijving"
                element-key="invoiceDescription"
            />
          </div>
        </div>

        <!-- Financial Information Section -->
        <div class="layout-section">
          <h4>Financiële Informatie</h4>
          <div class="element-grid">
            <PdfElementEditor
                v-model="layoutSettings.baseAmount"
                label="Basis Bedrag"
                element-key="baseAmount"
            />
            <PdfElementEditor
                v-model="layoutSettings.vatAmount"
                label="BTW Bedrag"
                element-key="vatAmount"
            />
            <PdfElementEditor
                v-model="layoutSettings.totalAmount"
                label="Totaal Bedrag"
                element-key="totalAmount"
            />
          </div>
        </div>

        <!-- Additional Information Section -->
        <div class="layout-section">
          <h4>Aanvullende Informatie</h4>
          <div class="element-grid">
            <PdfElementEditor
                v-model="layoutSettings.paymentNote"
                label="Betaal Notitie"
                element-key="paymentNote"
            />
            <PdfElementEditor
                v-model="layoutSettings.contactInfo"
                label="Contact Informatie"
                element-key="contactInfo"
            />
          </div>
        </div>

      </div>

      <div class="layout-footer">
        <button
            type="submit"
            class="btn btn-success"
            :disabled="loading"
        >
          Instellingen Opslaan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import PdfElementEditor from './PdfElementEditor.vue'
import { pdfLayoutApi } from '../services/api'

// Reactive data
const layoutSettings = ref(null)
const loading = ref(false)
const error = ref('')

// Emits
const emit = defineEmits(['saved', 'preview-generated'])

// Load layout settings
const loadLayoutSettings = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await pdfLayoutApi.getLayoutSettings()
    layoutSettings.value = response.data.data
  } catch (err) {
    error.value = 'Kon layout instellingen niet laden'
    console.error('Error loading layout settings:', err)
  } finally {
    loading.value = false
  }
}

// Save layout settings
const saveSettings = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await pdfLayoutApi.updateLayoutSettings(layoutSettings.value)
    emit('saved', response.data.data)
    // Show success message or toast
    alert('Layout instellingen succesvol opgeslagen!')
  } catch (err) {
    error.value = 'Kon layout instellingen niet opslaan'
    console.error('Error saving layout settings:', err)
  } finally {
    loading.value = false
  }
}

// Reset to default settings
const resetToDefaults = async () => {
  if (!confirm('Weet je zeker dat je wilt resetten naar de standaard instellingen?')) {
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await pdfLayoutApi.resetToDefaults()
    layoutSettings.value = response.data.data
    alert('Layout instellingen gereset naar standaard!')
  } catch (err) {
    error.value = 'Kon instellingen niet resetten'
    console.error('Error resetting layout settings:', err)
  } finally {
    loading.value = false
  }
}

// Generate preview PDF
const generatePreview = async () => {
  loading.value = true

  try {
    const response = await pdfLayoutApi.generatePreview(layoutSettings.value)

    // Create blob and download
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `layout_preview_${new Date().toISOString().slice(0, 10)}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    emit('preview-generated')
  } catch (err) {
    error.value = 'Kon voorbeeld niet genereren'
    console.error('Error generating preview:', err)
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(() => {
  loadLayoutSettings()
})
</script>

<style scoped>
.pdf-layout-editor {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.pdf-layout-header {
  margin-bottom: 2rem;
  text-align: center;
}

.pdf-layout-header h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.pdf-layout-description {
  color: #666;
  font-size: 0.9rem;
}

.pdf-layout-controls {
  margin-bottom: 2rem;
}

.control-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.layout-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.layout-section {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 1.5rem;
}

.layout-section h4 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.element-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.layout-footer {
  margin-top: 2rem;
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
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
  font-size: 1.1rem;
  padding: 1rem 2rem;
}

.btn-success:hover:not(:disabled) {
  background-color: #1e7e34;
}

.loading-spinner {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: #666;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
}

@media (max-width: 768px) {
  .pdf-layout-editor {
    padding: 1rem;
  }

  .element-grid {
    grid-template-columns: 1fr;
  }

  .control-group {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>