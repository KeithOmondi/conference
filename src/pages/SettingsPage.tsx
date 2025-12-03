import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchPresenters,
  selectPresenters,
  selectPresentersLoading,
  selectPresentersError,
  type Presenter,
} from "../store/slices/presenterSlice";
import type { AppDispatch } from "../store/store";

const SettingsPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const presenters = useSelector(selectPresenters);
  const loading = useSelector(selectPresentersLoading);
  const error = useSelector(selectPresentersError);

  useEffect(() => {
    dispatch(fetchPresenters());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Presenters / Bios</h2>

      {loading && <p className="text-gray-500">Loading presenters...</p>}

      {error && (
        <p className="text-red-600 font-medium">
          Failed to load presenters: {error}
        </p>
      )}

      <ul className="bg-white shadow rounded-lg p-4 space-y-4">
        {!loading && presenters?.length === 0 && (
          <p className="text-gray-500">No presenters found.</p>
        )}

        {presenters?.map((p: Presenter) => (
          <li
            key={p._id}
            className="border-b last:border-none pb-3 flex items-center gap-4"
          >
            <img
              src={p.image || "/placeholder-avatar.png"}
              alt={p.name}
              className="w-14 h-14 rounded-full object-cover border"
            />

            <div>
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-sm text-gray-600">{p.title || "Presenter"}</p>

              {p.bio && (
                <p className="text-xs text-gray-500 line-clamp-2">
                  {p.bio}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SettingsPage;
