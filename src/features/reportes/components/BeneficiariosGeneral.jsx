import Card from "../../../components/ui/Card";
import Boton from "../../../components/ui/Boton";

import TarjetasEstadisticas from "../../../components/shared/TarjetasEstadisticas";

import FiltrosReporte from "../../../components/tablas/FiltrosReporte";
import DatosTabla from "../../../components/tablas/DatosTabla";
import PaginacionTabla from "../../../components/tablas/PaginacionTabla";

import {
  Users,
  UserCheck,
  UserX,
  GraduationCap,
  PauseCircle,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

export default function ReporteBeneficiariosTab() {
  return (
    <div className="space-y-6">
      <TarjetasEstadisticas
        items={[
          {
            label: "Total Beneficiarios",
            value: 0,
            icon: Users,
            color: "blue",
          },
          {
            label: "Activos",
            value: 0,
            icon: UserCheck,
            color: "emerald",
          },
          {
            label: "Inactivos",
            value: 0,
            icon: UserX,
            color: "red",
          },
          {
            label: "Graduados",
            value: 0,
            icon: GraduationCap,
            color: "violet",
          },
          {
            label: "En Pausa",
            value: 0,
            icon: PauseCircle,
            color: "amber",
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
              ],
            },
            {
              key: "estatus",
              value: "",
              onChange: () => {},
              options: [
                { value: "", label: "Todos" },
                { value: "activo", label: "Activo" },
                { value: "inactivo", label: "Inactivo" },
                { value: "graduado", label: "Graduado" },
                { value: "pausa", label: "En Pausa" },
              ],
            },
            {
              key: "escolaridad",
              value: "",
              onChange: () => {},
              options: [
                { value: "", label: "Todas" },
              ],
            },
            {
              key: "donador",
              value: "",
              onChange: () => {},
              options: [
                { value: "", label: "Todos los donadores" },
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
              key: "nombre",
              label: "Nombre",
            },
            {
              key: "edad",
              label: "Edad",
            },
            {
              key: "escolaridad",
              label: "Escolaridad",
            },
            {
              key: "escuela",
              label: "Escuela",
            },
            {
              key: "estatus",
              label: "Estatus",
            },
            {
              key: "donador",
              label: "Donador",
            },
          ]}
          data={[]}
          rowKey="id_beneficiario"
        />

        <PaginacionTabla
          currentPage={1}
          totalPages={1}
          totalItems={0}
          pageSize={10}
          onPageChange={() => {}}
        />
      </Card>
    </div>
  );
}