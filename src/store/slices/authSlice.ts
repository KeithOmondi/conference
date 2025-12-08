import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import api from "../../api/axios";

// -------------------------------------------------------------
// TYPES
// -------------------------------------------------------------
export interface User {
  id: string;
  name: string;
  email: string;
  station?: string;
  role: "judge" | "admin";
  img?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  pdfUrl: string | null; // <-- signed PDF URL
  loading: boolean;
  error: string | null;
  users: User[]; // all users for admin dropdown
}

// -------------------------------------------------------------
// LOAD SAVED SESSION
// -------------------------------------------------------------
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  pdfUrl: null,
  loading: false,
  error: null,
  users: [],
};

// -------------------------------------------------------------
// THUNKS
// -------------------------------------------------------------

// LOGIN (PJ only)
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ pj }: { pj: string }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", { pj });
      return res.data; // { message, token, user, pdfUrl }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

// FETCH ALL USERS (Admin only)
export const fetchAllUsers = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/all");

      const mappedUsers: User[] = res.data.users.map((u: any) => ({
        id: u._id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        role: u.role,
      }));

      return mappedUsers;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// -------------------------------------------------------------
// SLICE
// -------------------------------------------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.pdfUrl = action.payload.pdfUrl;

        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.pdfUrl = null;
        state.users = [];

        localStorage.removeItem("user");
        localStorage.removeItem("token");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // FETCH ALL USERS
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllUsers.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.loading = false;
          state.users = action.payload;
        }
      )
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// -------------------------------------------------------------
// SELECTORS
// -------------------------------------------------------------
export const selectAuth = (state: RootState) => state.auth;
export const selectAllUsersState = (state: RootState) => state.auth.users;

// -------------------------------------------------------------
export default authSlice.reducer;
