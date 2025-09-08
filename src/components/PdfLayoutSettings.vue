<template>
  <div class="page-container">
    <h1 class="page-title">PDF Layout Instellingen</h1>
    <p class="page-description">Pas de positionering van tekst elementen in de gegenereerde facturen aan.</p>

    <!-- Layout Configuration Card -->
    <div class="form-card">
      <div class="form-header">
        <h2 class="form-title">Tekst Positionering</h2>
        <div class="header-actions">
          <button @click="resetToDefault" class="reset-button" :disabled="loading">
            <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8.002 8.002 0 0015.357 2m-15.357 0H4m15.357 0v5h-.582M19.418 15A8.001 8.001 0 004.582 15m0 0V15a8.002 8.002 0 0015.357-2m-15.357 0H4" />
            </svg>
            Reset naar Standaard
          </button>
          <button @click="generatePreview" class="preview-button" :disabled="loading">
            <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Voorbeeld Genereren
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading-message">Laden van layout instellingen...</div>
      <div v-if="error" class="error-message">{{ error }}</div>

      <div v-if="layoutSettings && !loading" class="layout-grid">
        <!-- Student Information Section -->
        <div class="section-card">
          <h3 class="section-title">Student Informatie</h3>

          <div class="element-config">
            <label class="element-label">Student Naam</label>
            <div class="position-controls">
              <div class="control-group">
                <label>Top (px)</label>
                <input type="number" v-model="layoutSettings.studentName.top" @change="updateElement('StudentName')" class="control-input">
              </div>
              <div class="control-group">
                <label>Links (px)</label>
                <input type="number" v-model="layoutSettings.studentName.left" @change="updateElement('StudentName')" class="control-input">
              </div>
              <div class="control-group">
                <label>Lettergrootte</label>
                <input type="number" v-model="layoutSettings.studentName.fontSize" @change="updateElement('StudentName')" class="control-input" min="6" max="20">
              </div>
              <div class="control-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="layoutSettings.studentName.isBold" @change="updateElement('StudentName')">
                  Vet
                </label>
              </div>
            </div>
          </div>

          <div class="element-config">
            <label class="element-label">Student Adres</label>
            <div class="position-controls">
              <div class="control-group">
                <label>Top (px)</label>
                <input type="number" v-model="layoutSettings.studentAddress.top" @change="updateElement('StudentAddress')" class="control-input">
              </div>
              <div class="control-group">
                <label>Links (px)</label>
                <input type="number" v-model="layoutSettings.studentAddress.left" @change="updateElement('StudentAddress')" class="control-input">
              </div>
              <div class="control-group">
                <label>Lettergrootte</label>
                <input type="number" v-model="layoutSettings.studentAddress.fontSize" @change="updateElement('StudentAddress')" class="control-input" min="6" max="20">
              </div>
              <div class="control-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="layoutSettings.studentAddress.isBold" @change="updateElement('StudentAddress')">
                  Vet
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Invoice Information Section -->
        <div class="section-card">
          <h3 class="section-title">Factuur Informatie</h3>

          <div class="element-config">
            <label class="element-label">Factuur ID</label>
            <div class="position-controls">
              <div class="control-group">
                <label>Top (px)</label>
                <input type="number" v-model="layoutSettings.invoiceId.top" @change="updateElement('InvoiceId')" class="control-input">
              </div>
              <div class="control-group">
                <label>Links (px)</label>
                <input type="number" v-model="layoutSettings.invoiceId.left" @change="updateElement('InvoiceId')" class="control-input">
              </div>
              <div class="control-group">
                <label>Lettergrootte</label>
                <input type="number" v-model="layoutSettings.invoiceId.fontSize" @change="updateElement('InvoiceId')" class="control-input" min="6" max="20">
              </div>
              <div class="control-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="layoutSettings.invoiceId.isBold" @change="updateElement('InvoiceId')">
                  Vet
                </label>
              </div>
            </div>
          </div>

          <div class="element-config">
            <label class="element-label">Factuur Datum</label>
            <div class="position-controls">
              <div class="control-group">
                <label>Top (px)</label>
                <input type="number" v-model="layoutSettings.invoiceDate.top" @change="updateElement('InvoiceDate')" class="control-input">
              </div>
              <div class="control-group">
                <label>Links (px)</label>
                <input type="number" v-model="layoutSettings.invoiceDate.left" @change="updateElement('InvoiceDate')" class="control-input">
              </div>
              <div class="control-group">
                <label>Lettergrootte</label>
                <input type="number" v-model="layoutSettings.invoiceDate.fontSize" @change="updateElement('InvoiceDate')" class="control-input" min="6" max="20">
              </div>
              <div class="control-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="layoutSettings.invoiceDate.isBold" @change="updateElement('InvoiceDate')">
                  Vet
                </label>
              </div>
            </div>
          </div>

          <div class="element-config">
            <label class="element-label">Beschrijving</label>
            <div class="position-controls">
              <div class="control-group">
                <label>Top (px)</label>
                <input type="number" v-model="layoutSettings.invoiceDescription.top" @change="updateElement('InvoiceDescription')" class="control-input">
              </div>
              <div class="control-group">
                <label>Links (px)</label>
                <input type="number" v-model="layoutSettings.invoiceDescription.left" @change="updateElement('InvoiceDescription')" class="control-input">
              </div>
              <div class="control-group">
                <label>Lettergrootte</label>
                <input type="number" v-model="layoutSettings.invoiceDescription.fontSize" @change="updateElement('InvoiceDescription')" class="control-input" min="6" max="20">
              </div>
              <div class="control-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="layoutSettings.invoiceDescription.isBold" @change="updateElement('InvoiceDescription')">
                  Vet
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Amounts Section -->
        <div class="section-card">
          <h3 class="section-title">Bedragen</h3>

          <div class="element-config">
            <label class="element-label">Basis Bedrag (excl. BTW)</label>
            <div class="position-controls">
              <div class="control-group">
                <label>Top (px)</label>
                <input type="number" v-model="layoutSettings.baseAmount.top" @change="updateElement('BaseAmount')" class="control-input">
              </div>
              <div class="control-group">
                <label>Links (px)</label>
                <input type="number" v-model="layoutSettings.baseAmount.left" @change="updateElement('BaseAmount')" class="control-input">
              </div>
              <div class="control-group">
                <label>Lettergrootte</label>
                <input type="number" v-model="layoutSettings.baseAmount.fontSize" @change="updateElement('BaseAmount')" class="control-input" min="6" max="20">
              </div>
              <div class="control-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="layoutSettings.baseAmount.isBold" @change="updateElement('BaseAmount')">
                  Vet
                </label>
              </div>
            </div>
          </div>

          <div class="element-config">
            <label class="element-label">BTW Bedrag</label>
            <div class="position-controls">
              <div class="control-group">
                <label>Top (px)</label>
                <input type="number" v-model="layoutSettings.vatAmount.top" @change="updateElement('VatAmount')" class="control-input">
              </div>
              <div class="control-group">
                <label>Links (px)</label>
                <input type="number" v-model="layoutSettings.vatAmount.left" @change="updateElement('VatAmount')" class="control-input">
              </div>
              <div class="control-group">
                <label>Lettergrootte</label>
                <input type="number" v-model="layoutSettings.vatAmount.fontSize" @change="updateElement('VatAmount')" class="control-input" min="6" max="20">
              </div>
              <div class="control-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="layoutSettings.vatAmount.isBold" @change="updateElement('VatAmount')">
                  Vet
                </label>
              </div>
            </div>
          </div>

          <div class="element-config">
            <label class="element-label">Totaal Bedrag</label>
            <div class="position-controls">
              <div class="control-group">
                <label>Top (px)</label>
                <input type="number" v-model="layoutSettings.totalAmount.top" @change="updateElement('TotalAmount')" class="control-input">
              </div>
              <div class="control-group">
                <label>Links (px)</label>
                <input type="number" v-model="layoutSettings.totalAmount.left" @change="updateElement('TotalAmount')" class="control-input">
              </div>
              <div class="control-group">
                <label>Lettergrootte</label>
                <input type="number" v-model="layoutSettings.totalAmount.fontSize" @change="updateElement('TotalAmount')" class="control-input" min="6" max="20">
              </div>
              <div class="control-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="layoutSettings.totalAmount.isBold" @change="updateElement('TotalAmount')">
                  Vet
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Information Section -->
        <div class="section-card">
          <h3 class="section-title">Aanvullende Informatie</h3>

          <div class="element-config">
            <label class="element-label">Betaalnotitie</label>
            <div class="position-controls">
              <div class="control-group">
                <label>Top (px)</label>
                <input type="number" v-model="layoutSettings.paymentNote.top" @change="updateElement('PaymentNote')" class="control-input">
              </div>
              <div class="control-group">
                <label>Links (px)</label>
                <input type="number" v-model="layoutSettings.paymentNote.left" @change="updateElement('PaymentNote')" class="control-input">
              </div>
              <div class="control-group">
                <label>Lettergrootte</label>
                <input type="number" v-model="layoutSettings.paymentNote.fontSize" @change="updateElement('PaymentNote')" class="control-input" min="6" max="20">
              </div>
              <div class="control-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="layoutSettings.paymentNote.isBold" @change="updateElement('PaymentNote')">
                  Vet
                </label>
              </div>
            </div>
          </div>

          <div class="element-config">
            <label class="element-label">Contact Informatie</label>
            <div class="position-controls">
              <div class="control-group">
                <label>Top (px)</label>
                <input type="number" v-model="layoutSettings.contactInfo.top" @change="updateElement('ContactInfo')" class="control-input">
              </div>
              <div class="control-group">
                <label>Links (px)</label>
                <input type="number" v-model="layoutSettings.contactInfo.left" @change="updateElement('ContactInfo')" class="control-input">
              </div>
              <div class="control-group">
                <label>Lettergrootte</label>
                <input type="number" v-model="layoutSettings.contactInfo.fontSize" @change="updateElement('ContactInfo')" class="control-input" min="6" max="20">
              </div>
              <div class="control-group">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="layoutSettings.contactInfo.isBold" @change="updateElement('ContactInfo')">
                  Vet
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button @click="saveAllSettings" class="submit-button" :disabled="loading || saving">
          <svg v-if="saving" class="button-icon animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          {{ saving ? 'Opslaan...' : 'Alle Instellingen Opslaan' }}
        </button>
      </div>

      <div v-if="message" :class="['message', messageStatus]">{{ message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Reactive state
const layoutSettings = ref(null);
const loading = ref(true);
const saving = ref(false);
const error = ref(null);
const message = ref(null);
const messageStatus = ref(null);

// Fetch layout settings
const fetchLayoutSettings = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get('/api/pdflayout');
    layoutSettings.value = response.data;
    console.log('Layout settings loaded:', layoutSettings.value);
  } catch (err) {
    console.error("Fout bij het ophalen van layout instellingen:", err);
    error.value = err.response?.data?.message || "Er is een fout opgetreden bij het laden van layout instellingen.";
  } finally {
    loading.value = false;
  }
};

// Update individual element
const updateElement = async (elementName) => {
  // Auto-save when user changes individual elements
  // Debounce the save to avoid too many requests
  clearTimeout(updateElement.timeoutId);
  updateElement.timeoutId = setTimeout(async () => {
    await saveAllSettings();
  }, 1000);
};

// Save all settings
const saveAllSettings = async () => {
  saving.value = true;
  message.value = null;
  messageStatus.value = null;

  try {
    const response = await axios.put('/api/pdflayout', layoutSettings.value);
    message.value = 'Layout instellingen succesvol opgeslagen!';
    messageStatus.value = 'success';
  } catch (err) {
    console.error("Fout bij het opslaan van layout instellingen:", err);
    message.value = err.response?.data?.message || "Fout bij het opslaan van layout instellingen";
    messageStatus.value = 'error';
  } finally {
    saving.value = false;
  }
};

// Reset to default
const resetToDefault = async () => {
  if (confirm('Weet u zeker dat u alle layout instellingen wilt resetten naar de standaardwaarden?')) {
    loading.value = true;

    try {
      const response = await axios.post('/api/pdflayout/reset');
      layoutSettings.value = response.data;
      message.value = 'Layout instellingen zijn gereset naar standaard!';
      messageStatus.value = 'success';
    } catch (err) {
      console.error("Fout bij het resetten van layout instellingen:", err);
      message.value = err.response?.data?.message || "Fout bij het resetten van layout instellingen";
      messageStatus.value = 'error';
    } finally {
      loading.value = false;
    }
  }
};

// Generate preview
const generatePreview = () => {
  window.open('/api/pdflayout/preview', '_blank');
};

// Initialize on mount
onMounted(() => {
  fetchLayoutSettings();
});
</script>

<style scoped>
.page-container {
  max-width: 1400px;
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

.form-card {
  background-color: var(--color-background-light);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-background);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.reset-button, .preview-button, .submit-button {
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

.reset-button {
  background-color: var(--color-text-light);
  color: var(--color-background-light);
}

.reset-button:hover:not(:disabled) {
  background-color: #8a939e;
}

.preview-button {
  background-color: var(--color-secondary);
  color: var(--color-background);
}

.preview-button:hover:not(:disabled) {
  background-color: #e6c200;
}

.submit-button {
  background-color: var(--color-primary);
  color: var(--color-background-light);
}

.submit-button:hover:not(:disabled) {
  background-color: #b67949;
}

.submit-button:disabled, .reset-button:disabled, .preview-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.layout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.section-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-background);
  margin-bottom: 1.5rem;
}

.element-config {
  margin-bottom: 2rem;
}

.element-config:last-child {
  margin-bottom: 0;
}

.element-label {
  display: block;
  font-weight: 500;
  color: var(--color-background);
  margin-bottom: 0.75rem;
}

.position-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.75rem;
}

.control-group {
  display: flex;
  flex-direction: column;
}

.control-group label {
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-bottom: 0.25rem;
}

.control-input {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: var(--color-background);
  background-color: var(--color-background-light);
}

.control-input:focus {
  border-color: var(--color-primary);
  outline: none;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-top: 0.25rem;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
}

.form-actions {
  margin-top: 2rem;
  text-align: center;
}

.message {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
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