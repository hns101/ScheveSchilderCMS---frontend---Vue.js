<template>
  <div class="page-container">
    <h1 class="page-title">Ledenboek</h1>
    <p class="page-description">Overzicht van alle geregistreerde studenten.</p>

    <button @click="navigateToAddStudent" class="add-student-button">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      Nieuwe Student Toevoegen
    </button>

    <div v-if="loading" class="loading-message">Laden van studenten...</div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <div v-if="students.length" class="student-cards-grid">
      <div v-for="student in students" :key="student.id" class="student-card" @click="viewStudentDetail(student.id!)">
        <h2 class="student-card-title">{{ student.name || 'Onbekende Naam' }}</h2>
        <p class="student-card-detail">Studentnummer: {{ student.studentNumber || 'N.v.t.' }}</p>
        <p class="student-card-detail">Email: {{ student.email || 'N.v.t.' }}</p>
      </div>
    </div>
    <div v-else-if="!loading && !error" class="no-data-message">Geen studenten gevonden.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import type { Student } from '../types/Student';

const students = ref<Student[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const router = useRouter();

const fetchStudents = async () => {
  try {
    const response = await axios.get<Student[]>('/api/students');
    students.value = response.data;
  } catch (err) {
    console.error("Fout bij het ophalen van studenten:", err);
    error.value = "Er is een fout opgetreden bij het laden van studenten.";
  } finally {
    loading.value = false;
  }
};

const viewStudentDetail = (id: string) => {
  router.push({ name: 'StudentDetail', params: { id } });
};

const navigateToAddStudent = () => {
  router.push({ name: 'AddStudent' });
};

onMounted(fetchStudents);
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

.add-student-button {
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.add-student-button:hover {
  background-color: #4078e0; /* Darker shade of primary */
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

.no-data-message {
  background-color: var(--color-background);
  color: var(--color-text-light);
}

.student-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.student-card {
  background-color: var(--color-background-light);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.student-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.student-card-title {
  font-size: 1.25rem; /* 20px */
  font-weight: 600;
  color: var(--color-background);
  margin-bottom: 0.5rem;
}

.student-card-detail {
  font-size: 0.875rem; /* 14px */
  color: var(--color-background);
  margin-bottom: 0.25rem;
}
</style>
