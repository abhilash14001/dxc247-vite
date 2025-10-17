import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboardStats: {
    totalUsers: 0,
    totalBets: 0,
    totalRevenue: 0,
    activeBets: 0,
  },
  users: [],
  bets: [],
  reports: {},
  logo: null,
  isLoading: false,
  error: null,
  // Game names state - separate for different game types
  gameNames: {
    all: {},
    casino: {},
    sports: {}
  },
  gameNamesLoading: {
    all: false,
    casino: false,
    sports: false
  },
  gameNamesError: {
    all: null,
    casino: null,
    sports: null
  },
  // Auth state
  token: null,
  user: null,
  tokenExpiresAt: null,
  tokenExpiresInMinutes: null,
  isAuthenticated: false,
  loading: true,
  
  // Match data for fancy history
  selectedMatchData: null,
  
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setDashboardStats: (state, action) => {
      state.dashboardStats = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setBets: (state, action) => {
      state.bets = action.payload;
    },
    setReports: (state, action) => {
      state.reports = action.payload;
    },
    setLogo: (state, action) => {
      state.logo = action.payload;
    },
    updateLogo: (state, action) => {
      state.logo = { ...state.logo, ...action.payload };
    },
    setGeneralLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    // Game names reducers
    setGameNames: (state, action) => {
      const { gameType, gameNames } = action.payload;
      // Ensure the nested structure exists
      if (!state.gameNames) state.gameNames = {};
      if (!state.gameNamesLoading) state.gameNamesLoading = {};
      if (!state.gameNamesError) state.gameNamesError = {};
      
      state.gameNames[gameType] = gameNames;
      state.gameNamesLoading[gameType] = false;
      state.gameNamesError[gameType] = null;
    },
    setGameNamesLoading: (state, action) => {
      const { gameType, loading } = action.payload;
      // Ensure the nested structure exists
      if (!state.gameNamesLoading) state.gameNamesLoading = {};
      
      state.gameNamesLoading[gameType] = loading;
    },
    setGameNamesError: (state, action) => {
      const { gameType, error } = action.payload;
      // Ensure the nested structure exists
      if (!state.gameNamesError) state.gameNamesError = {};
      if (!state.gameNamesLoading) state.gameNamesLoading = {};
      
      state.gameNamesError[gameType] = error;
      state.gameNamesLoading[gameType] = false;
    },
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      state.loading = false;
      
      if (user.token_expires_at) {
        state.tokenExpiresAt = new Date(user.token_expires_at).getTime();
      }
      
      if (user.token_expires_in_minutes) {
        state.tokenExpiresInMinutes = user.token_expires_in_minutes;
      }
    },
    logout: (state) => {
      // Reset all state to initial values
      state.dashboardStats = {
        totalUsers: 0,
        totalBets: 0,
        totalRevenue: 0,
        activeBets: 0,
      };
      state.users = [];
      state.bets = [];
      state.reports = {};
      state.logo = null;
      state.isLoading = false;
      state.error = null;
      
      // Reset game names state
      state.gameNames = {
        all: {},
        casino: {},
        sports: {}
      };
      state.gameNamesLoading = {
        all: false,
        casino: false,
        sports: false
      };
      state.gameNamesError = {
        all: null,
        casino: null,
        sports: null
      };
      
      // Reset auth state
      state.token = null;
      state.user = null;
      state.tokenExpiresAt = null;
      state.tokenExpiresInMinutes = null;
      state.isAuthenticated = false;
      state.loading = false;
      
      // Reset match data
      state.selectedMatchData = null;
      
      // Clear admin-specific localStorage items
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_balance');
        localStorage.removeItem('admin_exposure');
        localStorage.removeItem('admin_isLoggedIn');
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_theme');
      }
    },

    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPasswordChanged: (state) => {
      if (state.user) {
        state.user.change_password = 0; // 0 means password has been changed
      }
    },
    setTransactionPasswordChanged: (state) => {
      if (state.user) {
        state.user.change_transaction_password = 0; // 0 means transaction password has been changed
      }
    },
    setSelectedMatchData: (state, action) => {
      state.selectedMatchData = action.payload;
    },
    clearSelectedMatchData: (state) => {
      state.selectedMatchData = null;
    },
    resetAdminState: () => initialState,
  },
});

export const {
  setDashboardStats,
  setUsers,
  setBets,
  setReports,
  setLogo,
  updateLogo,
  setGeneralLoading,
  setAuthLoading,
  setError,
  setGameNames,
  setGameNamesLoading,
  setGameNamesError,
  setPasswordChanged,
  setTransactionPasswordChanged,
  setSelectedMatchData,
  clearSelectedMatchData,
  resetAdminState,
  loginSuccess,
  logout
} = adminSlice.actions;

export default adminSlice.reducer;
