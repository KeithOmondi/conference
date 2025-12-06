import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export interface IPresenterBio {
  _id: string;
  name: string;
  title?: string;
  description: string;
  image?: {
    url: string;
    public_id?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}


// ---------------------------------------
//  CREATE PRESENTER BIO
// ---------------------------------------
export const createPresenterBio = createAsyncThunk(
  "presenterBios/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await api.post(`/presenterbios/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return res.data.bio;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Error creating");
    }
  }
);

// ---------------------------------------
//  GET ALL BIOS
// ---------------------------------------
export const fetchPresenterBios = createAsyncThunk(
  "presenterBios/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/presenterbios/get`, {
        withCredentials: true,
      });
      return res.data.bios;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Error fetching");
    }
  }
);

// ---------------------------------------
//  GET SINGLE BIO
// ---------------------------------------
export const fetchPresenterBio = createAsyncThunk(
  "presenterBios/getOne",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/presenterbios/get/${id}`, {
        withCredentials: true,
      });
      return res.data.bio;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Error fetching");
    }
  }
);

// ---------------------------------------
//  UPDATE PRESENTER BIO
// ---------------------------------------
export const updatePresenterBio = createAsyncThunk(
  "presenterBios/update",
  async (
    { id, formData }: { id: string; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`/presenterbios/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return res.data.updated;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Error updating");
    }
  }
);

// ---------------------------------------
//  DELETE PRESENTER BIO
// ---------------------------------------
export const deletePresenterBio = createAsyncThunk(
  "presenterBios/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/presenterbios/delete/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Error deleting");
    }
  }
);

interface PresenterBioState {
  bios: any[];
  selectedBio: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: PresenterBioState = {
  bios: [],
  selectedBio: null,
  loading: false,
  error: null,
};

const presenterBioSlice = createSlice({
  name: "presenterBios",
  initialState,
  reducers: {
    clearBioError: (state) => {
      state.error = null;
    },
    clearSelectedBio: (state) => {
      state.selectedBio = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createPresenterBio.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPresenterBio.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.bios.unshift(payload);
      })
      .addCase(createPresenterBio.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // GET ALL
      .addCase(fetchPresenterBios.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPresenterBios.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.bios = payload;
      })
      .addCase(fetchPresenterBios.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // GET ONE
      .addCase(fetchPresenterBio.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPresenterBio.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.selectedBio = payload;
      })
      .addCase(fetchPresenterBio.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // UPDATE
      .addCase(updatePresenterBio.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePresenterBio.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.bios = state.bios.map((bio) =>
          bio._id === payload._id ? payload : bio
        );
      })
      .addCase(updatePresenterBio.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })

      // DELETE
      .addCase(deletePresenterBio.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePresenterBio.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.bios = state.bios.filter((bio) => bio._id !== payload);
      })
      .addCase(deletePresenterBio.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      });
  },
});

export const { clearBioError, clearSelectedBio } = presenterBioSlice.actions;
export default presenterBioSlice.reducer;
