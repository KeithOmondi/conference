import Home from "./pages/HomePage";
import Login from "./pages/Login";
import Schedule from "./pages/SchedulePage";
import Messages from "./pages/MessagesPage";
import Settings from "./pages/SettingsPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MobileLayout from "./layout/MobileLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/login" element={<Login />} />

        {/* Mobile layout wrapper for app pages */}
        <Route
          path="/*"
          element={
            <MobileLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </MobileLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
