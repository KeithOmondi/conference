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
              src="https://res.cloudinary.com/drls2cpnu/image/upload/v1765116373/The_Jud_rmzqa7.png" // Replace with actual logo
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
