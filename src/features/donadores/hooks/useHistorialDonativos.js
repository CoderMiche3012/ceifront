import { useEffect, useMemo, useState } from "react";

import {
  useDonativosPorDonador,
  usePeriodosDonativosPorDonador,
  useCrearDonativo,
  useActualizarDonativo,
} from "./useDonativos";

const PAGE_SIZE = 2;

export default function useHistorialDonativos(data) {

  const {
    data: donativos = [],
    isLoading,
  } = useDonativosPorDonador(
    data?.id_donador
  );

  const {
    data: periodosDonador = [],
  } = usePeriodosDonativosPorDonador(
    data?.id_donador
  );

  const crearMutation = useCrearDonativo();
  const actualizarMutation = useActualizarDonativo();

  const [modalConf, setModalConf] = useState({
    open: false,
    data: null,
  });

  const [modalRes, setModalRes] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const [openId, setOpenId] = useState(null);
  const [pages, setPages] = useState({});
  const [searchByPeriodo, setSearchByPeriodo] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [donativoEditando, setDonativoEditando] = useState(null);
  const [errorForm, setErrorForm] = useState("");

  const [form, setForm] = useState({
    id_donador: "",
    id_periodo: "",
    concepto: "",
    monto: "",
    fecha: "",
    moneda: "MXN",
  });

  const loading = isLoading;

  const saving =
    crearMutation.isPending ||
    actualizarMutation.isPending;

  const periodosOrdenados = useMemo(() => {
    return [...periodosDonador]
      .sort(
        (a, b) =>
          new Date(b.fecha_inicio) -
          new Date(a.fecha_inicio)
      )
      .map((periodo) => ({
        ...periodo,
        ciclo_escolar: `${new Date(periodo.fecha_inicio).getFullYear()}-${new Date(periodo.fecha_fin).getFullYear()}`,
      }));
  }, [periodosDonador]);

  useEffect(() => {
    if (periodosOrdenados.length > 0) {
      setOpenId(periodosOrdenados[0].id_periodo);
    }
  }, []);

  const abrirModal = (periodo) => {
    setErrorForm("");

    setForm({
      id_donador: data?.id_donador,
      id_periodo: periodo.id_periodo,
      concepto: "",
      monto: "",
      fecha: "",
      moneda: "MXN",
    });

    setShowModal(true);
  };

  const abrirModalEditar = (donativo) => {
    setErrorForm("");

    setDonativoEditando(donativo);

    setForm({
      id_donador: donativo.id_donador,
      id_periodo: donativo.id_periodo,
      concepto: donativo.concepto,
      monto: donativo.monto,
      fecha: donativo.fecha,
      moneda: donativo.moneda || "MXN",
    });

    setShowModalEditar(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setErrorForm("");
  };

  const handleSubmitClick = (tipo) => {

    if (
      data?.estatus?.toLowerCase() ===
      "inactivo"
    ) {
      setErrorForm(
        "No se pueden registrar nuevos donativos para un donador inactivo."
      );
      return;
    }

    if (
      !form.concepto ||
      !form.monto ||
      !form.fecha
    ) {
      setErrorForm(
        "Todos los campos son obligatorios para registrar el donativo."
      );
      return;
    }

    setErrorForm("");

    setModalConf({
      open: true,
      data: tipo,
    });
  };

  const handleConfirmarGuardado =
    async () => {
      try {

        if (modalConf.data === "CREAR") {

          await crearMutation.mutateAsync({
            ...form,
            monto: Number(
              Number(form.monto).toFixed(3)
            ),
          });

          cerrarModal();

        } else {

          await actualizarMutation.mutateAsync({
            id: donativoEditando.id_donativo,
            data: {
              concepto: form.concepto,
              monto: Number(
                Number(form.monto).toFixed(3)
              ),
              fecha: form.fecha,
              moneda: form.moneda,
            },
          });

          setShowModalEditar(false);
        }

        setModalConf({
          open: false,
          data: null,
        });

        setModalRes({
          open: true,
          type: "success",
          title: "¡Éxito!",
          message:
            "El donativo se ha guardado correctamente.",
        });

      } catch (err) {

        const backendErrors = err?.errors || err?.response?.data;
        setModalConf({
          open: false,
          data: null,
        });
        // Si vienen errores de validación
        if (
          backendErrors &&
          typeof backendErrors === "object"
        ) {
          const primerError = Object.values(
            backendErrors
          )?.[0]?.[0];

          setErrorForm(
            primerError ||
            "No se pudo procesar la solicitud."
          );
          return;
        }

        // Error general
        setModalRes({
          open: true,
          type: "error",
          title: "Error",
          message: "No se pudo procesar la solicitud.",
        });
      }
    };

  const changePage = (
    idPeriodo,
    page
  ) => {
    setPages((prev) => ({
      ...prev,
      [idPeriodo]: page,
    }));
  };

  const handleSearchChange = (
    idPeriodo,
    value
  ) => {
    setSearchByPeriodo((prev) => ({
      ...prev,
      [idPeriodo]: value,
    }));
  };

  return {
    PAGE_SIZE,

    donativos,
    periodosOrdenados,

    modalConf,
    modalRes,

    loading,
    saving,
    openId,

    pages,
    searchByPeriodo,

    showModal,
    showModalEditar,

    form,
    errorForm,

    setOpenId,
    setModalConf,
    setModalRes,
    setShowModalEditar,
    setForm,
    setErrorForm,

    abrirModal,
    abrirModalEditar,
    cerrarModal,
    handleSubmitClick,
    handleConfirmarGuardado,

    changePage,
    handleSearchChange,
  };
}