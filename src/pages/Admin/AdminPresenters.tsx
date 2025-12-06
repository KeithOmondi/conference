import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store/store";

import {
  fetchPresenterBios,
  createPresenterBio,
  updatePresenterBio,
  deletePresenterBio,
  type IPresenterBio,
} from "../../store/slices/presenterBioSlice";

// -------------------- Helper: Parse Description --------------------
const parseDescription = (text: string) => {
  const lines = text.split(/\r?\n/).map(line => line.trim());
  const blocks: { type: "paragraph" | "list"; content: string[] }[] = [];

  let currentList: string[] = [];
  let currentParagraph: string[] = [];

  lines.forEach(line => {
    if (/^(\d+|[a-zA-Z])\.\s+/.test(line)) {
      // Numbered or lettered point
      if (currentParagraph.length > 0) {
        blocks.push({ type: "paragraph", content: currentParagraph });
        currentParagraph = [];
      }
      currentList.push(line.replace(/^(\d+|[a-zA-Z])\.\s+/, ""));
    } else if (line === "") {
      // Empty line ends any block
      if (currentList.length > 0) {
        blocks.push({ type: "list", content: currentList });
        currentList = [];
      }
      if (currentParagraph.length > 0) {
        blocks.push({ type: "paragraph", content: currentParagraph });
        currentParagraph = [];
      }
    } else {
      // Regular paragraph
      if (currentList.length > 0) {
        blocks.push({ type: "list", content: currentList });
        currentList = [];
      }
      currentParagraph.push(line);
    }
  });

  if (currentList.length > 0) blocks.push({ type: "list", content: currentList });
  if (currentParagraph.length > 0) blocks.push({ type: "paragraph", content: currentParagraph });

  return blocks;
};

// -------------------- Helper: Render text with bold --------------------
const renderBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g); // split by **bold**
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

// -------------------- Modal Component --------------------
interface AddEditPresenterModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  initialData?: IPresenterBio | null;
}

const AddEditPresenterModal: React.FC<AddEditPresenterModalProps> = ({
  show,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    image: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(
    initialData?.image?.url || null
  );

  useEffect(() => {
    setForm({
      name: initialData?.name || "",
      title: initialData?.title || "",
      description: initialData?.description || "",
      image: null,
    });
    setPreview(initialData?.image?.url || null);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target.name === "image" && e.target instanceof HTMLInputElement) {
      const file = e.target.files?.[0] || null;
      setForm({ ...form, image: file });
      if (file) setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = () => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("title", form.title);
    fd.append("description", form.description);
    if (form.image) fd.append("image", form.image);

    onSubmit(fd);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Presenter" : "Add Presenter"}
        </h3>

        <div className="space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={6}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-28 h-28 object-cover rounded-full mt-2 border"
            />
          )}
        </div>

        <div className="flex justify-end mt-5 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            {initialData ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------- Presenter Card --------------------
interface PresenterCardProps {
  p: IPresenterBio;
  handleOpenEdit: (bio: IPresenterBio) => void;
  handleDelete: (id: string) => void;
}

const PresenterCard: React.FC<PresenterCardProps> = ({
  p,
  handleOpenEdit,
  handleDelete,
}) => {
  const imageUrl = p.image?.url || "/placeholder-avatar.png";

  return (
    <div className="relative bg-[#0F3B35] text-white rounded-xl overflow-hidden shadow-2xl min-h-[350px] md:min-h-[400px]">
      <div className="p-6 md:p-10 flex flex-col justify-between h-full relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div className="flex flex-col space-y-1">
            <div className="bg-yellow-500 text-black py-1 px-2 text-[10px] font-bold inline-block w-fit">
              HIGH COURT OF KENYA
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-none tracking-tight">
              <span className="text-yellow-500">ANNUAL</span>
              <br />
              HUMAN RIGHTS
              <br />
              SUMMIT 2025
            </h1>
            <p className="text-[10px] md:text-xs opacity-80 mt-1">
              27th - 28th DECEMBER 2025
              <br />
              THEME: LEARNING HUMAN RIGHTS (SOCIAL LEADERSHIP AS A PILLAR OF
              CONSTITUTIONALISM)
            </p>
          </div>

          <div className="flex flex-col items-center space-y-1 text-right">
            <div className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center text-xs text-black">
              Logo
            </div>
            <div className="text-[8px] font-serif leading-none">
              Republic of Kenya
            </div>
            <div className="text-sm md:text-lg font-bold tracking-widest leading-none">
              THE JUDICIARY
            </div>
          </div>
        </div>

        <div className="flex-1 mt-6">
          <div className="text-3xl md:text-4xl font-extrabold text-white">
            Meet the
            <br />
            <span className="text-yellow-500">Speakers</span>
          </div>

          <blockquote className="border-l-4 border-yellow-500 pl-4 py-2 mt-4 max-w-full md:max-w-[70%]">
            {parseDescription(p.description).map((block, idx) => {
              if (block.type === "paragraph") {
                return (
                  <p
                    key={idx}
                    className="text-sm md:text-base font-normal opacity-95 mb-2"
                  >
                    {block.content.map((line, i) => (
                      <span key={i}>{renderBold(line)} </span>
                    ))}
                  </p>
                );
              } else {
                return (
                  <ol
                    key={idx}
                    className="list-decimal list-inside text-sm md:text-base font-normal opacity-95 mb-2"
                  >
                    {block.content.map((item, i) => (
                      <li key={i}>{renderBold(item)}</li>
                    ))}
                  </ol>
                );
              }
            })}
          </blockquote>
        </div>

        <div className="flex items-center space-x-2 text-sm md:text-base mt-4">
          <div className="w-4 h-4 bg-yellow-500"></div>
          <span className="font-semibold">highcourt.judiciary.go.ke</span>
        </div>
      </div>

      <div className="absolute top-0 right-0 h-full w-full md:w-1/2 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-yellow-600/70 rounded-full md:translate-x-1/4"></div>
        <img
          src={imageUrl}
          alt={p.name}
          className="absolute top-1/2 right-10 transform -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 object-cover rounded-full z-20 border-4 border-white shadow-xl pointer-events-auto"
        />
        <div className="absolute bottom-0 right-0 flex items-center bg-black pr-10 pl-6 py-2 z-30 pointer-events-auto">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-yellow-500 transform -skew-x-[30deg] -translate-x-1/2"></div>
          <h4 className="relative z-40 text-lg md:text-2xl font-bold ml-4">{p.name}</h4>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-50 pointer-events-auto">
        <div className="bg-black/50 p-2 rounded-lg flex gap-2">
          <button
            onClick={() => handleOpenEdit(p)}
            className="px-3 py-1 text-sm bg-white text-black rounded-md hover:bg-gray-200 transition"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(p._id)}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------- Main Component --------------------
const AdminPresenters = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bios, loading, error } = useSelector(
    (state: any) => state.presenterBios
  );

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<IPresenterBio | null>(null);

  useEffect(() => {
    dispatch(fetchPresenterBios());
  }, [dispatch]);

  const handleOpenCreate = () => {
    setEditing(null);
    setShowModal(true);
  };

  const handleOpenEdit = (bio: IPresenterBio) => {
    setEditing(bio);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditing(null);
    setShowModal(false);
  };

  const handleSubmit = async (formData: FormData) => {
    if (editing) {
      await dispatch(updatePresenterBio({ id: editing._id, formData }));
    } else {
      await dispatch(createPresenterBio(formData));
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this presenter bio?")) {
      dispatch(deletePresenterBio(id));
    }
  };

  return (
    <div className="space-y-8 p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Admin — Presenter Bios</h2>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Presenter
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading presenters…</p>}
      {error && <p className="text-red-600 font-medium">Error: {error}</p>}

      <div className="grid lg:grid-cols-1 gap-8">
        {bios.map((p: IPresenterBio) => (
          <PresenterCard
            key={p._id}
            p={p}
            handleOpenEdit={handleOpenEdit}
            handleDelete={handleDelete}
          />
        ))}
      </div>

      {!loading && bios.length === 0 && (
        <p className="text-gray-600 italic">No presenters found.</p>
      )}

      <AddEditPresenterModal
        show={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editing}
      />
    </div>
  );
};

export default AdminPresenters;