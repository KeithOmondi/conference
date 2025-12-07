import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../store/store";
import {
  fetchPresenterBio,
  clearSelectedBio,
  type IPresenterBio,
} from "../store/slices/presenterBioSlice";

const PresenterDetailsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { selectedBio, loading, error } = useSelector(
    (state: RootState) => state.presenterBios
  );

  useEffect(() => {
    if (id) dispatch(fetchPresenterBio(id));

    // Cleanup: return a function that calls dispatch
    return () => {
      dispatch(clearSelectedBio());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600 italic">
          Loading presenter details…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-10">
        <p className="text-xl text-red-600 font-medium">
          Error: Failed to load presenter: {error}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
        >
          ← Back
        </button>
      </div>
    );
  }

  if (!selectedBio) {
    return (
      <div className="min-h-screen bg-gray-50 p-10">
        <p className="text-xl text-gray-500">Presenter not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
        >
          ← Back
        </button>
      </div>
    );
  }

  const presenter = selectedBio as IPresenterBio;
  const imageUrl = presenter.image?.url || "/placeholder-avatar.png";

  return (
    <div className="min-h-screen bg-[#0F3B35] text-white">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-yellow-500 text-[#0F3B35] rounded-full font-bold uppercase tracking-wider hover:bg-yellow-400 transition shadow-lg mb-8"
        >
          ← Back to Speakers
        </button>

        {/* HEADER: Judiciary Logo + Summit Info Box */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
          {/* Info Box */}
          <div className="bg-yellow-500/90 text-[#0F3B35] p-6 md:p-10 rounded-xl shadow-xl max-w-3xl">
            <h2 className="text-lg md:text-xl font-bold mb-2 tracking-wide">
              HIGH COURT OF KENYA
            </h2>
            <h1 className="text-2xl md:text-3xl font-extrabold uppercase mb-2">
              ANNUAL HUMAN RIGHTS SUMMIT 2025
            </h1>
            <p className="text-sm md:text-base font-semibold uppercase mb-1">
              8TH - 10TH DECEMBER
            </p>
            <p className="text-sm md:text-base font-semibold uppercase leading-snug">
              THEME: UPHOLDING HUMAN DIGNITY, ETHICAL LEADERSHIP AS A PILLAR OF
              CONSTITUTIONALISM
            </p>
          </div>
        </div>

        {/* Main Presenter Card */}
        <div className="relative bg-[#0F3B35] p-6 md:p-12 border-2 border-yellow-500 rounded-2xl shadow-2xl">
          {/* Decorative Circle (top-right corner) */}
          <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 overflow-hidden">
            <div className="absolute inset-0 transform translate-x-1/2 -translate-y-1/2 w-full h-full bg-yellow-600/70 rounded-full"></div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
            {/* Presenter Image */}
            <div className="relative flex-shrink-0 w-48 h-48 md:w-72 md:h-72">
              <img
                src={imageUrl}
                alt={presenter.name}
                className="w-full h-full object-cover rounded-full border-8 border-white shadow-2xl"
              />
            </div>

            {/* Presenter Details */}
            <div className="flex-1 pt-4 text-center md:text-left">
              <div className="inline-block bg-black px-8 py-3 relative mb-4">
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-yellow-500 transform -skew-x-[30deg] -translate-x-1/3"></div>
                <h2 className="relative z-10 text-4xl md:text-6xl font-extrabold tracking-tighter">
                  {presenter.name}
                </h2>
              </div>

              {presenter.title && (
                <p className="text-2xl font-light text-yellow-500 mt-2 italic">
                  {presenter.title}
                </p>
              )}

              <hr className="my-8 border-yellow-500/30" />

              {/* Biography */}
              <div className="bg-black/20 p-6 rounded-lg border border-yellow-500/20">
                <h3 className="text-3xl font-bold text-yellow-500 mb-4">
                  Biography
                </h3>
                <p className="text-lg text-gray-200 whitespace-pre-line leading-relaxed">
                  {presenter.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Accent */}
        <div className="flex justify-between mt-8">
          {/* Judiciary Logo */}
          <div className="w-28 h-28 md:w-32 md:h-32 flex-shrink-0 overflow-hidden">
            <img
              src="data:image/png;base64,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" // Replace with actual logo
              alt="Judiciary Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center space-x-2 text-sm font-bold text-yellow-500">
            <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
            <span className="text-sm">highcourt.judiciary.go.ke</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresenterDetailsPage;
