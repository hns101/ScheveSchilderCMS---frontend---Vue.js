<template>
  <div class="form-card">
    <h2 class="form-title">{{ isEditing ? 'Student Bewerken' : 'Nieuwe Student Toevoegen' }}</h2>
    <form @submit.prevent="submitForm">
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

      <!-- Registration Document Upload (Optional - requires backend file upload endpoint) -->
      <!-- For now, we'll just display the path if editing -->
      <div class="form-group" v-if="isEditing && formData.registrationDocumentPath">
        <p class="form-label">Registratiedocument:</p>
        <a :href="formData.registrationDocumentPath" target="_blank" class="detail-link">Bekijk document</a>
      </div>
      <!-- TODO: Implement actual file upload if needed -->

      <div class="form-actions">
        <button type="submit" class="submit-button" :disabled="submitting">
          <span v-if="submitting">{{ isEditing ? 'Opslaan...' : 'Toevoegen...' }}</span>
          <span v-else>{{ isEditing ? 'Opslaan' : 'Toevoegen' }}</span>
        </button>
        <button type="button" @click="$emit('cancel')" class="cancel-button">Annuleren</button>
      </div>
      <div v-if="submitMessage" :class="['message', submitStatus]">{{ submitMessage }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import axios from 'axios';
import type { Student } from '../types/Student';

const props = defineProps<{
  student?: Student; // Optional prop for editing an existing student
}>();

const emit = defineEmits(['submitted', 'cancel']);

const isEditing = computed(() => !!props.student?.id);

const formData = ref<Student>({
  id: props.student?.id || undefined,
  name: props.student?.name || '',
  studentNumber: props.student?.studentNumber || '',
  address: props.student?.address || '',
  email: props.student?.email || '',
  phoneNumber: props.student?.phoneNumber || '',
  emergencyContact: props.student?.emergencyContact || '',
  bankName: props.student?.bankName || '',
  accountNumber: props.student?.accountNumber || '',
  dateOfRegistration: props.student?.dateOfRegistration ? new Date(props.student.dateOfRegistration) : new Date(),
  registrationDocumentPath: props.student?.registrationDocumentPath || undefined,
});

const submitting = ref(false);
const submitMessage = ref<string | null>(null);
const submitStatus = ref<'success' | 'error' | null>(null);

// Watch for changes in the student prop to update formData when editing
watch(() => props.student, (newStudent) => {
  if (newStudent) {
    formData.value = {
      id: newStudent.id,
      name: newStudent.name,
      studentNumber: newStudent.studentNumber,
      address: newStudent.address,
      email: newStudent.email,
      phoneNumber: newStudent.phoneNumber,
      emergencyContact: newStudent.emergencyContact,
      bankName: newStudent.bankName,
      accountNumber: newStudent.accountNumber,
      dateOfRegistration: new Date(newStudent.dateOfRegistration),
      registrationDocumentPath: newStudent.registrationDocumentPath,
    };
  }
}, { immediate: true });

// Computed property to handle date input binding (YYYY-MM-DD format)
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
    if (isEditing.value) {
      await axios.put(`/api/students/${formData.value.id}`, formData.value);
      submitMessage.value = 'Student succesvol bijgewerkt!';
      submitStatus.value = 'success';
    } else {
      await axios.post('/api/students', formData.value);
      submitMessage.value = 'Student succesvol toegevoegd!';
      submitStatus.value = 'success';
      // Clear form for new entry if adding
      formData.value = {
        name: '', studentNumber: '', address: '', email: '', phoneNumber: '',
        emergencyContact: '', bankName: '', accountNumber: '', dateOfRegistration: new Date(),
      };
    }
    emit('submitted'); // Notify parent component
  } catch (err: any) {
    console.error("Fout bij het opslaan van student:", err);
    submitMessage.value = `Fout: ${err.response?.data?.detail || err.response?.data?.title || err.message}`;
    submitStatus.value = 'error';
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
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
  color: var(--color-text-regular);
  background-color: var(--color-background-light);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus, .form-select:focus {
  border-color: var(--color-primary);
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
  color: var(--color-white);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-weight: 600;
}

.submit-button:hover:not(:disabled) {
  background-color: #4078e0; /* Darker shade of primary */
}

.submit-button:disabled {
  background-color: var(--color-text-light);
  cursor: not-allowed;
}

.cancel-button {
  background-color: var(--color-text-light);
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
