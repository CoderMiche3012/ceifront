import { BrowserRouter, Routes, Route } from "react-router-dom";
import InicioSesion from "../pages/InicioSesion";
import Inicio from "../pages/Inicio";
import UsuariosPagina from "../pages/UsuariosPagina";
import RolesPagina from "../pages/RolesPagina";
import AppLayout from "../components/layout/AppLayout";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import PeriodosPagina from "./../pages/PeriodosPagina"
import PostulantesPagina from "./../pages/postulantes/PostulantesPagina"
import ExpedientePagina from "../pages/postulantes/ExpedientePagina";
import { PermissionsProvider } from "../context/PermissionsContext";
import PermissionRoute from "./PermissionRoute";
import BeneficiariosPagina from "../pages/beneficiarios/BeneficiariosPagina";
import ExpedientePaginaB from "../pages/beneficiarios/ExpedientePaginaB";
import DonadoresPagina from "../pages/donadores/DonadoresPagina";
import DonadoresDetalle from "../pages/donadores/DonadoresDetalle";
import AsistenciasPagina from "../pages/AsistenciasPagina";
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
          <Route
            path="beneficiarios"
            element={
              <PermissionRoute permiso="Ver Beneficiarios">
                <BeneficiariosPagina />
              </PermissionRoute>
            }
          />

          <Route
            path="asistencias"
            element={
              <PermissionRoute permiso="Ver Beneficiarios">
                <AsistenciasPagina />
              </PermissionRoute>
            }
          />

          <Route
            path="beneficiarios/expediente/:id"
            element={
              <PermissionRoute permiso="Ver Beneficiarios">
                <ExpedientePaginaB />
              </PermissionRoute>
            }
          />


          <Route
            path="donadores"
            element={
              <PermissionRoute permiso="Ver Donadores">
                <DonadoresPagina />
              </PermissionRoute>
            }
          />

          <Route
            path="donadores/donador/:id"
            element={
              <PermissionRoute permiso="Ver Donadores">
                <DonadoresDetalle />
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
          <Route path="ingresos">
            <Route index element={
              <PermissionRoute permiso="Ver Postulantes">
                <PostulantesPagina />
              </PermissionRoute>
            } />

            <Route
              path="expediente/:id"
              element={
                <PermissionRoute permiso="Ver Postulantes">
                  <ExpedientePagina />
                </PermissionRoute>
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}