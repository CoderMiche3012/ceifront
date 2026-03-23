import { Navigate } from "react-router-dom";
//protege rutas que requieren autenticación
export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("access");
  const userJson = localStorage.getItem("user");
  //si no hay token o usuario, redirige al login
  if (!token || !userJson) {
    return <Navigate to="/" replace />;
  }
  //si está autenticado, permite el acceso
  return children;
}