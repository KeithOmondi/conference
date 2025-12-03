import Home from "./pages/HomePage";
import Login from "./pages/Login";
import Schedule from "./pages/SchedulePage";
import Messages from "./pages/MessagesPage";
import Settings from "./pages/SettingsPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MobileLayout from "./layout/MobileLayout";
import PrivateRoute from "./components/PrivateRoute";

import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminLayout from "./layout/AdminLayout";
import AdminPresenters from "./pages/Admin/AdminPresenters";
import AdminProgramme from "./pages/Admin/AdminProgramme";
import AdminUsers from "./pages/Admin/AdminUsers";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected mobile app */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <MobileLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </MobileLayout>
            </PrivateRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="presenters" element={<AdminPresenters />} />
                  <Route path="programme" element={<AdminProgramme />} />
                  <Route path="users" element={<AdminUsers />} />
                </Routes>
              </AdminLayout>
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
