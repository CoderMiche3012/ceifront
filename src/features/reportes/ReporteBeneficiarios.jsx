import { useState } from "react";

import EncabezadoPagina from "../../components/shared/EncabezadoPagina";
import ReporteBeneficiariosTab from "./components/BeneficiariosGeneral";
import ReporteAcademicoTab from "./components/ReporteAcademicoTab";
import ReporteApoyosEconomicosTab from "./components/ReporteApoyosEconomicosTab";
import ReporteObligacionesTab from "./components/ReporteObligacionesTab";
import ReporteAsistenciasTab from "./components/ReporteAsistencias";
import { usePermissions } from "../../context/PermissionsContext";

export default function ReporteBeneficiarios() {
  const [tabActiva, setTabActiva] = useState("general");
  const { hasModulePermission, loading: isPermsLoading, } = usePermissions();
  const canViewEscuela = hasModulePermission("datos_escolares", "ver");
  const canViewApoyos = hasModulePermission("apoyos", "ver");
  const canViewServicios = hasModulePermission("servicios", "ver");
  const canViewObligaciones = hasModulePermission("obligaciones", "ver");

  const tabsConfig = {
    general: {
      titulo: "Reporte General de Beneficiarios",
      descripcion:
        "Consulta, filtra y exporta información relacionada con los beneficiarios registrados.",
    },
    rendimiento: {
      titulo: "Reporte de Rendimiento Académico",
      descripcion:
        "Analiza el desempeño académico y los indicadores escolares de los beneficiarios.",
    },
    apoyos: {
      titulo: "Reporte de Reembolsos",
      descripcion:
        "Consulta y exporta información sobre los reembolsos otorgados a los beneficiarios.",
    },
    obligaciones: {
      titulo: "Reporte de Obligaciones",
      descripcion:
        "Visualiza el cumplimiento de obligaciones y compromisos de los beneficiarios.",
    },
    asistencias: {
      titulo: "Reporte de Asistencias",
      descripcion:
        "Consulta estadísticas y registros de asistencia de los beneficiarios.",
    },
  };

  const { titulo, descripcion } = tabsConfig[tabActiva];

  return (
    <section className="flex flex-col h-full">
      {/* Encabezado y tabs fijos */}
      <div className="sticky top-0 z-10 bg-[#f3f1f4]">
        <EncabezadoPagina
          titulo={titulo}
          descripcion={descripcion}
        />

        <div className="border-b border-gray-200">
          <nav className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setTabActiva("general")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tabActiva === "general"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              General
            </button>
            {canViewEscuela &&(
              <button
                onClick={() => setTabActiva("rendimiento")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tabActiva === "rendimiento"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                Rendimiento Académico
              </button>
            )}
            {canViewApoyos &&(
              <button
                onClick={() => setTabActiva("apoyos")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tabActiva === "apoyos"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                Reembolsos
              </button>
            )}
            {canViewObligaciones &&(
              <button
                onClick={() => setTabActiva("obligaciones")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tabActiva === "obligaciones"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                Obligaciones
              </button>
            )}
            {canViewServicios &&(
              <button
                onClick={() => setTabActiva("asistencias")}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tabActiva === "asistencias"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                Asistencias
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Contenido con scroll */}
      <main className="flex-1 overflow-y-auto custom-scroll pt-4">
        {tabActiva === "general" && <ReporteBeneficiariosTab />}

        {tabActiva === "rendimiento" && (
          <ReporteAcademicoTab />
        )}

        {tabActiva === "apoyos" && (
          <ReporteApoyosEconomicosTab />
        )}

        {tabActiva === "obligaciones" && (
          <ReporteObligacionesTab />
        )}

        {tabActiva === "asistencias" && (
          <ReporteAsistenciasTab />
        )}
      </main>
    </section>
  );
}