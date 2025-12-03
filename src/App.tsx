import Home from "./pages/HomePage";
import Login from "./pages/Login";
import Schedule from "./pages/SchedulePage";
import Messages from "./pages/MessagesPage";
import Settings from "./pages/SettingsPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MobileLayout from "./layout/MobileLayout";
import PrivateRoute from "./components/PrivateRoute";

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
      </Routes>
    </BrowserRouter>
  );
}
