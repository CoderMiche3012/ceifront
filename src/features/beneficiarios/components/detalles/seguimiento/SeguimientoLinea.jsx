import { Clock, PencilLine, Plus, X } from "lucide-react";

import BotonInterno from "../../../../../components/ui/BotonInterno";
import Alerta from "../../../../../components/ui/AlertaError";

import ModalConfirmacion from "../../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../../components/shared/ModalResultado";

import Field from "../../../../../components/ui/Field";
import Input from "../../../../../components/ui/InputG";
import Select from "../../../../../components/ui/Select";
import Boton from "../../../../../components/ui/Boton";

import { useSeguimientoLinea } from "../../../hooks/seguimiento/useSeguimientoLinea";
import { useCrearSeguimientoForm } from "../../../hooks/seguimiento/useCrearSeguimientoForm";
import { useEditarSeguimientoForm } from "../../../hooks/seguimiento/useEditarSeguimientoForm";

import { ui } from "../../../../../styles/ui/uiClasses";
import { usePermissions } from "../../../../../context/PermissionsContext";

export default function SeguimientoLinea({ data }) {
  const id_beneficiario = data.id_beneficiario;
  const { hasModulePermission, loading: isPermsLoading, } = usePermissions();
  const canEditSeguimientos = hasModulePermission("seguimientos", "editar");
  const canCreateSeguimientos = hasModulePermission("seguimientos", "crear");

  const {
    listaOrdenada,
    periodosMap,
    periodosDisponibles,
    idMasReciente,
    loadingPer,
  } = useSeguimientoLinea(id_beneficiario);

  const crearFlow = useCrearSeguimientoForm(id_beneficiario);
  const editarFlow = useEditarSeguimientoForm();

  if (loadingPer) {
    return <p className="text-sm text-slate-500">Cargando...</p>;
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">

      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <Clock className="w-4 h-4 text-teal-600" />
          Seguimiento por Periodo Escolar
        </h3>
      </div>

      <div className="max-h-[420px] overflow-y-auto pr-2 space-y-6 custom-scroll">

        {!listaOrdenada?.length && (
          <p className="text-sm text-slate-500 text-center py-6">
            Sin seguimientos
          </p>
        )}

        {(listaOrdenada ?? []).map((item, index) => {
          const esReciente = item.id_periodo === idMasReciente;

          return (
            <div key={item.id_seguimiento} className="flex gap-4">

              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${esReciente ? "bg-teal-500" : "bg-slate-300"}`} />
                {index !== listaOrdenada.length - 1 && (
                  <div className="w-px h-full bg-slate-200" />
                )}
              </div>

              <div className="flex-1 border border-slate-100 rounded-xl p-4">

                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-slate-700">
                    {periodosMap[item.id_periodo]}
                  </p>
                  {canEditSeguimientos && (
                    <button
                      onClick={() => editarFlow.abrirEditar(item)}
                      className="flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700"
                    >
                      <PencilLine className="w-4 h-4" />
                      Editar
                    </button>
                  )}
                </div>

                <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mb-2 ${esReciente
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
      <div className="pt-6 mt-6 border-t border-slate-100 flex justify-center">
        {canCreateSeguimientos && (
          <BotonInterno onClick={() => crearFlow.setMostrarSelector(true)}>
            <Plus className="w-4 h-4" />
            Agregar seguimiento
          </BotonInterno>
        )}
      </div>
      {crearFlow.mostrarSelector && (
        <div className={ui.modal.formOverlay}>
          <div className="w-full max-w-lg">
            <div className={ui.modal.formContainer}>

              {/* HEADER */}
              <div className={ui.modal.formHeader}>
                <div className={`${ui.modal.iconWrapper} bg-teal-100 text-teal-600`}>
                  <Plus className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <h2 className={ui.modal.title}>Agregar seguimiento</h2>
                  <p className={ui.modal.description}>
                    Selecciona un periodo escolar
                  </p>
                </div>

                <button
                  onClick={() => crearFlow.setMostrarSelector(false)}
                  className="p-2 rounded-xl hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* BODY */}
              <div className={ui.modal.formBody}>
                <div className={ui.modal.formScroll}>

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

                <div className={ui.modal.formActions}>
                  <Boton
                    variant="secondary"
                    onClick={() => crearFlow.setMostrarSelector(false)}
                  >
                    Cancelar
                  </Boton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {editarFlow.editando && (
        <div className={ui.modal.formOverlay}>
          <div className="w-full max-w-md">
            <div className={ui.modal.formContainer}>

              {/* HEADER */}
              <div className={ui.modal.formHeader}>
                <div className={`${ui.modal.iconWrapper} bg-teal-100 text-teal-600`}>
                  <PencilLine className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <h2 className={ui.modal.title}>Editar seguimiento</h2>
                  <p className={ui.modal.description}>
                    Modifica la información
                  </p>
                </div>

                <button
                  onClick={() => editarFlow.setEditando(null)}
                  className="p-2 rounded-xl hover:bg-slate-100"
                >
                  <X />
                </button>
              </div>

              <div className={ui.modal.formBody}>
                <div className={ui.modal.formScroll}>

                  <Alerta mensaje={editarFlow.error} />

                  <Field label="Nota">
                    <Input
                      as="textarea"
                      value={editarFlow.nota}
                      onChange={(e) => editarFlow.setNota(e.target.value)}
                      rows={4}
                    />
                  </Field>

                  <Field label="Estatus">
                    <Select
                      value={editarFlow.estatus}
                      onChange={(e) => editarFlow.setEstatus(e.target.value)}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                      <option value="Finalizado">Graduado</option>
                    </Select>
                  </Field>
                </div>

                <div className={ui.modal.formActions}>

                  <Boton
                    variant="secondary"
                    onClick={() => editarFlow.setEditando(null)}
                  >
                    Cancelar
                  </Boton>

                  <Boton onClick={editarFlow.guardarEdicion}>
                    Guardar
                  </Boton>
                </div>
              </div>
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

      <ModalConfirmacion
        open={editarFlow.confirmarEdicion}
        title="Confirmar cambios"
        description="¿Deseas actualizar los datos de este seguimiento?"
        onConfirm={editarFlow.confirmarActualizacion}
        onClose={() => editarFlow.setConfirmarEdicion(false)}
        loading={editarFlow.loading}
      />

      <ModalResultado
        open={editarFlow.exitoEdicion}
        title="Actualizado"
        message="Seguimiento actualizado correctamente"
        onClose={() => editarFlow.setExitoEdicion(false)}
      />

    </div>
  );
}

