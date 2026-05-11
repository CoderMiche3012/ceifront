import DatosTabla from "../../tablas/DatosTabla";
import { Pencil } from "lucide-react";
import  {formatMoney} from "../../../utils/formatMoney";

const COLUMNS = [
  { key: "concepto", label: "Concepto" },
  { key: "monto", label: "Monto" },
  { key: "fecha", label: "Fecha" },
  { key: "acciones", label: "Acciones" },
];

export default function DonativoTabla({
  donativos = [],
  onEditar,
}) {

  const renderCell = (item, key) => {
    switch (key) {
      case "concepto":
        return (
          <span className="text-sm font-semibold text-slate-800">
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
          <span className="text-sm text-slate-700">
            {item.fecha || "--"}
          </span>
        );

      case "acciones":
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onEditar?.(item)
              }
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-emerald-600 transition-all"
              title="Editar donativo"
            >
              <Pencil size={18} />
            </button>
          </div>
        );

      default:
        return null;
    }
  };
  return (

    <DatosTabla
      columns={COLUMNS}
      data={donativos}
      renderCell={renderCell}
      rowKey="id_donativo"
    />
  );
}