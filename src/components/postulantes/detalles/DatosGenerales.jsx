import DatosPersonalesCard from "./DatosPersonalesCard";
import ComposicionFamiliar from "./../../Expediente/familia/ComposicionFamiliar";
import EstatusCard from "./EstatusCard";
import EstudioCard from "./EstudioCard";
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
    <div className="space-y-6">
      <DatosPersonalesCard data={data} setData={setData} />
      <ComposicionFamiliar
        familia={data?.familia || []}
        expedienteId={data?.id_expediente}
        onUpdate={handleUpdateFamilia}
      />
    </div>
  );
}