import DatosPersonalesCard from "./DatosPersonalesCard";
import ComposicionFamiliar from "../../../../expedientes/components/familia/ComposicionFamiliar";

export default function DatosGenerales({ data, canEdit }) {

  const puedeEditar = canEdit && !["aceptado", "rechazado"].includes(data?.estatus_postulante?.toLowerCase());

  return (
    <div className="space-y-6">

      <DatosPersonalesCard
        data={data} canEdit={canEdit}
      />
      <ComposicionFamiliar
        familia={data?.familia || []}
        expedienteId={data?.id_expediente}
        postulanteId={data?.id_postulante}
        puedeEditar={puedeEditar}
      />

    </div>
  );
}
