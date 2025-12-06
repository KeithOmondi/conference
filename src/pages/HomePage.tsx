import logo from "../assets/judiciary-logo.jfif";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const HomePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Please log in to view your dashboard.</p>
      </div>
    );
  }

  const firstLetter = user?.name?.charAt(0) ?? "?";

  return (
    <div className="min-h-screen bg-gray-100 relative flex flex-col">
      {/* Watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "300px",
          opacity: 0.05,
        }}
      />

      <div className="flex-1 w-full overflow-y-auto p-4">
        {/* WiFi bar */}
        <div className="w-full flex justify-end items-center mb-4 text-sm text-gray-600 space-x-2 relative z-10">
          <span>WiFi: JudicialNet</span>
          <span>Password: jud1c14ry</span>
          <span>📶</span>
        </div>

        {/* User Card */}
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border-2 border-[#005A2B] p-6 flex flex-col items-center mb-6 relative z-10 mx-auto">
          <div className="w-20 h-20 bg-[#005A2B]/20 rounded-full flex items-center justify-center text-2xl font-bold mb-3 text-[#005A2B]">
            {firstLetter}
          </div>

          <h2 className="font-semibold text-xl text-[#005A2B]">{user.name}</h2>
          <p className="text-[#C6A64F] text-sm font-medium mt-1">
            {user.role.toUpperCase()}
          </p>
          <p className="text-gray-600 text-sm mt-1">{user.email}</p>
          {user.station && <p className="text-gray-600 text-sm mt-1">{user.station}</p>}
        </div>

        {/* Welcome Message Section */}
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 mx-auto relative z-10 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#005A2B] mb-4">
            WELCOME TO THE ANNUAL HUMAN RIGHTS SUMMIT
          </h3>
          <p className="text-gray-700 text-lg md:text-xl">
            PLEASE DO ENJOY YOUR STAY
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
