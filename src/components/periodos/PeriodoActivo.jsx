import { useEffect, useState } from "react";
import { Calendar, Edit3 } from "lucide-react";
import InsigniaEstatus from "../../components/usuarios/insignias/InsigniaEstatus";
import { obtenerPeriodos } from "../../services/periodoService"; 
import { hasPermission } from "../../utils/menuPermissions";
import { usePermissions } from "../../context/PermissionsContext";

export default function PeriodoActivo({ periodoActivo, onEdit }) {
  //permisos y estado de carga del Contexto Global
  const { permissions, loading: isPermsLoading } = usePermissions();
  const canEdit = hasPermission(permissions, "Editar Periodos");
  const [loading, setLoading] = useState(true);
  if (!periodoActivo) return null;
  return (
    <div className="flex items-center justify-between rounded-[24px] border border-[#dbe3eb] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div className="flex items-center gap-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f0f9f6]">
          <Calendar className="text-[#0e6b62]" size={32} />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-3">
      
            <InsigniaEstatus status={periodoActivo.estado ? "Activo" : "Inactivo"} />
            
            <span className="text-sm text-gray-400">
              Iniciado el {periodoActivo.fecha_inicio}
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-[#1e293b]">
            {periodoActivo.ciclo_escolar}
          </h2>

          <p className="text-sm text-gray-500">
            Fecha de término: <span className="font-semibold text-gray-700">
              {periodoActivo.fecha_fin}
            </span>
          </p>
        </div>
      </div>
      {!isPermsLoading && canEdit && (
      <button 
        onClick={() => onEdit(periodoActivo)}
        className="group rounded-full p-2 transition-colors hover:bg-gray-50"
        title="Editar periodo"
      >
      
        <Edit3 size={20} className="text-gray-400 group-hover:text-[#0e6b62]" />
      </button>
      )}
    </div>
  );
}