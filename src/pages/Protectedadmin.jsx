import { Navigate } from "react-router-dom";

export default function ProtectedAdmin({ children }) {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) {
    return <Navigate to="/" replace />;
  }

  let user;
  try {
    user = JSON.parse(storedUser);
  } catch (err) {
    console.error("Error parsing user from localStorage:", err);
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  // Only allow managers into /admin
  if (user.role !== "manager") {
    return <Navigate to="/" replace />;
  }

  return children;
}
