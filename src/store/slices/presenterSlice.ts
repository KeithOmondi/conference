import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";
import type { RootState } from "../store";

// -------------------------------------------------------
// TYPES
// -------------------------------------------------------
export interface Presenter {
  _id: string;
  name: string;
  title?: string;
  bio?: string;
  image?: string;
}

export interface PresenterState {
  presenters: Presenter[];
  presenter: Presenter | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}

// -------------------------------------------------------
// INITIAL STATE
// -------------------------------------------------------
const initialState: PresenterState = {
  presenters: [],
  presenter: null,
  loading: false,
  error: null,
  success: null,
};

// -------------------------------------------------------
// ASYNC THUNKS
// -------------------------------------------------------

// GET ALL PRESENTERS
export const fetchPresenters = createAsyncThunk<
  Presenter[],    // return type
  void,           // argument type
  { rejectValue: string }
>("presenters/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/presenters/get");
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Failed to load presenters"
    );
  }
});

// GET ONE BY ID
export const fetchPresenterById = createAsyncThunk<
  Presenter,
  string,
  { rejectValue: string }
>("presenters/fetchById", async (id, thunkAPI) => {
  try {
    const res = await axios.get(`/presenters/get/${id}`);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Failed to load presenter"
    );
  }
});

// CREATE PRESENTER
export const createPresenter = createAsyncThunk<
  Presenter,
  Partial<Presenter>,
  { rejectValue: string }
>("presenters/create", async (data, thunkAPI) => {
  try {
    const res = await axios.post("/presenters/create", data);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Failed to create presenter"
    );
  }
});

// UPDATE PRESENTER
export const updatePresenter = createAsyncThunk<
  Presenter,
  { id: string; data: Partial<Presenter> },
  { rejectValue: string }
>("presenters/update", async ({ id, data }, thunkAPI) => {
  try {
    const res = await axios.put(`/presenters/update/${id}`, data);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Failed to update presenter"
    );
  }
});

// DELETE PRESENTER
export const deletePresenter = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("presenters/delete", async (id, thunkAPI) => {
  try {
    await axios.delete(`/presenters/delete/${id}`);
    return id;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Failed to delete presenter"
    );
  }
});

// -------------------------------------------------------
// SLICE
// -------------------------------------------------------
const presenterSlice = createSlice({
  name: "presenter",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },

  extraReducers: (builder) => {
    // FETCH ALL
    builder
      .addCase(fetchPresenters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPresenters.fulfilled, (state, action) => {
        state.loading = false;
        state.presenters = action.payload;
      })
      .addCase(fetchPresenters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load presenters";
      });

    // FETCH ONE
    builder
      .addCase(fetchPresenterById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPresenterById.fulfilled, (state, action) => {
        state.loading = false;
        state.presenter = action.payload;
      })
      .addCase(fetchPresenterById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load presenter";
      });

    // CREATE
    builder
      .addCase(createPresenter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPresenter.fulfilled, (state, action) => {
        state.loading = false;
        state.presenters.push(action.payload);
        state.success = "Presenter created successfully";
      })
      .addCase(createPresenter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create presenter";
      });

    // UPDATE
    builder
      .addCase(updatePresenter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePresenter.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Presenter updated successfully";

        const idx = state.presenters.findIndex(
          (p) => p._id === action.payload._id
        );
        if (idx !== -1) {
          state.presenters[idx] = action.payload;
        }
      })
      .addCase(updatePresenter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update presenter";
      });

    // DELETE
    builder
      .addCase(deletePresenter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePresenter.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Presenter deleted successfully";
        state.presenters = state.presenters.filter(
          (p) => p._id !== action.payload
        );
      })
      .addCase(deletePresenter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete presenter";
      });
  },
});

// -------------------------------------------------------
// EXPORTS
// -------------------------------------------------------
export const { clearMessages } = presenterSlice.actions;
export default presenterSlice.reducer;

// -------------------------------------------------------
// SELECTORS (FULLY FIXED)
// -------------------------------------------------------
export const selectPresenters = (state: RootState): Presenter[] =>
  Array.isArray(state.presenter.presenters)
    ? state.presenter.presenters
    : [];

export const selectPresenter = (state: RootState) =>
  state.presenter.presenter;

export const selectPresentersLoading = (state: RootState) =>
  state.presenter.loading;

export const selectPresentersError = (state: RootState) =>
  state.presenter.error;

export const selectPresentersSuccess = (state: RootState) =>
  state.presenter.success;
