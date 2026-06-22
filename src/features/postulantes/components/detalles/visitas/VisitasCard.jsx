import EstudioCard from "./EstudioCard";
import FotosCard from "./FotosCard";
import VitasTab from "./VitasTab";

import { usePermissions } from "../../../../../context/PermissionsContext";
export default function VisitasCard({
  data,
  visitas,
  estudio
}) {

  const { hasModulePermission, loading: isPermsLoading, } = usePermissions();
  const canEditPostulante = hasModulePermission("postulantes", "editar");
  const puedeEditar = canEditPostulante && !["aceptado"].includes(data?.estatus_postulante?.toLowerCase());

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="space-y-6 xl:col-span-2">
        <VitasTab
          visitas={visitas}
          data={data}
          puedeEditar={puedeEditar}
        />

        <EstudioCard
          data={data}
          estudio={estudio}
          puedeEditar={puedeEditar}
        />
      </div>

      <div className="space-y-6 xl:col-span-1">
        <FotosCard data={data}
          puedeEditar={puedeEditar}
        />
      </div>
    </div>
  );
}