import { BrowserRouter, Routes, Route } from "react-router-dom";
import InicioSesion from "../pages/auth/InicioSesion";
import Inicio from "../pages/home/Inicio";
import UsuariosPagina from "../pages/usuarios/UsuariosPagina";
import RolesPagina from "../pages/roles/RolesPagina";
import AppLayout from "../layouts/AppLayout";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import PeriodosPagina from "./../pages/Periodos/PeriodosPagina"
import PostulantesPagina from "./../pages/postulantes/PostulantesPagina"
import { PermissionsProvider } from "../context/PermissionsContext";
import PermissionRoute from "./PermissionRoute";
//define las rutas principales 
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/*ruta publica*/}
        <Route path="/" element={<InicioSesion />} />
        {/*rutas protegidas dentro de /app */}
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <PermissionsProvider>
                <AppLayout />
              </PermissionsProvider>
            </PrivateRoute>
          }
        >
          {/*pagina principal*/}
          <Route index element={<Inicio />} />
          {/*gestión de Periodos */}
          <Route
            path="periodos"
            element={
              <PermissionRoute permiso="Ver Periodos">
                <PeriodosPagina />
              </PermissionRoute>
            }
          />
          {/*gestión de usuarios */}
          <Route
            path="usuarios"
            element={
              <PermissionRoute permiso="Ver Usuarios">
                <UsuariosPagina />
              </PermissionRoute>
            }
          />
          {/* gestión de roles */}
          <Route
            path="roles"
            element={
              <AdminRoute>
                <RolesPagina />
              </AdminRoute>
            }
          />
          <Route
            path="postulantes"
            element={
              <PostulantesPagina />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}