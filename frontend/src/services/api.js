import axios from 'axios'
import { auth } from '../firebase/config'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach Firebase ID token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser
    if (user) {
      try {
        const token = await user.getIdToken()
        config.headers.Authorization = `Bearer ${token}`
      } catch (err) {
        console.error('Failed to get auth token:', err)
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — unwrap data
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.message ||
      'Something went wrong'
    return Promise.reject({ ...error, userMessage: message })
  }
)

export default api