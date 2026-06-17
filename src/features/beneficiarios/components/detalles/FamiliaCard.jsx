import ComposicionFamiliar from "../../../expedientes/components/familia/ComposicionFamiliar";
import NotasFamilaCard from "../../../expedientes/components/familia/NotasFamilaCard";
import { usePermissions } from "../../../../context/PermissionsContext";

export default function FamiliaCard({ data }) {
  const { hasModulePermission, loading: isPermsLoading,} = usePermissions();
  const puedeEditar = hasModulePermission( "familia", "editar");
  const canView = hasModulePermission( "familia", "ver");
  const canCreate = hasModulePermission( "familia", "crear"  );

  return (
    <div className="space-y-6 px-4">
      {canView && (
        <>
          <ComposicionFamiliar
            familia={data?.familia || []}
            expedienteId={data?.id_expediente}
            puedeEditar={puedeEditar}
            canCreate={canCreate}
            beneficiario={true}
          />

          <NotasFamilaCard data={data} puedeEditar={puedeEditar} />
        </>
      )}
    </div>
  );
}