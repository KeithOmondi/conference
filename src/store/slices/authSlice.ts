import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";

interface User {
  id: string;
  name: string;
  email: string;
  station: string
  role: "judge" | "admin";
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Load from localStorage
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  loading: false,
  error: null,
};

// -----------------------------------------
// LOGIN THUNK
// -----------------------------------------
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    { email, pj }: { email: string; pj: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        { email, pj },
        { withCredentials: true }
      );

      return res.data; // { message, token, user }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// -----------------------------------------
// SLICE
// -----------------------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.user;
        state.token = action.payload.token;

        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
