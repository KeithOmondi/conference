import { type ReactNode } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
// Import icons (you'll need a library like react-icons)
import {
  MdDashboard,
  MdPeople,
  MdBusinessCenter,
  MdSchedule,
  MdSupervisorAccount,
  MdSettings,
} from "react-icons/md";

interface Props {
  children?: ReactNode;
}

// Define the navigation items
const navItems = [
  { to: "/admin/", icon: MdDashboard, label: "Dashboard" },
  { to: "/admin/presenters", icon: MdPeople, label: "Presenters" },
  { to: "/admin/presentions", icon: MdBusinessCenter, label: "Presentations" },
  { to: "/admin/programme", icon: MdSchedule, label: "Programme" },
  { to: "/admin/users", icon: MdSupervisorAccount, label: "Users" },
  { to: "/admin/settings", icon: MdSettings, label: "Settings" },
];

export default function AdminLayout({ children }: Props) {
  const location = useLocation();

  const isLinkActive = (to: string) => {
    // Special case for the base admin route
    if (to === "/admin/") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    return location.pathname.startsWith(to);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      {/* Set sidebar to fixed width, sticky position, and primary green background */}
      <aside className="w-64 bg-[#005A2B] text-white shadow-2xl p-6 flex flex-col sticky top-0 h-screen z-20">
        {/* Panel Title */}
        <div className="border-b border-[#C6A64F] pb-4 mb-6">
          <h2 className="text-2xl font-extrabold tracking-wider">
            Admin Panel
          </h2>
          <p className="text-sm text-[#C6A64F]">Judicial Management</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = isLinkActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`
                  flex items-center space-x-3 p-3 rounded-lg font-medium transition-all duration-200
                  ${
                    isActive
                      ? // Active Link: Accent Gold background, Primary Green text/icon
                        "bg-[#C6A64F] text-[#005A2B] shadow-md"
                      : // Inactive Link: Hover effect uses a lighter Primary Green
                        "text-white hover:bg-[#005A2B]/80 hover:shadow-sm"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer/Logout Placeholder */}
        <div className="pt-4 border-t border-[#C6A64F]/50">
          <button className="w-full text-left p-3 text-sm text-gray-300 hover:text-white hover:bg-[#005A2B]/80 rounded-lg transition-colors">
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header/Breadcrumb Placeholder */}
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
