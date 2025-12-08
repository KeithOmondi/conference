import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../store/store";
import {
  fetchAllDocuments,
  selectDocuments,
  selectDocumentsLoading,
} from "../store/slices/documentSlice";
import { Download, FileText, Calendar, Tag } from "lucide-react";

// Theme Colors (Consistent with Admin and Presenter components)
const PRIMARY_GREEN = "#005A2B";
const ACCENT_GOLD = "#C6A64F";

const UserDocuments = () => {
  const dispatch = useDispatch<AppDispatch>();
  // Assuming a structure for document objects similar to the admin component
  const documents = useSelector(selectDocuments) || []; 
  const loading = useSelector(selectDocumentsLoading);

  useEffect(() => {
    dispatch(fetchAllDocuments());
  }, [dispatch]);

  // Helper to determine the file icon color based on type/extension (placeholder logic)
  const getFileIconColor = (fileUrl: string) => {
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return 'text-red-500';
    if (['jpg', 'jpeg', 'png'].includes(extension || '')) return 'text-blue-500';
    return 'text-gray-500';
  };

  return (
    <div className="min-h-screen pt-12 pb-20" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <h1 className="text-4xl font-extrabold mb-10 text-center" style={{ color: PRIMARY_GREEN }}>
          Resource Downloads
        </h1>

        {/* Loading and Empty States */}
        {loading && (
            <div className="flex items-center justify-center p-10 bg-white rounded-xl shadow-lg">
                <p className="text-xl text-gray-500 italic">Fetching official documents...</p>
            </div>
        )}

        {!loading && documents.length === 0 && (
          <div className="text-center p-10 border-dashed border-2 border-gray-300 rounded-xl bg-white shadow-lg">
            <p className="text-xl text-gray-600 font-medium">No public documents are currently available.</p>
          </div>
        )}

        {/* Documents List */}
        <div className="space-y-6">
          {documents.map((doc: any) => ( // Using 'any' for doc as the type is not defined here
            <div
              key={doc._id}
              className="bg-white rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center shadow-lg hover:shadow-xl transition duration-300 border-l-4"
              style={{ borderColor: ACCENT_GOLD }}
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                
                {/* File Icon */}
                <FileText size={40} className={`flex-shrink-0 mt-1 ${getFileIconColor(doc.fileUrl)}`} />

                {/* Details */}
                <div className="min-w-0">
                  <h2 className="text-xl font-bold mb-1 truncate" style={{ color: PRIMARY_GREEN }}>
                    {doc.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    {doc.description}
                  </p>
                  <div className="flex items-center text-xs text-gray-400 space-x-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> 
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag size={14} /> 
                      {/* Placeholder for file type/size, assuming doc has a fileType or size field */}
                      {doc.fileType || "Document"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 md:mt-0 flex-shrink-0 bg-opacity-90 text-white px-6 py-3 rounded-full flex items-center gap-2 font-semibold shadow-md hover:bg-opacity-100 transition duration-200"
                style={{ backgroundColor: PRIMARY_GREEN }}
                download 
              >
                <Download size={18} />
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDocuments;