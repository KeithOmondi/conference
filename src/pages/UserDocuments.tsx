import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../store/store";
import {
  fetchAllDocuments,
  fetchDocumentSignedUrl,
  selectDocuments,
  selectDocumentsLoading,
} from "../store/slices/documentSlice";
import { Download, FileText, Calendar, Tag, Eye } from "lucide-react";

const PRIMARY_GREEN = "#005A2B";
const ACCENT_GOLD = "#C6A64F";

const UserDocuments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const documents = useSelector(selectDocuments) || [];
  const loading = useSelector(selectDocumentsLoading);

  useEffect(() => {
    dispatch(fetchAllDocuments());
  }, [dispatch]);

  useEffect(() => {
    documents.forEach((doc) => {
      if (!doc.signedUrl) {
        dispatch(fetchDocumentSignedUrl(doc._id));
      }
    });
  }, [documents, dispatch]);

  const getFileIconColor = (fileUrl: string) => {
    const extension = fileUrl.split(".").pop()?.toLowerCase();
    if (extension === "pdf") return "text-red-500";
    if (["jpg", "jpeg", "png"].includes(extension || "")) return "text-blue-500";
    return "text-gray-500";
  };

  return (
    <div className="min-h-screen pt-12 pb-20" style={{ backgroundColor: "#F9FAFB" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1
          className="text-2xl font-extrabold mb-10 text-center"
          style={{ color: PRIMARY_GREEN }}
        >
          Resource Downloads
        </h1>

        {loading && (
          <div className="flex items-center justify-center p-10 bg-white rounded-xl shadow-lg">
            <p className="text-xl text-gray-500 italic">
              Fetching official documents...
            </p>
          </div>
        )}

        {!loading && documents.length === 0 && (
          <div className="text-center p-10 border-dashed border-2 border-gray-300 rounded-xl bg-white shadow-lg">
            <p className="text-xl text-gray-600 font-medium">
              No public documents are currently available.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {documents.map((doc: any) => (
            <div
              key={doc._id}
              className="bg-white rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg hover:shadow-xl transition duration-300 border-l-4"
              style={{ borderColor: ACCENT_GOLD }}
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <FileText
                  size={40}
                  className={`flex-shrink-0 mt-1 ${getFileIconColor(doc.fileUrl)}`}
                />
                <div className="min-w-0">
                  <h2
                    className="text-xl font-bold mb-1 truncate"
                    style={{ color: PRIMARY_GREEN }}
                  >
                    {doc.title}
                  </h2>

                  <p className="text-sm text-gray-600 mb-2">{doc.description}</p>

                  <div className="flex items-center text-xs text-gray-400 space-x-4 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>

                    <span className="flex items-center gap-1">
                      <Tag size={14} /> {doc.fileType || "Document"}
                    </span>
                  </div>

                  {/* NEW: View & Download Count */}
                  <div className="flex items-center text-xs font-semibold text-gray-600 gap-4">
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {doc.viewCount ?? 0} views
                    </span>

                    <span className="flex items-center gap-1">
                      <Download size={14} />
                      {doc.downloadCount ?? 0} downloads
                    </span>
                  </div>
                </div>
              </div>

              <a
                href={doc.signedUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-4 md:mt-0 flex-shrink-0 bg-opacity-90 text-white px-6 py-3 rounded-full flex items-center gap-2 font-semibold shadow-md hover:bg-opacity-100 transition duration-200 ${
                  !doc.signedUrl ? "pointer-events-none opacity-50" : ""
                }`}
                style={{ backgroundColor: PRIMARY_GREEN }}
              >
                <Download size={18} />
                {doc.signedUrl ? "Download" : "Loading..."}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDocuments;
