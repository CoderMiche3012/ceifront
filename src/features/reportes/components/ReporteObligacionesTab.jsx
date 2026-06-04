import Card from "../../../components/ui/Card";
import Boton from "../../../components/ui/Boton";

import TarjetasEstadisticas from "../../../components/shared/TarjetasEstadisticas";
import FiltrosReporte from "../../../components/tablas/FiltrosReporte";
import DatosTabla from "../../../components/tablas/DatosTabla";
import PaginacionTabla from "../../../components/tablas/PaginacionTabla";

import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  FileSpreadsheet,
} from "lucide-react";

export default function ReporteObligacionesTab() {
  return (
    <div className="space-y-6">

      {/* 📊 ESTADÍSTICAS */}
      <TarjetasEstadisticas
        items={[
          {
            label: "Total Obligaciones",
            value: 0,
            icon: FileText,
            color: "blue",
          },
          {
            label: "Entregadas",
            value: 0,
            icon: CheckCircle,
            color: "emerald",
          },
          {
            label: "Pendientes",
            value: 0,
            icon: Clock,
            color: "amber",
          },
          {
            label: "Canceladas",
            value: 0,
            icon: XCircle,
            color: "red",
          },
        ]}
      />

      <Card>

        {/* 🔎 FILTROS */}
        <FiltrosReporte
          search=""
          onSearchChange={() => {}}
          searchPlaceholder="Buscar beneficiario..."

          filtros={[
            {
              key: "tipo",
              value: "",
              onChange: () => {},
              options: [
                { value: "", label: "Todas las obligaciones" },
                { value: "carta", label: "Carta Donante" },
                { value: "servicio", label: "Servicio Social" },
              ],
            },
            {
              key: "estatus",
              value: "",
              onChange: () => {},
              options: [
                { value: "", label: "Todos los estatus" },
                { value: "pendiente", label: "Pendiente" },
                { value: "entregado", label: "Entregado" },
                { value: "cancelado", label: "Cancelado" },
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
          ]}
        />

        {/* 📋 TABLA */}
        <DatosTabla
          columns={[
            {
              key: "beneficiario",
              label: "Beneficiario",
            },
            {
              key: "obligacion",
              label: "Obligación",
            },
            {
              key: "estatus",
              label: "Estatus",
            },
            {
              key: "fecha",
              label: "Fecha",
            },
          ]}
          data={[]}
          rowKey="id_obligacion"
        />

        {/* 📄 PAGINACIÓN */}
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