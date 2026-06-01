import { useEffect, useMemo, useState } from "react";
import { useDonativos, useCrearDonativo, useActualizarDonativo, } from "./useDonativos";
import { usePeriodos } from "../../periodos/hooks/usePeriodos";

const PAGE_SIZE = 2;

export default function useHistorialDonativos(data) {

  const { data: donativosData = [], isLoading, } = useDonativos();
  const { data: periodos = [], } = usePeriodos();
  const crearMutation = useCrearDonativo();
  const actualizarMutation = useActualizarDonativo();

  const [modalConf, setModalConf] =
    useState({
      open: false,
      data: null,
    });

  const [modalRes, setModalRes] =
    useState({
      open: false,
      type: "success",
      title: "",
      message: "",
    });

  const [openId, setOpenId] = useState(null);
  const [pages, setPages] = useState({});
  const [searchByPeriodo, setSearchByPeriodo,] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showModalEditar, setShowModalEditar,] = useState(false);
  const [donativoEditando, setDonativoEditando,] = useState(null);
  const [errorForm, setErrorForm] = useState("");

  const [form, setForm] =
    useState({
      id_donador: "",
      id_periodo: "",
      concepto: "",
      monto: "",
      fecha: "",
      moneda: "MXN",
    });

  const loading = isLoading || crearMutation.isPending || actualizarMutation.isPending;

  const donativos =
    useMemo(() => {
      return donativosData.filter(
        (item) => Number(item.id_donador) === Number(data?.id_donador)
      );
    }, [donativosData, data,]);

  const periodosOrdenados =
    useMemo(() => {
      return [...periodos].sort(
        (a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio)
      );
    }, [periodos]);

  useEffect(() => {
    if (periodosOrdenados.length > 0 && openId === null) {
      setOpenId(periodosOrdenados[0].id_periodo);
    }
  }, [periodosOrdenados]);

  const abrirModal = ( periodo ) => {
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

  const abrirModalEditar = ( donativo ) => {
    setErrorForm("");
    setDonativoEditando( donativo );
    setForm({
      id_donador: donativo.id_donador,
      id_periodo: donativo.id_periodo,
      concepto: donativo.concepto,
      monto: donativo.monto,
      fecha: donativo.fecha,
      moneda: donativo.moneda || "MXN",
    });
    setShowModalEditar(
      true
    );
  };

  const cerrarModal = () => {
    setShowModal(false);
    setErrorForm("");
  };

  const handleSubmitClick = ( tipo ) => {
    if ( data?.estatus?.toLowerCase() === "inactivo" ) {
      setErrorForm( "No se pueden registrar nuevos donativos para un donador inactivo." );
      return;
    }

    if ( !form.concepto || !form.monto || !form.fecha ) {
      setErrorForm( "Todos los campos son obligatorios para registrar el donativo." );
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
        if ( modalConf.data === "CREAR" ) {
          await crearMutation.mutateAsync(
            {
              ...form,
              monto: Number( Number( form.monto ).toFixed( 3 ) ),
            }
          );

          cerrarModal();
        } else {
          await actualizarMutation.mutateAsync(
            {
              id: donativoEditando.id_donativo,
              data: {
                concepto: form.concepto,
                monto: Number( Number( form.monto ).toFixed( 3 ) ),
                fecha: form.fecha,
                moneda: form.moneda,
              },
            }
          );
          setShowModalEditar( false );
        }

        setModalConf({
          open: false,
          data: null,
        });

        setModalRes({
          open: true,
          type: "success",
          title: "¡Éxito!",
          message: "El donativo se ha guardado correctamente.",
        });
      } catch {
        setModalConf({
          open: false,
          data: null,
        });

        setModalRes({
          open: true,
          type: "error",
          title: "Error",
          message: "No se pudo procesar la solicitud.",
        });
      }
    };

  const changePage = ( idPeriodo, page ) => {
    setPages((prev) => ({
      ...prev,
      [idPeriodo]: page,
    }));
  };

  const handleSearchChange = ( idPeriodo, value ) => {
    setSearchByPeriodo(
      (prev) => ({
        ...prev,
        [idPeriodo]: value,
      })
    );
  };

  return {
    PAGE_SIZE,

    donativos,
    periodosOrdenados,

    modalConf,
    modalRes,

    loading,
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