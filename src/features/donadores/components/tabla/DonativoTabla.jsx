import { useMemo } from "react";
import { Pencil } from "lucide-react";

import { ui } from "../../../../styles/ui/index";

import DatosTabla from "../../../../components/tablas/DatosTabla";
import AccionesTabla from "../../../../components/tablas/AccionesTabla";

import { formatMoney } from "../../../../utils/formatMoney";

export default function DonativoTabla({ donativos = [], onEditar, canEdit }) {
  const columns = useMemo(() => {
    const baseColumns = [
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
    ];

    if (canEdit) {
      baseColumns.push({
        key: "acciones",
        label: "Acciones",
      });
    }

    return baseColumns;
  }, [canEdit]);

  const renderCell = (item, key) => {
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
            {formatMoney(item.monto, item.moneda)}
          </span>
        );

      case "fecha":
        return (
          <span className={ui.text.muted} >
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
                icon: <Pencil className="h-4 w-4" />,
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
      columns={columns}
      data={donativos}
      renderCell={renderCell}
      rowKey="id_donativo"
    />
  );
}