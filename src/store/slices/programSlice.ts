import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "../../api/axios";
import type { RootState } from "../store";

// -------------------- TYPES --------------------

export interface ProgrammeItem {
  time: string;
  activity: string;
  facilitator: string;
}

export interface ProgrammeDay {
  _id: string;
  day: string;
  date: string;
  items: ProgrammeItem[];
}

interface ProgrammeState {
  data: ProgrammeDay[];
  loading: boolean;
  error: string | null;
}

// -------------------- INITIAL STATE --------------------

const initialState: ProgrammeState = {
  data: [],
  loading: false,
  error: null,
};

// -------------------- ASYNC THUNKS --------------------

// Get all programme days
export const fetchProgramme = createAsyncThunk<
  ProgrammeDay[],
  void,
  { rejectValue: string }
>("programme/fetchProgramme", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/programs/get");
    return res.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to fetch programme");
  }
});

// Get a programme day by ID
export const fetchProgrammeById = createAsyncThunk<
  ProgrammeDay,
  string,
  { rejectValue: string }
>("programme/fetchProgrammeById", async (id, thunkAPI) => {
  try {
    const res = await axios.get(`/programs/get/${id}`);
    return res.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to fetch programme day");
  }
});

// Create a new programme day
export const createProgrammeDay = createAsyncThunk<
  ProgrammeDay,
  Partial<ProgrammeDay>,
  { rejectValue: string }
>("programme/createProgrammeDay", async (payload, thunkAPI) => {
  try {
    const res = await axios.post("/programs/create", payload);
    return res.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to create programme day");
  }
});

// Update a programme day
export const updateProgrammeDay = createAsyncThunk<
  ProgrammeDay,
  { id: string; data: Partial<ProgrammeDay> },
  { rejectValue: string }
>("programme/updateProgrammeDay", async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`/programs/update/${id}`, data);
    return res.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to update programme day");
  }
});

// Delete a programme day
export const deleteProgrammeDay = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("programme/deleteProgrammeDay", async (id, thunkAPI) => {
  try {
    const res = await axios.delete(`/programs/delete/${id}`);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to delete programme day");
  }
});

// -------------------- SLICE --------------------

const programmeSlice = createSlice({
  name: "programme",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch all
    builder.addCase(fetchProgramme.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProgramme.fulfilled, (state, action: PayloadAction<ProgrammeDay[]>) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(fetchProgramme.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
    });

    // Fetch by ID
    builder.addCase(fetchProgrammeById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProgrammeById.fulfilled, (state, action: PayloadAction<ProgrammeDay>) => {
      state.loading = false;
      const index = state.data.findIndex(d => d._id === action.payload._id);
      if (index !== -1) state.data[index] = action.payload;
      else state.data.push(action.payload);
    });
    builder.addCase(fetchProgrammeById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
    });

    // Create
    builder.addCase(createProgrammeDay.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProgrammeDay.fulfilled, (state, action: PayloadAction<ProgrammeDay>) => {
      state.loading = false;
      state.data.push(action.payload);
    });
    builder.addCase(createProgrammeDay.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
    });

    // Update
    builder.addCase(updateProgrammeDay.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProgrammeDay.fulfilled, (state, action: PayloadAction<ProgrammeDay>) => {
      state.loading = false;
      const index = state.data.findIndex(d => d._id === action.payload._id);
      if (index !== -1) state.data[index] = action.payload;
    });
    builder.addCase(updateProgrammeDay.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
    });

    // Delete
    builder.addCase(deleteProgrammeDay.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProgrammeDay.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.data = state.data.filter(d => d._id !== action.payload);
    });
    builder.addCase(deleteProgrammeDay.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
    });
  },
});

// -------------------- SELECTOR --------------------

export const selectProgramme = (state: RootState) => state.programme;

// -------------------- EXPORT --------------------

export default programmeSlice.reducer;
