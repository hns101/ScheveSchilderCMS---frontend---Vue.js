<template>
  <div class="page-container">
    <h1 class="page-title">Incasso boekingen</h1>
    <p class="page-description">Beheer en genereer facturen in batches.</p>

    <!-- Template Status Banner -->
    <div v-if="!templateInfo?.hasTemplate" class="warning-banner">
      <div class="warning-content">
        <svg xmlns="http://www.w3.org/2000/svg" class="warning-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <h4>Geen factuur template gevonden</h4>
          <p>Upload eerst een template in <router-link to="/settings" class="settings-link">Instellingen</router-link> voordat u facturen kunt genereren.</p>
        </div>
      </div>
    </div>

    <!-- Invoice Generation Form -->
    <div class="form-card">
      <h2 class="form-title">Nieuwe Factuur Batch</h2>
      <form @submit.prevent="generateInvoices">
        <div class="form-group">
          <label for="description" class="form-label">Beschrijving:</label>
          <input type="text" id="description" v-model="batchRequest.description" class="form-input" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="amountTotal" class="form-label">Totaalbedrag (€):</label>
            <input type="number" id="amountTotal" v-model.number="batchRequest.amountTotal" class="form-input" step="0.01" required />
          </div>

          <div class="form-group">
            <label for="vat" class="form-label">BTW (%):</label>
            <input type="number" id="vat" v-model.number="batchRequest.vat" class="form-input" step="0.01" required />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Selecteer Studenten:</label>
          <div class="student-selection-actions">
            <button type="button" @click="selectAllStudents" class="select-all-button">Selecteer Alles</button>
            <button type="button" @click="deselectAllStudents" class="deselect-all-button">Deselecteer Alles</button>
            <span class="selected-count">{{ batchRequest.studentIds.length }} van {{ availableStudents.length }} geselecteerd</span>
          </div>
          <div v-if="loadingStudents" class="loading-message-small">Laden van studenten...</div>
          <div v-else-if="!availableStudents.length" class="no-data-message-small">Geen studenten beschikbaar.</div>
          <div v-else class="student-checkbox-list">
            <label v-for="student in availableStudents" :key="student.id" class="checkbox-item">
              <input type="checkbox" :value="student.id" v-model="batchRequest.studentIds" class="checkbox-input" />
              <div class="student-info">
                <span class="student-name">{{ student.name }}</span>
                <span class="student-number">({{ student.studentNumber }})</span>
              </div>
            </label>
          </div>
        </div>

        <button type="submit" class="submit-button" :disabled="generating || !batchRequest.studentIds.length || !templateInfo?.hasTemplate">
          <svg v-if="generating" class="button-icon animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ generating ? 'Genereren...' : 'Genereer Facturen' }}
        </button>
      </form>
      <div v-if="generationMessage" :class="['message', generationStatus]">{{ generationMessage }}</div>
    </div>

    <!-- All Invoices List -->
    <div class="invoice-list-card">
      <div class="invoice-list-header">
        <h2 class="form-title">Alle Facturen</h2>
        <button @click="refreshInvoices" class="refresh-button" :disabled="loadingInvoices">
          <svg xmlns="http://www.w3.org/2000/svg" class="button-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8.002 8.002 0 0115.357 2m-15.357 0H4m15.357 0v5h-.582M19.418 15A8.001 8.001 0 004.582 15m0 0V15a8.002 8.002 0 0015.357-2m-15.357 0H4" />
          </svg>
          Vernieuwen
        </button>
      </div>

      <div v-if="loadingInvoices" class="loading-message">Laden van facturen...</div>
      <div v-if="invoiceError" class="error-message">{{ invoiceError }}</div>

      <div v-if="allInvoices.length" class="invoice-table-container">
        <table class="invoice-table">
          <thead>
          <tr>
            <th>ID</th>
            <th>Student</th>
            <th>Datum</th>
            <th>Bedrag</th>
            <th>BTW</th>
            <th>Beschrijving</th>
            <th>Acties</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="invoice in allInvoices" :key="invoice.id">
            <td>{{ invoice.id?.substring(0, 8) }}...</td>
            <td>{{ getStudentName(invoice.studentId) }}</td>
            <td>{{ formatDate(invoice.date) }}</td>
            <td>€{{ formatAmount(invoice.amountTotal) }}</td>
            <td>{{ invoice.vat }}%</td>
            <td>{{ invoice.description || 'Geen beschrijving' }}</td>
            <td>
              <div class="action-buttons">
                <button @click="viewDocument('invoice', invoice.id!)" class="table-action-link">
                  <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  PDF
                </button>
                <button @click="deleteInvoice(invoice.id!)" class="table-action-button-ib">
                  <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Verwijder
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div v-else-if="!loadingInvoices && !invoiceError" class="no-data-message">Geen facturen gevonden.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import type { Student, Invoice } from '../types/Student';

const router = useRouter();

const batchRequest = ref({
  studentIds: [] as string[],
  description: '',
  amountTotal: 0,
  vat: 21
});

const generating = ref(false);
const generationMessage = ref<string | null>(null);
const generationStatus = ref<'success' | 'error' | null>(null);

const availableStudents = ref<Student[]>([]);
const loadingStudents = ref(true);

const allInvoices = ref<Invoice[]>([]);
const loadingInvoices = ref(true);
const invoiceError = ref<string | null>(null);

// Template management
const templateInfo = ref<any>(null);

const fetchTemplateInfo = async () => {
  try {
    const response = await axios.get('/api/invoices/template/info');

    // Handle both old and new API response formats
    if (response.data && response.data.success !== undefined) {
      templateInfo.value = response.data.success ? response.data.data : { hasTemplate: false };
    } else {
      templateInfo.value = response.data;
    }
  } catch (err) {
    console.error("Fout bij het ophalen van template info:", err);
    templateInfo.value = { hasTemplate: false };
  }
};

const fetchAvailableStudents = async () => {
  try {
    const response = await axios.get('/api/students');

    // Handle both old and new API response formats
    if (response.data && response.data.success !== undefined) {
      availableStudents.value = response.data.success ? response.data.data : [];
    } else {
      availableStudents.value = response.data || [];
    }
  } catch (err) {
    console.error("Fout bij het ophalen van studenten voor selectie:", err);
  } finally {
    loadingStudents.value = false;
  }
};

const fetchAllInvoices = async () => {
  loadingInvoices.value = true;
  invoiceError.value = null;

  try {
    const response = await axios.get('/api/invoices');

    // Handle both old and new API response formats
    if (response.data && response.data.success !== undefined) {
      allInvoices.value = response.data.success ? response.data.data : [];
    } else {
      allInvoices.value = response.data || [];
    }
  } catch (err: any) {
    console.error("Fout bij het ophalen van facturen:", err);
    invoiceError.value = err.response?.data?.message || "Er is een fout opgetreden bij het laden van facturen.";
  } finally {
    loadingInvoices.value = false;
  }
};

const generateInvoices = async () => {
  if (!templateInfo.value?.hasTemplate) {
    generationMessage.value = 'Upload eerst een template in Instellingen voordat u facturen kunt genereren.';
    generationStatus.value = 'error';
    return;
  }

  generating.value = true;
  generationMessage.value = null;
  generationStatus.value = null;

  try {
    const response = await axios.post('/api/invoices/batch-generate', batchRequest.value);

    // Handle both old and new API response formats
    let result;
    if (response.data && response.data.success !== undefined) {
      result = response.data.success ? response.data.data : null;
    } else {
      result = response.data;
    }

    if (result) {
      generationMessage.value = `Succesvol ${result.successCount || result.length || 0} facturen gegenereerd!`;
      if (result.errorCount && result.errorCount > 0) {
        generationMessage.value += ` ${result.errorCount} fouten opgetreden.`;
      }
      generationStatus.value = 'success';

      await fetchAllInvoices();
      batchRequest.value = { studentIds: [], description: '', amountTotal: 0, vat: 21 };
    } else {
      throw new Error('Geen data ontvangen van server');
    }
  } catch (err: any) {
    console.error("Fout bij het genereren van facturen:", err);
    generationMessage.value = err.response?.data?.message || "Fout bij het genereren van facturen";
    generationStatus.value = 'error';
  } finally {
    generating.value = false;
  }
};

const refreshInvoices = async () => {
  await fetchAllInvoices();
};

const getStudentName = (studentId: string) => {
  const student = availableStudents.value.find(s => s.id === studentId);
  return student ? student.name : 'Onbekend';
};

const viewDocument = (type: 'student' | 'invoice', id: string) => {
  router.push({ name: 'PdfViewer', params: { type, id } });
};

const deleteInvoice = async (invoiceId: string) => {
  if (confirm('Weet u zeker dat u deze factuur wilt verwijderen?')) {
    try {
      await axios.delete(`/api/invoices/${invoiceId}`);
      generationMessage.value = 'Factuur succesvol verwijderd.';
      generationStatus.value = 'success';
      await fetchAllInvoices();
    } catch (err: any) {
      console.error("Fout bij het verwijderen van factuur:", err);
      generationMessage.value = err.response?.data?.message || "Fout bij het verwijderen van factuur";
      generationStatus.value = 'error';
    }
  }
};

const selectAllStudents = () => {
  batchRequest.value.studentIds = availableStudents.value.map(s => s.id!);
};

const deselectAllStudents = () => {
  batchRequest.value.studentIds = [];
};

// Helper functions
const formatDate = (dateString: string | Date): string => {
  return new Date(dateString).toLocaleDateString('nl-NL');
};

const formatAmount = (amount: number): string => {
  return Number(amount).toFixed(2);
};

onMounted(() => {
  fetchTemplateInfo();
  fetchAvailableStudents();
  fetchAllInvoices();
});

// Prevent unused variable warnings
void formatDate;
void formatAmount;
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
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--color-text-dark);
  margin-bottom: 1rem;
}

.page-description {
  margin-top: 0.5rem;
  color: var(--color-text-regular);
  margin-bottom: 1.5rem;
}

.warning-banner {
  background-color: #fef3cd;
  border: 1px solid #fde047;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 2rem;
}

.warning-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.warning-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #d97706;
  flex-shrink: 0;
}

.warning-content h4 {
  font-weight: 600;
  color: #92400e;
  margin-bottom: 0.25rem;
}

.warning-content p {
  color: #92400e;
  margin: 0;
}

.settings-link {
  color: var(--color-primary);
  text-decoration: underline;
}

.form-card, .invoice-list-card {
  background-color: var(--color-background-light);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  margin-top: 2rem;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-background);
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-label {
  display: block;
  font-weight: 500;
  color: var(--color-background);
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font-size: 1rem;
  color: var(--color-background);
  background-color: var(--color-background-light);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(var(--color-background), 0.2);
  outline: none;
}

.student-selection-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.select-all-button, .deselect-all-button {
  background-color: var(--color-primary);
  color: var(--color-background-light);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.select-all-button:hover, .deselect-all-button:hover {
  background-color: #b67949;
}

.selected-count {
  color: var(--color-text-light);
  font-size: 0.875rem;
  margin-left: auto;
}

.student-checkbox-list {
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
  background-color: var(--color-background-light);
  padding: 0.5rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  color: var(--color-background);
  cursor: pointer;
  border-radius: 0.25rem;
  transition: background-color 0.2s ease;
}

.checkbox-item:hover {
  background-color: var(--color-background-hover);
}

.checkbox-input {
  margin-right: 0.75rem;
}

.student-info {
  display: flex;
  flex-direction: column;
}

.student-name {
  font-weight: 500;
}

.student-number {
  font-size: 0.875rem;
  color: var(--color-text-light);
}

.loading-message-small, .no-data-message-small {
  padding: 0.5rem;
  border-radius: 0.25rem;
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-light);
  background-color: var(--color-background-hover);
}

.submit-button {
  background-color: var(--color-primary);
  color: var(--color-background-light);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s ease;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  background-color: #b67949;
}

.submit-button:disabled {
  background-color: var(--color-text-light);
  cursor: not-allowed;
}

.button-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.invoice-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.refresh-button {
  background-color: var(--color-secondary);
  color: var(--color-background);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
}

.refresh-button:hover:not(:disabled) {
  background-color: #e6c200;
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

.loading-message, .error-message, .no-data-message {
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

.no-data-message {
  background-color: var(--color-background);
  color: var(--color-text-light);
}

.invoice-table-container {
  overflow-x: auto;
  margin-top: 1.5rem;
}

.invoice-table {
  width: 100%;
  border-collapse: collapse;
}

.invoice-table th, .invoice-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.invoice-table th {
  background-color: var(--color-background-hover);
  font-weight: 600;
  color: var(--color-text-dark);
}

.invoice-table td {
  background-color: var(--color-light-gray);
  color: var(--color-background);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.table-action-link {
  color: var(--color-background-light);
  background-color: var(--color-primary);
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: none;
  text-decoration: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: background-color 0.2s ease;
}

.table-action-link:hover {
  background-color: #b67949;
}

.table-action-button-ib {
  background-color: #8f4747;
  color: var(--color-background-light);
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: background-color 0.2s ease;
}

.table-action-button-ib:hover {
  background-color: #7a3e3e;
}

.action-icon {
  width: 1rem;
  height: 1rem;
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