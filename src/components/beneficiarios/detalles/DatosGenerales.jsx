import DatosPersonalesCard from "./DatosPersonalesCard";
import DonadorCard from "./DonadorCard";
import SeguimientoLinea from "./seguimiento/SeguimientoLinea";

// Ya no recibimos setData, solo data
export default function DatosGenerales({ data }) {

  if (!data) return (
    <div className="p-4 text-slate-500 animate-pulse font-medium">
      Cargando información general...
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Columna Principal: 2/3 del ancho */}
      <div className="md:col-span-2 space-y-6">
        {/* Solo pasamos data. La edición se manejará con Mutations dentro de cada Card */}
        <DatosPersonalesCard data={data} />
        <DonadorCard data={data} />
      </div>

      {/* Columna Lateral: 1/3 del ancho */}
      <div className="md:col-span-1 space-y-6">
        <SeguimientoLinea data={data} />
      </div>
    </div>
  );
}