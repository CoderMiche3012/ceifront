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

  const confirmarActualizacion = async () => {
  try {
    await mutationEditar.mutateAsync({
      id: editando.id_seguimiento,
      data: { estatus, nota_seguimiento: nota },
    });

    //  si la edición del seguimiento fue exitosa
    const esPeriodoActivo = editando?.id_periodo === idPeriodoActivo;

    if (esPeriodoActivo) {
      // Si se pasa a Inactivo
      if (estatus === "Inactivo" || estatus === "Finalizado") {
        await mutationBeneficiario.mutateAsync({
          id: editando.id_beneficiario,
          data: { estatus: "Inactivo" },
        });
      }

      // Si se pasa a Activo o Graduado 
      if (estatus === "Activo" ) {
        await mutationBeneficiario.mutateAsync({
          id: editando.id_beneficiario,
          data: { estatus: "Activo" },
        });
      }
    }
    setExitoEdicion(true);
    setEditando(null);
    setConfirmarEdicion(false);

  } catch (error) {
    console.error("Error en el proceso de actualización:", error);
  }
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