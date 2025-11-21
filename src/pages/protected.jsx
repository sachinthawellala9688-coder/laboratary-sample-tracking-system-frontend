import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  // Not logged in at all
  if (!token || !storedUser) {
    return <Navigate to="/" replace />;
  }

  // Optional: if user JSON is corrupted, force re-login
  let user;
  try {
    user = JSON.parse(storedUser);
  } catch (err) {
    console.error("Error parsing user from localStorage:", err);
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  if (user.role !== "lab technician") {
    return <Navigate to="/" replace />;
  }

  return children;
}
