import { TriangleAlert } from "lucide-react";
//reutilizable para confirmar acciones importantes
export default function ModalConfirmacion({
  open,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onClose,
  loading = false,
  color = "teal",
}) {
  if (!open) return null;
  //icono según el color recibido
  const colorStyles = {
    teal: "bg-teal-100 text-teal-600",
    amber: "bg-amber-100 text-amber-600",
    red: "bg-red-100 text-red-600",
    green: "bg-green-100 text-green-600",
  };
  //estilos dinámicos del botón de confirmación
  const buttonStyles = {
    teal: "bg-teal-600 hover:bg-teal-700",
    amber: "bg-amber-600 hover:bg-amber-700",
    red: "bg-red-600 hover:bg-red-700",
    green: "bg-[#1e9543] hover:bg-[#187a38]",
  };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
              colorStyles[color] || colorStyles.teal
            }`}
          >
            <TriangleAlert size={22} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <div className="mt-2 text-sm leading-6 text-slate-600">
              {description}
            </div>
          </div>
        </div>
        {/* botones de acción del modal */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              buttonStyles[color] || buttonStyles.teal
            }`}
          >
            {loading ? "Procesando..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}