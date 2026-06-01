import DatosPersonalesCard from "./DatosPersonalesCard";

import ComposicionFamiliar from
  "../../../../expedientes/components/familia/ComposicionFamiliar";

export default function DatosGenerales({
  data,
}) {
  return (
    <div className="space-y-6">

      <DatosPersonalesCard
        data={data}
      />

      <ComposicionFamiliar
        familia={data?.familia || []}
        expedienteId={data?.id_expediente}
        postulanteId={data?.id_postulante}
      />
    </div>
  );
}