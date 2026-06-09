import { useState } from "react";
import { useActualizarSeguimiento } from "./useSeguimientos";
export function useEditarSeguimientoFlow() {
  const mutationEditar = useActualizarSeguimiento();

  const [editando, setEditando] = useState(null);
  const [nota, setNota] = useState("");
  const [estatus, setEstatus] = useState("Activo");

  const [error, setError] = useState("");
  const [confirmarEdicion, setConfirmarEdicion] = useState(false);
  const [exitoEdicion, setExitoEdicion] = useState(false);

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
    mutationEditar.mutate(
      {
        id: editando.id_seguimiento,
        data: { estatus, nota_seguimiento: nota },
      },
      {
        onSuccess: () => {
          setExitoEdicion(true);
          setEditando(null);
          setConfirmarEdicion(false);
        }
      }
    );
  };

  return {
    editando,
    setEditando,
    nota,
    setNota,
    estatus,
    setEstatus,
    error,
    confirmarEdicion,
    setConfirmarEdicion,
    exitoEdicion,
    setExitoEdicion,
    abrirEditar,
    guardarEdicion,
    confirmarActualizacion,
    loading: mutationEditar.isLoading,
  };
}