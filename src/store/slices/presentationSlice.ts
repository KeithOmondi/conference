import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import api from "../../api/axios";

// -------------------------------------------------------------
// TYPES
// -------------------------------------------------------------
export interface IPresentation {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  presenter: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    pj: string;
  };
  uploadedBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface PresentationState {
  presentations: IPresentation[];
  currentPresentation?: IPresentation;
  loading: boolean;
  error?: string | null;
}

const initialState: PresentationState = {
  presentations: [],
  currentPresentation: undefined,
  loading: false,
  error: null,
};

// -------------------------------------------------------------
// THUNKS
// -------------------------------------------------------------

export const fetchAllPresentations = createAsyncThunk<
  IPresentation[],
  void,
  { rejectValue: string }
>("presentations/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/presentations/get");
    return data.presentations;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchMyPresentations = createAsyncThunk<
  IPresentation[],
  void,
  { rejectValue: string }
>("presentations/fetchMine", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/presentations/mine");
    return data.presentations;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchPresentationById = createAsyncThunk<
  IPresentation,
  string,
  { rejectValue: string }
>("presentations/fetchById", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/presentations/get/${id}`);
    return data.presentation;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// CREATE — Upload presentation via Cloudinary
export const createPresentation = createAsyncThunk<
  IPresentation,
  { title: string; description?: string; presenterId: string; file: File },
  { rejectValue: string }
>("presentations/create", async ({ title, description, presenterId, file }, { rejectWithValue }) => {
  try {
    // Prepare FormData
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description || "");
    formData.append("presenterId", presenterId);

    // Send to backend
    const { data } = await api.post("/presentations/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data.presentation;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});


export const updatePresentation = createAsyncThunk<
  IPresentation,
  { id: string; updates: Partial<IPresentation> },
  { rejectValue: string }
>("presentations/update", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/presentations/update/${id}`, updates);
    return data.presentation;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const deletePresentation = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("presentations/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/presentations/delete/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// -------------------------------------------------------------
// SLICE
// -------------------------------------------------------------
const presentationsSlice = createSlice({
  name: "presentations",
  initialState,
  reducers: {
    clearCurrentPresentation(state) {
      state.currentPresentation = undefined;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchAllPresentations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllPresentations.fulfilled,
        (state, action: PayloadAction<IPresentation[]>) => {
          state.loading = false;
          state.presentations = action.payload;
        }
      )
      .addCase(fetchAllPresentations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch presentations";
      })

      // FETCH MINE
      .addCase(fetchMyPresentations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMyPresentations.fulfilled,
        (state, action: PayloadAction<IPresentation[]>) => {
          state.loading = false;
          state.presentations = action.payload;
        }
      )
      .addCase(fetchMyPresentations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch presentations";
      })

      // FETCH BY ID
      .addCase(fetchPresentationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPresentationById.fulfilled,
        (state, action: PayloadAction<IPresentation>) => {
          state.loading = false;
          state.currentPresentation = action.payload;
        }
      )
      .addCase(fetchPresentationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch presentation";
      })

      // CREATE
      .addCase(createPresentation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createPresentation.fulfilled,
        (state, action: PayloadAction<IPresentation>) => {
          state.loading = false;
          state.presentations.push(action.payload);
        }
      )
      .addCase(createPresentation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create presentation";
      })

      // UPDATE
      .addCase(
        updatePresentation.fulfilled,
        (state, action: PayloadAction<IPresentation>) => {
          state.presentations = state.presentations.map((p) =>
            p._id === action.payload._id ? action.payload : p
          );
        }
      )

      // DELETE
      .addCase(
        deletePresentation.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.presentations = state.presentations.filter(
            (p) => p._id !== action.payload
          );
        }
      );
  },
});

// Memoized selectors
export const selectPresentations = createSelector(
  (state: RootState) => state.presentations,
  (presentationsState) => presentationsState?.presentations ?? []
);

export const selectCurrentPresentation = createSelector(
  (state: RootState) => state.presentations,
  (presentationsState) => presentationsState?.currentPresentation ?? null
);

export const selectPresentationsLoading = createSelector(
  (state: RootState) => state.presentations,
  (presentationsState) => presentationsState?.loading ?? false
);

export const selectPresentationsError = createSelector(
  (state: RootState) => state.presentations,
  (presentationsState) => presentationsState?.error ?? null
);

// -------------------------------------------------------------
export const { clearCurrentPresentation, clearError } =
  presentationsSlice.actions;
export default presentationsSlice.reducer;
