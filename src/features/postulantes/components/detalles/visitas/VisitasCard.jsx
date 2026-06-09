import EstudioCard from "./EstudioCard";
import FotosCard from "./FotosCard";
import VitasTab from "./VitasTab";


export default function VisitasCard({
  data,
  visitas,
  estudio
}) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="space-y-6 xl:col-span-2">
        <VitasTab
          visitas={visitas}
          data={data}
        />

        <EstudioCard
          data={data}
          estudio={estudio}
        />
      </div>

      <div className="space-y-6 xl:col-span-1">
        <FotosCard data={data} />
      </div>
    </div>
  );
}