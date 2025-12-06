import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  createPresenterBio,
  clearBioError,
} from "../../store/slices/presenterBioSlice";

const AddPresenterBioForm = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.presenterBios);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
        setImage(null);
        setPreview(null);
      }
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4">Add Presenter Bio</h2>

      {error && (
        <p className="text-red-600 mb-3">
          {error}
          <button
            onClick={() => dispatch(clearBioError())}
            className="ml-2 text-blue-600 underline"
          >
            clear
          </button>
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAME */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* TITLE */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            className="w-full border rounded p-2 h-32"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* IMAGE */}
        <div>
          <label className="block mb-1 font-medium">Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-32 h-32 object-cover mt-2 rounded shadow"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-300"
        >
          {loading ? "Saving..." : "Create Presenter Bio"}
        </button>
      </form>
    </div>
  );
};

export default AddPresenterBioForm;
