import { User, PencilLine } from 'lucide-react';
import React, { useState } from 'react';
import EditarResumen from '../modales/EditarResumen';
export default function ResumenCard({ data, setData }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const formatearFecha = (fecha) => {
    if (!fecha) return "--";

    const [year, month, day] = fecha.split("-");
    const fechaLocal = new Date(year, month - 1, day);

    return fechaLocal.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  const calcularTiempo = (fecha) => {
    if (!fecha) return "--";

    const [year, month, day] = fecha.split("-");
    const inicio = new Date(year, month - 1, day);
    const hoy = new Date();

    // 🔹 Hacer conteo inclusivo (sumar 1 día)
    const hoyInclusivo = new Date(hoy);
    hoyInclusivo.setDate(hoyInclusivo.getDate() + 1);

    let años = hoyInclusivo.getFullYear() - inicio.getFullYear();
    let meses = hoyInclusivo.getMonth() - inicio.getMonth();
    let dias = hoyInclusivo.getDate() - inicio.getDate();

    if (dias < 0) {
      meses--;
      // días del mes anterior
      const ultimoMes = new Date(
        hoyInclusivo.getFullYear(),
        hoyInclusivo.getMonth(),
        0
      );
      dias += ultimoMes.getDate();
    }

    if (meses < 0) {
      años--;
      meses += 12;
    }

    return `${años > 0 ? años + " año" + (años !== 1 ? "s " : " ") : ""}${meses > 0 ? meses + " mes" + (meses !== 1 ? "es " : " ") : ""
      }${dias} día${dias !== 1 ? "s" : ""}`;
  };
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">

      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <User className="w-4 h-4 text-teal-600" />
          Resumen del caso
        </h3>

        <button
          onClick={() => setModalAbierto(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors group"
        >
          <PencilLine className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          Editar datos
        </button>
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-8 text-sm">

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Estatus</p>
          <p className="text-slate-700 font-medium">
            {data.estatus_beneficiario}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Fecha de ingreso</p>
          <p className="text-slate-700 font-medium">
            {formatearFecha(data.fecha_ingreso) || "--"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tiempo en el programa</p>
          <p className="text-slate-700 font-medium">
            {calcularTiempo(data.fecha_ingreso) || "--"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Tutor principal
          </p>

          <div className="flex flex-col">
            <span className="text-slate-800 font-semibold">
              {data.tutor_nombre || "--"}
            </span>

            <span className="text-slate-500 text-sm">
              {data.tutor_telefono || "--"}
            </span>
          </div>
        </div>

      </div>
      <EditarResumen
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        data={data}
        setData={setData}
      />

    </div>
  );
}