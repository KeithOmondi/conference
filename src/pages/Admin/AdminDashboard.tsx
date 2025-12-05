// src/pages/Admin/Dashboard.tsx

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to the admin panel. Here you can manage users, presentations, and more.
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example cards */}
        <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <p className="text-gray-500">Manage all registered users.</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Presentations</h2>
          <p className="text-gray-500">View, approve, or delete presentations.</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Reports</h2>
          <p className="text-gray-500">Generate activity and analytics reports.</p>
        </div>
      </main>
    </div>
  );
}
