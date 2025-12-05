import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

import {
fetchAllPresentations,
createPresentation,
deletePresentation,
selectPresentations,
selectPresentationsLoading,
selectPresentationsError,
type IPresentation,
} from "../../store/slices/presentationSlice";
import {
fetchAllUsers,
selectAllUsersState,
} from "../../store/slices/authSlice";
import type { AppDispatch } from "../../store/store";
import {
MdDelete,
MdCloudUpload,
MdLink,
MdPerson,
MdTextFormat,
MdDescription,
} from "react-icons/md";

const PRIMARY_GREEN = "#005A2B";
const ACCENT_GOLD = "#C6A64F";

export default function AdminPresentations() {
const dispatch = useDispatch<AppDispatch>();

const presentations = useSelector(selectPresentations);
const users = useSelector(selectAllUsersState);
const loading = useSelector(selectPresentationsLoading);
const error = useSelector(selectPresentationsError);

const [title, setTitle] = useState("");
const [presenterId, setPresenterId] = useState("");
const [file, setFile] = useState<File | null>(null);

// Tiptap editor for rich text description
const editor = useEditor({
extensions: [StarterKit, Underline, Link],
content: "",
});

useEffect(() => {
dispatch(fetchAllPresentations());
dispatch(fetchAllUsers());
}, [dispatch]);

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
if (!title || !presenterId || !file) return;


const description = editor?.getHTML() || "";

await dispatch(createPresentation({ title, description, presenterId, file }));

setTitle("");
setPresenterId("");
setFile(null);
editor?.commands.clearContent();

dispatch(fetchAllPresentations());


};

const handleDelete = async (id: string) => {
await dispatch(deletePresentation(id));
dispatch(fetchAllPresentations());
};

return ( <div className="p-4 sm:p-6"> <h1 className="text-3xl font-extrabold mb-8 text-[#005A2B] border-b-4 border-[#C6A64F] pb-2">
📂 Manage Presentations </h1>

```
  {/* New Presentation Form */}
  <div className="mb-10 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
    <h2 className="text-xl font-bold p-4 bg-gray-100 text-[#005A2B] border-b border-gray-200 flex items-center">
      <MdCloudUpload className="mr-2" /> New Presentation Submission
    </h2>

    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 flex items-center">
            <MdTextFormat className="w-4 h-4 mr-2 text-gray-500" />
            Presentation Title <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g., Human Rights in the Digital Age"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:ring-[#C6A64F] focus:border-[#C6A64F] transition-colors"
          />
        </div>

        {/* Presenter dropdown */}
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 flex items-center">
            <MdPerson className="w-4 h-4 mr-2 text-gray-500" />
            Presenter <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={presenterId}
            onChange={(e) => setPresenterId(e.target.value)}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:ring-[#C6A64F] focus:border-[#C6A64F] transition-colors"
          >
            <option value="">Select Presenter</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700 flex items-center">
          <MdLink className="w-4 h-4 mr-2 text-gray-500" />
          Upload File <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="file"
          accept=".pdf,.ppt,.pptx,.doc,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:ring-[#C6A64F] focus:border-[#C6A64F] transition-colors"
        />
      </div>

      {/* Rich Text Description */}
      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700 flex items-center">
          <MdDescription className="w-4 h-4 mr-2 text-gray-500" />
          Description (Optional)
        </label>
        <div className="border border-gray-300 rounded-lg">
          <EditorContent editor={editor} className="p-2 min-h-[150px]" />
        </div>
      </div>

      <button
        type="submit"
        className={`w-full px-4 py-3 bg-[${PRIMARY_GREEN}] text-white font-bold rounded-lg shadow-md transition-all hover:bg-[${PRIMARY_GREEN}]/90 hover:shadow-lg`}
      >
        Submit Presentation
      </button>
    </form>
  </div>

  <hr className="my-8 border-gray-300" />

  {loading && (
    <p className={`text-[${PRIMARY_GREEN}] font-semibold text-lg`}>
      Loading presentations...
    </p>
  )}
  {error && (
    <p className="text-red-600 font-semibold bg-red-100 p-3 rounded-lg border border-red-300">
      Error: {error}
    </p>
  )}

  {/* Presentations Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {presentations.map((p: IPresentation) => (
      <div
        key={p._id}
        className={`p-5 bg-white rounded-xl shadow-lg border-t-4 border-[${ACCENT_GOLD}] flex flex-col justify-between transition-shadow hover:shadow-xl`}
      >
        <div>
          <h2 className={`font-extrabold text-lg mb-2 text-[${PRIMARY_GREEN}]`}>
            {p.title}
          </h2>
          <div
            className="text-gray-700 mb-3 text-sm"
            dangerouslySetInnerHTML={{ __html: p.description || "" }}
          />
          <p className="text-gray-800 font-medium text-sm mb-3">
            Presenter: {p.presenter?.firstName || "N/A"} {p.presenter?.lastName || ""}
          </p>
          <a
            href={p.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            <MdLink className="mr-1 w-4 h-4" /> View File
          </a>
        </div>

        <button
          onClick={() => handleDelete(p._id)}
          className="mt-4 flex items-center justify-center px-3 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md"
        >
          <MdDelete className="mr-1 w-5 h-5" /> Delete Presentation
        </button>
      </div>
    ))}
  </div>
</div>

);
}
