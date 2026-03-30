import { HiOutlineCalendar } from "react-icons/hi";
import AlertaError from "../../ui/AlertaError";
import Field from "../../ui/Field";
import InputG from "../../ui/InputG";
import ModalConfirmacion from "../../shared/ModalConfirmacion"; 
import ModalResultado from "../../shared/ModalResultado";
import { usePeriodoEditarForm } from "../../../hooks/usePeriodoEditarForm";

export default function PeriodoEditarModal({ open, periodo, onClose, onSuccess }) {
  const {
    form,
    setForm,
    error,
    loading,
    showConfirm,
    setShowConfirm,
    resultModal,
    handlePreSubmit,
    handleConfirmSave,
    handleFinalClose
  } = usePeriodoEditarForm(periodo, onSuccess, onClose);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <div className="w-full max-w-2xl rounded-[32px] bg-white shadow-2xl overflow-hidden">
          
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0E5F63]/10 text-[#0E5F63]">
              <HiOutlineCalendar size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-800">Editar Periodo</h2>
              <p className="text-sm text-slate-500">Configura el ciclo y fechas escolares</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl transition-colors" disabled={loading}>×</button>
          </div>

          <form onSubmit={handlePreSubmit} className="p-6 sm:p-8">
            <AlertaError mensaje={error} />
            
            <div className="grid gap-6">
              <Field label="Ciclo Escolar" required>
                <InputG
                  placeholder="Ej: 2026-A"
                  value={form?.ciclo_escolar || ""}
                  onChange={(e) => setForm({ ...form, ciclo_escolar: e.target.value })}
                  disabled={loading}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Fecha de Inicio" required>
                  <InputG 
                    type="date" 
                    value={form?.fecha_inicio || ""} 
                    disabled={loading}
                    onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })} 
                  />
                </Field>
                <Field label="Fecha de Fin" required>
                  <InputG 
                    type="date" 
                    value={form?.fecha_fin || ""} 
                    disabled={loading}
                    onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })} 
                  />
                </Field>
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t pt-6">
              <button 
                type="button" 
                onClick={onClose} 
                disabled={loading}
                className="px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-2xl transition"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-3 text-sm font-semibold text-white bg-[#0E5F63] hover:bg-[#0c5357] rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Validando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ModalConfirmacion
        open={showConfirm}
        title="¿Confirmar cambios?"
        description={`Se validará que no existan conflictos con otros periodos.`}
        onConfirm={handleConfirmSave}
        onClose={() => setShowConfirm(false)}
      />

      <ModalResultado
        open={resultModal?.open || false}
        type={resultModal?.type || "success"}
        title={resultModal?.title || ""}
        message={resultModal?.message || ""}
        onClose={handleFinalClose}
      />
    </>
  );
}