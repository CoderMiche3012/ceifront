import { AlignLeft, PencilLine } from "lucide-react";
import EditarNotaGeneral from "../modales/EditarNotaGeneral";
import React, { useState } from 'react';

export default function NotasSeguimientoCard({ data, setData }) {
    const [modalAbierto, setModalAbierto] = useState(false);
    const hayNota = data?.nota && data.nota.trim() !== "";

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <AlignLeft className="w-4 h-4 text-teal-600" />
                    Notas de Seguimiento
                </h3>

                <button
                    onClick={() => setModalAbierto(true)}
                    className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors group"
                >
                    <PencilLine className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    Editar datos
                </button>
            </div>

            {/* Contenido */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">

                {hayNota ? (
                    <p className="text-sm text-slate-600 leading-relaxed">
                        “{data.nota}”
                    </p>
                ) : (
                    <p className="text-sm text-slate-400 italic">
                        No hay notas registradas para{" "}
                        <span className="font-medium">
                            {data.nombre || "este beneficiario"}
                        </span>.
                    </p>
                )}

            </div>

            <EditarNotaGeneral
                isOpen={modalAbierto}
                onClose={() => setModalAbierto(false)}
                data={data}
                setData={setData}
            />
        </div>
    );
}