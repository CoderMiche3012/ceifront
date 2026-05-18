import Alerta from "../../../../../../../components/ui/AlertaError";

export default function ModalFormularioServicioSocial({
  open,
  data,
  setData,
  alerta,
  onClose,
  onNext,
  loading,
}) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white w-full max-w-[550px] rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            Servicio social
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Actualiza la información del servicio social
          </p>
        </div>

        <div className="p-6 space-y-5">
          {alerta && (
            <Alerta
              mensaje={alerta}
              tipo="error"
            />
          )}

          {/* estatus */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Estatus
            </label>

            <select
              value={data.estatus}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  estatus:
                    e.target.value,
                }))
              }
              className="w-full border border-slate-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-teal-500 outline-none transition"
            >
              <option value="Pendiente">
                Pendiente
              </option>
              <option value="Cumplio">
                Cumplió
              </option>
              <option value="No cumplio">
                No cumplió
              </option>
            </select>
          </div>

          {/* fecha */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Fecha de cumplimiento
            </label>

            <input
              type="date"
              value={data.fecha}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  fecha:
                    e.target.value,
                }))
              }
              className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 outline-none transition"
            />
          </div>

          {/* nota */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Observaciones
            </label>

            <textarea
              rows={4}
              value={
                data.observaciones
              }
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  observaciones:
                    e.target.value,
                }))
              }
              placeholder="Agregar observaciones..."
              className="w-full border border-slate-300 rounded-xl p-3 resize-none focus:ring-2 focus:ring-teal-500 outline-none transition"
            />
          </div>
        </div>

        {/* footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-xl text-slate-600 hover:bg-slate-200 transition disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={onNext}
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-xl font-medium transition disabled:opacity-50"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}