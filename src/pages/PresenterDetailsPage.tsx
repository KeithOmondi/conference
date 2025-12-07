import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "../store/store";
import {
  fetchPresenterBio,
  clearSelectedBio,
  type IPresenterBio,
} from "../store/slices/presenterBioSlice";

// Define the established theme colors for consistency
const DARK_BACKGROUND = "#0F3B35";
const ACCENT_GOLD = "#C6A64F";
const PRIMARY_GREEN = "#005A2B"; // Used for text/accents in the info box

const PresenterDetailsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { selectedBio, loading, error } = useSelector(
    (state: RootState) => state.presenterBios
  );

  useEffect(() => {
    if (id) dispatch(fetchPresenterBio(id));

    return () => {
      dispatch(clearSelectedBio());
    };
  }, [dispatch, id]);

  // --- Loading/Error States ---

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: DARK_BACKGROUND }}
      >
        <p className="text-xl italic" style={{ color: ACCENT_GOLD }}>
          Loading presenter details…
        </p>
      </div>
    );
  }

  if (error || !selectedBio) {
    const message = error
      ? `Error: Failed to load presenter: ${error}`
      : "Presenter not found.";
    const textColor = error ? "text-red-400" : "text-gray-400";

    return (
      <div
        className="min-h-screen p-10 flex flex-col items-center justify-center text-center"
        style={{ backgroundColor: DARK_BACKGROUND }}
      >
        <p className={`text-2xl font-medium ${textColor} mb-6`}>{message}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 rounded-full font-bold uppercase tracking-wider transition shadow-lg"
          style={{ backgroundColor: ACCENT_GOLD, color: DARK_BACKGROUND }}
        >
          ← Back
        </button>
      </div>
    );
  }

  // --- Main Content ---

  const presenter = selectedBio as IPresenterBio;
  const imageUrl = presenter.image?.url || "/placeholder-avatar.png";

  return (
    <div
      className="min-h-screen text-white"
      style={{ backgroundColor: DARK_BACKGROUND }}
    >
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 rounded-full font-bold uppercase tracking-wider transition shadow-lg mb-10"
          style={{ backgroundColor: ACCENT_GOLD, color: DARK_BACKGROUND }}
        >
          ← Back to Speakers
        </button>

        {/* HEADER: Summit Info Box */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          {/* Info Box - Now using a structured, framed look */}
          <div
            className="p-6 md:p-10 rounded-2xl shadow-2xl max-w-3xl w-full border-4"
            style={{
              backgroundColor: ACCENT_GOLD + "E0",
              borderColor: PRIMARY_GREEN,
              color: PRIMARY_GREEN,
            }}
          >
            <h2
              className="text-lg md:text-xl font-bold mb-2 tracking-wide border-b-2 pb-1"
              style={{ borderColor: PRIMARY_GREEN }}
            >
              HIGH COURT OF KENYA
            </h2>
            <h1 className="text-2xl md:text-2xl font-extrabold uppercase mb-3">
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
        <div
          className="relative py-10 px-6 md:py-16 md:px-8 rounded-3xl shadow-2xl"
          style={{
            backgroundColor: DARK_BACKGROUND,
            border: `3px solid ${ACCENT_GOLD}`,
          }}
        >
          {/* Decorative Corner Motif */}
          <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 overflow-hidden">
            <div
              className="absolute inset-0 transform translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full opacity-30"
              style={{ backgroundColor: ACCENT_GOLD }}
            ></div>
          </div>

          {/* 🛑 FIX: Removed lg:flex-row to force stacking on all screens, and used items-center to center content */}
          <div className="flex flex-col items-center gap-10 relative z-10">
            {/* Presenter Image */}
            <div className="relative w-60 h-60 md:w-80 md:h-80">
              <img
                src={imageUrl}
                alt={presenter.name}
                className="w-full h-full object-cover rounded-full shadow-2xl"
                style={{ border: `6px solid ${ACCENT_GOLD}` }}
              />
            </div>

            {/* Presenter Details (Name and Title) - Now full width and centered */}
            <div className="w-full pt-4 text-center">
              <div className="mb-6">
                <h2
                  className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none"
                  style={{ color: ACCENT_GOLD }}
                >
                  {presenter.name}
                </h2>
                {presenter.title && (
                  <p className="text-xl md:text-2xl font-light mt-3 italic text-gray-200">
                    {presenter.title}
                  </p>
                )}
              </div>

              <hr
                className="my-8 opacity-30"
                style={{ borderColor: ACCENT_GOLD }}
              />
            </div>
          </div>

          {/* Biography Section */}
          <div
            className="p-4 rounded-xl border-2 mt-8"
            style={{
              backgroundColor: DARK_BACKGROUND,
              borderColor: ACCENT_GOLD + "40",
              boxShadow: `0 0 15px -5px ${ACCENT_GOLD}`,
            }}
          >
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: ACCENT_GOLD }}
            >
              Biography
            </h3>
            <p className="text-lg text-gray-300 whitespace-pre-line leading-relaxed">
              {presenter.description}
            </p>
          </div>
        </div>

        {/* Footer Accent */}
        <div className="flex justify-between items-end mt-12 pt-4 border-t border-gray-700/50">
          {/* Judiciary Logo */}
          <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 overflow-hidden opacity-80">
            <img
              src="https://res.cloudinary.com/drls2cpnu/image/upload/v1765116373/The_Jud_rmzqa7.png" // Replace with actual logo
              alt="Judiciary Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div
            className="flex items-center space-x-2 text-sm font-bold opacity-80"
            style={{ color: ACCENT_GOLD }}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: ACCENT_GOLD }}
            ></div>
            <span className="text-base">highcourt.judiciary.go.ke</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresenterDetailsPage;
