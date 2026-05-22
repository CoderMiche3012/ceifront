import { Navigate } from "react-router-dom";
import { obtenerUsuario } from "../storage/userStorage";

// protege rutas exclusivas para administradores
export default function AdminRoute({ children }) {

  const usuario = obtenerUsuario();

  // sin sesión válida
  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  // no es administrador
  if (!usuario.esAdmin) {
    return <Navigate to="/app" replace />;
  }

  return children;
}