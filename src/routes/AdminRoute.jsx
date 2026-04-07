import { Navigate } from "react-router-dom";
//protege rutas solo accesibles para super administradores
export default function AdminRoute({ children }) {
  const userJson = localStorage.getItem("user");
  // Si no hay usuario en localStorage, redirige al login
  if (!userJson) {
    return <Navigate to="/" replace />;
  }
  let user = null;
  //intenta parsear el usuario guardado
  try {
    user = JSON.parse(userJson);
  } catch (error) {
    return <Navigate to="/" replace />;
  }
  //valida si el usuario tiene permisos de super administrador
  const esSuperAdmin =
    user?.is_admin === true ||
    user?.is_admin === "true" ||
    user?.rol === "Súper Administrador";
  //si no es super admin, lo redirige a la app normal
  if (!esSuperAdmin) {
    return <Navigate to="/app" replace />;
  }
  // Si es super admin, permite el acceso
  return children;
}