import DatosDonador from "./DatosDonador";

import ResumenCard from "./ResumenCard";
import NotasSeguimientoCard from "./NotasSeguimientoCard";
import BeneficiariosVinculadosCard from "./BeneficiariosVinculadosCard";

import { ui } from "../../../../styles/ui/uiClasses";

export default function DatosGenerales({ data, setData }) {
  return (
    <div className={ui.layout.twoColumn}>
      <div className={ui.layout.twoColumnMain}>
        <DatosDonador data={data} setData={setData} />
        <NotasSeguimientoCard data={data} setData={setData} />
      </div>

      <div className={ui.layout.twoColumnAside}>
        <ResumenCard data={data} setData={setData} />
        <BeneficiariosVinculadosCard data={data} setData={setData} />
      </div>
    </div>
  );
}