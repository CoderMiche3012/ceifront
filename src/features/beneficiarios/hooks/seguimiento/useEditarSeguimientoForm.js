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
  // 🟢 El try/catch ahora sí capturará los errores de red o del servidor
  try {
    // ⚠️ CAMBIO CLAVE: Usamos mutateAsync con await para esperar la respuesta
    await mutationEditar.mutateAsync({
      id: editando.id_seguimiento,
      data: { estatus, nota_seguimiento: nota },
    });

    // 🚀 Todo este bloque se ejecuta SOLO si la edición del seguimiento fue exitosa
    const esPeriodoActivo = editando?.id_periodo === idPeriodoActivo;

    if (esPeriodoActivo) {
      // 🔴 Si se pasa a Inactivo
      if (estatus === "Inactivo" || estatus === "Finalizado") {
        await mutationBeneficiario.mutateAsync({
          id: editando.id_beneficiario,
          data: { estatus: "Inactivo" },
        });
      }

      // 🟢 Si se pasa a Activo o Graduado (Corregido con paréntesis para respetar la lógica)
      if (estatus === "Activo" ) {
        await mutationBeneficiario.mutateAsync({
          id: editando.id_beneficiario,
          data: { estatus: "Activo" },
        });
      }
    }

    // 🎉 Si todo salió bien, cerramos modales y mostramos éxito
    setExitoEdicion(true);
    setEditando(null);
    setConfirmarEdicion(false);

  } catch (error) {
    // 🔴 Si cualquiera de las peticiones de arriba falla, cae aquí automáticamente
    console.error("Error en el proceso de actualización:", error);
    
    // Aquí puedes setear un estado de error para avisarle al usuario en la UI
    // Ej: registrarErrorVisual(error.message);
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