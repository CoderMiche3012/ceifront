import HistorialBase from "../Historial";
import ResumenServicioSocialCard from "./servicioSocial/ResumenServicioSocialCard";
import CartaCard from "./carta/CartaCard";
import { usePermissions } from "../../../../../../context/PermissionsContext";
import { usePeriodoActivo } from "../../../../../periodos/hooks/usePeriodos";

export default function HistorialObligacionesCard({ data }) {
  const { hasModulePermission, loading: isPermsLoading, } = usePermissions();
  const canEditObligaciones = hasModulePermission("obligaciones", "editar");
  const canCreateObligaciones = hasModulePermission("obligaciones", "crear")
  const canViewHistorial = hasModulePermission("historial", "ver");
  const canEditHistorial = hasModulePermission("historial", "editar");

  const { data: periodoActivo, isLoading: loadingPeriodo } = usePeriodoActivo();
  const esPeriodoActivo = (item) =>
    item.id_periodo === periodoActivo?.id_periodo;

  const puedeEditarEnItem = (item) => {
    if (canEditHistorial) return true;
    return esPeriodoActivo(item);
  };

  const obtenerEstado = (obligaciones = []) => {
    if (!obligaciones.length) {
      return {
        texto: "Sin obligaciones",
        color: "text-slate-500",
      };
    }

    const tienePendientes = obligaciones.some(
      (o) => o.estatus?.toLowerCase() === "pendiente"
    );

    return tienePendientes
      ? {
        texto: "Obligaciones pendientes",
        color: "text-amber-600",
      }
      : {
        texto: "Cumplió con todas sus obligaciones",
        color: "text-emerald-600",
      };
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
      title="Historial de Obligaciones"
      items={historialFiltrado}
      periodos={periodosFiltrados}
      periodoActivo={data?.periodoActivo}

      renderTitulo={(item, periodo) => (
        <p className="text-sm font-semibold text-slate-800">
          {periodo?.ciclo_escolar || "Periodo"}
        </p>
      )}

      renderSubtitulo={(item) => {
        const estado = obtenerEstado(item.obligaciones);

        return (
          <p className={`text-xs font-medium ${estado.color}`}>
            {estado.texto}
          </p>
        );
      }}

      renderMeta={(item) => {
        const total = item.obligaciones?.length || 0;
        const pendientes =
          item.obligaciones?.filter(
            (o) => o.estatus?.toLowerCase() === "pendiente"
          ).length || 0;

        return (
          <div className="text-right">
            <p className="text-[10px] uppercase text-slate-400 font-semibold">
              Pendientes
            </p>
            <p
              className={`text-sm font-bold ${pendientes > 0
                ? "text-amber-600"
                : "text-emerald-600"
                }`}
            >
              {pendientes}/{total}
            </p>
          </div>
        );
      }}

      renderDetalle={(item) => {
        const editablePorPermisoPeriodo = puedeEditarEnItem(item);

        const editableFinal =
          editablePorPermisoPeriodo && item.estatus === "Activo";

        return (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ResumenServicioSocialCard
                seguimiento={item}
                editable={editableFinal && canEditObligaciones}
                canCreateObligaciones={editableFinal && canCreateObligaciones}
              />

              <CartaCard
                seguimiento={item}
                editable={editableFinal && canEditObligaciones}
                canCreateObligaciones={editableFinal && canCreateObligaciones}
              />
            </div>
          </div>
        );
      }}
    />
  );
}