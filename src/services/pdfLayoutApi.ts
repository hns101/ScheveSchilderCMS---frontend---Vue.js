import { apiClient } from './api';

/**
 * Interface representing the structure of a position object.
 */
interface ElementPosition {
    top: number;
    left: number;
    fontSize: number;
    maxHeight: number;
    isBold: boolean;
    textAlign: string;
}

/**
 * Interface for the main layout settings object.
 */
interface LayoutSettings {
    studentName: ElementPosition;
    studentAddress: ElementPosition;
    invoiceId: ElementPosition;
    invoiceDate: ElementPosition;
    invoiceDescription: ElementPosition;
    baseAmount: ElementPosition;
    vatAmount: ElementPosition;
    totalAmount: ElementPosition;
    paymentNote: ElementPosition;
    contactInfo: ElementPosition;
}

export const pdfLayoutApi = {

    /**
     * Get current PDF layout settings
     */
    async getLayoutSettings() {
        try {
            const response = await apiClient.get('/api/pdflayout');
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
            const response = await apiClient.put('/api/pdflayout', layoutSettings);
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
            const response = await apiClient.post('/api/pdflayout/reset');
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
            if (layoutSettings) {
                const response = await apiClient.post(
                    '/api/pdflayout/preview',
                    { layoutSettings },
                    {
                        responseType: 'blob' // Important for PDF download
                    }
                );
                return response;
            } else {
                const response = await apiClient.get(
                    '/api/pdflayout/preview',
                    {
                        responseType: 'blob' // Important for PDF download
                    }
                );
                return response;
            }
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