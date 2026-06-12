import { AlignLeft, PencilLine } from "lucide-react";
import { useState } from "react";

import NotasCard from "../.././../../../../components/ui/NotasCard";
import EditarNotaGeneral from "./EditarNotaGeneral";

export default function NotasSeguimientoCard({ data, canEdit = true }) {
  const [modalAbierto, setModalAbierto] = useState(false);

  const hayData = !!data;
  const hayNota = data?.nota_escolar?.trim();

  const disabled = !hayData;

  return (
    <>
      <NotasCard
        icon={AlignLeft}
        title="Notas de Seguimiento"
        onEdit={
          canEdit && hayData
            ? () => setModalAbierto(true)
            : undefined
        }
        editLabel="Editar nota"
      >
        <div
          className={`rounded-xl border p-5 ${
            disabled
              ? "bg-slate-100 border-slate-200 opacity-60"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          {hayNota ? (
            <p className="text-sm text-slate-600 leading-relaxed">
              “{data.nota_escolar}”
            </p>
          ) : (
            <p className="text-sm text-slate-400 italic">
              No hay notas registradas para{" "}
              <span className="font-medium">
                {data?.nombre || "este registro"}
              </span>.
            </p>
          )}
        </div>
      </NotasCard>

      <EditarNotaGeneral
        isOpen={modalAbierto && hayData}
        onClose={() => setModalAbierto(false)}
        data={data}
      />
    </>
  );
}