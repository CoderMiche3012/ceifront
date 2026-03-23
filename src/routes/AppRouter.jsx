import { BrowserRouter, Routes, Route } from "react-router-dom";
import InicioSesion from "../pages/auth/InicioSesion";
import Inicio from "../pages/home/Inicio";
import UsuariosPagina from "../pages/usuarios/UsuariosPagina";
import RolesPagina from "../pages/roles/RolesPagina";
import AppLayout from "../layouts/AppLayout";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

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
              <AppLayout />
            </PrivateRoute>
          }
        >
          {/*pagina principal*/}
          <Route index element={<Inicio />} />
          {/*gestión de usuarios */}
          <Route path="usuarios" element={<UsuariosPagina />} />
          {/* gestión de roles */}
          <Route
            path="roles"
            element={
              <AdminRoute>
                <RolesPagina />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}