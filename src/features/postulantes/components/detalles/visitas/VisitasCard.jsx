import EstudioCard from "./EstudioCard";
import FotosCard from "./FotosCard";
import VitasTab from "./VitasTab";

export default function VisitasCard({
  data,
  visitas,
  setMostrarSubida,
}) {  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <VitasTab visitas={visitas} />
      </div>

      <div className="col-span-1 space-y-6">
        <EstudioCard
          data={data}
          onSubirDocumento={() =>
            setMostrarSubida(true)
          }
        />
        <FotosCard data={data} />
      </div>
    </div>
  );
}