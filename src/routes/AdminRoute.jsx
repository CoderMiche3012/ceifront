import { Navigate } from "react-router-dom";
import { obtenerUsuario } from "../storage/userStorage";

// protege rutas exclusivas para administradores
export default function AdminRoute({ children }) {

  const usuario = obtenerUsuario();
  console.log("ROUTE", usuario);
  // sin sesión válida
  if (!usuario) {
    return <Navigate to="/" replace />;
  }
  const isAdmin =
    usuario?.esAdmin === true ||
    usuario?.esAdmin === "true" ||
    usuario?.is_admin === true;

  // no es administrador
  if (!isAdmin) {
    return <Navigate to="/app" replace />;
  }

  return children;
}