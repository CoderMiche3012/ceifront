import { useMemo } from "react";
import { Pencil } from "lucide-react";

import { ui } from "../../../../styles/ui/uiClasses";

import DatosTabla from "../../../../components/tablas/DatosTabla";
import AccionesTabla from "../../../../components/tablas/AccionesTabla";

import { formatMoney } from "../../../../utils/formatMoney";

export default function DonativoTabla({ donativos = [], onEditar, }) {
  const columns =
    useMemo(() => {
      return [
        {
          key: "concepto",
          label: "Concepto",
        },
        {
          key: "monto",
          label: "Monto",
        },
        {
          key: "fecha",
          label: "Fecha",
        },
        {
          key: "acciones",
          label: "Acciones",
        },
      ];
    }, []);

  const renderCell = ( item, key ) => {
    switch (key) {
      case "concepto":
        return (
          <span className={`${ui.text.body} font-semibold`} >
            {item.concepto || "--"}
          </span>
        );

      case "monto":
        return (
          <span className="text-sm font-medium text-emerald-600">
            {formatMoney( item.monto, item.moneda )}
          </span>
        );

      case "fecha":
        return (
          <span className={ ui.text.muted } >
            {item.fecha || "--"}
          </span>
        );

      case "acciones":
        return (
          <AccionesTabla
            row={item}
            actions={[
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
      data={ donativos }
      renderCell={ renderCell }
      rowKey="id_donativo"
    />
  );
}