import Card from "../../../components/ui/Card";
import Boton from "../../../components/ui/Boton";

import TarjetasEstadisticas from "../../../components/shared/TarjetasEstadisticas";

import FiltrosReporte from "../../../components/tablas/FiltrosReporte";
import DatosTabla from "../../../components/tablas/DatosTabla";
import PaginacionTabla from "../../../components/tablas/PaginacionTabla";

import {
  HandCoins,
  Wallet,
  DollarSign,
  Euro,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

export default function HistorialDonativosTab() {
  return (
    <div className="space-y-6">
      <TarjetasEstadisticas
        items={[
          {
            label: "Total Donativos",
            value: 0,
            icon: HandCoins,
            color: "blue",
          },
          {
            label: "MXN",
            value: "$0",
            icon: Wallet,
            color: "emerald",
          },
          {
            label: "USD",
            value: "$0",
            icon: DollarSign,
            color: "amber",
          },
          {
            label: "EUR",
            value: "€0",
            icon: Euro,
            color: "violet",
          },
        ]}
      />

      <Card>
        <FiltrosReporte
          search=""
          onSearchChange={() => {}}
          searchPlaceholder="Buscar donador..."
          filtros={[
            {
              key: "periodo",
              value: "",
              onChange: () => {},
              options: [
                {
                  value: "",
                  label: "Todos los períodos",
                },
              ],
            },
            {
              key: "moneda",
              value: "",
              onChange: () => {},
              options: [
                {
                  value: "",
                  label: "Todas las monedas",
                },
                {
                  value: "MXN",
                  label: "Pesos Mexicanos",
                },
                {
                  value: "USD",
                  label: "Dólares",
                },
                {
                  value: "EUR",
                  label: "Euros",
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
              key: "fecha",
              label: "Fecha",
            },
            {
              key: "donador",
              label: "Donador",
            },
            {
              key: "concepto",
              label: "Concepto",
            },
            {
              key: "monto",
              label: "Monto",
            },
            {
              key: "moneda",
              label: "Moneda",
            },
            {
              key: "registrado_por",
              label: "Registrado por",
            },
          ]}
          data={[]}
          rowKey="id_donativo"
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