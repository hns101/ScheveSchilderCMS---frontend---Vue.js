<template>
  <div class="pdf-element-editor">
    <h5 class="element-label">{{ label }}</h5>

    <div class="element-controls">
      <!-- Position Controls -->
      <div class="control-row">
        <div class="control-group">
          <label for="top">Bovenkant (px)</label>
          <input
              id="top"
              type="number"
              :value="modelValue.top"
              @input="updateValue('top', $event.target.value)"
              min="0"
              max="1000"
              class="form-control"
          />
        </div>

        <div class="control-group">
          <label for="left">Links (px)</label>
          <input
              id="left"
              type="number"
              :value="modelValue.left"
              @input="updateValue('left', $event.target.value)"
              min="0"
              max="1000"
              class="form-control"
          />
        </div>
      </div>

      <!-- Typography Controls -->
      <div class="control-row">
        <div class="control-group">
          <label for="fontSize">Lettergrootte</label>
          <input
              id="fontSize"
              type="number"
              :value="modelValue.fontSize"
              @input="updateValue('fontSize', $event.target.value)"
              min="6"
              max="30"
              class="form-control"
          />
        </div>

        <div class="control-group">
          <label for="maxHeight">Max Hoogte (px)</label>
          <input
              id="maxHeight"
              type="number"
              :value="modelValue.maxHeight"
              @input="updateValue('maxHeight', $event.target.value)"
              min="10"
              max="100"
              class="form-control"
          />
        </div>
      </div>

      <!-- Style Controls -->
      <div class="control-row">
        <div class="control-group">
          <label for="textAlign">Uitlijning</label>
          <select
              id="textAlign"
              :value="modelValue.textAlign"
              @change="updateValue('textAlign', $event.target.value)"
              class="form-control"
          >
            <option value="Left">Links</option>
            <option value="Center">Midden</option>
            <option value="Right">Rechts</option>
          </select>
        </div>

        <div class="control-group checkbox-group">
          <label class="checkbox-label">
            <input
                type="checkbox"
                :checked="modelValue.isBold"
                @change="updateValue('isBold', $event.target.checked)"
            />
            <span class="checkmark"></span>
            Vetgedrukt
          </label>
        </div>
      </div>
    </div>

    <!-- Live Preview -->
    <div class="element-preview">
      <div
          class="preview-text"
          :style="previewStyle"
      >
        {{ getPreviewText() }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    validator: (value) => {
      return value &&
          typeof value.top === 'number' &&
          typeof value.left === 'number' &&
          typeof value.fontSize === 'number' &&
          typeof value.maxHeight === 'number' &&
          typeof value.isBold === 'boolean' &&
          typeof value.textAlign === 'string'
    }
  },
  label: {
    type: String,
    required: true
  },
  elementKey: {
    type: String,
    required: true
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Update value method
const updateValue = (property, value) => {
  const updatedValue = { ...props.modelValue }

  // Convert numeric strings to numbers
  if (['top', 'left', 'fontSize', 'maxHeight'].includes(property)) {
    updatedValue[property] = parseInt(value, 10) || 0
  } else {
    updatedValue[property] = value
  }

  emit('update:modelValue', updatedValue)
}

// Computed style for preview
const previewStyle = computed(() => ({
  fontSize: `${props.modelValue.fontSize}px`,
  fontWeight: props.modelValue.isBold ? 'bold' : 'normal',
  textAlign: props.modelValue.textAlign.toLowerCase(),
  maxHeight: `${props.modelValue.maxHeight}px`,
  overflow: 'hidden'
}))

// Get preview text based on element type
const getPreviewText = () => {
  const previewTexts = {
    studentName: 'Jan de Vries',
    studentAddress: 'Voorbeeldstraat 123, 1234 AB Amsterdam',
    invoiceId: 'INV-2023-001',
    invoiceDate: '15-03-2023',
    invoiceDescription: 'Schilderlessen maart 2023 - Dit is een voorbeeldtekst',
    baseAmount: '€103.31',
    vatAmount: '€21.69',
    totalAmount: '€125.00',
    paymentNote: 'Dit bedrag wordt automatisch geïncasseerd omstreeks 15-04-2023.',
    contactInfo: 'Contact: info@scheveschilder.nl'
  }

  return previewTexts[props.elementKey] || props.label
}
</script>

<style scoped>
.pdf-element-editor {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  background-color: #fafafa;
}

.element-label {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 600;
}

.element-controls {
  margin-bottom: 1rem;
}

.control-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.control-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.control-group label {
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.form-control {
  padding: 0.5rem;
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

.checkbox-group {
  justify-content: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: #555;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 0.5rem;
}

.checkmark {
  margin-left: 0.25rem;
}

.element-preview {
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  min-height: 60px;
  position: relative;
}

.preview-text {
  background-color: #f8f9fa;
  padding: 0.5rem;
  border-radius: 3px;
  border: 1px dashed #007bff;
  min-height: 20px;
  word-wrap: break-word;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .control-row {
    flex-direction: column;
    gap: 0.5rem;
  }

  .pdf-element-editor {
    padding: 0.75rem;
  }

  .element-label {
    font-size: 0.9rem;
  }
}
</style>