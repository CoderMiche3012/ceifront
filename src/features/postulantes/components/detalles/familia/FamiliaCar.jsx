import ComposicionFamiliar from "../../../../expedientes/components/familia/ComposicionFamiliar";
import NotasFamilaCard from "../../../../expedientes/components/familia/NotasFamilaCard";
import { usePermissions } from "../../../../../context/PermissionsContext";

export default function FamiliaCard({ data, canEdit }) {

  const { hasModulePermission, loading: isPermsLoading, } = usePermissions();
  const canEditPostulante = hasModulePermission("postulantes", "editar");
  const puedeEditar = canEditPostulante && !["aceptado", "rechazado"].includes(data?.estatus_postulante?.toLowerCase());
  return (
    <div className="space-y-6">
      

      <ComposicionFamiliar
        familia={data?.familia || []}
        expedienteId={data?.id_expediente}
        postulanteId={data?.id_postulante}
        puedeEditar={puedeEditar}
      />
      <NotasFamilaCard data={data} puedeEditar={puedeEditar}/>
    </div>
  );
}
