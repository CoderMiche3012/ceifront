import { Navigate } from "react-router-dom";
import {
  obtenerAccessToken,
  obtenerUsuario,
} from "../storage/userStorage";

// protege rutas que requieren autenticación
export default function PrivateRoute({ children }) {

  const token = obtenerAccessToken();
  const usuario = obtenerUsuario();

  // si no existe sesión válida
  if (!token || !usuario) {
    return <Navigate to="/" replace />;
  }

  // si está autenticado permite acceso
  return children;
}