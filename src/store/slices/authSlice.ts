import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";

interface User {
id: string;
name: string;
email: string;
station?: string;
role: "judge" | "admin";
}

interface AuthState {
user: User | null;
token: string | null;
loading: boolean;
error: string | null;
}

// Load saved session
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

const initialState: AuthState = {
user: storedUser ? JSON.parse(storedUser) : null,
token: storedToken || null,
loading: false,
error: null,
};

// ------------------------------------------------------
// LOGIN (PJ ONLY)
// ------------------------------------------------------
export const loginUser = createAsyncThunk(
"auth/loginUser",
async ({ pj }: { pj: string }, { rejectWithValue }) => {
try {
const res = await axios.post(
"https://conference1.onrender.com/api/v1/auth/login",
{ pj },
{ withCredentials: true }
);
return res.data; // { message, token, user }
} catch (error: any) {
return rejectWithValue(error.response?.data?.message || "Login failed");
}
}
);

// ------------------------------------------------------
// LOGOUT
// ------------------------------------------------------
export const logoutUser = createAsyncThunk(
"auth/logoutUser",
async (_, { rejectWithValue }) => {
try {
await axios.post("https://conference1.onrender.com/api/v1/auth/logout", {}, { withCredentials: true });
// no need to return anything
} catch (error: any) {
return rejectWithValue(error.response?.data?.message || "Logout failed");
}
}
);

// ------------------------------------------------------
// SLICE
// ------------------------------------------------------
const authSlice = createSlice({
name: "auth",
initialState,
reducers: {},
extraReducers: (builder) => {
builder
// LOGIN: pending
.addCase(loginUser.pending, (state) => {
state.loading = true;
state.error = null;
})
// LOGIN: fulfilled
.addCase(loginUser.fulfilled, (state, action) => {
state.loading = false;
state.user = action.payload.user;
state.token = action.payload.token;


    localStorage.setItem("user", JSON.stringify(action.payload.user));
    localStorage.setItem("token", action.payload.token);
  })
  // LOGIN: rejected
  .addCase(loginUser.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  })
  // LOGOUT: pending
  .addCase(logoutUser.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  // LOGOUT: fulfilled
  .addCase(logoutUser.fulfilled, (state) => {
    state.loading = false;
    state.user = null;
    state.token = null;

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  })
  // LOGOUT: rejected
  .addCase(logoutUser.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  });


},
});

// Selectors
export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
