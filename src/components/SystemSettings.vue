<template>
  <div class="system-settings">
    <div class="system-header">
      <h3>Systeem Instellingen</h3>
      <p class="system-description">
        Configureer algemene systeem instellingen
      </p>
    </div>

    <div v-if="loading" class="loading-spinner">
      Laden...
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <form @submit.prevent="saveSettings" v-if="settings && !loading">

      <!-- File Upload Settings -->
      <div class="settings-section">
        <h4>Bestand Upload Instellingen</h4>

        <div class="setting-group">
          <label for="maxFileSize">Maximum bestandsgrootte (MB)</label>
          <input
              id="maxFileSize"
              type="number"
              v-model="settings.maxFileUploadSize"
              min="1"
              max="50"
              class="form-control"
          />
          <small class="help-text">
            Huidige waarde: {{ formatFileSize(settings.maxFileUploadSize) }}
          </small>
        </div>

        <div class="setting-group">
          <label for="fileStoragePath">Bestanden opslag pad</label>
          <input
              id="fileStoragePath"
              type="text"
              v-model="settings.fileStoragePath"
              class="form-control"
              placeholder="Files"
          />
          <small class="help-text">
            Relatief pad voor bestandsopslag
          </small>
        </div>
      </div>

      <!-- Database Settings -->
      <div class="settings-section">
        <h4>Database Instellingen</h4>

        <div class="setting-group">
          <label for="connectionString">Verbindingsstring</label>
          <input
              id="connectionString"
              type="text"
              v-model="settings.connectionString"
              class="form-control"
              placeholder="mongodb://localhost:27017"
          />
          <small class="help-text">
            MongoDB verbindingsstring
          </small>
        </div>

        <div class="setting-group">
          <label for="databaseName">Database naam</label>
          <input
              id="databaseName"
              type="text"
              v-model="settings.databaseName"
              class="form-control"
              placeholder="StudentCMS"
          />
        </div>
      </div>

      <!-- Collection Names -->
      <div class="settings-section">
        <h4>Database Collecties</h4>

        <div class="collection-grid">
          <div class="setting-group">
            <label for="studentsCollection">Studenten collectie</label>
            <input
                id="studentsCollection"
                type="text"
                v-model="settings.studentsCollectionName"
                class="form-control"
                placeholder="Students"
            />
          </div>

          <div class="setting-group">
            <label for="invoicesCollection">Facturen collectie</label>
            <input
                id="invoicesCollection"
                type="text"
                v-model="settings.invoicesCollectionName"
                class="form-control"
                placeholder="Invoices"
            />
          </div>

          <div class="setting-group">
            <label for="systemSettingsCollection">Systeem instellingen collectie</label>
            <input
                id="systemSettingsCollection"
                type="text"
                v-model="settings.systemSettingsCollectionName"
                class="form-control"
                placeholder="SystemSettings"
            />
          </div>
        </div>
      </div>

      <!-- Application Settings -->
      <div class="settings-section">
        <h4>Applicatie Instellingen</h4>

        <div class="setting-group">
          <label for="defaultTemplate">Standaard template pad</label>
          <input
              id="defaultTemplate"
              type="text"
              v-model="settings.defaultInvoiceTemplatePath"
              class="form-control"
              placeholder="Automatisch ingesteld via template upload"
              readonly
          />
          <small class="help-text">
            Dit wordt automatisch ingesteld wanneer je een template uploadt
          </small>
        </div>
      </div>

      <!-- System Information -->
      <div class="settings-section">
        <h4>Systeem Informatie</h4>

        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Applicatie versie:</span>
            <span class="info-value">1.0.0</span>
          </div>
          <div class="info-item">
            <span class="info-label">Framework:</span>
            <span class="info-value">ASP.NET Core 9.0</span>
          </div>
          <div class="info-item">
            <span class="info-label">Database:</span>
            <span class="info-value">MongoDB</span>
          </div>
          <div class="info-item">
            <span class="info-label">PDF Engine:</span>
            <span class="info-value">QuestPDF</span>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="settings-footer">
        <button
            type="submit"
            class="btn btn-success"
            :disabled="saving"
        >
          {{ saving ? 'Opslaan...' : 'Instellingen Opslaan' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'

// Reactive data
const settings = ref(null)
const loading = ref(false)
const saving = ref(false)
const error = ref('')

// Emits
const emit = defineEmits(['settings-updated'])

// Load system settings
const loadSettings = async () => {
  loading.value = true
  error.value = ''

  try {
    // For now, we'll use default settings since there's no specific API endpoint
    // In a real application, you'd fetch these from an API
    settings.value = {
      maxFileUploadSize: 5242880, // 5MB in bytes
      fileStoragePath: 'Files',
      connectionString: 'mongodb://localhost:27017',
      databaseName: 'StudentCMS',
      studentsCollectionName: 'Students',
      invoicesCollectionName: 'Invoices',
      systemSettingsCollectionName: 'SystemSettings',
      defaultInvoiceTemplatePath: ''
    }
  } catch (err) {
    error.value = 'Kon systeem instellingen niet laden'
    console.error('Error loading system settings:', err)
  } finally {
    loading.value = false
  }
}

// Save system settings
const saveSettings = async () => {
  saving.value = true
  error.value = ''

  try {
    // Convert file size to bytes if needed
    if (typeof settings.value.maxFileUploadSize === 'string') {
      settings.value.maxFileUploadSize = parseInt(settings.value.maxFileUploadSize) * 1024 * 1024
    }

    // Here you would typically send the settings to your API
    // const response = await systemApi.updateSettings(settings.value)

    // For now, just simulate a successful save
    await new Promise(resolve => setTimeout(resolve, 1000))

    emit('settings-updated', settings.value)
    alert('Systeem instellingen succesvol opgeslagen!')

  } catch (err) {
    error.value = 'Kon instellingen niet opslaan'
    console.error('Error saving system settings:', err)
  } finally {
    saving.value = false
  }
}

// Utility functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Initialize
onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.system-settings {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.system-header {
  margin-bottom: 2rem;
  text-align: center;
}

.system-header h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.system-description {
  color: #666;
  font-size: 0.9rem;
}

.settings-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: #fafafa;
}

.settings-section h4 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.setting-group {
  margin-bottom: 1rem;
}

.setting-group label {
  display: block;
  font-weight: 500;
  color: #555;
  margin-bottom: 0.5rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-control:read-only {
  background-color: #f8f9fa;
  color: #6c757d;
}

.help-text {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #666;
  font-style: italic;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.info-label {
  font-weight: 500;
  color: #555;
}

.info-value {
  color: #333;
  font-family: 'Courier New', monospace;
  background-color: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  font-size: 0.85rem;
}

.settings-footer {
  margin-top: 2rem;
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-success {
  background-color: #28a745;
  color: white;
  font-size: 1.1rem;
  padding: 1rem 2rem;
}

.btn-success:hover:not(:disabled) {
  background-color: #1e7e34;
}

.loading-spinner {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: #666;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
}

@media (max-width: 768px) {
  .system-settings {
    padding: 1rem;
  }

  .collection-grid,
  .info-grid {
    grid-template-columns: 1fr;
  }

  .settings-section {
    padding: 1rem;
  }

  .info-item {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>