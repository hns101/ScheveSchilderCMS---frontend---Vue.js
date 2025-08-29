<template>
  <div class="page-container">
    <h1 class="page-title">Student Detail</h1>
    <p class="page-description">Details voor student: {{ student?.name || 'Laden...' }}</p>

    <div v-if="loading" class="loading-message">Laden van studentdetails...</div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <div v-if="student" class="student-details-card">
      <h2 class="student-details-title">{{ student.name }} ({{ student.studentNumber }})</h2>
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
        <a :href="student.registrationDocumentPath" target="_blank" class="detail-link">Bekijk document</a>
      </div>

      <h3 class="invoices-title">Facturen</h3>
      <div v-if="student.invoices && student.invoices.length" class="invoice-list">
        <div v-for="invoice in student.invoices" :key="invoice.id" class="invoice-item">
          <p>Factuur ID: {{ invoice.id }}</p>
          <p>Datum: {{ new Date(invoice.date).toLocaleDateString() }}</p>
          <p>Bedrag: {{ invoice.amountTotal }} (BTW: {{ invoice.vat }})</p>
          <p>Beschrijving: {{ invoice.description }}</p>
          <a :href="getInvoiceFileUrl(invoice.id!)" target="_blank" class="detail-link">Bekijk PDF</a>
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

    if (!studentId || studentId.length !== 24) { // Basic check for ObjectId length
      error.value = "Ongeldig student ID formaat.";
      loading.value = false;
      return;
    }

    const response = await axios.get<Student>(`/api/students/${studentId}`);
    student.value = response.data;
  } catch (err: any) { // Catch any type of error
    console.error("Fout bij het ophalen van studentdetails:", err);
    // Attempt to get a more specific error message from the backend response
    if (err.response && err.response.data && err.response.data.title) {
      error.value = `Fout: ${err.response.data.title} - ${err.response.data.detail || ''}`;
    } else {
      error.value = "Er is een fout opgetreden bij het laden van studentdetails.";
    }
  } finally {
    loading.value = false;
  }
};

const getInvoiceFileUrl = (invoiceId: string) => {
  return `/api/invoices/file/${invoiceId}`;
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

.student-details-title {
  font-size: 1.5rem; /* 24px */
  font-weight: 600;
  color: var(--color-background);
  margin-bottom: 1.5rem;
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
  background-color: var(--color-light-gray);
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
  color: var( --color-background-light);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  margin-top: 2rem;
  transition: background-color 0.2s ease;
}

</style>
