import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [pj, setPJ] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await dispatch(loginUser({ email, pj }));

    if (loginUser.fulfilled.match(res)) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Judge Login
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 mb-1">Official Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-300"
              placeholder="example@court.go.ke"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* PJ Number */}
          <div>
            <label className="block text-gray-700 mb-1">PJ Number</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-300"
              placeholder="Enter PJ Number"
              value={pj}
              onChange={(e) => setPJ(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
