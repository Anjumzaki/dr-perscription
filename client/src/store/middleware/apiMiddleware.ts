import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit';
import { logout } from '../slices/authSlice';

// API middleware to handle authentication and error responses
const apiMiddleware: Middleware = (store) => (next) => (action) => {
  // Pass the action to the next middleware/reducer
  const result = next(action);

  // Handle authentication errors globally
  if (isRejectedWithValue(action)) {
    const payload = action.payload;
    
    // Check for unauthorized errors
    if (typeof payload === 'string' && payload.includes('Unauthorized')) {
      // Auto logout on unauthorized
      store.dispatch(logout());
    }
    
    // Check for token expiration
    if (typeof payload === 'string' && payload.includes('token')) {
      // Auto logout on token issues
      store.dispatch(logout());
    }
  }

  return result;
};

export default apiMiddleware;