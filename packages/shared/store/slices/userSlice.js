import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  balance: 0,
  exposure: 0,
  casinoList: [],
  cricketList: [],
  isAuthenticated: false,
  loading: true,
  showModal: false,
  bannerDetails: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, user, balance, exposure, casinoList, cricketList, bannerDetails } = action.payload;
      state.token = token;
      state.user = user;
      state.balance = balance;
      state.exposure = exposure;
      state.casinoList = casinoList;
      state.cricketList = cricketList;
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
      state.casinoList = [];
      state.cricketList = [];
      state.isAuthenticated = false;
      state.loading = false;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    setExposure: (state, action) => {
      state.exposure = action.payload;
    },
    setCasinoList: (state, action) => {
      state.casinoList = action.payload;
    },
    setCricketList: (state, action) => {
      state.cricketList = action.payload;
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
    resetUserState: () => initialState,
  },
});

export const {
  loginSuccess,
  logout,
  setBalance,
  setExposure,
  setCasinoList,
  setCricketList,
  setLoading,
  setPasswordChanged,
  setTransactionPasswordChanged,
  setShowModal,
  setBannerDetails,
  resetUserState,
} = userSlice.actions;

export default userSlice.reducer;
