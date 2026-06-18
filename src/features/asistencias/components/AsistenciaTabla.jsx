import DatosTabla from "../../../components/tablas/DatosTablaCheck";
import AsistenciaCell from "./AsistenciaCell";
import Boton from "../../../components/ui/Boton";

export default function AsistenciasTabla({
  beneficiarios,
  dias,
  cambios,
  seguimientoMap,
  onCambio,
  onGuardar,
  guardando,
  hayCambios,
  filters,
}) {
  //columnas para los beneficiarios y las fechas
  const columns = [
    {
      key: "beneficiario",
      label: "Beneficiario",
      className: "min-w-[260px] sticky left-0 bg-white z-10 text-left px-6",
    },
    ...dias.map((d) => ({
      key: d.id,
      label: d.label,
      className: "min-w-[120px] text-center",
    })),
  ];
  const renderCell = (item, key) => {
    //columna de nombre del beneficiario
    if (key === "beneficiario") {
      return (
        <span className="font-semibold uppercase text-xs text-slate-700">
          {item.nombreCompleto}
        </span>
      );
    }
    //celdas de asistencia (Días de la semana)
    const seguimientoPadre = seguimientoMap?.[item.id] ?? null;
    // en caso de existentes
    const asistenciaExistente = item.asistencias?.find(
      (h) =>
        h.fecha_realizacion === key &&
        h.tipo_servicio === filters.servicio
    );
    //identificador unico para el estado local de cambios
    const registroKey = `${item.id}-${key}`;
    // de acuerdo a si hay datos o no
    const datoVisual = cambios[registroKey] || asistenciaExistente || {
      asistencia: false,
      numero_acompanantes: 0,
      id_servicio: null,
      id_asistencia_servicio: null
    };
    const currentId = datoVisual.id_servicio || datoVisual.id_asistencia_servicio;
    return (
      <div className="flex justify-center items-center w-full">
        <AsistenciaCell
          dato={{
            ...datoVisual,
            id_beneficiario: item.id,
            id_seguimiento: seguimientoPadre?.id_seguimiento,
            fecha_realizacion: key,
            tipo_servicio: filters.servicio,
            id_asistencia_servicio: currentId
          }}
          onCambio={(payload) =>
            onCambio({
              ...payload,
              id_beneficiario: item.id,
              id_seguimiento: seguimientoPadre?.id_seguimiento,
              fecha_realizacion: key,
              tipo_servicio: filters.servicio,
              id_asistencia_servicio: currentId || null
            })
          }
        />
      </div>
    );
  };
  console.log("TABLA", beneficiarios);
  console.log("COLUMNAS", columns);
  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <DatosTabla
          columns={columns}
          data={beneficiarios}
          renderCell={renderCell}
          rowKey="id"
        />
      </div>
    </div>
  );
}

