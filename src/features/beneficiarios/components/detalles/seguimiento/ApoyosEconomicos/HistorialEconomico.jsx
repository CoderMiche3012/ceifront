import HistorialBase from "../Historial";
import DetalleSeguimientoEconomico from "./DetalleSeguimientoEconomico";
import { usePermissions } from "../../../../../../context/PermissionsContext";
import { usePeriodoActivo } from "../../../../../periodos/hooks/usePeriodos";

export default function HistorialEconomicoCard({ data }) {
  const { hasModulePermission, loading: isPermsLoading, } = usePermissions();
  const canEditApoyos = hasModulePermission("apoyos", "editar");
  const canCreateApoyos = hasModulePermission("apoyos", "crear")
  const canViewHistorial = hasModulePermission("historial", "ver");
  const canEditHistorial = hasModulePermission("historial", "editar");
  const { data: periodoActivo, isLoading: loadingPeriodo } = usePeriodoActivo();
  const esPeriodoActivo = (item) =>
    item.id_periodo === periodoActivo?.id_periodo;

  const puedeEditarEnItem = (item) => {
    if (canEditHistorial) return true;
    return esPeriodoActivo(item);
  };
  const calcularTotalPeriodo = (apoyos = []) => {
    return apoyos.reduce(
      (acc, apoyo) => acc + Number(apoyo.monto || 0),
      0
    );
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
      title="Historial Económico"
      items={historialFiltrado}
      periodos={periodosFiltrados}
      periodoActivo={data?.periodoActivo}

      /* TÍTULO */
      renderTitulo={(item, periodo) => (
        <p className="text-sm font-semibold text-slate-800">
          Periodo escolar: {periodo?.ciclo_escolar || "Ciclo"}
        </p>
      )}

      /* SUBTÍTULO */
      renderSubtitulo={(item) => (
        <p className="text-xs text-slate-500">
          {item.apoyos_economicos?.length || 0} apoyos registrados
        </p>
      )}

      /* LADO DERECHO */
      renderMeta={(item) => (
        <div className="text-right">
          <p className="text-[10px] uppercase text-slate-400 font-semibold">
            Total Periodo
          </p>

          <p className="text-sm font-bold text-teal-600">
            $
            {calcularTotalPeriodo(
              item.apoyos_economicos
            ).toLocaleString("es-MX")}
          </p>
        </div>
      )}

      /* DETALLE */
      renderDetalle={(item) => {
        const editablePorPermisoPeriodo = puedeEditarEnItem(item);

        const editableFinal =
          editablePorPermisoPeriodo && item.estatus === "Activo";

        return (
          <DetalleSeguimientoEconomico
            seguimiento={item}
            dataT={data}
            editable={editableFinal && canEditApoyos}
            canCreateApoyos={editableFinal && canCreateApoyos}
          />
        );
      }}
    />
  );
}