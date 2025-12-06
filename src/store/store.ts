import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import programmeReducer from "./slices/programSlice";
import presenterReducer from "./slices/presenterSlice";
import presentationsReducer from "./slices/presentationSlice";
import presenterBiosReducer from "./slices/presenterBioSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    programme: programmeReducer,
    presenter: presenterReducer,
    presentations: presentationsReducer,
    presenterBios: presenterBiosReducer
  },
});

// Infer the RootState & AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
