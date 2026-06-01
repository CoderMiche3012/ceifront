import DatosTabla from "../../../../../../../components/tablas/DatosTabla";
import {Pencil,LockKeyhole,Trash2,Check,} from "lucide-react";
import { formatMoney } from "../../../../../../../utils/formatMoney";

const COLUMNS = [
  { key: "concepto", label: "Concepto" },
  { key: "estatus", label: "Estatus" },
  { key: "monto", label: "Monto" },
  { key: "fecha", label: "Fecha de rembolso" },
  { key: "acciones", label: "Acciones" },
];

export default function ApoyoTabla({
  donativos = [],
  onEditar,
  onEliminar,
  onEntregar,
}) {
  const renderCell = (item, key) => {
    switch (key) {
      case "concepto":
        return (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-800">
              {item.concepto || "--"}
            </span>

            <span className="text-xs text-slate-400">
              Apoyo #{item.id_apoyo}
            </span>
          </div>
        );

      case "estatus":
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${item.estatus === "Entregado"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
              }`}
          >
            {item.estatus || "--"}
          </span>
        );

      case "monto":
        return (
          <span className="text-sm font-semibold text-emerald-600">
            {formatMoney(item.monto)}
          </span>
        );

      case "fecha":
        return item.estatus ===
          "Pendiente" ? (
          <div className="flex items-center gap-2 text-amber-600">
            <LockKeyhole size={14} />

            <span className="text-sm font-medium">
              Pendiente
            </span>
          </div>
        ) : (
          <span className="text-sm text-slate-700">
            {item.fecha || "--"}
          </span>
        );

      case "acciones":
  return (
    <div className="flex items-center gap-2">
      {/* ENTREGAR */}
      <button
        onClick={() =>
          item.estatus === "Pendiente" &&
          onEntregar?.(item)
        }
        disabled={
          item.estatus === "Entregado"
        }
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-all ${
          item.estatus === "Entregado"
            ? "cursor-not-allowed bg-slate-100 text-slate-300"
            : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
        }`}
        title={
          item.estatus === "Entregado"
            ? "Apoyo ya entregado"
            : "Marcar como entregado"
        }
      >
        <Check size={18} />
      </button>

      {/* EDITAR */}
      <button
        onClick={() =>
          onEditar?.(item)
        }
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-teal-600 transition-all"
        title="Editar apoyo"
      >
        <Pencil size={18} />
      </button>

      <button
        onClick={() =>
          onEliminar?.(item)
        }
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
        title="Eliminar apoyo"
      >
        <Trash2 size={18} />
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
      rowKey="id_apoyo"
    />
  );
}