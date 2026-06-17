import { useState } from "react";
import { useCrearSeguimiento } from "./useSeguimientos";
import { usePeriodoActivo } from "../../../periodos/hooks/usePeriodos";
import { useActualizarBeneficiario } from "../../hooks/useBeneficiarios";

export function useCrearSeguimientoForm(id_beneficiario) {

  const mutationCrear = useCrearSeguimiento();
  const mutationBeneficiario = useActualizarBeneficiario();

  const { data: periodoActivo } = usePeriodoActivo();
  const idPeriodoActivo = periodoActivo?.id_periodo;

  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [confirmar, setConfirmar] = useState(null);
  const [exito, setExito] = useState(false);

  const handleCrear = (id_periodo) => setConfirmar(id_periodo);

  const confirmarCreacion = () => {
    mutationCrear.mutate(
      {
        id_beneficiario,
        id_periodo: confirmar,
        estatus: "Activo",
        nota_seguimiento: "Seguimiento creado manualmente",
      },
      {
        onSuccess: () => {

          if (confirmar === idPeriodoActivo) {
            mutationBeneficiario.mutate({
              id: id_beneficiario,
              data: { estatus: "Activo" },
            });
          }

          setExito(true);
          setConfirmar(null);
          setMostrarSelector(false);
        },
      }
    );
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