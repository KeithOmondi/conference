// src/components/admin/AdminDocuments.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store/store";
import {
  uploadDocument,
  fetchAllDocuments,
  deleteDocument,
  selectDocuments,
  selectDocumentsLoading,
  type IDocument,
} from "../../store/slices/documentSlice";
import { Trash2, Download, Upload, FileText, X } from "lucide-react";

const PRIMARY_GREEN = "#005A2B";
const ACCENT_YELLOW = "#C6A64F";

const AdminDocuments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const documents: IDocument[] = useSelector(selectDocuments) || [];
  const loading = useSelector(selectDocumentsLoading);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchAllDocuments());
  }, [dispatch]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    const resultAction: any = await dispatch(uploadDocument(formData));
    if (uploadDocument.fulfilled.match(resultAction)) {
      setTitle("");
      setDescription("");
      setFile(null);
      dispatch(fetchAllDocuments());
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;
    await dispatch(deleteDocument(id));
    dispatch(fetchAllDocuments());
  };

  const getFileIconColor = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "text-red-600";
    if (["jpg", "jpeg", "png"].includes(ext || "")) return "text-blue-600";
    return "text-gray-600";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1
        className="text-3xl font-extrabold mb-8"
        style={{ color: PRIMARY_GREEN }}
      >
        🏛️ Document Repository Management
      </h1>

      <form
        onSubmit={handleUpload}
        className="rounded-xl p-8 mb-12 shadow-2xl"
        style={{
          backgroundColor: "#F8F8F8",
          border: `2px solid ${ACCENT_YELLOW}`,
        }}
      >
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: PRIMARY_GREEN }}
        >
          Upload New Document
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <input
            type="text"
            placeholder="Document title (Required)"
            className="w-full border border-gray-300 p-3 rounded-lg focus:border-green-600 focus:ring-1 focus:ring-green-600 transition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Description (Optional)"
            className="w-full border border-gray-300 p-3 rounded-lg focus:border-green-600 focus:ring-1 focus:ring-green-600 transition resize-none h-12 md:h-auto"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={1}
          />

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Select File
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="flex-grow border border-gray-300 p-2 rounded-lg bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
              {file && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="text-white px-8 py-3 rounded-full flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl transition disabled:bg-gray-400"
            style={{ backgroundColor: PRIMARY_GREEN }}
            disabled={loading || !file || !title.trim()}
          >
            <Upload size={18} /> {loading ? "Uploading..." : "Publish Document"}
          </button>
        </div>
      </form>

      <h2 className="text-2xl font-bold mb-4" style={{ color: PRIMARY_GREEN }}>
        All Published Documents ({documents.length})
      </h2>

      {loading && <p className="text-gray-500 italic">Loading documents...</p>}

      {!loading && documents.length === 0 && (
        <div className="p-6 text-center border-dashed border-2 border-gray-300 rounded-xl bg-white">
          <p className="text-gray-600 font-medium">
            No documents have been uploaded yet.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc._id}
            className="bg-white rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center shadow-md hover:shadow-lg transition border-l-4"
            style={{ borderColor: ACCENT_YELLOW }}
          >
            <div className="flex items-start gap-4 flex-1">
              <FileText
                size={40}
                className={`flex-shrink-0 ${getFileIconColor(doc.fileUrl)}`}
              />
              <div>
                <h3
                  className="text-xl font-bold"
                  style={{ color: PRIMARY_GREEN }}
                >
                  {doc.title}
                </h3>
                {doc.description && (
                  <p className="text-gray-700 text-sm italic">
                    {doc.description}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 md:mt-0 flex-shrink-0">
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2 font-medium hover:bg-blue-700 transition"
              >
                <Download size={18} /> View/Download
              </a>

              <button
                onClick={() => handleDelete(doc._id)}
                className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition"
                aria-label={`Delete document ${doc.title}`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDocuments;
