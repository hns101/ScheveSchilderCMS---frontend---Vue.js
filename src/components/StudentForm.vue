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
            <a :href="getRegistrationDocumentUrl()" target="_blank" class="detail-link">Bekijk Huidig Document</a>
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
import { useRouter } from 'vue-router';
import type { Student } from '../types/Student';

const props = defineProps<{
  id?: string;
}>();

const router = useRouter();
const isEditing = computed(() => !!props.id);

const formData = ref<Student>({
  name: '',
  studentNumber: '',
  address: '',
  email: '',
  phoneNumber: '',
  emergencyContact: '',
  bankName: '',
  accountNumber: '',
  dateOfRegistration: new Date(),
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

// FIXED: Better API response handling
const fetchStudentData = async (studentId: string) => {
  loadingStudent.value = true;
  studentFetchError.value = null;

  try {
    console.log(`Fetching student data for ID: ${studentId}`);
    const response = await axios.get(`/api/students/${studentId}`);

    // Handle both old and new API response formats
    let studentData;
    if (response.data && response.data.success !== undefined) {
      if (response.data.success) {
        studentData = response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch student data');
      }
    } else {
      studentData = response.data;
    }

    // FIXED: Proper date handling
    formData.value = {
      ...studentData,
      dateOfRegistration: studentData.dateOfRegistration ? new Date(studentData.dateOfRegistration) : new Date(),
    };

    console.log('Student data loaded successfully:', formData.value);

  } catch (err: any) {
    console.error(`Error fetching student with ID ${studentId}:`, err);

    let errorMessage = 'Error loading student data';
    if (err.response?.data) {
      if (err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.response.data.title) {
        errorMessage = err.response.data.title;
      }
    } else if (err.message) {
      errorMessage = err.message;
    }

    studentFetchError.value = errorMessage;
  } finally {
    loadingStudent.value = false;
  }
};

const formattedDateOfRegistration = computed({
  get: () => {
    if (formData.value.dateOfRegistration) {
      const date = new Date(formData.value.dateOfRegistration);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    }
    return new Date().toISOString().split('T')[0];
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
    console.error("Error deleting document:", err);
    fileUploadMessage.value = `Error deleting document: ${err.response?.data?.message || err.message}`;
    fileUploadStatus.value = 'error';
  }
};

const getRegistrationDocumentUrl = () => {
  return `/api/students/${formData.value.id}/registration-document`;
};

// FIXED: Better form submission with proper error handling
const submitForm = async () => {
  submitting.value = true;
  submitMessage.value = null;
  submitStatus.value = null;

  try {
    let studentResponse;
    let studentId;

    // Create or update student
    if (isEditing.value && formData.value.id) {
      console.log('Updating existing student:', formData.value.id);
      studentResponse = await axios.put(`/api/students/${formData.value.id}`, formData.value);
      studentId = formData.value.id;
    } else {
      console.log('Creating new student');
      studentResponse = await axios.post('/api/students', formData.value);

      // Handle different response formats for new student creation
      if (studentResponse.data && studentResponse.data.success !== undefined) {
        studentId = studentResponse.data.data?.id;
      } else {
        studentId = studentResponse.data?.id;
      }
    }

    // Upload file if provided
    if (file.value && studentId) {
      console.log('Uploading registration document for student:', studentId);
      const formDataToSend = new FormData();
      formDataToSend.append('file', file.value);

      await axios.post(`/api/students/${studentId}/registration-document`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      fileUploadMessage.value = 'Document succesvol geüpload!';
      fileUploadStatus.value = 'success';
    }

    submitMessage.value = `Student succesvol ${isEditing.value ? 'bijgewerkt' : 'toegevoegd'}!`;
    submitStatus.value = 'success';

    // Reset form for new students
    if (!isEditing.value) {
      formData.value = {
        name: '', studentNumber: '', address: '', email: '', phoneNumber: '',
        emergencyContact: '', bankName: '', accountNumber: '', dateOfRegistration: new Date(),
      };
      clearFile();
    }

    // Navigate back after short delay
    setTimeout(() => {
      router.back();
    }, 1000);

  } catch (err: any) {
    console.error("Error saving student:", err);

    let errorMessage = 'Error saving student';
    if (err.response?.data) {
      if (err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.response.data.title) {
        errorMessage = err.response.data.title;
      } else if (err.response.data.errors) {
        errorMessage = err.response.data.errors.join(', ');
      }
    } else if (err.message) {
      errorMessage = err.message;
    }

    submitMessage.value = errorMessage;
    submitStatus.value = 'error';
  } finally {
    submitting.value = false;
  }
};

const cancelForm = () => {
  router.back();
};

// FIXED: Better prop watching
watch(() => props.id, (newId) => {
  if (newId) {
    console.log('Student ID changed to:', newId);
    fetchStudentData(newId);
  }
}, { immediate: true });

onMounted(() => {
  if (props.id) {
    console.log('Component mounted, loading student:', props.id);
    fetchStudentData(props.id);
  }
});
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
  font-size: 1.5rem;
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

.message, .loading-message, .error-message {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  font-weight: 500;
  text-align: center;
}

.message.success, .loading-message {
  background-color: #d1fae5;
  color: #059669;
}

.message.error, .error-message {
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

.file-name {
  font-weight: 500;
}

.delete-file-button {
  background-color: #ef4444;
  color: var(--color-background-light);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
}

.delete-file-button:hover {
  background-color: #dc2626;
}
</style>