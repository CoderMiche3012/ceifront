import { Clock, PencilLine, Plus, X } from "lucide-react";
import BotonInterno from "../../../../../components/ui/BotonInterno";
import Alerta from "../../../../../components/ui/AlertaError";
import ModalConfirmacion from "../../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../../components/shared/ModalResultado";
import { useCrearSeguimientoFlow } from "../../../hooks/seguimiento/useCrearSeguimientoForm";
import { useSeguimientoLinea } from "../../../hooks/seguimiento/useSeguimientoLinea";
import { useCrearSeguimientoForm } from "../../../hooks/seguimiento/useCrearSeguimientoForm";
import { useEditarSeguimientoForm } from "../../../hooks/seguimiento/useEditarSeguimientoForm";

export default function SeguimientoLinea({ data }) {
  const id_beneficiario = data.id_beneficiario;

  // 📦 DATA
  const {
    listaOrdenada,
    periodosMap,
    periodosDisponibles,
    idMasReciente,
    loadingPer,
  } = useSeguimientoLinea(id_beneficiario);

  // ⚙️ FLOWS (CREAR / EDITAR)
  const crearFlow = useCrearSeguimientoForm(id_beneficiario);
  const editarFlow = useEditarSeguimientoForm();

  if (loadingPer) {
    return <p className="text-sm text-slate-500">Cargando...</p>;
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <Clock className="w-4 h-4 text-teal-600" />
          Seguimiento por Periodo Escolar
        </h3>
      </div>

      {/* LISTA */}
      <div className="max-h-[420px] overflow-y-auto pr-2 space-y-6">

        {!listaOrdenada.length && (
          <p className="text-sm text-slate-500 text-center py-6">
            Sin seguimientos
          </p>
        )}

        {listaOrdenada.map((item, index) => {
          const esReciente = item.id_periodo === idMasReciente;

          return (
            <div key={item.id_seguimiento} className="flex gap-4">

              {/* timeline */}
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${esReciente ? "bg-teal-500" : "bg-slate-300"}`} />
                {index !== listaOrdenada.length - 1 && (
                  <div className="w-px h-full bg-slate-200" />
                )}
              </div>

              {/* card */}
              <div className="flex-1 border border-slate-100 rounded-xl p-4">

                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-slate-700">
                    {periodosMap[item.id_periodo]}
                  </p>

                  <button
                    onClick={() => editarFlow.abrirEditar(item)}
                    className="flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700 group"
                  >
                    <PencilLine className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    Editar
                  </button>
                </div>

                <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mb-2 ${
                  esReciente
                    ? "bg-teal-100 text-teal-700"
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {item.estatus}
                </span>

                <p className="text-sm text-slate-600">
                  {item.nota_seguimiento || "--"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTÓN AGREGAR */}
      <div className="sticky bottom-0 bg-white pt-6 mt-6 border-t border-slate-100 flex justify-center">
        <BotonInterno onClick={() => crearFlow.setMostrarSelector(true)}>
          <Plus className="w-4 h-4" />
          Agregar seguimiento
        </BotonInterno>
      </div>

      {/* =========================
          MODAL CREAR
      ========================= */}
      <div>
        {crearFlow.mostrarSelector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">

            <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">

              <div className="flex items-center justify-between px-6 py-5 border-b">
                <div>
                  <h3 className="text-xl font-black">Agregar seguimiento</h3>
                  <p className="text-xs text-slate-500">
                    Selecciona un periodo
                  </p>
                </div>

                <button onClick={() => crearFlow.setMostrarSelector(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-3 max-h-[420px] overflow-y-auto">

                {!periodosDisponibles.length ? (
                  <p className="text-sm text-slate-500 text-center">
                    No hay periodos disponibles
                  </p>
                ) : (
                  periodosDisponibles.map((p) => (
                    <button
                      key={p.id_periodo}
                      onClick={() => crearFlow.handleCrear(p.id_periodo)}
                      className="w-full flex justify-between p-4 border rounded-xl hover:bg-teal-50"
                    >
                      <span className="font-semibold">{p.ciclo_escolar}</span>
                      <Plus />
                    </button>
                  ))
                )}

              </div>
            </div>
          </div>
        )}

        <ModalConfirmacion
          open={!!crearFlow.confirmar}
          title="Asignar periodo"
          description="¿Quieres asignar este periodo?"
          onConfirm={crearFlow.confirmarCreacion}
          onClose={() => crearFlow.setConfirmar(null)}
          loading={crearFlow.loading}
        />

        <ModalResultado
          open={crearFlow.exito}
          title="Seguimiento creado"
          message="Periodo asignado correctamente"
          onClose={() => crearFlow.setExito(false)}
        />
      </div>

      {/* =========================
          MODAL EDITAR
      ========================= */}
      <div>
        {editarFlow.editando && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">

            <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border">

              <div className="p-6 border-b flex justify-between">
                <div>
                  <h3 className="text-xl font-black">Editar seguimiento</h3>
                  <p className="text-xs text-slate-500">
                    Modifica información
                  </p>
                </div>

                <button onClick={() => editarFlow.setEditando(null)}>
                  <X />
                </button>
              </div>

              <div className="p-6 space-y-4">

                <Alerta mensaje={editarFlow.error} />

                <textarea
                  value={editarFlow.nota}
                  onChange={(e) => editarFlow.setNota(e.target.value)}
                  className="w-full border p-3 rounded-xl"
                  rows={4}
                />

                <select
                  value={editarFlow.estatus}
                  onChange={(e) => editarFlow.setEstatus(e.target.value)}
                  className="w-full border p-3 rounded-xl"
                >
                  <option>Activo</option>
                  <option>Inactivo</option>
                </select>

              </div>

              <div className="p-4 flex justify-end gap-3 border-t">

                <button onClick={() => editarFlow.setEditando(null)}>
                  Cancelar
                </button>

                <button onClick={editarFlow.guardarEdicion}>
                  Guardar
                </button>

              </div>
            </div>
          </div>
        )}

        <ModalConfirmacion
          open={editarFlow.confirmarEdicion}
          title="Confirmar cambios"
          description="¿Deseas actualizar?"
          onConfirm={editarFlow.confirmarActualizacion}
          onClose={() => editarFlow.setConfirmarEdicion(false)}
          loading={editarFlow.loading}
        />

        <ModalResultado
          open={editarFlow.exitoEdicion}
          title="Actualizado"
          message="Cambios guardados"
          onClose={() => editarFlow.setExitoEdicion(false)}
        />
      </div>
    </div>
  );
}