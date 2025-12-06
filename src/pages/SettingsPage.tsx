import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../store/store";

import { fetchPresenterBios, type IPresenterBio } from "../store/slices/presenterBioSlice";

const SettingsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { bios, loading, error } = useSelector((state: any) => state.presenterBios);

  useEffect(() => {
    dispatch(fetchPresenterBios());
  }, [dispatch]);

  const handleClick = (id: string) => {
    navigate(`/settings/${id}`);
  };

  return (
    <div className="space-y-8 p-4">
      <h2 className="text-3xl font-bold text-gray-900">MEET YOUR PRESENTERS</h2>

      {loading && <p className="text-gray-600 italic">Loading presenters…</p>}
      {error && <p className="text-red-600 font-medium">Failed to load presenters: {error}</p>}

      <div className="grid md:grid-cols-3 gap-6">
        {bios?.map((p: IPresenterBio) => (
          <div
            key={p._id}
            className="flex flex-col items-center bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition"
          >
            <img
              src={p.image?.url || "/placeholder-avatar.png"}
              alt={p.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-yellow-500 mb-3"
            />
            <h3
              className="text-lg font-semibold text-gray-900 hover:text-blue-600"
              onClick={() => handleClick(p._id)}
            >
              {p.name}
            </h3>
          </div>
        ))}
      </div>

      {!loading && bios?.length === 0 && (
        <p className="text-gray-500">No presenters found.</p>
      )}
    </div>
  );
};

export default SettingsPage;
