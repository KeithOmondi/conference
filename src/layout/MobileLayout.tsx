import { type ReactNode, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";
import type { AppDispatch } from "../store/store";

// Lucide Icons
import {
  Home,
  Calendar,
  FileText,
  BookOpen,
  User,
} from "lucide-react";

interface Props {
  children?: ReactNode;
}

const MobileLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  // Determine active tab
  const activeTab = useMemo(() => {
    if (location.pathname.startsWith("/schedule")) return "schedule";
    if (location.pathname.startsWith("/presentation")) return "presentation";
    if (location.pathname.startsWith("/documents")) return "documents";
    if (location.pathname.startsWith("/settings")) return "settings";
    return "home";
  }, [location.pathname]);

  // Bottom nav items with icons
  const navItems = [
    { label: "Home", icon: Home, path: "/", key: "home" },
    { label: "Program", icon: Calendar, path: "/schedule", key: "schedule" },
    {
      label: "Presentation",
      icon: BookOpen,
      path: "/presentation",
      key: "presentation",
    },
    {
      label: "Documents",
      icon: FileText,
      path: "/documents",
      key: "documents",
    },
    { label: "Bios", icon: User, path: "/settings", key: "settings" },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center relative max-w-md mx-auto">
      {/* Header */}
      <header className="w-full bg-[#005A2B] text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-30">
        <h1 className="text-base font-bold leading-tight">
          ANNUAL HIGH COURT HUMAN RIGHTS SUMMIT 2025
        </h1>
        <button
          className="bg-[#C6A64F] px-3 py-1 rounded-md hover:bg-[#ad9043] transition"
          aria-label="Logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-y-auto p-4 pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav
        className="w-full h-16 bg-white shadow-inner flex justify-around items-center 
                   fixed bottom-0 left-1/2 -translate-x-1/2 max-w-md z-20 p-2 border-t"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center transition-all ${
                isActive ? "text-[#005A2B] font-semibold" : "text-gray-500"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
              <span className="text-xs mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileLayout;
