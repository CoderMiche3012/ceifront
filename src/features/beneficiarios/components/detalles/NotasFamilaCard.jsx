import { AlignLeft, PencilLine } from "lucide-react";
import React, { useState } from "react";
import EditarNotaFamilia from "../modales/EditarNotaFamilia";

export default function NotasFamilaCard({ data }) {
  const [modalAbierto, setModalAbierto] = useState(false);

  const nota = data?.nota_situacion_familiar?.trim();
  const hayNota = Boolean(nota);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <AlignLeft className="w-4 h-4 text-teal-600" />
          Situación Familiar
        </h3>

        <button
          onClick={() => setModalAbierto(true)}
          className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition outline-none focus:outline-none focus:ring-0"
        >
          <PencilLine className="w-4 h-4" />
          Editar
        </button>
      </div>

      {/* CONTENT */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">

        {hayNota ? (
          <p className="text-sm italic leading-relaxed whitespace-pre-line text-slate-600">
            “{nota}”
          </p>
        ) : (
          <div className="py-4 text-center">
            <p className="text-sm text-slate-400">
              No hay notas registradas sobre{" "}
              <span className="font-medium text-slate-500">
                {data?.nombre || "este beneficiario"}
              </span>
            </p>
          </div>
        )}

      </div>

      <EditarNotaFamilia
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        data={data}
      />

    </div>
  );
}