import { useMemo } from "react";
import { Eye, Pencil, } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ui } from "../../../../styles/ui/uiClasses";

import Avatar from "../../../../components/shared/AvatarGeneral";
import Insignia from "../../../../components/ui/Insignia";
import AccionesTabla from "../../../../components/tablas/AccionesTabla";
import DatosTabla from "../../../../components/tablas/DatosTabla";

export default function DonadoresTabla({ donadores = [], onEditar, }) {
  const navigate = useNavigate();

  const columns =
    useMemo(() => {
      return [
        {
          key: "donador",
          label: "Donador",
        },
        {
          key: "tipo",
          label: "Tipo",
        },
        {
          key: "contacto",
          label: "Contacto",
        },
        {
          key: "asignados",
          label: "Niños Asignados",
        },
        {
          key: "donaciones",
          label: "Donaciones (Periodo Activo)",
        },
        {
          key: "estatus",
          label: "Estatus",
        },
        {
          key: "acciones",
          label: "Acciones",
        },
      ];
    }, []);

  const renderCell = (
    donador,
    key
  ) => {
    switch (key) {
      case "donador":
        return (
          <div className={ ui.table.userCell } >
            <Avatar
              nombre={ donador.nombre }
              apellidoP={ donador.apellido_p }
            />

            <div className="min-w-0">
              <p className={`truncate ${ui.text.body} font-semibold`} >
                { donador.nombre }{" "}
                { donador.apellido_p }{" "}
                { donador.apellido_m }
              </p>
            </div>
          </div>
        );

      case "tipo": {
        const tipoVariant = {
          CEI: "cei",
          CANFRO: "canfro",
          OYE: "oye",
        };

        return (
          <Insignia
            label={donador.tipo}
            variant={ tipoVariant[donador.tipo] || "default"}
          />
        );
      }

      case "contacto":
        return (
          <div>
            <p className={ ui.text.body } >
              { donador.correo }
            </p>
            <p className={ ui.text.caption } >
              { donador.telefono }
            </p>
          </div>
        );

      case "asignados": {
        const total = donador. beneficiarios_apoyados ?.length || 0;

        if (total === 0) {
          return (
            <Insignia
              label="Sin asignar"
              variant="slate"
            />
          );
        }

        return (
          <span className={ ui.text.body } >
            {total}{" "}
            {total === 1 ? "niño" : "niños"}
          </span>
        );
      }
      case "donaciones": {
        const totales = donador.totalesPeriodoActivo || {};
        const monedas = Object.entries( totales );
        if ( monedas.length === 0 ) {
          return (
            <Insignia
              label="Sin donaciones"
              variant="slate"
            />
          );
        }

        return (
          <div className="space-y-1">
            {monedas.map( ([ moneda, monto,]) => (
                <p key={ moneda } className={ ui.text.body } >
                  { moneda } : $ {Number( monto ).toLocaleString( "es-MX" )}
                </p>
              )
            )}
          </div>
        );
      }

      case "estatus":
        return (
          <Insignia
            status={ donador.estatus }
          />
        );

      case "acciones":
        return (
          <AccionesTabla
            row={donador}
            actions={[
              {
                label: "Ver",
                icon: ( <Eye className="h-4 w-4" /> ),
                onClick: ( row ) => navigate( `/App/donadores/donador/${row.id_donador}` ),
              },
              {
                label: "Editar",
                icon: ( <Pencil className="h-4 w-4" /> ),
                onClick: onEditar,
              },
            ]}
          />
        );

      default:
        return null;
    }
  };

  return (
    <DatosTabla
      columns={ columns }
      data={ donadores }
      renderCell={ renderCell }
      rowKey="id_donador"
    />
  );
}