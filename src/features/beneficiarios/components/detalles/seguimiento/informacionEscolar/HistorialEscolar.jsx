import HistorialBase from "./../Historial";
import DetalleSeguimientoEscolar from "./DetalleSeguimientoEscolar";
import { usePermissions } from "../../../../../../context/PermissionsContext";
import { usePeriodoActivo } from "../../../../../periodos/hooks/usePeriodos";

export default function HistorialEscolarCard({ data }) {
  const { hasModulePermission, loading: isPermsLoading, } = usePermissions();
  const canEditEscuela = hasModulePermission("datos_escolares", "editar");
  const canCreateEscuela = hasModulePermission("datos_escolares", "crear")
  const canViewHistorial = hasModulePermission("historial", "ver");
  const canEditHistorial = hasModulePermission("historial", "editar");

  const { data: periodoActivo, isLoading: loadingPeriodo } = usePeriodoActivo();
  const esPeriodoActivo = (item) =>
    item.id_periodo === periodoActivo?.id_periodo;

  const puedeEditarEnItem = (item) => {
    if (canEditHistorial) return true;
    return esPeriodoActivo(item);
  };
  const calcularPromedio = (boletas) => {
    if (!boletas?.length) return null;

    const suma = boletas.reduce(
      (acc, b) => acc + Number(b.promedio_boleta || 0),
      0
    );

    return (suma / boletas.length).toFixed(2);
  };
  const historialFiltrado = (data?.historial_seguimientos ?? []).filter((item) => {
    // si puede ver todo, no filtra
    if (canViewHistorial) return true;

    // si no puede ver todo, solo periodo activo
    return item.id_periodo === periodoActivo?.id_periodo;
  });

  const periodosFiltrados = !canViewHistorial
    ? (periodoActivo ? [periodoActivo] : [])
    : (data?.periodos ?? []);

  return (
    <HistorialBase
      title="Historial Escolar"
      items={historialFiltrado}
      periodos={periodosFiltrados}
      periodoActivo={data?.periodoActivo}

      renderTitulo={(item, periodo) => (
        <p className="text-sm font-semibold text-slate-800">
          Periodo escolar: {periodo?.ciclo_escolar || "Ciclo"}
        </p>
      )}

      renderSubtitulo={(item) => (
        <p className="text-xs text-slate-500">
          {item.datos_escolares?.id_escolaridad?.nivel_escolar || "Nivel"} •{" "}
          {item.datos_escolares?.id_escolaridad?.grado_escolar || "Grado"}
        </p>
      )}

      renderMeta={(item) => (
        <div className="text-right">
          <p className="text-[10px] uppercase text-slate-400 font-semibold">
            Promedio
          </p>
          <p className="text-sm font-bold text-teal-600">
            {calcularPromedio(item.datos_escolares?.boletas) ?? "--"}
          </p>
        </div>
      )}


      renderDetalle={(item) => {
        const editablePorPermisoPeriodo = puedeEditarEnItem(item);

        const editableFinal =
          editablePorPermisoPeriodo && item.estatus === "Activo";

        return (
          <DetalleSeguimientoEscolar
            seguimiento={item}
            id_expediente={data?.id_expediente}
            editable={editableFinal && canEditEscuela}
            canCreateEscuela={editableFinal && canCreateEscuela}
          />
        );
      }}
    />
  );
}