// services/api/pdfLayoutApi.js
import { apiClient } from './apiClient'

export const pdfLayoutApi = {

    /**
     * Get current PDF layout settings
     */
    async getLayoutSettings() {
        try {
            const response = await apiClient.get('/api/invoices/settings/layout')
            return response
        } catch (error) {
            console.error('Error getting layout settings:', error)
            throw error
        }
    },

    /**
     * Update PDF layout settings
     * @param {Object} layoutSettings - The layout settings object
     */
    async updateLayoutSettings(layoutSettings) {
        try {
            const response = await apiClient.put('/api/invoices/settings/layout', layoutSettings)
            return response
        } catch (error) {
            console.error('Error updating layout settings:', error)
            throw error
        }
    },

    /**
     * Reset layout settings to defaults
     */
    async resetToDefaults() {
        try {
            const response = await apiClient.post('/api/invoices/settings/layout/reset')
            return response
        } catch (error) {
            console.error('Error resetting layout settings:', error)
            throw error
        }
    },

    /**
     * Generate PDF preview with current or provided layout settings
     * @param {Object} layoutSettings - Optional layout settings to preview
     */
    async generatePreview(layoutSettings = null) {
        try {
            const response = await apiClient.post(
                '/api/invoices/settings/layout/preview',
                layoutSettings,
                {
                    responseType: 'blob' // Important for PDF download
                }
            )
            return response
        } catch (error) {
            console.error('Error generating preview:', error)
            throw error
        }
    },

    /**
     * Update a single element's position
     * @param {string} elementName - Name of the element to update
     * @param {Object} position - New position settings
     */
    async updateElementPosition(elementName, position) {
        try {
            const response = await apiClient.put(`/api/pdflayout/element/${elementName}`, position)
            return response
        } catch (error) {
            console.error('Error updating element position:', error)
            throw error
        }
    },

    /**
     * Get available PDF elements and their descriptions
     */
    async getAvailableElements() {
        try {
            const response = await apiClient.get('/api/pdflayout/elements')
            return response
        } catch (error) {
            console.error('Error getting available elements:', error)
            throw error
        }
    },

    /**
     * Get default layout settings (without saving them)
     */
    async getDefaultSettings() {
        try {
            const response = await apiClient.get('/api/pdflayout/defaults')
            return response
        } catch (error) {
            console.error('Error getting default settings:', error)
            throw error
        }
    }
}

// Export as both named and default
export default pdfLayoutApi