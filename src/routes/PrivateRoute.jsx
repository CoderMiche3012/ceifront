import { Navigate } from "react-router-dom";
import { obtenerAccessToken } from "../storage/userStorage";

// protege rutas que requieren autenticación
export default function PrivateRoute({ children }) {
  const token = obtenerAccessToken();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}