import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  balance: 0,
  exposure: 0,
  isAuthenticated: false,
  loading: true,
  showModal: false,
  bannerDetails: {},
  transactionPassword: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, user, balance, exposure, bannerDetails } = action.payload;
      state.token = token;
      state.user = user;
      state.balance = balance;
      state.exposure = exposure;
      state.bannerDetails = bannerDetails || {};
      state.isAuthenticated = true;
      state.loading = false;
      state.showModal = true; // Show banner popup after login
    },
    logout: (state) => {
      
      state.token = null;
      state.user = null;
      state.balance = 0;
      state.exposure = 0;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    setExposure: (state, action) => {
      state.exposure = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPasswordChanged: (state) => {
      if (state.user) {
        state.user.ch_pas = 0; // 0 means password has been changed
      }
    },
    setTransactionPasswordChanged: (state) => {
      if (state.user) {
        state.user.isTrPassChange = 0; // 0 means transaction password has been changed
      }
    },
    setShowModal: (state, action) => {
      state.showModal = action.payload;
    },
    setBannerDetails: (state, action) => {
      state.bannerDetails = action.payload;
    },
    setTransactionPassword: (state, action) => {
      state.transactionPassword = action.payload;
    },
    resetUserState: () => initialState,
  },
});

export const {
  loginSuccess,
  logout,
  setBalance,
  setExposure,
  setLoading,
  setPasswordChanged,
  setTransactionPasswordChanged,
  setShowModal,
  setBannerDetails,
  setTransactionPassword,
  resetUserState,
} = userSlice.actions;

export default userSlice.reducer;
