<template>
  <div class="api-debug">
    <h3>🔧 API Debug Panel</h3>
    <p>Gebruik dit panel om te controleren of de API correct werkt</p>

    <div class="debug-section">
      <h4>Basis API Tests</h4>

      <div class="debug-test">
        <button @click="testHealthEndpoint" :disabled="testing" class="debug-btn">
          Test Health Endpoint
        </button>
        <span v-if="healthResult" :class="healthResult.success ? 'success' : 'error'">
          {{ healthResult.message }}
        </span>
      </div>

      <div class="debug-test">
        <button @click="testStudentsEndpoint" :disabled="testing" class="debug-btn">
          Test Students API
        </button>
        <span v-if="studentsResult" :class="studentsResult.success ? 'success' : 'error'">
          {{ studentsResult.message }}
        </span>
      </div>

      <div class="debug-test">
        <button @click="testTemplateInfoEndpoint" :disabled="testing" class="debug-btn">
          Test Template Info API
        </button>
        <span v-if="templateResult" :class="templateResult.success ? 'success' : 'error'">
          {{ templateResult.message }}
        </span>
      </div>

      <div class="debug-test">
        <button @click="testLayoutEndpoint" :disabled="testing" class="debug-btn">
          Test Layout API
        </button>
        <span v-if="layoutResult" :class="layoutResult.success ? 'success' : 'error'">
          {{ layoutResult.message }}
        </span>
      </div>
    </div>

    <div class="debug-section">
      <h4>Connection Info</h4>
      <div class="info-grid">
        <div><strong>Frontend URL:</strong> {{ window.location.origin }}</div>
        <div><strong>API Base URL:</strong> http://localhost:5000</div>
        <div><strong>Backend Status:</strong> <span id="backend-status">Checking...</span></div>
      </div>
    </div>

    <div v-if="testing" class="loading">Testing API endpoints...</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const testing = ref(false)
const healthResult = ref<{success: boolean, message: string} | null>(null)
const studentsResult = ref<{success: boolean, message: string} | null>(null)
const templateResult = ref<{success: boolean, message: string} | null>(null)
const layoutResult = ref<{success: boolean, message: string} | null>(null)

const testHealthEndpoint = async () => {
  testing.value = true
  try {
    const response = await axios.get('/health', { timeout: 5000 })
    healthResult.value = {
      success: true,
      message: `✅ Health check passed - Status: ${response.data.Status}`
    }
  } catch (error: any) {
    healthResult.value = {
      success: false,
      message: `❌ Health check failed - ${error.response?.status || error.message}`
    }
  } finally {
    testing.value = false
  }
}

const testStudentsEndpoint = async () => {
  testing.value = true
  try {
    const response = await axios.get('/api/students', { timeout: 5000 })
    const students = response.data?.data || response.data || []
    studentsResult.value = {
      success: true,
      message: `✅ Students API works - Found ${Array.isArray(students) ? students.length : 0} students`
    }
  } catch (error: any) {
    studentsResult.value = {
      success: false,
      message: `❌ Students API failed - ${error.response?.status || error.message}`
    }
  } finally {
    testing.value = false
  }
}

const testTemplateInfoEndpoint = async () => {
  testing.value = true
  try {
    const response = await axios.get('/api/invoices/template/info', { timeout: 5000 })
    const hasTemplate = response.data?.data?.hasTemplate || response.data?.hasTemplate || false
    templateResult.value = {
      success: true,
      message: `✅ Template API works - Has template: ${hasTemplate}`
    }
  } catch (error: any) {
    templateResult.value = {
      success: false,
      message: `❌ Template API failed - ${error.response?.status || error.message}`
    }
  } finally {
    testing.value = false
  }
}

const testLayoutEndpoint = async () => {
  testing.value = true
  try {
    const response = await axios.get('/api/pdflayout', { timeout: 5000 })
    const settings = response.data?.data || response.data || {}
    layoutResult.value = {
      success: true,
      message: `✅ Layout API works - Has ${Object.keys(settings).length} settings`
    }
  } catch (error: any) {
    layoutResult.value = {
      success: false,
      message: `❌ Layout API failed - ${error.response?.status || error.message}`
    }
  } finally {
    testing.value = false
  }
}
</script>

<style scoped>
.api-debug {
  background: #f8f9fa;
  border: 2px solid #007bff;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
}

.debug-section {
  margin-bottom: 2rem;
}

.debug-section h4 {
  color: #333;
  margin-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 0.5rem;
}

.debug-test {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.debug-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  min-width: 180px;
}

.debug-btn:hover:not(:disabled) {
  background: #0056b3;
}

.debug-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success {
  color: #28a745;
  font-weight: 500;
}

.error {
  color: #dc3545;
  font-weight: 500;
}

.info-grid {
  display: grid;
  gap: 0.5rem;
}

.info-grid div {
  padding: 0.25rem 0;
}

.loading {
  text-align: center;
  color: #007bff;
  font-weight: 500;
  padding: 1rem;
}
</style>