import { apiClient } from './api';

export const templateApi = {

    /**
     * Get current template information
     */
    async getTemplateInfo() {
        try {
            const response = await apiClient.get('/api/invoices/template/info');
            return response;
        } catch (error) {
            console.error('Error getting template info:', error);
            throw error;
        }
    },

    /**
     * Upload a new template
     * @param formData - Form data containing the file
     */
    async uploadTemplate(formData: FormData) {
        try {
            const response = await apiClient.post('/api/invoices/template', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            console.error('Error uploading template:', error);
            throw error;
        }
    },

    /**
     * Get the current template file for viewing
     */
    async getCurrentTemplate() {
        try {
            const response = await apiClient.get('/api/invoices/template', {
                responseType: 'blob'
            });
            return response;
        } catch (error) {
            console.error('Error getting current template:', error);
            throw error;
        }
    },

    /**
     * Generate a preview PDF with the current template
     */
    async generatePreview() {
        try {
            const response = await apiClient.get('/api/invoices/template/preview', {
                responseType: 'blob'
            });
            return response;
        } catch (error) {
            console.error('Error generating template preview:', error);
            throw error;
        }
    }
};

export default templateApi;