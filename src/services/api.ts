// src/services/api.ts
import axios from 'axios';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:5000';

// Add response interceptor to handle ApiResponse<T> format
axios.interceptors.response.use(
    (response) => {
        // If response has the ApiResponse format with success and data properties
        if (response.data && typeof response.data === 'object' && 'success' in response.data) {
            if (response.data.success) {
                // Return the actual data from ApiResponse
                return { ...response, data: response.data.data };
            } else {
                // Handle API error responses
                const error = new Error(response.data.message || 'API Error');
                (error as any).response = response;
                throw error;
            }
        }
        // Return response as-is for non-API responses (like file downloads)
        return response;
    },
    (error) => {
        // Handle network errors or other axios errors
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default axios;