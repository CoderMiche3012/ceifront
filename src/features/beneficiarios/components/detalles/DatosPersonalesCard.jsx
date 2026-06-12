import { User, PencilLine } from 'lucide-react';
import React, { useState } from 'react';
import EditarDatosGenerales from "./../modales/EditarDatosGenerales";

export default function DatosPersonalesCard({ data }) {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <User className="w-4 h-4 text-teal-600" />
          Datos Personales
        </h3>

        <button
          onClick={() => setModalAbierto(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors group"
        >
          <PencilLine className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          Editar datos
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8 text-sm">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nombre completo</p>
          <p className="text-slate-700 font-medium">
            {data.nombre} {data.apellido_p} {data.apellido_m}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Fecha de nacimiento</p>
          <p className="text-slate-700 font-medium">
            {data.fecha_nacimiento || "--"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Teléfono</p>
          <p className="text-slate-700 font-medium">
            {data.telefono || "--"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Género</p>
          <p className="text-slate-700 font-medium">
            {data.genero || "--"}
          </p>
        </div>

        <div className="col-span-1 md:col-span-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Correo</p>
          <p className="text-slate-700 font-medium italic text-teal-700">
            {data.correo || "--"}
          </p>
        </div>

        <div className="col-span-1 md:col-span-3 border-t border-slate-50 pt-4 mt-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Dirección</p>
          <p className="text-slate-700 font-medium">
            Calle {data.direccion.calle}, # {data.direccion.numero}, Col. {data.direccion.colonia}, {data.direccion.municipio}, C.P {data.direccion.cp}
          </p>
        </div>
      </div>

      <EditarDatosGenerales
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        data={data}
        onSuccess={() => {
          setModalAbierto(false);
        }}
      />
    </div>
  );
}