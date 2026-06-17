import HistorialBase from "../Historial";
import ResumenServicioSocialCard from "./servicioSocial/ResumenServicioSocialCard";
import CartaCard from "./carta/CartaCard";
import { usePermissions } from "../../../../../../context/PermissionsContext";

export default function HistorialObligacionesCard({ data }) {
  const { hasModulePermission, loading: isPermsLoading, } = usePermissions();
  const canEditObligaciones = hasModulePermission("obligaciones", "editar");
  const canCreateObligaciones = hasModulePermission("obligaciones", "crear")
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

  return (
    <HistorialBase
      title="Historial de Obligaciones"
      items={data?.historial_seguimientos ?? []}
      periodos={data?.periodos ?? []}
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
        const esEditable = item.estatus === "Activo";

        return (
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ResumenServicioSocialCard
                seguimiento={item}
                editable={esEditable && canEditObligaciones}
                canCreateObligaciones={esEditable && canCreateObligaciones}
              />

              <CartaCard
                seguimiento={item}
                editable={esEditable && canEditObligaciones}
                canCreateObligaciones={esEditable && canCreateObligaciones}
              />
            </div>
          </div>
        );
      }}
    />
  );
}