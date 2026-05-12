import { useEffect, useMemo, useState } from "react";
import { actualizarDonador } from "../../services/donadoresService";
import { obtenerBeneficiario } from "../../services/beneficiariosService";
import { obtenerExpedienteIndividual } from "../../services/expedientesService";
import { obtenerSeguimientosPorBeneficiario } from "../../services/seguimientoService";
import { obtenerPeriodos } from "../../services/periodoService";

export function useBeneficiariosVinculados(data, setData) {
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [listaBeneficiarios, setListaBeneficiarios] = useState([]);

  const calcularEdad = (fecha) => {
    if (!fecha) return "--";

    const hoy = new Date();
    const nacimiento = new Date(fecha);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  };

  useEffect(() => {
    if (!data?.beneficiarios?.length) return;

    const cargar = async () => {
      try {
        const completos = await Promise.all(
          data.beneficiarios.map(async (item) => {
            if (!item.id_expediente) return item;

            const expediente = await obtenerExpedienteIndividual(
              item.id_expediente
            );

            return {
              ...item,
              nombre: expediente?.nombre || "",
              apellido_p: expediente?.apellido_p || "",
              apellido_m: expediente?.apellido_m || "",
              genero: expediente?.genero || "",
              fecha_nacimiento: expediente?.fecha_nacimiento || "",
            };
          })
        );

        setData((prev) => ({
          ...prev,
          beneficiarios: completos,
        }));
      } catch (error) {
        console.error("Error cargando expedientes:", error);
      }
    };

    cargar();
  }, [data?.beneficiarios?.length, setData]);

  const cargarBeneficiarios = async () => {
    try {
      setLoading(true);

      const [resBeneficiarios, resPeriodos] = await Promise.all([
        obtenerBeneficiario(),
        obtenerPeriodos(),
      ]);

      const todos = resBeneficiarios || [];
      const periodos = resPeriodos || [];

      const idsVinculados = (data?.beneficiarios_apoyados || []).map(String);

      const ultimoPeriodo = [...periodos]
        .sort((a, b) => b.id_periodo - a.id_periodo)[0]?.id_periodo;

      const beneficiariosConEstado = await Promise.all(
        todos.map(async (item) => {
          try {
            const seguimientos =
              await obtenerSeguimientosPorBeneficiario(
                item.id_beneficiario
              );

            const seguimientoReciente = (seguimientos || []).find(
              (s) => s.id_periodo === ultimoPeriodo
            );

            return {
              ...item,
              esActivo: seguimientoReciente?.estatus === "Activo",
            };
          } catch (error) {
            console.error("Error en seguimiento:", error);
            return { ...item, esActivo: false };
          }
        })
      );

      const activos = beneficiariosConEstado.filter(
        (item) =>
          item.esActivo &&
          !idsVinculados.includes(String(item.id_beneficiario))
      );

      const completos = await Promise.all(
        activos.map(async (item) => {
          if (!item.id_expediente) return item;

          const expediente = await obtenerExpedienteIndividual(
            item.id_expediente
          );

          return {
            ...item,
            nombre: expediente?.nombre || "",
            apellido_p: expediente?.apellido_p || "",
            apellido_m: expediente?.apellido_m || "",
            genero: expediente?.genero || "",
            fecha_nacimiento: expediente?.fecha_nacimiento || "",
          };
        })
      );

      setListaBeneficiarios(completos);
    } catch (error) {
      console.error("Error cargando beneficiarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtrados = useMemo(() => {
    return listaBeneficiarios.filter((item) =>
      `${item.nombre} ${item.apellido_p} ${item.apellido_m}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, listaBeneficiarios]);
  const handleAgregar = async (idBeneficiario) => {
    try {
      setLoadingId(idBeneficiario);

      const actuales = (data?.beneficiarios_apoyados || []).map(String);

      if (actuales.includes(String(idBeneficiario))) return;

      const nuevosIds = [...actuales, String(idBeneficiario)];

      await actualizarDonador(data.id_donador, {
        beneficiarios_apoyados: nuevosIds,
      });

      const nuevo = listaBeneficiarios.find(
        (i) => String(i.id_beneficiario) === String(idBeneficiario)
      );

      setData((prev) => ({
        ...prev,
        beneficiarios_apoyados: nuevosIds,
        beneficiarios: nuevo
          ? [...(prev.beneficiarios ?? []), nuevo]
          : prev.beneficiarios ?? [],
        total_beneficiarios: nuevosIds.length,
      }));

      setOpenModal(false);
      setSearch("");
    } catch (error) {
      console.error("Error agregando:", error);
    } finally {
      setLoadingId(null);
    }
  };
  const handleEliminar = async (idBeneficiario) => {
    try {
      const actuales = (data?.beneficiarios_apoyados || []).map(String);

      const nuevosIds = actuales.filter(
        (id) => String(id) !== String(idBeneficiario)
      );

      await actualizarDonador(data.id_donador, {
        beneficiarios_apoyados: nuevosIds,
      });

      setData((prev) => ({
        ...prev,
        beneficiarios_apoyados: nuevosIds,
        beneficiarios: prev.beneficiarios.filter(
          (b) => String(b.id_beneficiario) !== String(idBeneficiario)
        ),
        total_beneficiarios: nuevosIds.length,
      }));
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  return {
    openModal,
    setOpenModal,
    search,
    setSearch,
    loading,
    loadingId,
    listaBeneficiarios,
    filtrados,
    cargarBeneficiarios,
    handleAgregar,
    handleEliminar,
    calcularEdad,
  };
}