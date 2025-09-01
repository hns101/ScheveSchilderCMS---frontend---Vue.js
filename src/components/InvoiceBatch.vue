<template>
  <div class="page-container">
    <h1 class="page-title">Incasso boekingen</h1>
    <p class="page-description">Beheer en genereer facturen in batches.</p>

    <!-- Invoice Generation Form -->
    <div class="form-card">
      <h2 class="form-title">Nieuwe Factuur Batch</h2>
      <form @submit.prevent="generateInvoices">
        <div class="form-group">
          <label for="description" class="form-label">Beschrijving:</label>
          <input type="text" id="description" v-model="batchRequest.description" class="form-input" required />
        </div>

        <div class="form-group">
          <label for="amountTotal" class="form-label">Totaalbedrag:</label>
          <input type="number" id="amountTotal" v-model.number="batchRequest.amountTotal" class="form-input" step="0.01" required />
        </div>

        <div class="form-group">
          <label for="vat" class="form-label">BTW (%):</label>
          <input type="number" id="vat" v-model.number="batchRequest.vat" class="form-input" step="0.01" required />
        </div>

        <div class="form-group">
          <label class="form-label">Selecteer Studenten:</label>
          <div class="student-selection-actions">
            <button type="button" @click="selectAllStudents" class="select-all-button">Selecteer Alles</button>
            <button type="button" @click="deselectAllStudents" class="deselect-all-button">Deselecteer Alles</button>
          </div>
          <div v-if="loadingStudents" class="loading-message-small">Laden van studenten...</div>
          <div v-else-if="!availableStudents.length" class="no-data-message-small">Geen studenten beschikbaar.</div>
          <div v-else class="student-checkbox-list">
            <label v-for="student in availableStudents" :key="student.id" class="checkbox-item">
              <input type="checkbox" :value="student.id" v-model="batchRequest.studentIds" class="checkbox-input" />
              {{ student.name }} ({{ student.studentNumber }})
            </label>
          </div>
        </div>

        <button type="submit" class="submit-button" :disabled="generating || !batchRequest.studentIds.length">
          <span v-if="generating">Genereren...</span>
          <span v-else>Genereer Facturen</span>
        </button>
      </form>
      <div v-if="generationMessage" :class="['message', generationStatus]">{{ generationMessage }}</div>
    </div>

    <!-- All Invoices List -->
    <div class="invoice-list-card">
      <h2 class="form-title">Alle Facturen</h2>
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
            <td>{{ invoice.id }}</td>
            <td>{{ getStudentName(invoice.studentId) }}</td>
            <td>{{ new Date(invoice.date).toLocaleDateString() }}</td>
            <td>{{ invoice.amountTotal }}</td>
            <td>{{ invoice.vat }}</td>
            <td>{{ invoice.description }}</td>
            <td>
              <button @click="viewDocument('invoice', invoice.id!)" class="table-action-link">Bekijk PDF</button>
              <button @click="deleteInvoice(invoice.id!)" class="table-action-button-ib">Verwijder</button>
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
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import type { Student, Invoice } from '../types/Student';

const router = useRouter();

const batchRequest = ref({
  studentIds: [] as string[],
  description: '',
  amountTotal: 0,
  vat: 0
});

const generating = ref(false);
const generationMessage = ref<string | null>(null);
const generationStatus = ref<'success' | 'error' | null>(null);

const availableStudents = ref<Student[]>([]);
const loadingStudents = ref(true);

const allInvoices = ref<Invoice[]>([]);
const loadingInvoices = ref(true);
const invoiceError = ref<string | null>(null);

const fetchAvailableStudents = async () => {
  try {
    const response = await axios.get<Student[]>('/api/students');
    availableStudents.value = response.data;
  } catch (err) {
    console.error("Fout bij het ophalen van studenten voor selectie:", err);
  } finally {
    loadingStudents.value = false;
  }
};

const fetchAllInvoices = async () => {
  try {
    const response = await axios.get<Invoice[]>('/api/invoices');
    allInvoices.value = response.data;
  } catch (err) {
    console.error("Fout bij het ophalen van facturen:", err);
    invoiceError.value = "Er is een fout opgetreden bij het laden van facturen.";
  } finally {
    loadingInvoices.value = false;
  }
};

const generateInvoices = async () => {
  generating.value = true;
  generationMessage.value = null;
  generationStatus.value = null;

  try {
    const response = await axios.post('/api/invoices/batch-generate', batchRequest.value);
    generationMessage.value = `Succesvol ${response.data.length} facturen gegenereerd!`;
    generationStatus.value = 'success';
    await fetchAllInvoices();
    batchRequest.value = { studentIds: [], description: '', amountTotal: 0, vat: 0 };
  } catch (err: any) {
    console.error("Fout bij het genereren van facturen:", err);
    generationMessage.value = `Fout bij het genereren van facturen: ${err.response?.data || err.message}`;
    generationStatus.value = 'error';
  } finally {
    generating.value = false;
  }
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
      generationMessage.value = `Fout bij het verwijderen van factuur: ${err.response?.data || err.message}`;
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

onMounted(() => {
  fetchAvailableStudents();
  fetchAllInvoices();
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

.form-label {
  display: block;
  font-weight: 500;
  color: var(--color-background);
  margin-bottom: 0.5rem;
}

.form-input, .form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font-size: 1rem;
  color: var(--color-background);
  background-color: var(--color-background-light);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus, .form-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(var(--color-background), 0.2);
  outline: none;
}

.student-selection-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
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
  background-color: #4078e0;
}

.student-checkbox-list {
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  background-color: var(--color-background-light);
  padding: 0.5rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  color: var(--color-background);
  cursor: pointer;
}

.checkbox-item:hover {
  background-color: var(--color-background-hover);
}

.checkbox-input {
  margin-right: 0.5rem;
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
}

.submit-button:hover:not(:disabled) {
  background-color: var(--color-primary);
}

.submit-button:disabled {
  background-color: var(--color-text-light);
  cursor: not-allowed;
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
  background-color: var( --color-light-gray);
  color: var(--color-background);
}

.invoice-table tbody :hover {
  background-color: var(--color-background-light);
}

.table-action-link {
  color: var(--color-white);
  text-decoration: underline;
  margin-right: 0.5rem;
}

.table-action-button-ib {
  background-color: #8f4747;
  color: var(--color-background-light);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
}

.table-action-button-ib:hover {
  background-color: #8f4747;
}

</style>
