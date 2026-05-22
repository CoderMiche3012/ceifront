import { Calendar, Edit3 } from "lucide-react";
import { ui } from "../../../styles/uiClasses";
import InsigniaEstatus from "../../usuarios/components/insignias/InsigniaEstatus";
import { hasPermission } from "../../../utils/menuPermissions";
import { usePermissions } from "../../../context/PermissionsContext";

export default function PeriodoActivo({ periodoActivo, onEdit }) {
  const { permissions, loading: isPermsLoading } = usePermissions();

  const canEdit = hasPermission(permissions, "Editar Periodos");

  if (!periodoActivo) return null;

  return (
    <div className={`${ui.card} flex items-center justify-between`}>
      <div className="flex items-center gap-5">
        <div className={`${ui.iconBox} h-16 w-16`}>
          <Calendar className={ui.primaryIcon} size={32} />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <InsigniaEstatus
              status={periodoActivo.estado ? "Activo" : "Inactivo"}
            />

            <span className={ui.text.body }>
              Iniciado el {periodoActivo.fecha_inicio}
            </span>
          </div>

          <h2 className={ui.text.title}>
            {periodoActivo.ciclo_escolar}
          </h2>

          <p className={ui.text.body }>
            Fecha de término:{" "}
            <span className={ui.text.body }>
              {periodoActivo.fecha_fin}
            </span>
          </p>
        </div>
      </div>

      {!isPermsLoading && canEdit && (
        <button
          onClick={() => onEdit(periodoActivo)}
          title="Editar periodo"
          className="
            group
            rounded-2xl
            p-3
            transition-all
            hover:bg-slate-50
            hover:shadow-sm
          "
        >
          <Edit3
            size={20}
            className="text-slate-400 group-hover:text-[#0E5F63]"
          />
        </button>
      )}
    </div>
  );
}