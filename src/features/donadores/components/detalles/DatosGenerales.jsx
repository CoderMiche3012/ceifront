import DatosDonador from "./DatosDonador";
import NotasSeguimientoCard from "./NotasSeguimientoCard";
import ResumenCard from "./ResumenCard";

import { usePermissions } from "../../../../context/PermissionsContext";

//import BeneficiariosVinculadosCard from "./BeneficiariosVinculadosCard";
import { ui } from "../../../../styles/ui/index";

export default function DatosGenerales({ data }) {
  const { hasModulePermission, loading: isPermsLoading, } = usePermissions();
  const canEdit = hasModulePermission("donadores", "editar");
  return (
    <div className={ui.layout.twoColumn}>
      <div className={ui.layout.twoColumnMain}>
        <DatosDonador data={data} canEdit={canEdit}/>
        <NotasSeguimientoCard data={data} canEdit={canEdit}/>
      </div>

      <div className={ui.layout.twoColumnAside}>
        <ResumenCard data={data} canEdit={canEdit}/>
        {/*<BeneficiariosVinculadosCard data={data} />*/}
      </div>
    </div>
  );
}