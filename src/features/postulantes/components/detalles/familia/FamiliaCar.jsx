import ComposicionFamiliar from "../../../../expedientes/components/familia/ComposicionFamiliar";
import NotasFamilaCard from "../../../../expedientes/components/familia/NotasFamilaCard";

export default function FamiliaCard({ data, canEdit }) {

  const puedeEditar = canEdit && !["aceptado", "rechazado"].includes(data?.estatus_postulante?.toLowerCase());
console.log(data)
  return (
    <div className="space-y-6">
      

      <ComposicionFamiliar
        familia={data?.familia || []}
        expedienteId={data?.id_expediente}
        postulanteId={data?.id_postulante}
        puedeEditar={puedeEditar}
      />
      <NotasFamilaCard data={data} />
    </div>
  );
}
