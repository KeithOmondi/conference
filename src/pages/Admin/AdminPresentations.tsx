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
  MdPerson,
  MdTextFormat,
  MdDescription,
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdLink,
  MdFormatListBulleted,
  MdFormatListNumbered,
} from "react-icons/md";

// Note: To use custom colors directly in Tailwind classes (without configuration),
// we must use the square bracket notation, e.g., bg-[#005A2B].
const PRIMARY_GREEN = "#005A2B";
const ACCENT_GOLD = "#C6A64F";

/**
 * Toolbar component for the Tiptap editor.
 */
const TiptapToolbar = ({ editor }: { editor: ReturnType<typeof useEditor> }) => {
  if (!editor) {
    return null;
  }

  const iconClass = "p-1.5 rounded hover:bg-gray-200 transition-colors";
  const activeClass = `bg-[${ACCENT_GOLD}] text-white hover:bg-opacity-80`;

  return (
    <div className="flex flex-wrap items-center space-x-1 border-b border-gray-300 p-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${iconClass} ${editor.isActive("bold") ? activeClass : "text-gray-700"}`}
        title="Bold"
      >
        <MdFormatBold className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${iconClass} ${editor.isActive("italic") ? activeClass : "text-gray-700"}`}
        title="Italic"
      >
        <MdFormatItalic className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`${iconClass} ${editor.isActive("underline") ? activeClass : "text-gray-700"}`}
        title="Underline"
      >
        <MdFormatUnderlined className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${iconClass} ${editor.isActive("bulletList") ? activeClass : "text-gray-700"}`}
        title="Bullet List"
      >
        <MdFormatListBulleted className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${iconClass} ${editor.isActive("orderedList") ? activeClass : "text-gray-700"}`}
        title="Numbered List"
      >
        <MdFormatListNumbered className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => {
          const url = prompt("Enter URL");
          if (url) {
            editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
          }
        }}
        className={`${iconClass} ${editor.isActive("link") ? activeClass : "text-gray-700"}`}
        title="Add Link"
      >
        <MdLink className="w-5 h-5" />
      </button>
    </div>
  );
};

export default function AdminPresentations() {
  const dispatch = useDispatch<AppDispatch>();

  const presentations = useSelector(selectPresentations);
  const users = useSelector(selectAllUsersState);
  const loading = useSelector(selectPresentationsLoading);
  const error = useSelector(selectPresentationsError);

  const [title, setTitle] = useState("");
  const [presenterId, setPresenterId] = useState("");

  // Tiptap editor for rich text description
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: "",
  });

  useEffect(() => {
    dispatch(fetchAllPresentations());
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !presenterId) return;

    const description = editor?.getHTML() || "";

    await dispatch(createPresentation({ title, description, presenterId }));

    setTitle("");
    setPresenterId("");
    editor?.commands.clearContent();

    // Re-fetch to update the list after submission
    dispatch(fetchAllPresentations());
  };

  const handleDelete = async (id: string) => {
    await dispatch(deletePresentation(id));
    dispatch(fetchAllPresentations());
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-10 text-[#005A2B] border-b-4 border-[#C6A64F] pb-3">
        📂 Manage Presentations
      </h1>

      {/* New Presentation Form */}
      <div className="mb-12 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <h2 className="text-2xl font-bold p-5 bg-gray-50 text-[#005A2B] border-b border-gray-200 flex items-center">
          <MdCloudUpload className="mr-3 w-6 h-6" /> New Presentation Submission
        </h2>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center">
                <MdTextFormat className="w-4 h-4 mr-2 text-gray-500" />
                Presentation Title <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., Human Rights in the Digital Age"
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#C6A64F] focus:border-[#C6A64F] transition-shadow"
              />
            </div>

            {/* Presenter dropdown */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center">
                <MdPerson className="w-4 h-4 mr-2 text-gray-500" />
                Presenter <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                value={presenterId}
                onChange={(e) => setPresenterId(e.target.value)}
                required
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#C6A64F] focus:border-[#C6A64F] transition-shadow"
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

          {/* Rich Text Description */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700 flex items-center">
              <MdDescription className="w-4 h-4 mr-2 text-gray-500" />
              Description (Optional)
            </label>
            <div className="border border-gray-300 rounded-xl overflow-hidden shadow-inner">
              <TiptapToolbar editor={editor} /> {/* <-- ADDED TOOLBAR */}
              <EditorContent
                editor={editor}
                className="p-3 min-h-[150px] bg-white prose max-w-none focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full px-4 py-3 bg-[${PRIMARY_GREEN}] text-white font-bold text-lg rounded-xl shadow-lg transition-all transform hover:scale-[1.01] hover:bg-opacity-95 disabled:bg-gray-400`}
            disabled={!title || !presenterId}
          >
            Submit Presentation
          </button>
        </form>
      </div>

      ---

      <h2 className="text-3xl font-extrabold mb-6 text-[#005A2B] pt-4">
        All Submissions
      </h2>

      {loading && (
        <div className={`flex items-center text-xl text-[${PRIMARY_GREEN}] font-semibold mb-4`}>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading presentations...
        </div>
      )}
      {error && (
        <p className="text-red-700 font-semibold bg-red-50 p-4 rounded-lg border border-red-300 mb-6">
          🚨 Error fetching data: {error}
        </p>
      )}

      {/* Presentations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {presentations.map((p: IPresentation) => (
          <div
            key={p._id}
            className={`p-6 bg-white rounded-2xl shadow-xl border-t-6 border-[#C6A64F] flex flex-col justify-between transition-all hover:shadow-2xl hover:-translate-y-0.5`}
          >
            <div>
              <h3
                className={`font-extrabold text-xl mb-3 text-[${PRIMARY_GREEN}] leading-snug`}
              >
                {p.title}
              </h3>
              <p className="text-gray-800 font-medium text-sm mb-3 flex items-center">
                <MdPerson className="w-4 h-4 mr-1 text-gray-500" />
                <span className="font-semibold">Presenter:</span> {p.presenter?.firstName || "N/A"}{" "}
                {p.presenter?.lastName || ""}
              </p>
              <div
                className="text-gray-600 mb-4 text-sm max-h-[100px] overflow-hidden relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-8 after:bg-gradient-to-t after:from-white"
                dangerouslySetInnerHTML={{ __html: p.description || "No description provided." }}
              />

              {p.fileUrl && (
                <a
                  href={p.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors mt-2 border-b-2 border-blue-200 hover:border-blue-400 pb-0.5"
                >
                  View File
                </a>
              )}
            </div>

            <button
              onClick={() => handleDelete(p._id)}
              className="mt-6 flex items-center justify-center px-3 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg transform hover:scale-[1.02]"
            >
              <MdDelete className="mr-1 w-5 h-5" /> Delete
            </button>
          </div>
        ))}
        {presentations.length === 0 && !loading && !error && (
          <div className="md:col-span-4 p-6 text-center text-gray-500 bg-white rounded-xl shadow-lg">
            No presentations found. Start by submitting one!
          </div>
        )}
      </div>
    </div>
  );
}