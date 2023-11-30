import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { UserState } from "api-states";

type InitialType = {
  auth: boolean;
  user?: UserState;
};

const initialState: InitialType = {
  auth: false,
  user: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<InitialType["user"]>) {
      const { payload } = action;
      if (payload) {
        state.auth = true;
        state.user = payload;
      } else {
        state.auth = false;
        state.user = undefined;
      }
    },
    removeAuth(state) {
      state.auth = false;
      state.user = undefined;
    },
  },
});

export const { setAuth, removeAuth } = authSlice.actions;

export default authSlice.reducer;
