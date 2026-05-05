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

  // 🔥 nuevos estados UX
  const [confirmar, setConfirmar] = useState(null);
  const [exito, setExito] = useState(false);

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
    mutationFn: actualizarSeguimiento,
    onSuccess: () => {
      queryClient.invalidateQueries(["seguimientos"]);
      setEditando(null);
    },
    onError: () => {
      setError("Error al actualizar");
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
  const handleCrear = (id_periodo) => {
    setConfirmar(id_periodo);
  };

  const confirmarCreacion = () => {
    mutationCrear.mutate({
      id_beneficiario,
      id_periodo: confirmar,
      estatus: "Activo",
      nota_seguimiento: ".",
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
                <div className={`w-3 h-3 rounded-full ${esReciente ? "bg-teal-500" : "bg-slate-300"
                  }`} />
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
      <div className="flex justify-center mt-8 pt-4 border-t border-slate-100">
        <BotonInterno onClick={() => setMostrarSelector(true)}>
          <Plus className="w-4 h-4" />
          Agregar seguimiento
        </BotonInterno>
      </div>

      {/* MODAL CREAR */}
      {mostrarSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Agregar seguimiento
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Selecciona un periodo disponible
                </p>
              </div>

              <button
                onClick={() => setMostrarSelector(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* CONTENIDO */}
            {periodosDisponibles.length === 0 ? (
              <div className="text-center py-6 border border-slate-100 rounded-xl">
                <p className="text-sm text-slate-500">
                  Todos los periodos ya están asignados
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">

                {periodosDisponibles.map((p) => (
                  <button
                    key={p.id_periodo}
                    onClick={() => handleCrear(p.id_periodo)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-slate-200 hover:bg-teal-50 hover:border-teal-200 transition group"
                  >
                    <span className="text-sm font-medium text-slate-700 group-hover:text-teal-700">
                      {p.ciclo_escolar}
                    </span>

                    <Plus className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
                  </button>
                ))}

              </div>
            )}

            {/* FOOTER */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setMostrarSelector(false)}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🔥 CONFIRMACIÓN */}
      <ModalConfirmacion
        open={!!confirmar}
        title="Asignar periodo"
        description="¿Quieres asignar este periodo al beneficiario?"
        onConfirm={confirmarCreacion}
        onClose={() => setConfirmar(null)}
        loading={mutationCrear.isLoading}
      />

      {/* 🔥 ÉXITO */}
      <ModalResultado
        open={exito}
        title="Seguimiento creado"
        message="El periodo fue asignado correctamente"
        onClose={() => setExito(false)}
      />

      {/* MODAL EDITAR */}
      {editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <h3 className="text-lg font-bold mb-4">Editar seguimiento</h3>

            <Alerta mensaje={error} />

            <textarea
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              className="w-full border rounded-xl p-3 mb-3"
            />

            <select
              value={estatus}
              onChange={(e) => setEstatus(e.target.value)}
              className="w-full border rounded-xl p-3"
            >
              <option>Activo</option>
              <option>Inactivo</option>
            </select>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setEditando(null)}>Cancelar</button>
              <button
                onClick={guardarEdicion}
                className="bg-teal-600 text-white px-4 py-2 rounded-xl"
              >
                Guardar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
