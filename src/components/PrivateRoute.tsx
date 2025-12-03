import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import type { JSX } from "react";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useAppSelector((state) => state.auth);

  // If not logged in, redirect to login page
  return user ? children : <Navigate to="/login" replace />;
}
