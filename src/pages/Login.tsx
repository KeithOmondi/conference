import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginUser } from "../store/slices/authSlice";

const JUDGE_IMAGE_URL =
  "https://res.cloudinary.com/drls2cpnu/image/upload/v1764746866/Justice_e548ka.jpg";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useAppSelector((state) => state.auth);

  const [pjNumber, setPJNumber] = useState("");

  // Auto-focus PJ Number
  useEffect(() => {
    document.getElementById("pjNumber")?.focus();
  }, []);

  // Redirect based on role immediately after successful login
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (loading) return;
      await dispatch(loginUser({ pj: pjNumber }));
    },
    [dispatch, pjNumber, loading]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 font-sans">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-xl overflow-hidden border border-gray-100">

        {/* HEADER */}
        <div className="relative p-10 pt-16 bg-white overflow-hidden">
          <div className="relative z-10 text-center">
            <h1 className="text-3xl font-black text-[#005A2B] leading-none tracking-tight mb-3">
              ANNUAL HIGH COURT HUMAN RIGHTS SUMMIT 2025
            </h1>
            <p className="text-3xl font-serif italic text-[#C6A64F] mb-6">
              A Message from the Principal Judge
            </p>

            <img
              src={JUDGE_IMAGE_URL}
              alt="Principal Judge"
              className="w-28 h-28 object-cover mt-2 mb-4 rounded-full shadow-xl border-4 border-white mx-auto ring-4 ring-[#C6A64F]/50"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/112x112?text=Judge";
              }}
            />

            <p className="mt-3 text-base text-gray-700 leading-relaxed text-justify">
              It is my personal pleasure to welcome you to the{" "}
              <strong>2025 Annual High Court Human Rights Summit</strong>. As
              always, we remain committed to strengthening access to justice,
              promoting fairness, and upholding constitutional guarantees for
              all.
            </p>

            <p className="mt-6 font-extrabold text-[#005A2B] text-lg">
              Hon. Justice Eric Ogola, EBS
            </p>
            <p className="text-base text-gray-600 -mt-1">
              Principal Judge, High Court
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="p-10 bg-white border-t-8 border-[#C6A64F]/80">
          <h2 className="text-3xl font-extrabold text-center mb-8 text-[#005A2B]">
            Authorized Access
          </h2>

          {error && (
            <div className="bg-red-50 text-red-700 font-medium p-4 rounded-lg mb-6 text-center border border-red-300 shadow-md">
              <span className="font-bold">Login Failed: </span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="pjNumber"
                className="block text-gray-700 mb-2 font-semibold text-lg"
              >
                PJ Number
              </label>
              <input
                id="pjNumber"
                type="password"
                className="w-full border border-gray-300 rounded-xl px-5 py-3 bg-gray-50 text-gray-800 
                focus:border-[#C6A64F] focus:ring-4 focus:ring-[#C6A64F]/20 outline-none transition-all duration-200 shadow-inner text-xl tracking-wider"
                placeholder="••••••••"
                value={pjNumber}
                onChange={(e) => setPJNumber(e.target.value)}
                required
                disabled={loading}
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              disabled={loading || pjNumber.length === 0}
              className="w-full bg-[#005A2B] text-white py-4 rounded-xl font-bold text-xl uppercase 
              hover:bg-[#004A25] transition-all duration-200 disabled:bg-gray-400 disabled:shadow-none 
              shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Authenticating...
                </div>
              ) : (
                "Secure Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
