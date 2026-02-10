import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreatePatientData {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
}

interface UpdatePatientData extends CreatePatientData {
  id: string;
}

interface PatientState {
  patients: Patient[];
  currentPatient: Patient | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  total: number;
  currentPage: number;
  totalPages: number;
}

const initialState: PatientState = {
  patients: [],
  currentPatient: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  total: 0,
  currentPage: 1,
  totalPages: 0,
};

const getToken = () => {
  const root = localStorage.getItem('persist:root');
  if (!root) return null;

  try {
    const parsedRoot = JSON.parse(root);
    const auth = JSON.parse(parsedRoot.auth);
    return auth.token || null;
  } catch (err) {
    console.error('Token parse error', err);
    return null;
  }
};
const token = getToken();

// Async thunks for API calls
export const fetchPatients = createAsyncThunk(
  'patients/fetchAll',
  async (
    params: { search?: string; page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

     

      if (!token) {
        return rejectWithValue('Auth token missing');
      }

      const response = await fetch(
        `http://localhost:8000/api/patients?${queryParams}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch patients');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const createPatient = createAsyncThunk(
  'patients/create',
  async (patientData: CreatePatientData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8000/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to create patient');
      }

      const data = await response.json();
      return data.patient;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const updatePatient = createAsyncThunk(
  'patients/update',
  async (patientData: UpdatePatientData, { rejectWithValue }) => {
    try {
      const { id, ...updateData } = patientData;
      const response = await fetch(`http://localhost:8000/api/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to update patient');
      }

      const data = await response.json();
      return data.patient;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const deletePatient = createAsyncThunk(
  'patients/delete',
  async (patientId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8000/api/patients/${patientId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to delete patient');
      }

      return patientId;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const fetchPatientById = createAsyncThunk(
  'patients/fetchById',
  async (patientId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8000/api/patients/${patientId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch patient');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearCurrentPatient: (state) => {
      state.currentPatient = null;
    },
    setCurrentPatient: (state, action: PayloadAction<Patient>) => {
      state.currentPatient = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch patients cases
      .addCase(fetchPatients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.patients = action.payload.patients;
        state.total = action.payload.total;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.error = null;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create patient cases
      .addCase(createPatient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.patients.unshift(action.payload);
        state.error = null;
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update patient cases
      .addCase(updatePatient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.patients.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
        if (state.currentPatient?.id === action.payload.id) {
          state.currentPatient = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete patient cases
      .addCase(deletePatient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.patients = state.patients.filter(p => p.id !== action.payload);
        if (state.currentPatient?.id === action.payload) {
          state.currentPatient = null;
        }
        state.error = null;
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch patient by ID cases
      .addCase(fetchPatientById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPatient = action.payload;
        state.error = null;
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSearchQuery, clearCurrentPatient, setCurrentPatient } = patientSlice.actions;
export default patientSlice.reducer;