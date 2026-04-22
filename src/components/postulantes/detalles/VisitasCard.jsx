import EstudioCard from "./EstudioCard";
import FotosCard from "./FotosCard";
import CitaTab from "./CitaTab";
import RecomendacionCard from "./RecomendacionCard";
export default function visitasCard({ data, setData }) {
  const handleUpdateFamilia = (nuevaFamilia) => {
    if (!setData) return;
    setData((prev) => ({
      ...prev,
      familia: nuevaFamilia,
    }));
  };
  const handleUpdateEstatus = (nuevoEstatus) => {
    if (!setData) return;
    setData((prev) => ({
      ...prev,
      estatus_postulante: nuevoEstatus,
    }));
  };
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <CitaTab data={data} setData={setData} />
      </div>

      <div className="col-span-1 space-y-6">
        <EstudioCard data={data} setData={setData} />
        <FotosCard data={data} setData={setData} />
      </div>
    </div>
  );
}