import { User, PencilLine } from 'lucide-react';
import React, { useState } from 'react';
import EditarDatosGenerales from "../../modales/EditarDatosGenerales";

export default function DatosPersonalesCard({ data, setData }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const noEditable = ["aceptado", "rechazado"].includes(data?.estatus_postulante?.toLowerCase());

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">

      <div className="flex items-center justify-between mb-8">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
          <User className="w-5 h-5 text-teal-600" />
          Datos Personales
        </h3>
        {!noEditable && (
          <button
            onClick={() => setModalAbierto(true)}
            className="flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition group"
          >
            <PencilLine className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Editar datos
          </button>
        )}
      </div>

      {/* Grid de Información */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">

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

        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Correo
          </p>
          <p className="text-slate-700 font-medium italic text-teal-700">
            {data.correo || "--"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Escolaridad
          </p>

          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <span>{data.nivel_escolar_inicial || "--"}</span>
            <span className="text-slate-400">|</span>
            <span>{data.grado_escolar_inicial || "--"}</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Referencia de la casa</p>
          <p className="text-slate-700 font-medium">
            {data.referencia_casa || "--"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Referencias de ingreso</p>
          <p className="text-slate-700 font-medium">
            {data.referencia_ingreso || "--"}
          </p>
        </div>

        <div >
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Dirección
          </p>
          <p className="text-slate-700 font-medium leading-relaxed">
            Calle {data.calle}, # {data.numero}, Col. {data.colonia}, {data.municipio}, C.P {data.cp}
          </p>
        </div>

      </div>    

      <EditarDatosGenerales
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        data={data}
        setData={setData}
      />
    </div>
  );
}