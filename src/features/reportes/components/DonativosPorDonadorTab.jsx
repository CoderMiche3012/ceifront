import Card from "../../../components/ui/Card";
import Boton from "../../../components/ui/Boton";

import TarjetasEstadisticas from "../../../components/shared/TarjetasEstadisticas";

import FiltrosReporte from "../../../components/tablas/FiltrosReporte";
import DatosTabla from "../../../components/tablas/DatosTabla";
import PaginacionTabla from "../../../components/tablas/PaginacionTabla";

import {
  Users,
  UserCheck,
  Trophy,
  HandCoins,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

export default function DonativosPorDonadorTab() {
  return (
    <div className="space-y-6">
      <TarjetasEstadisticas
        items={[
          {
            label: "Total Donadores",
            value: 0,
            icon: Users,
            color: "blue",
          },
          {
            label: "Donadores Activos",
            value: 0,
            icon: UserCheck,
            color: "emerald",
          },
          {
            label: "Mayor Participación",
            value: "-",
            icon: Trophy,
            color: "amber",
          },
          {
            label: "Total Donativos",
            value: 0,
            icon: HandCoins,
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
              key: "donador",
              label: "Donador",
            },
            {
              key: "cantidad_donativos",
              label: "Cantidad Donativos",
            },
            {
              key: "aportaciones",
              label: "Aportaciones",
            },
          ]}
          data={[]}
          rowKey="id_donador"
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