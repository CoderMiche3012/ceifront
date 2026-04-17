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
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <DatosPersonalesCard data={data} setData={setData} />

        <ComposicionFamiliar
          familia={data?.familia || []}
          expedienteId={data?.id_expediente}
          onUpdate={handleUpdateFamilia}
        />
      </div>

      <div className="col-span-1 space-y-6">
        <EstatusCard
          data={data}
          onChangeDecision={handleUpdateEstatus}
        />
        <EstudioCard
          data={data}
          setData={setData}
        />
      </div>
    </div>
  );
}