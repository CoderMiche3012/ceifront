import DatosTabla from "../../tablas/DatosTabla";
import InsigniaEstatus from "../../usuarios/insignias/InsigniaEstatus";

// columnas de periodos
const columns = [
  { key: "ciclo_escolar", label: "Periodo Escolar" },
  { key: "fecha_inicio", label: "Fecha de Inicio" },
  { key: "fecha_fin", label: "Fecha de Fin" },
  { key: "estado", label: "Estado" },
];

// muestra la información de cada periodo
export default function PeriodoTabla({ periodos }) {
  const renderCell = (periodo, key) => {
    switch (key) {
      case "ciclo_escolar":
        return (
          <span className="text-sm font-semibold text-slate-800">
            {periodo.ciclo_escolar}
          </span>
        );

      case "fecha_inicio":
        return (
          <span className="text-sm text-slate-500">
            {periodo.fecha_inicio}
          </span>
        );

      case "fecha_fin":
        return (
          <span className="text-sm text-slate-500">
            {periodo.fecha_fin}
          </span>
        );

      case "estado":
        return (
          <InsigniaEstatus status={periodo.estado ? "Activo" : "Inactivo"} />
        );

      default:
        return null;
    }
  };

  return (
    <DatosTabla
      columns={columns}
      data={periodos}
      renderCell={renderCell}
      rowKey="id_periodo"
    />
  );
}