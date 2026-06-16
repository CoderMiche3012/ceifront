import EstatusCard from "./EstatusCard";
import RecomendacionCard from "./RecomendacionCard";
import { usePermissions } from "../../../../../context/PermissionsContext";

export default function Resultados({ data }) {
  const { hasModulePermission } = usePermissions();

  const aceptarPostulante = hasModulePermission("postulantes", "aceptar");
  const rechazarPostulante = hasModulePermission("postulantes", "rechazar");

  const puedeVerEstatus = aceptarPostulante && rechazarPostulante;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className={puedeVerEstatus ? "lg:col-span-2" : "lg:col-span-3"}>
        <RecomendacionCard data={data} />
      </div>

      {puedeVerEstatus && (
        <div>
          <EstatusCard data={data} />
        </div>
      )}
    </div>
  );
}