import { type ReactNode } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {  useSelector } from "react-redux";
import {
  MdDashboard,
  MdPeople,
  MdBusinessCenter,
  MdSchedule,
  MdSupervisorAccount,
  MdSettings,
} from "react-icons/md";
import {  logoutUser, selectAuth } from "../store/slices/authSlice";
import { useAppDispatch } from "../store/hooks";

interface Props {
  children?: ReactNode;
}

const navItems = [
  { to: "/admin/", icon: MdDashboard, label: "Dashboard" },
  { to: "/admin/presenters", icon: MdPeople, label: "Presenters" },
  { to: "/admin/presentions", icon: MdBusinessCenter, label: "Presentations" },
  { to: "/admin/programme", icon: MdSchedule, label: "Programme" },
  { to: "/admin/documents", icon: MdSettings, label: "Documents" },
  { to: "/admin/users", icon: MdSupervisorAccount, label: "Users" },
  { to: "/admin/settings", icon: MdSettings, label: "Settings" },
];

export default function AdminLayout({ children }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useSelector(selectAuth);

  const isLinkActive = (to: string) => {
    if (to === "/admin/") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    return location.pathname.startsWith(to);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#005A2B] text-white shadow-2xl p-6 flex flex-col sticky top-0 h-screen z-20">
        <div className="border-b border-[#C6A64F] pb-4 mb-6">
          <h2 className="text-2xl font-extrabold tracking-wider">Admin Panel</h2>
          <p className="text-sm text-[#C6A64F]">Judicial Management</p>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = isLinkActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center space-x-3 p-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#C6A64F] text-[#005A2B] shadow-md"
                    : "text-white hover:bg-[#005A2B]/80 hover:shadow-sm"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="pt-4 border-t border-[#C6A64F]/50">
          <button
            disabled={loading}
            onClick={handleLogout}
            className="w-full text-left p-3 text-sm text-gray-300 hover:text-white hover:bg-[#005A2B]/80 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8 p-4 bg-white rounded-xl shadow-lg border-l-4 border-[#C6A64F]">
          <h1 className="text-3xl font-bold text-[#005A2B]">
            {navItems.find((item) => isLinkActive(item.to))?.label || "Welcome"}
          </h1>
        </div>

        {children ?? <Outlet />}
      </main>
    </div>
  );
}
