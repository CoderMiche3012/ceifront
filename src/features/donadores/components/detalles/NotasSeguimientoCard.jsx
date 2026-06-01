import { AlignLeft, PencilLine } from "lucide-react";
import { useState } from "react";

import NotasCard from "../../../../components/ui/NotasCard";
import EditarNotaGeneral from "../modales/EditarNotaGeneral";

export default function NotasSeguimientoCard({ data, setData }) {
  // estado
  const [modalAbierto, setModalAbierto] = useState(false);
  const hayNota = data?.nota && data.nota.trim() !== "";

  return (
    <>
      <NotasCard
        icon={AlignLeft}
        title="Notas de Seguimiento"
        onEdit={() => setModalAbierto(true)}
        editLabel="Editar nota"
      >
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">
          {hayNota ? (
            <p className="text-sm text-slate-600 leading-relaxed">
              “{data.nota}”
            </p>
          ) : (
            <p className="text-sm text-slate-400 italic">
              No hay notas registradas para{" "}
              <span className="font-medium">
                {data.nombre || "este registro"}
              </span>.
            </p>
          )}
        </div>
      </NotasCard>

      <EditarNotaGeneral
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        data={data}
        setData={setData}
      />
    </>
  );
}