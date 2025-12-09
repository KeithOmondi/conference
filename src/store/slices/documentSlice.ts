import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import api from "../../api/axios";

export interface IDocument {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string; // cloudinary public_id
  signedUrl?: string; // generated dynamically
  fileType: string;
  fileSize?: number;
  originalName?: string;

  presenter?: any;
  category?: string;

  viewCount: number; // NEW
  downloadCount: number; // NEW

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

// -----------------------------------------------------
// ASYNC THUNKS
// -----------------------------------------------------

// Upload document (admin)
export const uploadDocument = createAsyncThunk(
  "documents/uploadDocument",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.document;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Upload failed");
    }
  }
);

// Fetch all document metadata
export const fetchAllDocuments = createAsyncThunk(
  "documents/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/documents/get");
      return res.data.documents || [];
    } catch {
      return rejectWithValue("Failed to load documents");
    }
  }
);

// Fetch single document metadata (AUTO INCREASE viewCount)
export const fetchDocumentById = createAsyncThunk(
  "documents/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/documents/get/${id}`);
      return res.data.document; // includes updated viewCount
    } catch {
      return rejectWithValue("Failed to fetch document");
    }
  }
);

// Fetch signed URL (AUTO INCREASE downloadCount)
export const fetchDocumentSignedUrl = createAsyncThunk(
  "documents/fetchSignedUrl",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/documents/url/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return { id, signedUrl: res.data.url };
    } catch {
      return rejectWithValue("Failed to fetch signed URL");
    }
  }
);

// Delete document
export const deleteDocument = createAsyncThunk(
  "documents/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/documents/delete/${id}`);
      return id;
    } catch {
      return rejectWithValue("Failed to delete document");
    }
  }
);

// -----------------------------------------------------
// SLICE
// -----------------------------------------------------
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

      // Fetch single (updates view count)
      .addCase(fetchDocumentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDocumentById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleDocument = action.payload;

        // Also update local list viewCount if exists
        const index = state.documents.findIndex(
          (d) => d._id === action.payload._id
        );
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
      })
      .addCase(fetchDocumentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch signed URL (updates download count)
      .addCase(fetchDocumentSignedUrl.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDocumentSignedUrl.fulfilled, (state, action) => {
        state.loading = false;

        const { id, signedUrl } = action.payload;

        // update list item
        const doc = state.documents.find((d) => d._id === id);
        if (doc) {
          doc.signedUrl = signedUrl;
          doc.downloadCount += 1; // update download count
        }

        // update single document
        if (state.singleDocument && state.singleDocument._id === id) {
          state.singleDocument.signedUrl = signedUrl;
          state.singleDocument.downloadCount += 1;
        }
      })
      .addCase(fetchDocumentSignedUrl.rejected, (state, action) => {
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

        if (
          state.singleDocument &&
          state.singleDocument._id === action.payload
        ) {
          state.singleDocument = null;
        }
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// -----------------------------------------------------
// SELECTORS
// -----------------------------------------------------
export const selectDocuments = (state: RootState) => state.documents.documents;
export const selectSingleDocument = (state: RootState) =>
  state.documents.singleDocument;
export const selectDocumentsLoading = (state: RootState) =>
  state.documents.loading;
export const selectDocumentsError = (state: RootState) => state.documents.error;

export default documentSlice.reducer;
