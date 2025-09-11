
<template>
  <div class="page-container">
    <h1 class="page-title">PDF Layout Editor</h1>
    <p class="page-description">Aanpassen van de posities van elementen op de factuur PDF.</p>

    <!-- Layout Controls -->
    <div class="form-card">
      <h2 class="form-title">Layout Instellingen</h2>

      <div v-if="loadingLayout" class="loading-message">Laden van layout instellingen...</div>
      <div v-if="layoutError" class="error-message">{{ layoutError }}</div>

      <div v-if="!loadingLayout && layoutSettings" class="layout-controls">
        <!-- Student Information -->
        <div class="element-group">
          <h3 class="group-title">Student Informatie</h3>

          <div class="element-control">
            <label class="element-label">Student Naam</label>
            <div class="control-inputs">
              <div class="input-group">
                <label>Top:</label>
                <input type="number" v-model.number="layoutSettings.studentName.top" min="0" max="1000" class="control-input" @change="updateElement('studentName')" />
              </div>
              <div class="input-group">
                <label>Left:</label>
                <input type="number" v-model.number="layoutSettings.studentName.left" min="0" max="1000" class="control-input" @change="updateElement('studentName')" />
              </div>
              <div class="input-group">
                <label>Font Size:</label>
                <input type="number" v-model.number="layoutSettings.studentName.fontSize" min="6" max="30" class="control-input" @change="updateElement('studentName')" />
              </div>
              <div class="input-group">
                <label>Bold:</label>
                <input type="checkbox" v-model="layoutSettings.studentName.isBold" class="control-checkbox" @change="updateElement('studentName')" />
              </div>
            </div>
          </div>

          <div class="element-control">
            <label class="element-label">Student Adres</label>
            <div class="control-inputs">
              <div class="input-group">
                <label>Top:</label>
                <input type="number" v-model.number="layoutSettings.studentAddress.top" min="0" max="1000" class="control-input" @change="updateElement('studentAddress')" />
              </div>
              <div class="input-group">
                <label>Left:</label>
                <input type="number" v-model.number="layoutSettings.studentAddress.left" min="0" max="1000" class="control-input" @change="updateElement('studentAddress')" />
              </div>
              <div class="input-group">
                <label>Font Size:</label>
                <input type="number" v-model.number="layoutSettings.studentAddress.fontSize" min="6" max="30" class="control-input" @change="updateElement('studentAddress')" />
              </div>
              <div class="input-group">
                <label>Bold:</label>
                <input type="checkbox" v-model="layoutSettings.studentAddress.isBold" class="control-checkbox" @change="updateElement('studentAddress')" />
              </div>
            </div>
          </div>
        </div>

        <!-- Invoice Information -->
        <div class="element-group">
          <h3 class="group-title">Factuur Informatie</h3>

          <div class="element-control">
            <label class="element-label">Factuur ID</label>
            <div class="control-inputs">
              <div class="input-group">
                <label>Top:</label>
                <input type="number" v-model.number="layoutSettings.invoiceId.top" min="0" max="1000" class="control-input" @change="updateElement('invoiceId')" />
              </div>
              <div class="input-group">
                <label>Left:</label>
                <input type="number" v-model.number="layoutSettings.invoiceId.left" min="0" max="1000" class="control-input" @change="updateElement('invoiceId')" />
              </div>
              <div class="input-group">
                <label>Font Size:</label>
                <input type="number" v-model.number="layoutSettings.invoiceId.fontSize" min="6" max="30" class="control-input" @change="updateElement('invoiceId')" />
              </div>
              <div class="input-group">
                <label>Bold:</label>
                <input type="checkbox" v-model="layoutSettings.invoiceId.isBold" class="control-checkbox" @change="updateElement('invoiceId')" />
              </div>
            </div>
          </div>

          <div class="element-control">
            <label class="element-label">Factuur Datum</label>
            <div class="control-inputs">
              <div class="input-group">
                <label>Top:</label>
                <input type="number" v-model.number="layoutSettings.invoiceDate.top" min="0" max="1000" class="control-input" @change="updateElement('invoiceDate')" />
              </div>
              <div class="input-group">
                <label>Left:</label>
                <input type="number" v-model.number="layoutSettings.invoiceDate.left" min="0" max="1000" class="control-input" @change="updateElement('invoiceDate')" />
              </div>
              <div class="input-group">
                <label>Font Size:</label>
                <input type="number" v-model.number="layoutSettings.invoiceDate.fontSize" min="6" max="30" class="control-input" @change="updateElement('invoiceDate')" />
              </div>
              <div class="input-group">
                <label>Bold:</label>
                <input type="checkbox" v-model="layoutSettings.invoiceDate.isBold" class="control-checkbox" @change="updateElement('invoiceDate')" />
              </div>
            </div>
          </div>

          <div class="element-control">
            <label class="element-label">Beschrijving</label>
            <div class="control-inputs">
              <div class="input-group">
                <label>Top:</label>
                <input type="number" v-model.number="layoutSettings.invoiceDescription.top" min="0" max="1000" class="control-input" @change="updateElement('invoiceDescription')" />
              </div>
              <div class="input-group">
                <label>Left:</label>
                <input type="number" v-model.number="layoutSettings.invoiceDescription.left" min="0" max="1000" class="control-input" @change="updateElement('invoiceDescription')" />
              </div>
              <div class="input-group">
                <label>Font Size:</label>
                <input type="number" v-model.number="layoutSettings.invoiceDescription.fontSize" min="6" max="30" class="control-input" @change="updateElement('invoiceDescription')" />
              </div>
              <div class="input-group">
                <label>Bold:</label>
                <input type="checkbox" v-model="layoutSettings.invoiceDescription.isBold" class="control-checkbox" @change="updateElement('invoiceDescription')" />
              </div>
            </div>
          </div>
        </div>

        <!-- Amount Information -->
        <div class="element-group">
          <h3 class="group-title">Bedrag Informatie</h3>

          <div class="element-control">
            <label class="element-label">Basisbedrag</label>
            <div class="control-inputs">
              <div class="input-group">
                <label>Top:</label>
                <input type="number" v-model.number="layoutSettings.baseAmount.top" min="0" max="1000" class="control-input" @change="updateElement('baseAmount')" />
              </div>
              <div class="input-group">
                <label>Left:</label>
                <input type="number" v-model.number="layoutSettings.baseAmount.left" min="0" max="1000" class="control-input" @change="updateElement('baseAmount')" />
              </div>
              <div class="input-group">
                <label>Font Size:</label>
                <input type="number" v-model.number="layoutSettings.baseAmount.fontSize" min="6" max="30" class="control-input" @change="updateElement('baseAmount')" />
              </div>
              <div class="input-group">
                <label>Bold:</label>
                <input type="checkbox" v-model="layoutSettings.baseAmount.isBold" class="control-checkbox" @change="updateElement('baseAmount')" />
              </div>
            </div>
          </div>

          <div class="element-control">
            <label class="element-label">BTW Bedrag</label>
            <div class="control-inputs">
              <div class="input-group">
                <label>Top:</label>
                <input type="number" v-model.number="layoutSettings.vatAmount.top" min="0" max="1000" class="control-input" @change="updateElement('vatAmount')" />
              </div>
              <div class="input-group">
                <label>Left:</label>
                <input type="number" v-model.number="layoutSettings.vatAmount.left" min="0" max="1000" class="control-input" @change="updateElement('vatAmount')" />
              </div>
              <div class="input-group">
                <label>Font Size:</label>
                <input type="number" v-model.number="layoutSettings.vatAmount.fontSize" min="6" max="30" class="control-input" @change="updateElement('vatAmount')" />
              </div>
              <div class="input-group">
                <label>Bold:</label>
                <input type="checkbox" v-model="layoutSettings.vatAmount.isBold" class="control-checkbox" @change="updateElement('vatAmount')" />
              </div>
            </div>
          </div>

          <div class="element-control">
            <label class="element-label">Totaal Bedrag</label>
            <div class="control-inputs">
              <div class="input-group">
                <label>Top:</label>
                <input type="number" v-model.number="layoutSettings.totalAmount.top" min="0" max="1000" class="control-input" @change="updateElement('totalAmount')" />
              </div>
              <div class="input-group">
                <label>Left:</label>
                <input type="number" v-model.number="layoutSettings.totalAmount.left" min="0" max="1000" class="control-input" @change="updateElement('totalAmount')" />
              </div>
              <div class="input-group">
                <label>Font Size:</label>
                <input type="number" v-model.number="layoutSettings.totalAmount.fontSize" min="6" max="30" class="control-input" @change="updateElement('totalAmount')" />
              </div>
              <div class="input-group">
                <label>Bold:</label>
                <input type="checkbox" v-model="layoutSettings.totalAmount.isBold" class="control-checkbox" @change="updateElement('totalAmount')" />
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="element-group">
          <h3 class="group-title">Extra Informatie</h3>

          <div class="element-control">
            <label class="element-label">Betaal Notitie</label>
            <div class="control-inputs">
              <div class="input-group">
                <label>Top:</label>
                <input type="number" v-model.number="layoutSettings.paymentNote.top" min="0" max="1000" class="control-input" @change="updateElement('paymentNote')" />
              </div>
              <div class="input-group">
                <label>Left:</label>
                <input type="number" v-model.number="layoutSettings.paymentNote.left" min="0" max="1000" class="control-input" @change="updateElement('paymentNote')" />
              </div>
              <div class="input-group">
                <label>Font Size:</label>
                <input type="number" v-model.number="layoutSettings.paymentNote.fontSize" min="6" max="30" class="control-input" @change="updateElement('paymentNote')" />
              </div>
              <div class="input-group">
                <label>Bold:</label>
                <input type="checkbox" v-model="layoutSettings.paymentNote.isBold" class="control-checkbox" @change="updateElement('paymentNote')" />
              </div>
            </div>
          </div>

          <div class="element-control">
            <label class="element-label">Contact Info</label>
            <div class="control-inputs">
              <div class="input-group">
                <label>Top:</label>
                <input type="number" v-model.number="layoutSettings.contactInfo.top" min="0" max="1000" class="control-input" @change="updateElement('contactInfo')" />
              </div>
              <div class="input-group">
                <label>Left:</label>
                <input type="number" v-model.number="layoutSettings.contactInfo.left" min="0" max="1000" class="control-input" @change="updateElement('contactInfo')" />
              </div>
              <div class="input-group">
                <label>Font Size:</label>
                <input type="number" v-model.number="layoutSettings.contactInfo.fontSize" min="6" max="30" class="control-input" @change="updateElement('contactInfo')" />
              </div>
              <div class="input-group">
                <label>Bold:</label>
                <input type="checkbox" v-model="layoutSettings.contactInfo.isBold" class="control-checkbox" @change="updateElement('contactInfo')" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons" v-if="!loadingLayout">
        <button @click="saveLayout" :disabled="savingLayout" class="save-button">
          <svg v-if="savingLayout" class="button-icon animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ savingLayout ? 'Opslaan...' : 'Layout Opslaan' }}
        </button>

        <button @click="generatePreview" :disabled="generatingPreview" class="preview-button">
          <svg v-if="generatingPreview" class="button-icon animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {{ generatingPreview ? 'Genereren...' : 'Genereer Preview' }}
        </button>

        <button @click="resetToDefault" :disabled="resettingLayout" class="reset-button">
          <svg v-if="resettingLayout" class="button-icon animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8.002 8.002 0 0115.357 2m-15.357 0H4m15.357 0v5h-.582M19.418 15A8.001 8.001 0 004.582 15m0 0V15a8.002 8.002 0 0015.357-2m-15.357 0H4" />
          </svg>
          {{ resettingLayout ? 'Resetten...' : 'Reset naar Default' }}
        </button>
      </div>

      <!-- Status Message -->
      <div v-if="statusMessage" :class="['message', statusType]">{{ statusMessage }}</div>
    </div>

    <!-- Help Section -->
    <div class="info-card">
      <h3 class="info-title">Hoe te gebruiken</h3>
      <div class="help-content">
        <div class="help-item">
          <strong>Positionering:</strong> Top en Left waarden bepalen waar de tekst op de PDF verschijnt. Top = afstand van bovenkant, Left = afstand van linkerkant.
        </div>
        <div class="help-item">
          <strong>Font Size:</strong> Grootte van de tekst in punten (6-30).
        </div>
        <div class="help-item">
          <strong>Bold:</strong> Vink aan om tekst vetgedrukt te maken.
        </div>
        <div class="help-item">
          <strong>Preview:</strong> Genereer een voorbeeldpdf om te zien hoe de layout eruit ziet.
        </div>
        <div class="help-item">
          <strong>Opslaan:</strong> Sla de huidige instellingen op voor toekomstige facturen.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface PdfElementPosition {
  top: number;
  left: number;
  fontSize: number;
  maxHeight: number;
  isBold: boolean;
  textAlign: string;
}

interface PdfLayoutSettings {
  studentName: PdfElementPosition;
  studentAddress: PdfElementPosition;
  invoiceId: PdfElementPosition;
  invoiceDate: PdfElementPosition;
  invoiceDescription: PdfElementPosition;
  baseAmount: PdfElementPosition;
  vatAmount: PdfElementPosition;
  totalAmount: PdfElementPosition;
  paymentNote: PdfElementPosition;
  contactInfo: PdfElementPosition;
}

// Reactive state
const layoutSettings = ref<PdfLayoutSettings | null>(null);
const loadingLayout = ref(true);
const layoutError = ref<string | null>(null);
const savingLayout = ref(false);
const generatingPreview = ref(false);
const resettingLayout = ref(false);
const statusMessage = ref<string | null>(null);
const statusType = ref<'success' | 'error' | null>(null);

let updateTimeout: any;

// Clear status message after delay
const clearStatusMessage = () => {
  setTimeout(() => {
    statusMessage.value = null;
    statusType.value = null;
  }, 5000);
};

// Fetch layout settings
const fetchLayoutSettings = async () => {
  try {
    loadingLayout.value = true;
    layoutError.value = null;

    const response = await axios.get('/api/pdflayout');
    layoutSettings.value = response.data;

    console.log('Layout settings loaded:', layoutSettings.value);
  } catch (error: any) {
    console.error('Error fetching layout settings:', error);
    layoutError.value = error.response?.data?.message || 'Failed to load layout settings';
  } finally {
    loadingLayout.value = false;
  }
};

// Update individual element with debouncing
const updateElement = async (elementName: string) => {
  // Clear previous timeout
  clearTimeout(updateTimeout);

  // Set new timeout to debounce rapid changes
  updateTimeout = setTimeout(async () => {
    if (!layoutSettings.value) return;

    try {
      const elementData = (layoutSettings.value as any)[elementName];
      console.log(`Updating element ${elementName}:`, elementData);

      await axios.put(`/api/pdflayout/element/${elementName}`, elementData);

      statusMessage.value = `${elementName} bijgewerkt`;
      statusType.value = 'success';
      clearStatusMessage();
    } catch (error: any) {
      console.error(`Error updating ${elementName}:`, error);
      statusMessage.value = `Fout bij bijwerken van ${elementName}: ${error.response?.data?.message || error.message}`;
      statusType.value = 'error';
      clearStatusMessage();
    }
  }, 800); // Wait 800ms after user stops typing
};

// Save entire layout
const saveLayout = async () => {
  if (!layoutSettings.value) return;

  try {
    savingLayout.value = true;
    statusMessage.value = null;

    const response = await axios.put('/api/pdflayout', layoutSettings.value);
    console.log('Layout saved successfully:', response.data);

    statusMessage.value = 'Layout instellingen succesvol opgeslagen!';
    statusType.value = 'success';
    clearStatusMessage();
  } catch (error: any) {
    console.error('Error saving layout:', error);
    statusMessage.value = error.response?.data?.message || 'Fout bij opslaan van layout instellingen';
    statusType.value = 'error';
    clearStatusMessage();
  } finally {
    savingLayout.value = false;
  }
};

// Generate preview PDF
const generatePreview = async () => {
  try {
    generatingPreview.value = true;
    statusMessage.value = null;

    console.log('Generating preview with settings:', layoutSettings.value);

    const response = await axios.post('/api/pdflayout/preview', {
      layoutSettings: layoutSettings.value
    }, {
      responseType: 'blob'
    });

    // Create download link
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `layout_preview_${new Date().toISOString().split('T')[0]}.pdf`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    window.URL.revokeObjectURL(url);

    statusMessage.value = 'Preview gegenereerd en gedownload!';
    statusType.value = 'success';
    clearStatusMessage();
  } catch (error: any) {
    console.error('Error generating preview:', error);
    statusMessage.value = error.response?.data?.message || 'Fout bij genereren van preview';
    statusType.value = 'error';
    clearStatusMessage();
  } finally {
    generatingPreview.value = false;
  }
};

// Reset to default settings
const resetToDefault = async () => {
  if (!confirm('Weet je zeker dat je alle layout instellingen wilt resetten naar de standaardwaarden? Dit kan niet ongedaan worden gemaakt.')) {
    return;
  }

  try {
    resettingLayout.value = true;
    statusMessage.value = null;

    const response = await axios.post('/api/pdflayout/reset');
    layoutSettings.value = response.data;

    console.log('Layout reset to defaults:', layoutSettings.value);

    statusMessage.value = 'Layout instellingen gereset naar standaardwaarden!';
    statusType.value = 'success';
    clearStatusMessage();
  } catch (error: any) {
    console.error('Error resetting layout:', error);
    statusMessage.value = error.response?.data?.message || 'Fout bij resetten van layout instellingen';
    statusType.value = 'error';
    clearStatusMessage();
  } finally {
    resettingLayout.value = false;
  }
};

// Initialize component
onMounted(() => {
  console.log('PdfLayoutEditor component mounted');
  fetchLayoutSettings();
});

// Cleanup timeout on component unmount
onUnmounted(() => {
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }
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

.form-card, .info-card {
  background-color: var(--color-background-light);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  margin-bottom: 2rem;
}

.form-title, .info-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-background);
  margin-bottom: 1.5rem;
}

.loading-message, .error-message {
  padding: 1rem;
  border-radius: 0.5rem;
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

.layout-controls {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.element-group {
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1.5rem;
  background-color: var(--color-white);
}

.group-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-background);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-border);
}

.element-control {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: var(--color-background-light);
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
}

.element-control:last-child {
  margin-bottom: 0;
}

.element-label {
  font-weight: 600;
  color: var(--color-background);
  margin-bottom: 0.75rem;
  display: block;
}

.control-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  align-items: center;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.input-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-light);
}

.control-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: var(--color-white);
  color: var(--color-background);
  width: 100%;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
</style>