import { Navigate } from "react-router-dom";
import { obtenerUsuario } from "../storage/userStorage";

export default function AdminRoute({ children }) {
  const usuario = obtenerUsuario();

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  if (!(usuario?.esAdmin || usuario?.esSuperUser)) {
    return <Navigate to="/app" replace />;
  }

  return children;
}