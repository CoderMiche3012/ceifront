import { useState } from "react";
import {
  X,
  GraduationCap,
  School,
  BookOpen,
} from "lucide-react";

import Field from "../../../../ui/Field";
import Input from "../../../../ui/Input";
import Alerta from "../../../../ui/AlertaError";
import ModalResultado from "../../../../shared/ModalResultado";
import ModalConfirmacion from "../../../../shared/ModalConfirmacion";

import useDatosEscolares from "../../../../../hooks/beneficiarios/seguimiento/useDatosEscolares";
import EscuelaSelector from "./EscuelaSelector";
import EscolaridadSelector from "./EscolaridadSelector";

export default function ModalDatosEscolares({
  open,
  onClose,
  id_seguimiento,
  datosIniciales,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resultadoOpen, setResultadoOpen] = useState(false);
  const datos = useDatosEscolares(id_seguimiento, datosIniciales);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4">
        <div className="bg-[#F8FAFC] rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-white">

          <div className="flex items-center justify-between p-6 bg-white border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#0E5F63]/10 rounded-2xl">
                <GraduationCap className="w-6 h-6 text-[#0E5F63]" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  {datosIniciales ? "Editar datos escolares" : "Datos escolares"}
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Registra la información académica del beneficiario
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-all active:scale-90"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">

            <Alerta mensaje={datos.error} />

            <div className="space-y-8">

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <School className="w-4 h-4 text-[#0E5F63]" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0E5F63]">
                    Institución educativa
                  </h3>
                </div>

                <Field label="Escuela" required>
                  <EscuelaSelector {...datos} />
                </Field>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-[#0E5F63]" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0E5F63]">
                    Nivel académico
                  </h3>
                </div>

                <Field label="Escolaridad" required>
                  <EscolaridadSelector {...datos} />
                </Field>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-px w-6 bg-[#0E5F63]/30"></span>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0E5F63]">
                    Detalles adicionales
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Grupo">
                    <Input
                      name="grupo"
                      value={datos.form.grupo}
                      onChange={datos.handleChange}
                    />
                  </Field>

                  <Field label="Turno">
                    <select
                      name="turno"
                      value={datos.form.turno || ""}
                      onChange={datos.handleChange}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    >
                      <option value="">Seleccionar</option>
                      <option value="MATUTINO">Matutino</option>
                      <option value="VESPERTINO">Vespertino</option>
                      <option value="NOCTURNO">Nocturno</option>
                      <option value="MIXTO">Mixto</option>
                      <option value="LINEA">En linea</option>
                    </select>
                  </Field>

                  <Field label="Periodo académico" required>
                    <select
                      name="modalidad_educativa"
                      value={datos.form.modalidad_educativa || ""}
                      onChange={datos.handleChange}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    >
                      <option value="">Seleccionar</option>
                      <option value="SEMESTRAL">Semestral</option>
                      <option value="ANUAL">Anual</option>
                      <option value="CUATRIMESTRAL">Cuatrimestral</option>
                      <option value="TRIMESTRAL">Trimestral</option>
                      <option value="BIMESTRAL">Bimestral</option>
                    </select>
                  </Field>

                  <Field label="Especialidad">
                    <Input
                      name="especialidad"
                      value={datos.form.especialidad}
                      onChange={datos.handleChange}
                    />
                  </Field>
                </div>
              </section>

            </div>

            <div className="flex justify-end gap-4 mt-10">
              <button
                onClick={onClose}
                className="px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-all"
              >
                Cancelar
              </button>

              <button
                onClick={() => setConfirmOpen(true)}
                disabled={datos.loading}
                className="px-8 py-3 bg-[#0E5F63] text-white text-sm font-bold rounded-2xl hover:bg-[#0A4D50] shadow-lg shadow-[#0E5F63]/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {datos.loading ? "Guardando..." : "Guardar datos"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ModalConfirmacion
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirmar guardado"
        description="Se registrarán los datos escolares del beneficiario."
        loading={datos.loading}
        onConfirm={async () => {
          const ok = await datos.handleSubmit();

          // 🔥 cerrar siempre confirmación
          setConfirmOpen(false);

          if (ok) {
            setResultadoOpen(true);
          }
        }}
      />

      <ModalResultado
        open={resultadoOpen}
        type="success"
        title="¡Guardado correctamente!"
        message="Los datos escolares se registraron con éxito."
        onClose={() => {
          setResultadoOpen(false);
          onClose();
        }}
      />
    </>
  );
}
