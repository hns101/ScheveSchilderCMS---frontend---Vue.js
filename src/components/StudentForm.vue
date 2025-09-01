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

        <!-- File Upload Section -->
        <div class="form-group">
          <label for="registrationDocument" class="form-label">Registratiedocument (PDF):</label>
          <input type="file" id="registrationDocument" ref="fileInput" @change="handleFileChange" class="form-input" accept=".pdf" />
          <div v-if="file" class="file-info-actions">
            <span class="file-name">{{ file.name }}</span>
            <button type="button" @click="clearFile" class="delete-file-button">Verwijder</button>
          </div>
          <div v-if="isEditing && formData.registrationDocumentPath && !file" class="file-info-actions">
            <a :href="getRegistrationDocumentUrl(formData.registrationDocumentPath)" target="_blank" class="detail-link">Bekijk Huidig Document</a>
            <button type="button" @click="deleteExistingDocument" class="delete-file-button">Verwijder Huidig</button>
          </div>
          <div v-if="fileUploadMessage" :class="['message', fileUploadStatus]">{{ fileUploadMessage }}</div>
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

const router = useRouter();
const route = useRoute();

const isEditing = computed(() => !!props.id);

const formData = ref<Student>({
  name: '', studentNumber: '', address: '', email: '', phoneNumber: '',
  emergencyContact: '', bankName: '', accountNumber: '', dateOfRegistration: new Date(),
});

const fileInput = ref<HTMLInputElement | null>(null);
const file = ref<File | null>(null);

const loadingStudent = ref(false);
const studentFetchError = ref<string | null>(null);
const submitting = ref(false);
const submitMessage = ref<string | null>(null);
const submitStatus = ref<'success' | 'error' | null>(null);
const fileUploadMessage = ref<string | null>(null);
const fileUploadStatus = ref<'success' | 'error' | null>(null);


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

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    file.value = target.files[0];
    fileUploadMessage.value = null;
    fileUploadStatus.value = null;
  }
};

const clearFile = () => {
  file.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  fileUploadMessage.value = null;
  fileUploadStatus.value = null;
};

const deleteExistingDocument = async () => {
  if (!formData.value.id) return;
  try {
    await axios.delete(`/api/students/${formData.value.id}/registration-document`);
    formData.value.registrationDocumentPath = undefined;
    fileUploadMessage.value = 'Document succesvol verwijderd.';
    fileUploadStatus.value = 'success';
  } catch (err: any) {
    console.error("Fout bij het verwijderen van document:", err);
    fileUploadMessage.value = `Fout bij verwijderen: ${err.response?.data?.title || err.message}`;
    fileUploadStatus.value = 'error';
  }
};

const getRegistrationDocumentUrl = (filePath: string) => {
  // This URL is what the backend's FileService.SaveStudentDocument returns.
  // It's a full server path, so we need to construct a public URL.
  // We'll use the StudentId to correctly build the URL for a Get request.
  const studentId = formData.value.id;
  if (studentId) {
    return `/api/students/${studentId}/registration-document-file`;
  }
  return '#';
};


const submitForm = async () => {
  submitting.value = true;
  submitMessage.value = null;
  submitStatus.value = null;

  try {
    let studentResponse;

    // Handle PUT request for editing
    if (isEditing.value && formData.value.id) {
      studentResponse = await axios.put(`/api/students/${formData.value.id}`, formData.value);
    } else {
      // Handle POST request for new student
      studentResponse = await axios.post('/api/students', formData.value);
    }

    // Handle file upload if a file is selected
    if (file.value) {
      const studentId = studentResponse.data.id || formData.value.id;
      const formDataToSend = new FormData();
      formDataToSend.append('file', file.value);
      await axios.post(`/api/students/${studentId}/registration-document`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fileUploadMessage.value = 'Document succesvol geüpload!';
      fileUploadStatus.value = 'success';
    }

    submitMessage.value = `Student succesvol ${isEditing.value ? 'bijgewerkt' : 'toegevoegd'}!`;
    submitStatus.value = 'success';

    // Clear form for new entry if adding
    if (!isEditing.value) {
      formData.value = {
        name: '', studentNumber: '', address: '', email: '', phoneNumber: '',
        emergencyContact: '', bankName: '', accountNumber: '', dateOfRegistration: new Date(),
      };
      if (fileInput.value) {
        fileInput.value.value = '';
      }
      file.value = null;
    }

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

.form-input, .form-select, .form-file-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font-size: 1rem;
  color: var(--color-background);
  background-color: var(--color-background-light);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus, .form-select:focus, .form-file-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(82, 139, 255, 0.2);
  outline: none;
}

.form-file-input {
  height: auto;
  padding: 0.5rem;
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
  background-color: #b67949;
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
  background-color: #8a939e;
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

.detail-link {
  color: var(--color-primary);
  text-decoration: underline;
}

.file-info-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.delete-file-button {
  background-color: #ef4444;
  color: var(--color-background-light);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.delete-file-button:hover {
  background-color: #dc2626;
}

</style>