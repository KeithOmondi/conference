import React, { type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface Props {
  children: ReactNode;
}

const MobileLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = () => {
    if (location.pathname.startsWith("/schedule")) return "schedule";
    if (location.pathname.startsWith("/messages")) return "messages";
    if (location.pathname.startsWith("/settings")) return "settings";
    return "home";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start relative">
      {/* Header */}
      <header className="w-full bg-blue-600 text-white p-4 shadow-md flex justify-between items-center z-10 relative">
        <h1 className="text-lg font-bold">Judges Conference</h1>
        <button className="bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-400">
          Profile
        </button>
      </header>

      {/* Scrollable page content */}
      <main className="flex-1 w-full max-w-md overflow-y-auto p-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="w-full h-16 bg-white shadow-inner p-2 flex justify-around items-center fixed bottom-0 left-0 max-w-md z-20">
        <button
          className={`flex flex-col items-center ${
            activeTab() === "home" ? "text-blue-600" : "text-gray-500"
          }`}
          onClick={() => navigate("/")}
        >
          <span className="material-icons">home</span>
          <span className="text-xs">Home</span>
        </button>

        <button
          className={`flex flex-col items-center ${
            activeTab() === "schedule" ? "text-blue-600" : "text-gray-500"
          }`}
          onClick={() => navigate("/schedule")}
        >
          <span className="material-icons">calendar_today</span>
          <span className="text-xs">Schedule</span>
        </button>

        <button
          className={`flex flex-col items-center ${
            activeTab() === "messages" ? "text-blue-600" : "text-gray-500"
          }`}
          onClick={() => navigate("/messages")}
        >
          <span className="material-icons">chat</span>
          <span className="text-xs">Messages</span>
        </button>

        <button
          className={`flex flex-col items-center ${
            activeTab() === "settings" ? "text-blue-600" : "text-gray-500"
          }`}
          onClick={() => navigate("/settings")}
        >
          <span className="material-icons">settings</span>
          <span className="text-xs">Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default MobileLayout;
