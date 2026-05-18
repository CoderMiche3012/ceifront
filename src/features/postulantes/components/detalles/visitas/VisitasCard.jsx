import EstudioCard from "./EstudioCard";
import FotosCard from "./FotosCard";
import VitasTab from "./VitasTab"
export default function visitasCard({ data, visitas, setData, onRefresh  }) {
  
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <VitasTab
          visitas={visitas}
          onRefresh={onRefresh}
        />
      </div>

      <div className="col-span-1 space-y-6">
        <EstudioCard data={data} setData={setData} />
        <FotosCard data={data} setData={setData} />
      </div>
    </div>
  );
}