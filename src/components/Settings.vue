<template>
  <div class="settings-container">
    <div class="settings-header">
      <h1>Instellingen</h1>
      <p>Beheer systeem instellingen en PDF configuratie</p>
    </div>

    <!-- Navigation Tabs -->
    <div class="settings-nav">
      <button
          class="nav-tab"
          :class="{ active: activeTab === 'template' }"
          @click="activeTab = 'template'"
      >
        📄 Template Beheer
      </button>
      <button
          class="nav-tab"
          :class="{ active: activeTab === 'layout' }"
          @click="activeTab = 'layout'"
      >
        🎨 PDF Layout
      </button>
      <button
          class="nav-tab"
          :class="{ active: activeTab === 'system' }"
          @click="activeTab = 'system'"
      >
        ⚙️ Systeem
      </button>
    </div>

    <!-- Tab Content -->
    <div class="settings-content">

      <!-- Template Management Tab -->
      <div v-if="activeTab === 'template'" class="tab-content">
        <TemplateManager @template-updated="handleTemplateUpdate" />
      </div>

      <!-- PDF Layout Tab -->
      <div v-if="activeTab === 'layout'" class="tab-content">
        <PdfLayoutEditor
            @saved="handleLayoutSaved"
            @preview-generated="handlePreviewGenerated"
        />
      </div>

      <!-- System Settings Tab -->
      <div v-if="activeTab === 'system'" class="tab-content">
        <SystemSettings @settings-updated="handleSystemUpdate" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PdfLayoutEditor from './PdfLayoutEditor.vue'
import TemplateManager from './TemplateManager.vue'
import SystemSettings from './SystemSettings.vue'

// Reactive data
const activeTab = ref('template')

// Event handlers
const handleTemplateUpdate = (templateInfo) => {
  console.log('Template updated:', templateInfo)
  // Show success notification
  showNotification('Template succesvol bijgewerkt!', 'success')
}

const handleLayoutSaved = (layoutSettings) => {
  console.log('Layout settings saved:', layoutSettings)
  // Show success notification
  showNotification('PDF layout instellingen opgeslagen!', 'success')
}

const handlePreviewGenerated = () => {
  console.log('Preview generated')
  // Show info notification
  showNotification('PDF voorbeeld gegenereerd en gedownload!', 'info')
}

const handleSystemUpdate = (systemSettings) => {
  console.log('System settings updated:', systemSettings)
  // Show success notification
  showNotification('Systeem instellingen bijgewerkt!', 'success')
}

// Simple notification system (you can replace this with a proper toast library)
const showNotification = (message, type = 'success') => {
  // For now, just use alert - in production you'd want a proper toast notification
  alert(message)
}
</script>

<style scoped>
.settings-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.settings-header {
  text-align: center;
  margin-bottom: 2rem;
}

.settings-header h1 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
}

.settings-header p {
  color: #666;
  font-size: 1.1rem;
}

.settings-nav {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e0e0e0;
}

.nav-tab {
  background: none;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  position: relative;
}

.nav-tab:hover {
  color: #007bff;
  background-color: #f8f9fa;
}

.nav-tab.active {
  color: #007bff;
  border-bottom-color: #007bff;
  background-color: #fff;
}

.settings-content {
  min-height: 500px;
}

.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .settings-container {
    padding: 1rem;
  }

  .settings-header h1 {
    font-size: 2rem;
  }

  .settings-nav {
    flex-direction: column;
  }

  .nav-tab {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e0e0e0;
    border-radius: 0;
  }

  .nav-tab.active {
    border-bottom-color: #007bff;
    border-left: 3px solid #007bff;
  }
}

@media (max-width: 480px) {
  .settings-header h1 {
    font-size: 1.75rem;
  }

  .nav-tab {
    font-size: 0.9rem;
    padding: 0.6rem 0.8rem;
  }
}
</style>