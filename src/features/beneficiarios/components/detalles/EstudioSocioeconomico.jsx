import DatosPersonalesCard from "./DatosPersonalesCard";
import DonadorCard from "./DonadorCard";
import SeguimientoLinea from "./seguimiento/SeguimientoLinea";
import CardVisitaSocial from "./CardVisitaSocial";
import FotosCard from "./FotosCard";
import EstudioCard from "./EstudioCard";

export default function EstudioSos({ data}) {

  if (!data) return (
    <div className="p-4 text-slate-500 animate-pulse font-medium">
      Cargando información general...
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <CardVisitaSocial data={data} />
      </div>

      <div className="md:col-span-1 space-y-6">
        <EstudioCard data={data} />
        <FotosCard data={data} />
      </div>
    </div>
  );
}