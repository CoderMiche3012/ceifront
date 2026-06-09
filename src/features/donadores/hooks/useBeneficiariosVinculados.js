import { useMemo, useState } from "react";
import { useBeneficiariosActivos } from "../../beneficiarios/hooks/useBeneficiarios";
import { useActualizarDonador } from "./useDonadores";

export function useBeneficiariosVinculados(
  data,
  setData
) {
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const { data: activos = [], isLoading } =useBeneficiariosActivos();

  const { mutateAsync: actualizarDonador } =
    useActualizarDonador();

  const calcularEdad = (fecha) => {
    if (!fecha) return "--";

    const hoy = new Date();
    const nacimiento = new Date(fecha);

    let edad =
      hoy.getFullYear() -
      nacimiento.getFullYear();

    const mes =
      hoy.getMonth() -
      nacimiento.getMonth();

    if (
      mes < 0 ||
      (mes === 0 &&
        hoy.getDate() <
        nacimiento.getDate())
    ) {
      edad--;
    }

    return edad;
  };

  const listaBeneficiarios = useMemo(() => {
    const idsVinculados = (
      data?.beneficiarios_apoyados || []
    ).map((b) => String(b.id));

    return activos
      .filter(
        (b) => b.estatus === "Activo"
      )
      .filter(
        (b) =>
          !idsVinculados.includes(
            String(b.id_beneficiario)
          )
      );
  }, [
    activos,
    data?.beneficiarios_apoyados,
  ]);

  const filtrados = useMemo(() => {
    return listaBeneficiarios.filter((b) =>
      b.expediente_resumen?.nombre_completo
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );
  }, [search, listaBeneficiarios]);

 const handleAgregar = async (idBeneficiario) => {
  try {
    setLoadingId(idBeneficiario);

    const actuales = (
      data?.beneficiarios_apoyados || []
    ).map((b) => b.id);

    if (actuales.includes(idBeneficiario)) {
      return;
    }

    const nuevosIds = [
      ...actuales,
      idBeneficiario,
    ];

    await actualizarDonador({
      id: data.id_donador,
      data: {
        beneficiarios_apoyados: nuevosIds,
      },
    });

    setOpenModal(false);
    setSearch("");
  } catch (error) {
    console.error(
      "Error agregando beneficiario:",
      error
    );

    console.error(
      error?.response?.data
    );

    throw error;
  } finally {
    setLoadingId(null);
  }
};const handleEliminar = async (
  idBeneficiario
) => {
  try {
    const actuales = (
      data?.beneficiarios_apoyados || []
    ).map((b) => b.id);

    const nuevosIds = actuales.filter(
      (id) => id !== idBeneficiario
    );

    await actualizarDonador({
      id: data.id_donador,
      data: {
        beneficiarios_apoyados: nuevosIds,
      },
    });
  } catch (error) {
    console.error(
      "Error al desvincular beneficiario:",
      error
    );

    console.error(
      "Respuesta backend:",
      error?.response?.data
    );

    throw error;
  }
};

  return {
    openModal,
    setOpenModal,
    search,
    setSearch,
    loading: isLoading,
    loadingId,
    listaBeneficiarios,
    filtrados,
    handleAgregar,
    handleEliminar,
    calcularEdad,
  };
}