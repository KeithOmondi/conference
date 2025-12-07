import logo from "../assets/judiciary-logo.jfif";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import React from "react";

// COLORS (Centralized for consistency)
const PRIMARY_GREEN = "#005A2B";
const ACCENT_GOLD = "#C6A64F";

// --- Styled WiFi Bar Component ---
const WiFiBar: React.FC = () => (
  <div className="w-full relative z-10">
    <div
      className="w-full flex flex-col md:flex-row items-start md:items-center justify-between p-3 rounded-xl shadow-lg border-l-8"
      style={{
        borderColor: ACCENT_GOLD,
        backgroundColor: "white",
      }}
    >
      {/* Connection Details Group */}
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-8 text-sm font-medium">
        {/* WiFi Name */}
        <span className="flex items-center space-x-1">
          <strong style={{ color: PRIMARY_GREEN }}>
            <span className="flex items-center">
              <span role="img" aria-label="wifi">
                📶
              </span>{" "}
              WiFi:
            </span>
          </strong>
          <span className="text-gray-800 font-bold">ekahotel</span>
        </span>

        {/* Password */}
        <span className="flex items-center space-x-1">
          <strong style={{ color: PRIMARY_GREEN }}>Password:</strong>
          <span className="text-gray-800 font-bold">GALAXY</span>
        </span>
      </div>

      {/* Access Code Hint */}
      <span
        className="text-xs italic mt-2 md:mt-0 px-2 py-1 rounded cursor-pointer transition-colors hover:bg-opacity-80"
        style={{ backgroundColor: ACCENT_GOLD, color: PRIMARY_GREEN }}
      >
        Choose Access Code
      </span>
    </div>
  </div>
);

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

      <div className="flex-1 w-full overflow-y-auto p-4 space-y-6">
        {/* WiFi Bar */}
        <WiFiBar />

        {/* User Card */}
        <div
          className="w-full max-w-md bg-white rounded-xl shadow-lg border-2 p-6 flex flex-col items-center mx-auto"
          style={{ borderColor: PRIMARY_GREEN }}
        >
          {/* Avatar (image or fallback letter) */}
          <div
            className="w-20 h-20 rounded-full overflow-hidden mb-3 flex items-center justify-center"
            style={{
              backgroundColor: PRIMARY_GREEN + "20",
              color: PRIMARY_GREEN,
            }}
          >
            {user.img ? (
              <img
                src={user.img}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold">{firstLetter}</span>
            )}
          </div>

          <h2
            className="font-semibold text-xl"
            style={{ color: PRIMARY_GREEN }}
          >
            {user.name}
          </h2>

          <p
            className="text-sm font-medium mt-1"
            style={{ color: ACCENT_GOLD }}
          >
            {user.role.toUpperCase()}
          </p>

          <p className="text-gray-600 text-sm mt-1">{user.email}</p>

          {user.station && (
            <p className="text-gray-600 text-sm mt-1">{user.station}</p>
          )}
        </div>

        {/* Welcome Message Section */}
        <div
          className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 mx-auto relative z-10 text-center border-t-4"
          style={{ borderColor: PRIMARY_GREEN }}
        >
          <h3
            className="text-2xl md:text-3xl font-extrabold mb-4"
            style={{ color: PRIMARY_GREEN }}
          >
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
