import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import type { JSX } from "react";

export default function AdminProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user } = useAppSelector((state) => state.auth);

  // If no user, redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // If user exists but is not an admin
  if (user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is an admin → allow access
  return children;
}
