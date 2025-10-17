import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApiMethods } from '../../utils/adminApi';

// Async thunk for password verification
export const verifyAdminPassword = createAsyncThunk(
  'adminPassword/verifyPassword',
  async (password, { rejectWithValue }) => {
    try {
      const response = await adminApiMethods.verifySettingsPassword(password);
      
      if (response.success && response.is_correct) {
        return {
          success: true,
          message: response.message || 'Password verified successfully',
          timestamp: Date.now()
        };
      } else {
        return rejectWithValue(response.message || 'Invalid password');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Failed to verify password. Please try again.');
    }
  }
);

const initialState = {
  isVerified: false,
  verificationTime: null,
  showModal: false,
  pendingRoute: null,
  loading: false,
  error: null,
  password: '',
  sessionId: null,
  isDirectAccess: false
};

const adminPasswordSlice = createSlice({
  name: 'adminPassword',
  initialState,
  reducers: {
    showPasswordModal: (state, action) => {
      state.showModal = true;
      state.pendingRoute = action.payload;
      state.password = '';
      state.error = null;
    },
    hidePasswordModal: (state) => {
      state.showModal = false;
      state.pendingRoute = null;
      state.password = '';
      state.error = null;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setVerified: (state, action) => {
      state.isVerified = action.payload;
      if (action.payload) {
        state.verificationTime = Date.now();
        state.sessionId = `admin_verified_${Date.now()}`;
      } else {
        state.verificationTime = null;
        state.sessionId = null;
      }
    },
    clearVerification: (state) => {
      state.isVerified = false;
      state.verificationTime = null;
      state.sessionId = null;
      state.showModal = false;
      state.pendingRoute = null;
      state.password = '';
      state.error = null;
    },
    resetOnLogout: (state) => {
      // Reset all verification state when admin logs out
      state.isVerified = false;
      state.verificationTime = null;
      state.sessionId = null;
      state.showModal = false;
      state.pendingRoute = null;
      state.password = '';
      state.error = null;
    },
    checkVerificationExpiry: (state) => {
      // Check if verification is older than 30 minutes (1800000 ms)
      const thirtyMinutes = 30 * 60 * 1000;
      if (state.verificationTime && (Date.now() - state.verificationTime) > thirtyMinutes) {
        state.isVerified = false;
        state.verificationTime = null;
        state.sessionId = null;
      }
    },
    setDirectAccess: (state, action) => {
      state.isDirectAccess = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyAdminPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyAdminPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.isVerified = true;
        state.verificationTime = action.payload.timestamp;
        state.sessionId = `admin_verified_${action.payload.timestamp}`;
        state.showModal = false;
        state.pendingRoute = null;
        state.password = '';
        state.error = null;
      })
      .addCase(verifyAdminPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase('admin/logout', (state) => {
        // Reset password verification when admin logs out
        state.isVerified = false;
        state.verificationTime = null;
        state.sessionId = null;
        state.showModal = false;
        state.pendingRoute = null;
        state.password = '';
        state.error = null;
      });
  }
});

export const {
  showPasswordModal,
  hidePasswordModal,
  setPassword,
  clearError,
  setVerified,
  clearVerification,
  resetOnLogout,
  checkVerificationExpiry,
  setDirectAccess
} = adminPasswordSlice.actions;

// Selectors
export const selectAdminPassword = (state) => state.adminPassword;
export const selectIsVerified = (state) => state.adminPassword.isVerified;
export const selectShowModal = (state) => state.adminPassword.showModal;
export const selectPendingRoute = (state) => state.adminPassword.pendingRoute;
export const selectPassword = (state) => state.adminPassword.password;
export const selectLoading = (state) => state.adminPassword.loading;
export const selectError = (state) => state.adminPassword.error;
export const selectVerificationTime = (state) => state.adminPassword.verificationTime;
export const selectIsDirectAccess = (state) => state.adminPassword.isDirectAccess;

export default adminPasswordSlice.reducer;
