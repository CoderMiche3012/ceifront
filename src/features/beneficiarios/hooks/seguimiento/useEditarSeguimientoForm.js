import { useState } from "react";
import { useActualizarSeguimiento } from "./useSeguimientos";
import { usePeriodoActivo } from "../../../periodos/hooks/usePeriodos";
import { useActualizarBeneficiario } from "../../hooks/useBeneficiarios";

export function useEditarSeguimientoForm() {

  const { data: periodoActivo } = usePeriodoActivo();
  const idPeriodoActivo = periodoActivo?.id_periodo;

  const mutationEditar = useActualizarSeguimiento();
  const mutationBeneficiario = useActualizarBeneficiario();

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
        onSuccess: async () => {

          const esPeriodoActivo =
            editando?.id_periodo === idPeriodoActivo;

          // 🔴 Inactivar beneficiario
          if (estatus === "Inactivo" && esPeriodoActivo) {
            mutationBeneficiario.mutate({
              id: editando.id_beneficiario,
              data: { estatus: "Inactivo" },
            });
          }

          // 🟢 Activar beneficiario
          if (estatus === "Activo" && esPeriodoActivo) {
            mutationBeneficiario.mutate({
              id: editando.id_beneficiario,
              data: { estatus: "Activo" },
            });
          }

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