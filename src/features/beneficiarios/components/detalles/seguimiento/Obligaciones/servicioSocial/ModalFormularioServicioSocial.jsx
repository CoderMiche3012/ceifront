import { HiOutlineBriefcase, HiOutlineX } from "react-icons/hi";
import Alerta from "../../../../../../../components/ui/AlertaError";
import Field from "../../../../../../../components/ui/Field";
import Input from "../../../../../../../components/ui/InputG";
import Select from "../../../../../../../components/ui/Select";
import Boton from "../../../../../../../components/ui/Boton";
import { ui } from "../../../../../../../styles/ui/index";

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
    <div className={ui.modal.formOverlay}>
      <div className="w-full max-w-2xl">
        {/* Contenedor Ejecutivo del Modal */}
        <div className={ui.modal.formContainer}>
          <div className={ui.modal.formHeader}>
            <div className={`${ui.modal.iconWrapper} bg-[#0E5F63]/10 text-[#0E5F63]`}>
              <HiOutlineBriefcase size={24} />
            </div>

            <div className="flex-1">
              <h2 className={ui.modal.title}>
                Servicio social
              </h2>
              <p className={ui.modal.description}>
                Actualiza la información del servicio social
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 transition"
            >
              <HiOutlineX size={20} />
            </button>
          </div>
          <div className={ui.modal.formBody}>
            {alerta && (
              <Alerta
                mensaje={alerta}
                tipo="error"
              />
            )}

            <div className={ui.modal.formScroll}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Estatus */}
                <Field label="Estatus" required>
                  <Select
                    value={data.estatus}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        estatus: e.target.value,
                      }))
                    }
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Cumplio">Cumplió</option>
                    <option value="No cumplio">No cumplió</option>
                  </Select>
                </Field>

                {/* Fecha */}
                <Field label="Fecha de cumplimiento" required>
                  <Input
                    type="date"
                    value={data.fecha}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        fecha: e.target.value,
                      }))
                    }
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Observaciones">
                    <textarea
                      rows={4}
                      value={data.observaciones}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          observaciones: e.target.value,
                        }))
                      }
                      placeholder="Agregar observaciones..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 resize-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600/20 outline-none transition"
                    />
                  </Field>
                </div>
              </div>
            </div>

            <div className={ui.modal.formActions}>
              <Boton
                variant="secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Boton>

              <Boton
                onClick={onNext}
                disabled={loading}
              >
                {loading ? "Procesando..." : "Continuar"}
              </Boton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}