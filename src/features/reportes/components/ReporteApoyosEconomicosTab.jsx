import Card from "../../../components/ui/Card";
import Boton from "../../../components/ui/Boton";

import TarjetasEstadisticas from "../../../components/shared/TarjetasEstadisticas";

import FiltrosReporte from "../../../components/tablas/FiltrosReporte";
import DatosTabla from "../../../components/tablas/DatosTabla";
import PaginacionTabla from "../../../components/tablas/PaginacionTabla";

import {
  HandCoins,
  Wallet,
  Clock3,
  Users,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

export default function ReporteApoyosEconomicosTab() {
  return (
    <div className="space-y-6">
      <TarjetasEstadisticas
        items={[
          {
            label: "Total de Apoyos",
            value: 0,
            icon: HandCoins,
            color: "blue",
          },
          {
            label: "Monto Entregado",
            value: "$0",
            icon: Wallet,
            color: "emerald",
          },
          {
            label: "Monto Pendiente",
            value: "$0",
            icon: Clock3,
            color: "amber",
          },
          {
            label: "Beneficiarios Apoyados",
            value: 0,
            icon: Users,
            color: "violet",
          },
        ]}
      />

      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold">
            Apoyos Económicos por Periodo
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Visualiza la distribución de apoyos económicos entregados en cada
            periodo.
          </p>

          <div className="h-64 flex items-center justify-center border rounded-lg mt-4 text-gray-400">
            Gráfico de apoyos por periodo
          </div>
        </div>

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
                {
                  value: "",
                  label: "Todos los periodos",
                },
              ],
            },
            {
              key: "estatus",
              value: "",
              onChange: () => {},
              options: [
                {
                  value: "",
                  label: "Todos",
                },
                {
                  value: "entregado",
                  label: "Entregado",
                },
                {
                  value: "pendiente",
                  label: "Pendiente",
                },
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
              key: "periodo",
              label: "Periodo",
            },
            {
              key: "total_recibido",
              label: "Total Recibido",
            },
            {
              key: "apoyos_entregados",
              label: "Entregados",
            },
            {
              key: "apoyos_pendientes",
              label: "Pendientes",
            },
            {
              key: "ultimo_apoyo",
              label: "Último Apoyo",
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