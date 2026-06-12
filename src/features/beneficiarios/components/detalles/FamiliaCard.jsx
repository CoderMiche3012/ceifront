import ComposicionFamiliar from "../../../expedientes/components/familia/ComposicionFamiliar";
import NotasFamilaCard from "./../../../expedientes/components/familia/NotasFamilaCard";

export default function FamiliaCard({ data }) {
    console.log(data)

    return (
        <div className="space-y-6 px-4">
            <ComposicionFamiliar
                familia={data?.familia || []}
                expedienteId={data?.id_expediente}
            />
            <NotasFamilaCard data={data} />
        </div>
    );
}