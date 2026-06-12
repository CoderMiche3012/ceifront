import DatosPersonalesCard from "./DatosPersonalesCard";

export default function DatosGenerales({ data, canEdit }) {
  return (
    <div className="space-y-6">

      <DatosPersonalesCard
        data={data} canEdit={canEdit}
      />

    </div>
  );
}
