import Alerta from "../../../../../../../components/ui/AlertaError";

export default function ModalFormularioCarta({open,data,setData,alerta,onClose,onNext,loading,}) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-[520px] rounded-3xl p-6 shadow-2xl space-y-5">
        <h2 className="text-xl font-bold text-slate-800">Editar Informacion de la carta</h2>
        {alerta && <Alerta mensaje={alerta} tipo="error" />}
        <div className="space-y-4">
          <select
            className="w-full border border-slate-300 rounded-xl p-3"
            value={data.estatus}
            onChange={(e) => setData((p) => ({ ...p, estatus: e.target.value }))}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Cumplio">Cumplió</option>
            <option value="No cumplio">No cumplió</option>
          </select>

          <input
            type="date"
            className="w-full border border-slate-300 rounded-xl p-3"
            value={data.fecha}
            onChange={(e) => setData((p) => ({ ...p, fecha: e.target.value }))}
          />

          <textarea
            rows={4}
            className="w-full border border-slate-300 rounded-xl p-3 resize-none"
            value={data.observaciones}
            onChange={(e) => setData((p) => ({ ...p, observaciones: e.target.value }))}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} disabled={loading}>Cancelar</button>
          <button onClick={onNext} disabled={loading}>Continuar</button>
        </div>
      </div>
    </div>
  );
}

