import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import { loadState, saveState } from "./helper/savetolocal.js";

const persistedState = loadState();

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveState({
    user: store.getState().user,
  });
});
