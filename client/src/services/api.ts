import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - logout user
      store.dispatch(logout());
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // Auth endpoints
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiClient.post('/auth/login', credentials),
    
    register: (userData: {
      name: string;
      email: string;
      password: string;
      phone: string;
      role: string;
      licenseNumber?: string;
      specialization?: string;
    }) => apiClient.post('/auth/register', userData),
    
    verifyEmail: (token: string) =>
      apiClient.get(`/auth/verify-email?token=${token}`),
    
    resendVerificationEmail: (email: string) =>
      apiClient.post('/auth/resend-verification', { email }),
  },
  
  // Prescription endpoints
  prescriptions: {
    getAll: (params?: { page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      
      return apiClient.get(`/prescriptions?${queryParams}`);
    },
    
    getById: (id: string) => apiClient.get(`/prescriptions/${id}`),
    
    getSavedDiagnoses: () => apiClient.get('/prescriptions/saved-diagnoses'),
    
    getSavedSymptoms: () => apiClient.get('/prescriptions/saved-symptoms'),
    
    getSavedTests: () => apiClient.get('/prescriptions/saved-tests'),
    
    getSavedMedicines: () => apiClient.get('/prescriptions/saved-medicines'),
    
    create: (prescriptionData: {
      patient: {
        id?: string;
        name: string;
        age: number;
        gender: 'male' | 'female' | 'other';
        phone: string;
        email?: string;
        address?: string;
        emergencyContact?: string;
      };
      diagnosis: {
        primaryDiagnosis: string;
        secondaryDiagnosis?: string;
        symptoms: string[];
        duration: string;
        severity: 'mild' | 'moderate' | 'severe';
        notes?: string;
      };
      lifestyle: {
        dietaryAdvice: string[];
        exerciseRecommendations: string[];
        lifestyleModifications: string[];
        followUpInstructions: string;
      };
      vitals: {
        bloodPressure?: string;
        temperature?: string;
        heartRate?: string;
        weight?: string;
        height?: string;
        bmi?: string;
        oxygenSaturation?: string;
      };
      tests: {
        orderedTests: string[];
        labResults?: string[];
        imagingResults?: string[];
        testNotes?: string;
      };
      medications: {
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
        instructions?: string;
      }[];
      notes?: string;
    }) => apiClient.post('/prescriptions', prescriptionData),
    
    update: (id: string, prescriptionData: any) =>
      apiClient.put(`/prescriptions/${id}`, prescriptionData),
    
    delete: (id: string) => apiClient.delete(`/prescriptions/${id}`),
  },

  // Patient endpoints
  patients: {
    getAll: (params?: { search?: string; page?: number; limit?: number }) => {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      
      return apiClient.get(`/patients?${queryParams}`);
    },
    
    getById: (id: string) => apiClient.get(`/patients/${id}`),
    
    create: (patientData: {
      name: string;
      age: number;
      gender: 'male' | 'female' | 'other';
      phone: string;
      email?: string;
      address?: string;
      emergencyContact?: string;
    }) => apiClient.post('/patients', patientData),
    
    update: (id: string, patientData: {
      name: string;
      age: number;
      gender: 'male' | 'female' | 'other';
      phone: string;
      email?: string;
      address?: string;
      emergencyContact?: string;
    }) => apiClient.put(`/patients/${id}`, patientData),
    
    delete: (id: string) => apiClient.delete(`/patients/${id}`),
  },
  
  // Generic methods for other endpoints
  get: (url: string) => apiClient.get(url),
  post: (url: string, data?: any) => apiClient.post(url, data),
  put: (url: string, data?: any) => apiClient.put(url, data),
  delete: (url: string) => apiClient.delete(url),
};

export default apiClient;