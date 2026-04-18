import ComposicionFamiliar from "./../../Expediente/familia/ComposicionFamiliar";
import NotasFamilaCard from "./NotasFamilaCard";
export default function FamiliaCard({ data, setData }) {
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
        <div className="space-y-6 px-4">
            <ComposicionFamiliar
                familia={data?.familia || []}
                onUpdate={handleUpdateFamilia}
                expedienteId={data?.id_expediente}
            />

            <NotasFamilaCard data={data} setData={setData} />
        </div>
    );
}