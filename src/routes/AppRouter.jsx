import { BrowserRouter, Routes, Route } from "react-router-dom";

import InicioSesion from "../pages/InicioSesion";
import Inicio from "../pages/Inicio";

//import UsuariosPagina from "../pages/UsuariosPagina";
import RolesPagina from "../pages/RolesPagina";
//import PeriodosPagina from "../pages/PeriodosPagina";

//import PostulantesPagina from "../pages/postulantes/PostulantesPagina";
//import ExpedientePagina from "../pages/postulantes/ExpedientePagina";

//import BeneficiariosPagina from "../pages/beneficiarios/BeneficiariosPagina";
//import ExpedientePaginaB from "../pages/beneficiarios/ExpedientePaginaB";

//import DonadoresPagina from "../pages/donadores/DonadoresPagina";
//import DonadoresDetalle from "../pages/donadores/DonadoresDetalle";

//import AsistenciasPagina from "../pages/AsistenciasPagina";

import AppLayout from "../components/layout/AppLayout";

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import PermissionRoute from "./PermissionRoute";

import { PermissionsProvider } from "../context/PermissionsContext";

// define las rutas principales
export default function AppRouter() {

  return (
    <BrowserRouter>

      <PermissionsProvider>

        <Routes>

          {/* rutas públicas */}
          <Route path="/" element={<InicioSesion />} />
          <Route path="/login" element={<InicioSesion />} />

          {/* rutas privadas */}
          <Route
            path="/app"
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >

            {/* inicio */}
            <Route index element={<Inicio />} />

            {/* periodos 
            <Route
              path="periodos"
              element={
                <PermissionRoute
                  modulo="periodos"
                  accion="ver"
                >
                  <PeriodosPagina />
                </PermissionRoute>
              }
            />
*/}
            {/* beneficiarios 
            <Route
              path="beneficiarios"
              element={
                <PermissionRoute
                  modulo="beneficiarios"
                  accion="ver"
                >
                  <BeneficiariosPagina />
                </PermissionRoute>
              }
            />

            <Route
              path="beneficiarios/expediente/:id"
              element={
                <PermissionRoute
                  modulo="beneficiarios"
                  accion="ver"
                >
                  <ExpedientePaginaB />
                </PermissionRoute>
              }
            />
*/}
            {/* asistencias 
            <Route
              path="asistencias"
              element={
                <PermissionRoute
                  modulo="beneficiarios"
                  accion="ver"
                >
                  <AsistenciasPagina />
                </PermissionRoute>
              }
            />
*/}
            {/* donadores 
            <Route
              path="donadores"
              element={
                <PermissionRoute
                  modulo="donadores"
                  accion="ver"
                >
                  <DonadoresPagina />
                </PermissionRoute>
              }
            />

            <Route
              path="donadores/donador/:id"
              element={
                <PermissionRoute
                  modulo="donadores"
                  accion="ver"
                >
                  <DonadoresDetalle />
                </PermissionRoute>
              }
            />
*/}
            {/* usuarios 
            <Route
              path="usuarios"
              element={
                <PermissionRoute
                  modulo="usuarios"
                  accion="ver"
                >
                  <UsuariosPagina />
                </PermissionRoute>
              }
            />
*/}
            {/* roles */}
            <Route
              path="roles"
              element={
                <AdminRoute>
                  <RolesPagina />
                </AdminRoute>
              }
            />

            {/* postulantes 
            <Route path="ingresos">

              <Route
                index
                element={
                  <PermissionRoute
                    modulo="postulantes"
                    accion="ver"
                  >
                    <PostulantesPagina />
                  </PermissionRoute>
                }
              />

              <Route
                path="expediente/:id"
                element={
                  <PermissionRoute
                    modulo="postulantes"
                    accion="ver"
                  >
                    <ExpedientePagina />
                  </PermissionRoute>
                }
              />

            </Route>
*/}
          </Route>

        </Routes>

      </PermissionsProvider>

    </BrowserRouter>
  );
}