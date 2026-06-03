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
  HeartHandshake,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

export default function DirectorioDonadoresTab() {
  return (
    <div className="space-y-6">
      <TarjetasEstadisticas
        items={[
          {
            label: "Donadores Totales",
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
            color: "amber",
          },
          {
            label: "Beneficiarios Apoyados",
            value: 0,
            icon: HeartHandshake,
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
              key: "estatus",
              value: "",
              onChange: () => {},
              options: [
                {
                  value: "",
                  label: "Todos",
                },
                {
                  value: "activo",
                  label: "Activos",
                },
                {
                  value: "inactivo",
                  label: "Inactivos",
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
              key: "nombre",
              label: "Nombre",
            },
            {
              key: "telefono",
              label: "Teléfono",
            },
            {
              key: "correo",
              label: "Correo",
            },
            {
              key: "estatus",
              label: "Estatus",
            },
            {
              key: "beneficiarios_apoyados",
              label: "Beneficiarios",
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