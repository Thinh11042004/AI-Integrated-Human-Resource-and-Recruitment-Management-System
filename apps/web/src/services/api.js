import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// API functions
export const hrApi = {
  // Employee endpoints
  getEmployees: () => api.get('/employees'),
  getEmployeeById: (id) => api.get(`/employees/${id}`),
  getEmployeePerformance: (id) => api.get(`/employees/${id}/performance`),

  // Candidate endpoints
  getCandidates: () => api.get('/candidates'),

  // Job endpoints
  getJobs: () => api.get('/jobs'),

  // Interview endpoints
  getInterviews: () => api.get('/interviews'),

  // Analytics endpoints
  getAnalytics: () => api.get('/analytics'),

  // AI endpoints
  getWorkforceInsight: () => api.get('/ai/insights'),
  summarizeCandidate: (data) => api.post('/ai/candidate-summary', data),
  matchCandidateToJob: (data) => api.post('/ai/match', data),
  generateInterviewFeedback: (data) => api.post('/ai/interview-feedback', data),
}

export default api
