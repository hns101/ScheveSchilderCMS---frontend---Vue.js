<template>
  <div class="page-container">
    <h1 class="page-title">Student Detail</h1>
    <p class="page-description">Details voor student: {{ student?.name || 'Laden...' }}</p>

    <div v-if="loading" class="loading-message">Laden van studentdetails...</div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <div v-if="student" class="student-details-card">
      <div class="student-details-header">
        <h2 class="student-details-title">{{ student.name }} ({{ student.studentNumber }})</h2>
        <div class="student-actions">
          <button @click="navigateToEditStudent(student.id!)" class="edit-student-button">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L7.5 21H3v-4.5L15.232 5.232z" />
            </svg>
            Bewerken
          </button>
          <button @click="deleteStudent(student.id!)" class="delete-student-button">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Verwijder
          </button>
        </div>
      </div>

      <div class="detail-group">
        <p class="detail-label">Adres:</p>
        <p class="detail-value">{{ student.address }}</p>
      </div>
      <div class="detail-group">
        <p class="detail-label">Email:</p>
        <p class="detail-value">{{ student.email }}</p>
      </div>
      <div class="detail-group">
        <p class="detail-label">Telefoonnummer:</p>
        <p class="detail-value">{{ student.phoneNumber }}</p>
      </div>
      <div class="detail-group">
        <p class="detail-label">Noodcontact:</p>
        <p class="detail-value">{{ student.emergencyContact }}</p>
      </div>
      <div class="detail-group">
        <p class="detail-label">Banknaam:</p>
        <p class="detail-value">{{ student.bankName }}</p>
      </div>
      <div class="detail-group">
        <p class="detail-label">Bankrekeningnummer:</p>
        <p class="detail-value">{{ student.accountNumber }}</p>
      </div>
      <div class="detail-group">
        <p class="detail-label">Registratiedatum:</p>
        <p class="detail-value">{{ new Date(student.dateOfRegistration).toLocaleDateString() }}</p>
      </div>
      <div class="detail-group" v-if="student.registrationDocumentPath">
        <p class="detail-label">Registratiedocument:</p>
        <button @click="viewDocument('student', student.id!)" class="edit-student-button">Bekijk document</button>
      </div>

      <h3 class="invoices-title">Facturen</h3>
      <div v-if="student.invoices && student.invoices.length" class="invoice-list">
        <div v-for="invoice in student.invoices" :key="invoice.id" class="invoice-item">
          <p>Factuur ID: {{ invoice.id }}</p>
          <p>Datum: {{ new Date(invoice.date).toLocaleDateString() }}</p>
          <p>Bedrag: {{ invoice.amountTotal }} (BTW: {{ invoice.vat }})</p>
          <p>Beschrijving: {{ invoice.description }}</p>
          <button @click="viewDocument('invoice', invoice.id!)" class="edit-student-button">Bekijk PDF</button>
        </div>
      </div>
      <div v-else class="no-data-message">Geen facturen gevonden voor deze student.</div>
    </div>
    <button @click="router.back()" class="back-button">Terug naar Ledenboek</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import type { Student } from '../types/Student';

const student = ref<Student | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const route = useRoute();
const router = useRouter();

const fetchStudentDetail = async () => {
  try {
    const studentId = route.params.id as string;

    if (!studentId || studentId.length !== 24) {
      error.value = "Ongeldig student ID formaat.";
      loading.value = false;
      return;
    }

    const response = await axios.get<Student>(`/api/students/${studentId}`);
    student.value = response.data;
  } catch (err: any) {
    console.error("Fout bij het ophalen van studentdetails:", err);
    if (err.response && err.response.data && err.response.data.title) {
      error.value = `Fout: ${err.response.data.title} - ${err.response.data.detail || ''}`;
    } else {
      error.value = "Er is een fout opgetreden bij het laden van studentdetails.";
    }
  } finally {
    loading.value = false;
  }
};

const viewDocument = (type: 'student' | 'invoice', id: string) => {
  router.push({ name: 'PdfViewer', params: { type, id } });
};

const getInvoiceFileUrl = (invoiceId: string) => {
  return `/api/invoices/file/${invoiceId}`;
};

const getRegistrationDocumentUrl = (studentId: string) => {
  return `/api/students/${studentId}/registration-document`;
};

const navigateToEditStudent = (id: string) => {
  router.push({ name: 'EditStudent', params: { id } });
};

const deleteStudent = async (id: string) => {
  if (confirm('Weet u zeker dat u deze student en alle bijbehorende facturen wilt verwijderen?')) {
    try {
      await axios.delete(`/api/students/${id}`);
      alert('Student succesvol verwijderd!');
      router.push({ name: 'StudentList' });
    } catch (err: any) {
      console.error("Fout bij het verwijderen van student:", err);
      alert(`Fout bij het verwijderen van student: ${err.response?.data?.title || err.message}`);
    }
  }
};

onMounted(fetchStudentDetail);
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
  font-size: 1.875rem; /* 30px */
  font-weight: 600;
  color: var(--color-text-dark);
  margin-bottom: 1rem;
}

.page-description {
  margin-top: 0.5rem;
  color: var(--color-text-regular);
  margin-bottom: 1.5rem;
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
  background-color: #fee2e2; /* light red */
  color: #ef4444; /* red */
}

.student-details-card {
  background-color: var(--color-background-light);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  margin-top: 2rem;
}

.student-details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.student-details-title {
  font-size: 1.5rem; /* 24px */
  font-weight: 600;
  color: var(--color-background);
  margin-bottom: 1.5rem;
}

.student-actions {
  display: flex;
  gap: 1rem;
}

.edit-student-button, .delete-student-button {
  background-color: var(--color-primary);
  color: var(--color-background-light);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.edit-student-button:hover {
  background-color: #d09e5f; /* Darker shade of primary */
}

.delete-student-button {
  background-color: #ef4444;
  color: var(--color-background-light);
}

.delete-student-button:hover {
  background-color: #dc2626; /* Darker red for delete */
}

.detail-group {
  display: flex;
  margin-bottom: 0.75rem;
  gap: 2.4rem;
}

.detail-label {
  font-weight: 500;
  color: var(--color-background);
  width: 150px;
}

.detail-value {
  color: var(--color-background);
  flex: 1;
}

.detail-link {
  color: var(--color-white);
  text-decoration: underline;
}

.invoices-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-background);
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.invoice-list {
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  overflow: hidden;
}

.invoice-item {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-background-light);
}

.invoice-item:last-child {
  border-bottom: none;
}

.invoice-item p {
  margin-bottom: 0.25rem;
  color: var(--color-background);
}

.back-button {
  background-color: var(--color-primary);
  color: var(--color-background-light);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  margin-top: 2rem;
  transition: background-color 0.2s ease;
}

.back-button:hover {
  background-color: #d09e5f;  /* Darker shade of primary */
}
</style>
