import { Clock, PencilLine, Plus, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { obtenerPeriodos } from "../../../../services/periodoService";
import {
  obtenerSeguimientos,
  crearSeguimiento,
  actualizarSeguimiento,
} from "../../../../services/seguimientoService";

import BotonInterno from "../../../ui/BotonInterno";
import Alerta from "../../../ui/AlertaError";
import ModalConfirmacion from "../../../shared/ModalConfirmacion";
import ModalResultado from "../../../shared/ModalResultado";

export default function SeguimientoLinea({ data }) {
  const id_beneficiario = data.id_beneficiario;
  const queryClient = useQueryClient();

  // 🔹 Estados
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [editando, setEditando] = useState(null);
  const [nota, setNota] = useState("");
  const [estatus, setEstatus] = useState("Activo");
  const [error, setError] = useState("");

  // 🔥 UX
  const [confirmar, setConfirmar] = useState(null);
  const [exito, setExito] = useState(false);

  const [confirmarEdicion, setConfirmarEdicion] = useState(false);
  const [exitoEdicion, setExitoEdicion] = useState(false);

  // 🔹 Queries
  const { data: seguimientos = [], isLoading: loadingSeg } = useQuery({
    queryKey: ["seguimientos"],
    queryFn: obtenerSeguimientos,
  });

  const { data: periodos = [], isLoading: loadingPer } = useQuery({
    queryKey: ["periodos"],
    queryFn: obtenerPeriodos,
  });

  // 🔥 MUTATIONS
  const mutationCrear = useMutation({
    mutationFn: crearSeguimiento,
    onSuccess: () => {
      queryClient.invalidateQueries(["seguimientos"]);
      setMostrarSelector(false);
      setConfirmar(null);
      setExito(true);
    },
  });

  const mutationEditar = useMutation({
    mutationFn: ({ id_seguimiento, ...data }) =>
      actualizarSeguimiento(id_seguimiento, data),

    onSuccess: () => {
      queryClient.invalidateQueries(["seguimientos"]);
      setConfirmarEdicion(false);
      setEditando(null);
      setExitoEdicion(true);
    },

    onError: () => {
      setError("Error al actualizar");
      setConfirmarEdicion(false);
    },
  });

  // 🔹 Map
  const periodosMap = Object.fromEntries(
    periodos.map((p) => [p.id_periodo, p.ciclo_escolar])
  );

  const lista = seguimientos.filter(
    (s) => s.id_beneficiario === id_beneficiario
  );

  const listaOrdenada = [...lista].sort((a, b) => {
    const indexA = periodos.findIndex(p => p.id_periodo === a.id_periodo);
    const indexB = periodos.findIndex(p => p.id_periodo === b.id_periodo);
    return indexB - indexA;
  });

  const idMasReciente = listaOrdenada[0]?.id_periodo;

  const usadosIds = lista.map((s) => s.id_periodo);

  const periodosDisponibles = periodos.filter(
    (p) => !usadosIds.includes(p.id_periodo)
  );

  // 🔥 acciones
  const handleCrear = (id_periodo) => setConfirmar(id_periodo);

  const confirmarCreacion = () => {
    mutationCrear.mutate({
      id_beneficiario,
      id_periodo: confirmar,
      estatus: "Activo",
      nota_seguimiento: "Seguimiento creado manualmente",
    });
  };

  const abrirEditar = (item) => {
    setEditando(item);
    setNota(item.nota_seguimiento || "");
    setEstatus(item.estatus);
    setError("");
  };

  const guardarEdicion = () => {
    if (!nota.trim()) {
      setError("La nota es obligatoria");
      return;
    }
    setConfirmarEdicion(true);
  };

  const confirmarActualizacion = () => {
    mutationEditar.mutate({
      id_seguimiento: editando.id_seguimiento,
      estatus,
      nota_seguimiento: nota,
    });
  };

  if (loadingSeg || loadingPer) {
    return <p className="text-sm text-slate-500">Cargando...</p>;
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <Clock className="w-4 h-4 text-teal-600" />
          Seguimiento por periodo
        </h3>
      </div>

      {/* TIMELINE */}
      <div className="space-y-6">
        {!listaOrdenada.length && (
          <p className="text-sm text-slate-500 text-center py-6">
            Sin seguimientos
          </p>
        )}

        {listaOrdenada.map((item, index) => {
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

                  <button
                    onClick={() => abrirEditar(item)}
                    className="flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700 group"
                  >
                    <PencilLine className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    Editar
                  </button>
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

      {/* BOTÓN */}
      {/* BOTÓN */}
      <div className="flex justify-center mt-8 pt-4 border-t border-slate-100">
        <BotonInterno onClick={() => setMostrarSelector(true)}>
          <Plus className="w-4 h-4" />
          Agregar seguimiento
        </BotonInterno>
      </div>

      {mostrarSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4 animate-in fade-in duration-200">

          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">

            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white">

              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                  Agregar seguimiento
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Selecciona un periodo para crear un nuevo seguimiento
                </p>
              </div>

              <button
                onClick={() => setMostrarSelector(false)}
                className="p-2 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* CONTENIDO */}
            <div className="p-6 max-h-[420px] overflow-y-auto">

              {!periodosDisponibles.length ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">

                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <Clock className="w-7 h-7 text-slate-400" />
                  </div>

                  <h4 className="text-sm font-bold text-slate-700">
                    No hay periodos disponibles
                  </h4>

                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Todos los periodos ya fueron asignados a este beneficiario.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">

                  {periodosDisponibles.map((p) => (
                    <button
                      key={p.id_periodo}
                      onClick={() => handleCrear(p.id_periodo)}
                      className="group w-full flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 hover:border-teal-300 hover:bg-teal-50 transition-all duration-200"
                    >

                      {/* IZQUIERDA */}
                      <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-600 group-hover:scale-105 transition-transform">
                          <Clock className="w-5 h-5" />
                        </div>

                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-800">
                            {p.ciclo_escolar}
                          </p>

                          <p className="text-xs text-slate-500 mt-0.5">
                            Crear seguimiento para este periodo
                          </p>
                        </div>
                      </div>

                      {/* DERECHA */}
                      <div className="flex items-center gap-2 text-teal-600 font-semibold text-sm">
                        <Plus className="w-4 h-4" />
                        Agregar
                      </div>

                    </button>
                  ))}

                </div>
              )}

            </div>

            {/* FOOTER */}
            <div className="flex justify-end px-6 py-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setMostrarSelector(false)}
                className="px-5 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition"
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CONFIRMAR CREACIÓN */}
      <ModalConfirmacion
        open={!!confirmar}
        title="Asignar periodo"
        description="¿Quieres asignar este periodo al beneficiario?"
        onConfirm={confirmarCreacion}
        onClose={() => setConfirmar(null)}
        loading={mutationCrear.isLoading}
      />

      {/* ÉXITO CREACIÓN */}
      <ModalResultado
        open={exito}
        title="Seguimiento creado"
        message="El periodo fue asignado correctamente"
        onClose={() => setExito(false)}
      />

      {/* MODAL EDITAR */}
      {editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">

          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-300">

            {/* HEADER */}
            <div className="flex items-center justify-between p-6 border-b bg-white">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                  Editar seguimiento
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Modifica la nota o el estatus del periodo
                </p>
              </div>

              <button
                onClick={() => setEditando(null)}
                className="p-2 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* CONTENIDO */}
            <div className="p-6 space-y-6">

              <Alerta mensaje={error} />

              {/* NOTA */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Nota del seguimiento
                </label>

                <textarea
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  placeholder="Escribe una observación o detalle importante..."
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                  rows={4}
                />
              </div>

              {/* ESTATUS */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Estatus
                </label>

                <div className="mt-2 relative">
                  <select
                    value={estatus}
                    onChange={(e) => setEstatus(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>

                  {/* indicador visual */}
                  <span
                    className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-0.5 rounded-full ${estatus === "Activo"
                        ? "bg-teal-100 text-teal-700"
                        : "bg-slate-200 text-slate-600"
                      }`}
                  >
                    {estatus}
                  </span>
                </div>
              </div>

            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 p-6 border-t bg-slate-50">

              <button
                onClick={() => setEditando(null)}
                className="px-5 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition"
              >
                Cancelar
              </button>

              <button
                onClick={guardarEdicion}
                className="px-6 py-2 bg-teal-600 text-white text-sm font-bold rounded-2xl shadow-md hover:bg-teal-700 active:scale-95 transition"
              >
                Guardar cambios
              </button>

            </div>

          </div>
        </div>
      )}
      {/* CONFIRMAR EDICIÓN */}
      <ModalConfirmacion
        open={confirmarEdicion}
        title="Confirmar cambios"
        description="¿Deseas actualizar este seguimiento?"
        onConfirm={confirmarActualizacion}
        onClose={() => setConfirmarEdicion(false)}
        loading={mutationEditar.isLoading}
      />

      {/* ÉXITO EDICIÓN */}
      <ModalResultado
        open={exitoEdicion}
        title="Seguimiento actualizado"
        message="Los cambios se guardaron correctamente"
        onClose={() => setExitoEdicion(false)}
      />

    </div>
  );
}