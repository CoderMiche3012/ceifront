import DatosPersonalesCard from "./DatosPersonalesCard";
import DonadorCard from "./DonadorCard";
import SeguimientoLinea from "./seguimiento/SeguimientoLinea";
import { usePermissions } from "../../../../context/PermissionsContext";

export default function DatosGenerales({ data }) {

  const { hasModulePermission, loading: isPermsLoading, } = usePermissions();
  const viewSeguimientos = hasModulePermission("seguimientos", "ver");

  if (!data) return (
    <div className="p-4 text-slate-500 animate-pulse font-medium">
      Cargando información general...
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className={viewSeguimientos ? "md:col-span-2 space-y-6" : "md:col-span-3 space-y-6"}>
        <DatosPersonalesCard data={data} />
        <DonadorCard data={data} />
      </div>

      {viewSeguimientos && (
        <div className="md:col-span-1 space-y-6">
          <SeguimientoLinea data={data} />
        </div>
      )}
    </div>
  );
}