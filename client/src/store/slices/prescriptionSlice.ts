import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Interfaces matching the backend model
export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface PrescriptionPatient {
  id?: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
}

export interface Diagnosis {
  primaryDiagnosis: string;
  secondaryDiagnosis?: string;
  symptoms: string[];
  duration: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface Lifestyle {
  dietaryAdvice: string[];
  exerciseRecommendations: string[];
  lifestyleModifications: string[];
  followUpInstructions: string;
}

export interface Vitals {
  bloodPressure?: string;
  temperature?: string;
  heartRate?: string;
  weight?: string;
  height?: string;
  bmi?: string;
  oxygenSaturation?: string;
}

export interface Tests {
  orderedTests: string[];
  labResults?: string[];
  imagingResults?: string[];
  testNotes?: string;
}

export interface PrescriptionData {
  patient: PrescriptionPatient;
  diagnosis: Diagnosis;
  lifestyle: Lifestyle;
  vitals: Vitals;
  tests: Tests;
  medications: Medication[];
  notes?: string;
}

export interface Doctor {
  name: string;
  specialization?: string;
  licenseNumber?: string;
}

export interface Prescription extends PrescriptionData {
  id: string;
  prescriptionNumber: string;
  doctorId: string | Doctor; // <--- now can be string or full doctor object
  dateIssued: Date;
  createdAt: Date;
  updatedAt: Date;
}


interface PrescriptionState {
  prescriptions: Prescription[];
  currentPrescription: Prescription | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
}

const initialState: PrescriptionState = {
  prescriptions: [],
  currentPrescription: null,
  isLoading: false,
  error: null,
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
export const fetchPrescriptions = createAsyncThunk(
  'prescriptions/fetchAll',

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
        `http://localhost:8000/api/prescriptions?${queryParams}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || 'Failed to fetch prescriptions'
        );
      }
const data = await response.json();

// Map _id to id for frontend convenience
const prescriptionsWithId = data.prescriptions.map((p: any) => ({
  ...p,
  id: p._id,
}));
console.log('Fetched prescriptions with mapped IDs:', prescriptionsWithId);
return { ...data, prescriptions: prescriptionsWithId };


    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);



export const createPrescription = createAsyncThunk(
  'prescriptions/create',
  async (prescriptionData: PrescriptionData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8000/api/prescriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(prescriptionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to create prescription');
      }

      const data = await response.json();
      return data.prescription;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const updatePrescription = createAsyncThunk(
  'prescriptions/update',
  async (params: { id: string; data: PrescriptionData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8000/api/prescriptions/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(params.data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to update prescription');
      }

      const data = await response.json();
      return data.prescription;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const deletePrescription = createAsyncThunk(
  'prescriptions/delete',
  async (prescriptionId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8000/api/prescriptions/${prescriptionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to delete prescription');
      }

      return prescriptionId;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

export const fetchPrescriptionById = createAsyncThunk(
  'prescriptions/fetchById',
  async (prescriptionId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:8000/api/prescriptions/${prescriptionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch prescription');
      }
      const data = await response.json();
            console.log('Fetch prescription by ID response:', data);

      return data.prescription;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

const prescriptionSlice = createSlice({
  name: 'prescriptions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPrescription: (state) => {
      state.currentPrescription = null;
    },
    setCurrentPrescription: (state, action: PayloadAction<Prescription>) => {
      state.currentPrescription = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch prescriptions cases
      .addCase(fetchPrescriptions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.prescriptions = action.payload.prescriptions;
        state.total = action.payload.total;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.error = null;
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create prescription cases
      .addCase(createPrescription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPrescription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.prescriptions.unshift(action.payload);
        state.error = null;
      })
      .addCase(createPrescription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update prescription cases
      .addCase(updatePrescription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePrescription.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.prescriptions.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.prescriptions[index] = action.payload;
        }
        if (state.currentPrescription?.id === action.payload.id) {
          state.currentPrescription = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePrescription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete prescription cases
      .addCase(deletePrescription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePrescription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.prescriptions = state.prescriptions.filter(p => p.id !== action.payload);
        if (state.currentPrescription?.id === action.payload) {
          state.currentPrescription = null;
        }
        state.error = null;
      })
      .addCase(deletePrescription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch prescription by ID cases
      .addCase(fetchPrescriptionById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPrescriptionById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPrescription = action.payload;
        state.error = null;
      })
      .addCase(fetchPrescriptionById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentPrescription, setCurrentPrescription } = prescriptionSlice.actions;
export default prescriptionSlice.reducer;