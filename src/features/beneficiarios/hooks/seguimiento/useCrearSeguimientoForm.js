import { useState } from "react";
import { useCrearSeguimiento } from "./useSeguimientos";
export function useCrearSeguimientoFlow(id_beneficiario) {
  const mutationCrear = useCrearSeguimiento();

  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [confirmar, setConfirmar] = useState(null);
  const [exito, setExito] = useState(false);

  const handleCrear = (id_periodo) => setConfirmar(id_periodo);

  const confirmarCreacion = () => {
    mutationCrear.mutate({
      id_beneficiario,
      id_periodo: confirmar,
      estatus: "Activo",
      nota_seguimiento: "Seguimiento creado manualmente",
    }, {
      onSuccess: () => {
        setExito(true);
        setConfirmar(null);
        setMostrarSelector(false);
      }
    });
  };

  return {
    mostrarSelector,
    setMostrarSelector,
    confirmar,
    setConfirmar,
    exito,
    setExito,
    handleCrear,
    confirmarCreacion,
    loading: mutationCrear.isLoading,
  };
}