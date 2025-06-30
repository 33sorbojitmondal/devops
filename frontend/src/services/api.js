import axios from 'axios'

// Base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message)
    
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access')
    } else if (error.response?.status >= 500) {
      // Handle server errors
      console.error('Server error occurred')
    }
    
    return Promise.reject(error)
  }
)

// Todo API endpoints
export const todoApi = {
  // Get all todos
  getAll: () => api.get('/todos'),
  
  // Get a specific todo by ID
  getById: (id) => api.get(`/todos/${id}`),
  
  // Create a new todo
  create: (todo) => api.post('/todos', todo),
  
  // Update a todo
  update: (id, updates) => api.put(`/todos/${id}`, updates),
  
  // Delete a todo
  delete: (id) => api.delete(`/todos/${id}`),
  
  // Delete all todos (for testing)
  deleteAll: () => api.delete('/todos'),
}

// Health check
export const healthApi = {
  check: () => api.get('/health', { baseURL: API_BASE_URL.replace('/api', '') })
}

export default api 