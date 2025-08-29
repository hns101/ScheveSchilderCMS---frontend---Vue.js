<template>
  <div class="form-card">
    <h2 class="form-title">{{ isEditing ? 'Student Bewerken' : 'Nieuwe Student Toevoegen' }}</h2>
    <form @submit.prevent="submitForm">
      <div v-if="loadingStudent" class="loading-message">Laden van studentgegevens...</div>
      <div v-if="studentFetchError" class="error-message">{{ studentFetchError }}</div>

      <template v-if="!loadingStudent">
        <div class="form-group">
          <label for="name" class="form-label">Naam:</label>
          <input type="text" id="name" v-model="formData.name" class="form-input" required />
        </div>

        <div class="form-group">
          <label for="studentNumber" class="form-label">Studentnummer:</label>
          <input type="text" id="studentNumber" v-model="formData.studentNumber" class="form-input" required />
        </div>

        <div class="form-group">
          <label for="address" class="form-label">Adres:</label>
          <input type="text" id="address" v-model="formData.address" class="form-input" required />
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email:</label>
          <input type="email" id="email" v-model="formData.email" class="form-input" required />
        </div>

        <div class="form-group">
          <label for="phoneNumber" class="form-label">Telefoonnummer:</label>
          <input type="tel" id="phoneNumber" v-model="formData.phoneNumber" class="form-input" required />
        </div>

        <div class="form-group">
          <label for="emergencyContact" class="form-label">Noodcontact:</label>
          <input type="text" id="emergencyContact" v-model="formData.emergencyContact" class="form-input" required />
        </div>

        <div class="form-group">
          <label for="bankName" class="form-label">Banknaam:</label>
          <input type="text" id="bankName" v-model="formData.bankName" class="form-input" required />
        </div>

        <div class="form-group">
          <label for="accountNumber" class="form-label">Bankrekeningnummer:</label>
          <input type="text" id="accountNumber" v-model="formData.accountNumber" class="form-input" required />
        </div>

        <div class="form-group">
          <label for="dateOfRegistration" class="form-label">Registratiedatum:</label>
          <input type="date" id="dateOfRegistration" v-model="formattedDateOfRegistration" class="form-input" required />
        </div>

        <div class="form-group" v-if="isEditing && formData.registrationDocumentPath">
          <p class="form-label">Registratiedocument:</p>
          <a :href="formData.registrationDocumentPath" target="_blank" class="detail-link">Bekijk document</a>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-button" :disabled="submitting">
            <span v-if="submitting">{{ isEditing ? 'Opslaan...' : 'Toevoegen...' }}</span>
            <span v-else>{{ isEditing ? 'Opslaan' : 'Toevoegen' }}</span>
          </button>
          <button type="button" @click="cancelForm" class="cancel-button">Annuleren</button>
        </div>
        <div v-if="submitMessage" :class="['message', submitStatus]">{{ submitMessage }}</div>
      </template>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import type { Student } from '../types/Student';

const props = defineProps<{
  id?: string; // Prop to receive student ID for editing
}>();

const emit = defineEmits(['submitted', 'cancel']);
const router = useRouter();
const route = useRoute();

const isEditing = computed(() => !!props.id);

const formData = ref<Student>({
  name: '', studentNumber: '', address: '', email: '', phoneNumber: '',
  emergencyContact: '', bankName: '', accountNumber: '', dateOfRegistration: new Date(),
});

const loadingStudent = ref(false);
const studentFetchError = ref<string | null>(null);
const submitting = ref(false);
const submitMessage = ref<string | null>(null);
const submitStatus = ref<'success' | 'error' | null>(null);

const fetchStudentData = async (studentId: string) => {
  loadingStudent.value = true;
  studentFetchError.value = null;
  try {
    const response = await axios.get<Student>(`/api/students/${studentId}`);
    formData.value = {
      ...response.data,
      dateOfRegistration: new Date(response.data.dateOfRegistration),
    };
  } catch (err: any) {
    console.error(`Fout bij het ophalen van student met ID ${studentId}:`, err);
    studentFetchError.value = `Fout bij het laden van studentgegevens: ${err.response?.data?.title || err.message}`;
  } finally {
    loadingStudent.value = false;
  }
};

watch(() => props.id, (newId) => {
  if (newId) {
    fetchStudentData(newId);
  } else {
    formData.value = {
      name: '', studentNumber: '', address: '', email: '', phoneNumber: '',
      emergencyContact: '', bankName: '', accountNumber: '', dateOfRegistration: new Date(),
    };
  }
}, { immediate: true });

const formattedDateOfRegistration = computed({
  get: () => {
    if (formData.value.dateOfRegistration) {
      const date = new Date(formData.value.dateOfRegistration);
      return date.toISOString().split('T')[0];
    }
    return '';
  },
  set: (value) => {
    if (value) {
      formData.value.dateOfRegistration = new Date(value);
    }
  }
});

const submitForm = async () => {
  submitting.value = true;
  submitMessage.value = null;
  submitStatus.value = null;

  try {
    if (isEditing.value && formData.value.id) {
      await axios.put(`/api/students/${formData.value.id}`, formData.value);
      submitMessage.value = 'Student succesvol bijgewerkt!';
      submitStatus.value = 'success';
    } else {
      await axios.post('/api/students', formData.value);
      submitMessage.value = 'Student succesvol toegevoegd!';
      submitStatus.value = 'success';
      formData.value = {
        name: '', studentNumber: '', address: '', email: '', phoneNumber: '',
        emergencyContact: '', bankName: '', accountNumber: '', dateOfRegistration: new Date(),
      };
    }
    emit('submitted');
    router.back();
  } catch (err: any) {
    console.error("Fout bij het opslaan van student:", err);
    submitMessage.value = `Fout: ${err.response?.data?.title || err.response?.data?.detail || err.message}`;
    submitStatus.value = 'error';
  } finally {
    submitting.value = false;
  }
};

const cancelForm = () => {
  emit('cancel');
  router.back();
};

onMounted(() => {
  if (props.id) {
    fetchStudentData(props.id);
  }
});
</script>

<style scoped>
/* Your provided CSS for form-card, form-title, form-group, form-label, form-input, form-select,
   form-actions, submit-button, cancel-button, message, message.success, message.error, detail-link */

.form-card {
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  margin-top: 2rem;
}

.form-title {
  font-size: 1.5rem; /* 24px */
  font-weight: 600;
  color: var(--color-text-dark);
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-weight: 500;
  color: var(--color-text-dark);
  margin-bottom: 0.5rem;
}

.form-input, .form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font-size: 1rem;
  color: var(--color-background); /* Corrected to text-regular */
  background-color: var(--color-background-light);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus, .form-select:focus {
  border-color: var(--color-primary); /* Corrected to primary */
  box-shadow: 0 0 0 2px rgba(82, 139, 255, 0.2); /* Using RGB for primary color */
  outline: none;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.submit-button, .cancel-button {
  background-color: var(--color-primary);
  color: var(--color-background-light);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-weight: 600;
}

.submit-button:hover:not(:disabled) {
  background-color: #b67949; /* Darker shade of primary */
}

.submit-button:disabled {
  background-color: var(--color-text-light);
  cursor: not-allowed;
}

.cancel-button {
  background-color: var(--color-text-light);
  color: var(--color-background-light);
}

.cancel-button:hover {
  background-color: #8a939e; /* Darker shade of light text */
}

.message {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  font-weight: 500;
  text-align: center;
}

.message.success {
  background-color: #d1fae5; /* light green */
  color: #059669; /* green */
}

.message.error {
  background-color: #fee2e2; /* light red */
  color: #ef4444; /* red */
}

.detail-link {
  color: var(--color-primary);
  text-decoration: underline;
}
</style>
