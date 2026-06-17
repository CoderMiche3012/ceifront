import HistorialBase from "../Historial";
import DetalleSeguimientoEconomico from "./DetalleSeguimientoEconomico";
import { usePermissions } from "../../../../../../context/PermissionsContext";


export default function HistorialEconomicoCard({ data }) {
  const { hasModulePermission, loading: isPermsLoading, } = usePermissions();
  const canEditApoyos = hasModulePermission("apoyos", "editar");
  const canCreateApoyos = hasModulePermission("apoyos", "crear")
  const calcularTotalPeriodo = (apoyos = []) => {
    return apoyos.reduce(
      (acc, apoyo) => acc + Number(apoyo.monto || 0),
      0
    );
  };

  return (
    <HistorialBase
      title="Historial Económico"
      items={data?.historial_seguimientos ?? []}
      periodos={data?.periodos ?? []}
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
        const esEditable = item.estatus === "Activo";

        return (
          <DetalleSeguimientoEconomico
            seguimiento={item}
            dataT={data}
            editable={esEditable && canEditApoyos}
            canCreateApoyos={esEditable && canCreateApoyos}
          />
        );
      }}
    />
  );
}