import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "user",
  initialState: {
    loggedIn: false,
    user: null,
    terceroUser: null,
    currentPortfolio: null,
    profileDetail: null,
    clientOverview: null,
    portfolioOptions: [],
  },
  reducers: {
    loginUser(state, action) {
      state.loggedIn = true;
      state.user = action.payload.user;
      state.profileInfo = action.payload.profileInfo;
      state.beneficiaries = action.payload.beneficiaries;
    },
    terceroData(state, action) {
      state.terceroUser = action.payload;
    },
    currentPortfolio(state, action) {
      state.currentPortfolio = action.payload;
    },
    portfolioOptions(state, action) {
      state.portfolioOptions = action.payload;
    },
    clientOverview(state, action) {
      state.clientOverview = action.payload;
    },
    logoutUser(state) {
      state.loggedIn = false;
      state.user = null;
      state.terceroUser = null;
      state.currentPortfolio = null;
      state.profileDetail = null;
      state.clientOverview = null;
      state.portfolioOptions = [];
    },
  },
});

export const {
  loginUser,
  logoutUser,
  currentPortfolio,
  clientOverview,
  terceroData,
  portfolioOptions,
} = authSlice.actions;

export default authSlice.reducer;
