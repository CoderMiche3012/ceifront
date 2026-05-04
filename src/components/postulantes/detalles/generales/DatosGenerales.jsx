import DatosPersonalesCard from "./DatosPersonalesCard";
import ComposicionFamiliar from "../../../Expediente/familia/ComposicionFamiliar";
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