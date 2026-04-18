import DatosPersonalesCard from "./DatosPersonalesCard";
export default function DatosGenerales({ data, setData }) {
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
        <DatosPersonalesCard data={data} setData={setData} />

      </div>

      <div className="col-span-1 space-y-6">
        
      </div>
    </div>
  );
}