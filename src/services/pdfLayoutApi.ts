import { apiClient } from './api.ts';

/**
 * Interface representing the structure of a position object.
 * This improves type safety and code readability.
 */
interface ElementPosition {
    x: number;
    y: number;
    // Add other properties if your position object has them, e.g.,
    // width?: number;
    // height?: number;
}

/**
 * Interface for the main layout settings object.
 * This is a good practice for more complex objects.
 */
interface LayoutSettings {
    [key: string]: any; // A simple way to represent various settings
    // A more precise approach would be to define each property:
    // header: ElementPosition;
    // signature: ElementPosition;
    // etc.
}


export const pdfLayoutApi = {

    /**
     * Get current PDF layout settings
     */
    async getLayoutSettings() {
        try {
            const response = await apiClient.get('/api/invoices/settings/layout');
            return response;
        } catch (error) {
            console.error('Error getting layout settings:', error);
            throw error;
        }
    },

    /**
     * Update PDF layout settings
     * @param layoutSettings - The layout settings object
     */
    async updateLayoutSettings(layoutSettings: LayoutSettings) {
        try {
            const response = await apiClient.put('/api/invoices/settings/layout', layoutSettings);
            return response;
        } catch (error) {
            console.error('Error updating layout settings:', error);
            throw error;
        }
    },

    /**
     * Reset layout settings to defaults
     */
    async resetToDefaults() {
        try {
            const response = await apiClient.post('/api/invoices/settings/layout/reset');
            return response;
        } catch (error) {
            console.error('Error resetting layout settings:', error);
            throw error;
        }
    },

    /**
     * Generate PDF preview with current or provided layout settings
     * @param layoutSettings - Optional layout settings to preview
     */
    async generatePreview(layoutSettings: LayoutSettings | null = null) {
        try {
            const response = await apiClient.post(
                '/api/invoices/settings/layout/preview',
                layoutSettings,
                {
                    responseType: 'blob' // Important for PDF download
                }
            );
            return response;
        } catch (error) {
            console.error('Error generating preview:', error);
            throw error;
        }
    },

    /**
     * Update a single element's position
     * @param elementName - Name of the element to update
     * @param position - New position settings
     */
    async updateElementPosition(elementName: string, position: ElementPosition) {
        try {
            const response = await apiClient.put(`/api/pdflayout/element/${elementName}`, position);
            return response;
        } catch (error) {
            console.error('Error updating element position:', error);
            throw error;
        }
    },

    /**
     * Get available PDF elements and their descriptions
     */
    async getAvailableElements() {
        try {
            const response = await apiClient.get('/api/pdflayout/elements');
            return response;
        } catch (error) {
            console.error('Error getting available elements:', error);
            throw error;
        }
    },

    /**
     * Get default layout settings (without saving them)
     */
    async getDefaultSettings() {
        try {
            const response = await apiClient.get('/api/pdflayout/defaults');
            return response;
        } catch (error) {
            console.error('Error getting default settings:', error);
            throw error;
        }
    }
};

// Export as both named and default
export default pdfLayoutApi;