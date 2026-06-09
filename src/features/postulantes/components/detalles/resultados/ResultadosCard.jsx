import EstatusCard from "./EstatusCard";
import RecomendacionCard from "./RecomendacionCard";
import { ui } from "../../../../../styles/ui/index";

export default function Resultados({ data }) {

  return (

    <div className={ui.layout.twoColumn}>
      <div className={ui.layout.twoColumnMain}>
        <RecomendacionCard
          data={data}
        />
      </div>

      <div className={ui.layout.twoColumnAside}>
        <EstatusCard
          data={data}
        />
      </div>
    </div>
  );
}