// Formulario para Agendar/Reprogramar
export const FormAgendar = ({ data, onChange }) => (
  <div className="mt-4 space-y-4 text-left">
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold text-slate-400 uppercase">Fecha de Visita</label>
      <input 
        type="date" 
        className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0E5F63]/20" 
        value={data.fecha}
        onChange={(e) => onChange({...data, fecha: e.target.value})} 
      />
    </div>
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold text-slate-400 uppercase">Hora</label>
      <input 
        type="time" 
        className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0E5F63]/20" 
        value={data.hora}
        onChange={(e) => onChange({...data, hora: e.target.value})} 
      />
    </div>
  </div>
);

// Formulario para Notas
export const FormFinalizar = ({ data, onChange }) => (
  <div className="mt-4 text-left">
    <label className="text-[10px] font-bold text-slate-400 uppercase">Notas del resultado</label>
    <textarea 
      className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500/20" 
      rows="3" 
      placeholder="Escribe las observaciones de la visita..."
      value={data.nota}
      onChange={(e) => onChange({...data, nota: e.target.value})} 
    />
  </div>
);

// Formulario para Cancelar con Nota
export const FormCancelar = ({ data, onChange }) => (
  <div className="mt-4 text-left">
    <label className="text-[10px] font-bold text-slate-400 uppercase">
      Motivo de cancelación
    </label>
    <textarea 
      className="w-full rounded-xl border border-slate-200 p-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500/20" 
      rows="3" 
      placeholder="Escribe el motivo de la cancelación..."
      value={data.nota || ""}
      onChange={(e) => onChange({ ...data, nota: e.target.value })} 
    />
  </div>
);