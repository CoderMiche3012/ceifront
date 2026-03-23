import { CheckCircle2, AlertCircle, XCircle, Info, X } from "lucide-react"
import Boton from "../ui/Boton"

const configByType = {
  success: {
    icon: CheckCircle2,
    iconWrapper: "bg-green-100 text-green-600",
    titleColor: "text-slate-900",
    messageColor: "text-slate-600",
    buttonClass: "bg-green-600 hover:bg-green-700 text-white",
  },
  error: {
    icon: XCircle,
    iconWrapper: "bg-red-100 text-red-600",
    titleColor: "text-slate-900",
    messageColor: "text-slate-600",
    buttonClass: "bg-red-600 hover:bg-red-700 text-white",
  },
  warning: {
    icon: AlertCircle,
    iconWrapper: "bg-amber-100 text-amber-600",
    titleColor: "text-slate-900",
    messageColor: "text-slate-600",
    buttonClass: "bg-amber-500 hover:bg-amber-600 text-white",
  },
  info: {
    icon: Info,
    iconWrapper: "bg-blue-100 text-blue-600",
    titleColor: "text-slate-900",
    messageColor: "text-slate-600",
    buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
  },
}

export default function ModalResultado({
  open,
  type = "success",
  title = "Operación completada",
  message = "",
  buttonText = "Entendido",
  onClose,
}) {
  if (!open) return null

  const currentConfig = configByType[type] || configByType.success
  const Icon = currentConfig.icon

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${currentConfig.iconWrapper}`}
            >
              <Icon size={24} />
            </div>

            <div>
              <h3 className={`text-lg font-bold ${currentConfig.titleColor}`}>
                {title}
              </h3>
              {message ? (
                <p className={`mt-1 text-sm leading-6 ${currentConfig.messageColor}`}>
                  {message}
                </p>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <Boton onClick={onClose} className={`px-5 py-2.5 text-sm ${currentConfig.buttonClass}`}>
            {buttonText}
          </Boton>
        </div>
      </div>
    </div>
  )
}