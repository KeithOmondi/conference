// src/store/slices/documentSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import api from "../../api/axios";

export interface IDocument {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentState {
  documents: IDocument[];
  singleDocument: IDocument | null;
  loading: boolean;
  error: string | null;
}

const initialState: DocumentState = {
  documents: [],
  singleDocument: null,
  loading: false,
  error: null,
};

// ASYNC THUNKS
export const uploadDocument = createAsyncThunk(
  "documents/uploadDocument",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      return res.data.document;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Upload failed");
    }
  }
);

export const fetchAllDocuments = createAsyncThunk(
  "documents/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/documents/get");
      return res.data.documents || [];
    } catch (err: any) {
      return rejectWithValue("Failed to load documents");
    }
  }
);

export const fetchDocumentById = createAsyncThunk(
  "documents/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/documents/get/${id}`);
      return res.data.document;
    } catch (err: any) {
      return rejectWithValue("Failed to fetch document");
    }
  }
);

export const deleteDocument = createAsyncThunk(
  "documents/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/documents/delete/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue("Failed to delete document");
    }
  }
);

// SLICE
export const documentSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload
      .addCase(uploadDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documents.push(action.payload);
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch all
      .addCase(fetchAllDocuments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload;
      })
      .addCase(fetchAllDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch single
      .addCase(fetchDocumentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDocumentById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleDocument = action.payload;
      })
      .addCase(fetchDocumentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = state.documents.filter(
          (d) => d._id !== action.payload
        );
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// SELECTORS
export const selectDocuments = (state: RootState) => state.documents.documents;
export const selectSingleDocument = (state: RootState) =>
  state.documents.singleDocument;
export const selectDocumentsLoading = (state: RootState) =>
  state.documents.loading;
export const selectDocumentsError = (state: RootState) => state.documents.error;

export default documentSlice.reducer;
