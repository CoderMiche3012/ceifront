import { AlignLeft, PencilLine } from "lucide-react";
import React, { useState } from "react";
import EditarNotaFamilia from "../modales/EditarNotaFamilia";
import NotasCard from "../../../../components/ui/NotasCard";

export default function NotasFamilaCard({ data }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const canEdit=true;

  const nota = data?.nota_situacion_familiar?.trim();
  const hayNota = Boolean(nota);

  return (
    <>
      <NotasCard
        icon={AlignLeft}
        title="Notas de Situación Familiar"
        onEdit={canEdit ? () => setModalAbierto(true) : undefined}
        editLabel="Editar nota"
      >
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">

          {hayNota ? (
            <p className="text-sm text-slate-600 leading-relaxed">
              “{nota}”
            </p>
          ) : (
              <p className="text-sm text-slate-400 italic">
                No hay notas registradas sobre{" "}
                <span className="font-medium ">
                  {data?.nombre || "este beneficiario"}
                </span>
              </p>
          )}

        </div>
      </NotasCard>


      <EditarNotaFamilia
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        data={data}
      />
    </>

  );
}

