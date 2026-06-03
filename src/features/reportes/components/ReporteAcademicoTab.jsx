import Card from "../../../components/ui/Card";
import Boton from "../../../components/ui/Boton";

import TarjetasEstadisticas from "../../../components/shared/TarjetasEstadisticas";

import FiltrosReporte from "../../../components/tablas/FiltrosReporte";
import DatosTabla from "../../../components/tablas/DatosTabla";
import PaginacionTabla from "../../../components/tablas/PaginacionTabla";

import {
  GraduationCap,
  Trophy,
  BookOpen,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

export default function ReporteAcademicoTab() {
  return (
    <div className="space-y-6">
      <TarjetasEstadisticas
        items={[
          {
            label: "Promedio General",
            value: "0.0",
            icon: GraduationCap,
            color: "blue",
          },
          {
            label: "Alto Rendimiento",
            value: 0,
            icon: Trophy,
            color: "emerald",
          },
          {
            label: "Rendimiento Medio",
            value: 0,
            icon: BookOpen,
            color: "amber",
          },
          {
            label: "Bajo Rendimiento",
            value: 0,
            icon: AlertTriangle,
            color: "red",
          },
        ]}
      />

      <Card>
        <FiltrosReporte
          search=""
          onSearchChange={() => {}}
          searchPlaceholder="Buscar beneficiario..."
          filtros={[
            {
              key: "periodo",
              value: "",
              onChange: () => {},
              options: [
                { value: "", label: "Todos los periodos" },
                { value: "2024-2025", label: "2024-2025" },
              ],
            },
            {
              key: "nivel",
              value: "",
              onChange: () => {},
              options: [
                { value: "", label: "Todos los niveles" },
                { value: "primaria", label: "Primaria" },
                { value: "secundaria", label: "Secundaria" },
                { value: "bachillerato", label: "Bachillerato" },
                { value: "universidad", label: "Universidad" },
              ],
            },
            {
              key: "rendimiento",
              value: "",
              onChange: () => {},
              options: [
                { value: "", label: "Todos" },
                { value: "alto", label: "Alto (≥ 8)" },
                { value: "medio", label: "Medio (6 - 7.9)" },
                { value: "bajo", label: "Bajo (< 6)" },
              ],
            },
          ]}
          acciones={[
            {
              component: Boton,
              variant: "secondary",
              icon: FileSpreadsheet,
              label: "Exportar Excel",
              onClick: () => {},
            },
            {
              component: Boton,
              icon: FileText,
              label: "Descargar PDF",
              onClick: () => {},
            },
          ]}
        />

        <DatosTabla
          columns={[
            {
              key: "beneficiario",
              label: "Beneficiario",
            },
            {
              key: "escuela",
              label: "Escuela",
            },
            {
              key: "grado",
              label: "Grado",
            },
            {
              key: "promedio",
              label: "Promedio",
            },
            {
              key: "estatusAcademico",
              label: "Estatus Académico",
            },
          ]}
          data={[
            {
              id_beneficiario: 1,
              beneficiario: "Ana López",
              escuela: "Primaria Benito Juárez",
              grado: "6°",
              promedio: "9.4",
              estatusAcademico: "Alto Rendimiento",
            },
            {
              id_beneficiario: 2,
              beneficiario: "Carlos Pérez",
              escuela: "Secundaria Técnica 12",
              grado: "2°",
              promedio: "7.3",
              estatusAcademico: "Rendimiento Medio",
            },
            {
              id_beneficiario: 3,
              beneficiario: "María García",
              escuela: "COBAO Plantel 01",
              grado: "4° Semestre",
              promedio: "5.8",
              estatusAcademico: "Bajo Rendimiento",
            },
          ]}
          rowKey="id_beneficiario"
        />

        <PaginacionTabla
          currentPage={1}
          totalPages={1}
          totalItems={3}
          pageSize={10}
          onPageChange={() => {}}
        />
      </Card>

      {/* Gráfico */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          Distribución por Rangos de Promedio
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Alto Rendimiento (≥ 8)</span>
              <span>18</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-emerald-500 h-4 rounded-full w-[60%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Rendimiento Medio (6 - 7.9)</span>
              <span>10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-amber-500 h-4 rounded-full w-[30%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Bajo Rendimiento (&lt; 6)</span>
              <span>4</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-red-500 h-4 rounded-full w-[10%]" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}