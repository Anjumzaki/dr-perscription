// src/store/slices/appointmentSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface CreateAppointmentData {
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface UpdateAppointmentData extends CreateAppointmentData {
  id: string;
}

interface AppointmentState {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  total: number;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
}

const initialState: AppointmentState = {
  appointments: [],
  isLoading: false,
  error: null,
  total: 0,
  searchQuery: '',
  currentPage: 1,
  totalPages: 0,
};

// Get token from localStorage like patient slice
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
// Fetch appointments
interface FetchAppointmentsParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAll',
  async (params: FetchAppointmentsParams = {}, { rejectWithValue }) => {
    try {
      const token = getToken();
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      if (!token) return rejectWithValue('Auth token missing');

      const response = await fetch(`http://localhost:8000/api/appointments?${queryParams}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch appointments');
      }

      const data = await response.json();
      
      return {
        appointments: data.appointments,
        total: data.total,
        currentPage: data.page || 1,
        totalPages: data.totalPages || 1,
      };
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Create appointment
export const createAppointment = createAsyncThunk(
  'appointments/create',
  async (appointmentData: CreateAppointmentData, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue('Auth token missing');

      const response = await fetch(`http://localhost:8000/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to create appointment');
      }

      const data = await response.json();
      return data.appointment;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Update appointment
export const updateAppointment = createAsyncThunk(
  'appointments/update',
  async (appointmentData: UpdateAppointmentData, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue('Auth token missing');

      const { id, ...updateData } = appointmentData;
      console.log('Updating appointment with ID:', id, 'and data:', updateData);
      const response = await fetch(`http://localhost:8000/api/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to update appointment');
      }

      const data = await response.json();
      return data.appointment;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Delete appointment
export const deleteAppointment = createAsyncThunk(
  'appointments/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) return rejectWithValue('Auth token missing');

      const response = await fetch(`http://localhost:8000/api/appointments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to delete appointment');
      }

      return id;
    } catch (error) {
      return rejectWithValue('Network error occurred');
    }
  }
);

// Appointment slice
const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchAppointments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = action.payload.appointments;
        state.total = action.payload.total;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createAppointment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateAppointment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
     .addCase(updateAppointment.fulfilled, (state, action) => {
  state.isLoading = false;
  const index = state.appointments.findIndex(a => a.id === action.payload.id); // <-- must match 'id'
  if (index !== -1) {
    state.appointments[index] = action.payload;
  }
})
      .addCase(updateAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete
      .addCase(deleteAppointment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = state.appointments.filter((a) => a.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchQuery, clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;
