import { useState } from "react";
import { X, GraduationCap, School, BookOpen } from "lucide-react";
import Field from "../../../../../../components/ui/Field";
import Input from "../../../../../../components/ui/Input";
import Alerta from "../../../../../../components/ui/AlertaError";
import ModalResultado from "../../../../../../components/shared/ModalResultado";
import ModalConfirmacion from "../../../../../../components/shared/ModalConfirmacion";
import useDatosEscolares from "../../../../hooks/seguimiento/useDatosEscolares";
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
      {/* Fondo con desenfoque elegante */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        
        {/* Contenedor Ejecutivo del Modal */}
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200 flex flex-col max-h-[90vh]">
          
          {/* HEADER: Limpio y balanceado */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 bg-slate-50 text-slate-700 rounded-xl border border-slate-100">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                  {datosIniciales ? "Editar datos escolares" : "Registrar datos escolares"}
                </h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Gestiona la información académica oficial del expediente
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* BODY: Con scroll interno controlado */}
          <div className="p-6 overflow-y-auto space-y-6 bg-white flex-1">
            
            <Alerta mensaje={datos.error} />

            {/* SECCIÓN 1: INSTITUCIÓN */}
            <section className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <School className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Institución Educativa
                </h3>
              </div>

              <Field label="Escuela" required>
                <EscuelaSelector
                  {...datos}
                  municipios={datos.municipios}
                />
              </Field>
            </section>

            {/* SECCIÓN 2: NIVEL ACADÉMICO */}
            <section className="border border-slate-200 rounded-xl p-4 space-y-4 bg-white">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <BookOpen className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Nivel Académico
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nivel educativo" required>
                  <select
                    name="nivel_educativo"
                    value={datos.form.nivel_educativo}
                    onChange={(e) =>
                      datos.setForm((prev) => ({
                        ...prev,
                        nivel_educativo: e.target.value,
                        id_escolaridad: "",
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 font-medium focus:border-teal-600 focus:ring-1 focus:ring-teal-600/20 outline-none transition"
                  >
                    <option value="">Seleccionar</option>
                    <option value="BASICA">Educación Básica</option>
                    <option value="MEDIA_SUPERIOR">Educación Media Superior</option>
                    <option value="SUPERIOR">Educación Superior</option>
                  </select>
                </Field>

                <Field label="Escolaridad" required>
                  <EscolaridadSelector {...datos} />
                </Field>
              </div>
            </section>

            {/* SECCIÓN 3: DETALLES COMPLEMENTARIOS */}
            <section className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Detalles Adicionales
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GRUPO */}
                <Field label="Grupo">
                  <Input
                    name="grupo"
                    value={datos.form.grupo}
                    onChange={datos.handleChange}
                    placeholder="Ej. A, 102, etc."
                  />
                </Field>

                {/* TURNO */}
                <Field label="Turno">
                  <select
                    name="turno"
                    value={datos.form.turno || ""}
                    onChange={datos.handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 font-medium focus:border-teal-600 focus:ring-1 focus:ring-teal-600/20 outline-none transition"
                  >
                    <option value="">Seleccionar</option>
                    <option value="MATUTINO">Matutino</option>
                    <option value="VESPERTINO">Vespertino</option>
                    <option value="NOCTURNO">Nocturno</option>
                    <option value="MIXTO">Mixto</option>
                    <option value="ABIERTA">Abierta / a distancia</option>
                  </select>
                </Field>

                {/* PERIODO ACADÉMICO */}
                <Field label="Periodo académico" required>
                  <select
                    name="modalidad_educativa"
                    value={datos.form.modalidad_educativa || ""}
                    onChange={datos.handleChange}
                    disabled={
                      datos.form.nivel_educativo === "BASICA" || datos.tieneBoletas
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 font-medium focus:border-teal-600 focus:ring-1 focus:ring-teal-600/20 outline-none transition disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                  >
                    <option value="">Seleccionar</option>
                    <option value="SEMESTRAL">Semestral</option>
                    <option value="ANUAL">Anual</option>
                    <option value="CUATRIMESTRAL">Cuatrimestral</option>
                    <option value="TRIMESTRAL">Trimestre</option>
                    <option value="BIMESTRAL">Bimestral</option>
                  </select>

                  {datos.tieneBoletas && (
                    <p className="text-[11px] text-amber-600 font-medium mt-1">
                      Bloqueado: existen boletas vinculadas a este registro.
                    </p>
                  )}
                </Field>

                {/* ESPECIALIDAD */}
                {datos.mostrarEspecialidad && (
                  <Field label="Especialidad">
                    <Input
                      name="especialidad"
                      value={datos.form.especialidad}
                      onChange={datos.handleChange}
                      placeholder="Ej. Tecnologías de la información"
                    />
                  </Field>
                )}
              </div>
            </section>
          </div>

          {/* FOOTER: Botones limpios y alineados */}
          <div className="flex justify-end gap-3 p-4 border-t border-slate-100 bg-slate-50 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-all"
            >
              Cancelar
            </button>

            <button
              onClick={() => setConfirmOpen(true)}
              disabled={datos.loading}
              className="px-5 py-2 bg-[#0e5f63] text-white text-xs font-semibold rounded-xl hover:bg-[#0c4f52] shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {datos.loading ? "Guardando..." : "Guardar datos"}
            </button>
          </div>

        </div>
      </div>

      {/* CONFIRMACIÓN */}
      <ModalConfirmacion
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirmar guardado"
        description="Se registrarán los datos escolares del beneficiario."
        loading={datos.loading}
        onConfirm={async () => {
          const ok = await datos.handleSubmit();
          setConfirmOpen(false);
          if (ok) {
            setResultadoOpen(true);
          }
        }}
      />

      {/* RESULTADO */}
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