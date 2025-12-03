import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import programmeReducer from "./slices/programSlice";
import presenterReducer from "./slices/presenterSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    programme: programmeReducer,
    presenter: presenterReducer,
  },
});

// Infer the RootState & AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
