// services/api/index.js - Main API exports
import axios from 'axios'

// Create the main API client
export const apiClient = axios.create({
    baseURL: 'http://localhost:5000', // Your ASP.NET Core API URL
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 30000 // 30 seconds timeout
})

// Request interceptor for adding auth tokens if needed
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // Handle common HTTP errors
        if (error.response?.status === 401) {
            // Unauthorized - redirect to login or refresh token
            console.warn('Unauthorized access - consider redirecting to login')
        } else if (error.response?.status === 403) {
            // Forbidden
            console.warn('Forbidden access')
        } else if (error.response?.status >= 500) {
            // Server errors
            console.error('Server error:', error.response?.data)
        }

        return Promise.reject(error)
    }
)

// Import and export all API services
export { pdfLayoutApi } from './pdfLayoutApi'
export { templateApi } from './templateApi'

// You can also export other API services here as you create them
// export { studentApi } from './studentApi'
// export { invoiceApi } from './invoiceApi'
// export { systemApi } from './systemApi'

export default apiClient