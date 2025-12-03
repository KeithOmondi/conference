import { type ReactNode } from "react";
import { Outlet, Link } from "react-router-dom";

interface Props {
  children?: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-5 space-y-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="space-y-3">
          <Link to="/admin" className="block hover:underline">
            Dashboard
          </Link>
          <Link to="/admin/presenters" className="block hover:underline">
            Presenters
          </Link>
          <Link to="/admin/programme" className="block hover:underline">
            Programme
          </Link>
          <Link to="/admin/users" className="block hover:underline">
            Users
          </Link>
          <Link to="/admin/settings" className="block hover:underline">
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {children ?? <Outlet />}
      </main>
    </div>
  );
}
