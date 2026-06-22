import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import PermissionRoute from "./PermissionRoute";
import { PermissionsProvider } from "../context/PermissionsContext";
import AppLayout from "../components/layout/AppLayout";
import InicioSesion from "../pages/InicioSesion";
import Inicio from "../pages/Inicio";
import RolesPagina from "../pages/RolesPagina";
import UsuariosPagina from "../pages/UsuariosPagina";
import PeriodosPagina from "../pages/PeriodosPagina";
import DonadoresPagina from "../pages/donadores/DonadoresPagina";
import DonadoresDetalle from "../pages/donadores/DonadoresDetalle";
import PostulantesPagina from "../pages/postulantes/PostulantesPagina";
import ExpedientePagina from "../pages/postulantes/ExpedientePagina";
import ReportePostulantes from "../features/reportes/ReportePostulantes";
import BeneficiariosPagina from "../pages/beneficiarios/BeneficiariosPagina";
import ExpedientePaginaB from "../pages/beneficiarios/ExpedientePaginaB";
import AsistenciasPagina from "../pages/AsistenciasPagina";
import ReporteDonativos from "../features/reportes/ReporteDonativos";
import ReporteBeneficiarios from "../features/reportes/ReporteBeneficiarios";

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

            {/* roles */}
            <Route
              path="roles"
              element={
                <AdminRoute>
                  <RolesPagina />
                </AdminRoute>
              }
            />

            {/* usuarios */}
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

            {/* periodos */}
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
            <Route
              path="asistencias"
              element={
                <PermissionRoute
                  modulo="servicios"
                  accion="ver"
                >
                  <AsistenciasPagina />
                </PermissionRoute>
              }
            />
            <Route
              path="reportes/donadores"
              element={
                <PermissionRoute
                  permisos={[
                    { modulo: "donadores", accion: "ver" },
                    { modulo: "reportes", accion: "exportar" }
                  ]}
                >
                  <ReporteDonativos />
                </PermissionRoute>
              }
            />
            <Route
              path="reportes/beneficiarios"
              element={
                <PermissionRoute
                  permisos={[
                    { modulo: "beneficiarios", accion: "ver" },
                    { modulo: "reportes", accion: "exportar" }
                  ]}
                >
                  <ReporteBeneficiarios />
                </PermissionRoute>
              }
            />
            <Route
              path="reportes/ingresos"
              element={
                <PermissionRoute
                  permisos={[
                    { modulo: "postulantes", accion: "ver" },
                    { modulo: "reportes", accion: "exportar" }
                  ]}
                >
                  <ReportePostulantes />
                </PermissionRoute>
              }
            />

          </Route>

        </Routes>

      </PermissionsProvider>

    </BrowserRouter>
  );
}