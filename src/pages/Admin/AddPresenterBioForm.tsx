import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createPresenterBio, clearBioError } from "../../store/slices/presenterBioSlice";
import { MdPerson, MdTitle, MdDescription, MdCloudUpload, MdClose } from "react-icons/md";

const PRIMARY_BLUE = "#1D4ED8"; // Tailwind blue-700
const ACCENT_RED = "#DC2626"; // Tailwind red-600
const SHADOW_COLOR = "shadow-[0_10px_25px_rgba(0,0,0,0.1)]";

const AddPresenterBioForm = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.presenterBios);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    const fileInput = document.getElementById("bio-image-upload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    dispatch(createPresenterBio(formData)).then((res: any) => {
      if (!res.error) {
        setName("");
        setTitle("");
        setDescription("");
        clearImage();
        setIsOpen(false);
      }
    });
  };

  const isFormValid = name.trim() !== "" && description.trim() !== "";

  const inputClass = "w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm";
  const labelClass = "block text-sm font-semibold mb-2 text-gray-700 flex items-center";
  const iconClass = "w-5 h-5 mr-2 text-gray-500";

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`px-6 py-3 bg-[${PRIMARY_BLUE}] text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all`}
      >
        + Add Presenter Bio
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          {/* Modal Card */}
          <div className={`bg-white rounded-2xl w-full max-w-lg p-6 md:p-8 ${SHADOW_COLOR} relative`}>
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <MdClose className="w-6 h-6" />
            </button>

            <h2 className={`text-2xl font-bold mb-6 text-[${PRIMARY_BLUE}] border-b pb-3 border-gray-200`}>
              ✨ Add New Presenter Bio
            </h2>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-300 mb-4 flex justify-between items-start">
                <p className="text-red-700 font-medium">**Submission Error:** {error}</p>
                <button onClick={() => dispatch(clearBioError())} className="text-red-600 hover:text-red-800 font-semibold flex items-center">
                  <MdClose className="w-5 h-5 mr-1" /> Dismiss
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* NAME */}
              <div>
                <label className={labelClass}>
                  <MdPerson className={iconClass} /> Name <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Jane Doe"
                  required
                />
              </div>

              {/* TITLE */}
              <div>
                <label className={labelClass}>
                  <MdTitle className={iconClass} /> Title / Position
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Senior Legal Analyst"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className={labelClass}>
                  <MdDescription className={iconClass} /> Biographical Description <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  className={`${inputClass} h-28 resize-y`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a brief biography, including professional background and expertise..."
                  required
                ></textarea>
              </div>

              {/* IMAGE UPLOAD */}
              <div>
                <label className={labelClass}>
                  <MdCloudUpload className={iconClass} /> Presenter Image
                </label>
                <input
                  id="bio-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
                />
                {preview && (
                  <div className="relative inline-block mt-4">
                    <img
                      src={preview}
                      alt="Image Preview"
                      className="w-28 h-28 object-cover rounded-full border-4 border-gray-100 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className={`absolute -top-1 -right-1 bg-[${ACCENT_RED}] text-white rounded-full p-1 shadow-lg hover:bg-red-700 transition-colors`}
                      title="Remove Image"
                    >
                      <MdClose className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`w-full px-4 py-3 text-white font-bold text-lg rounded-xl shadow-lg transition-all transform hover:scale-[1.02] ${
                  isFormValid && !loading
                    ? `bg-[${PRIMARY_BLUE}] hover:bg-blue-700`
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  "Create Presenter Bio"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPresenterBioForm;
