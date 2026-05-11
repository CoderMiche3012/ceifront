import { useEffect, useMemo, useState } from "react";
import {
    obtenerDonativos,
    crearDonativo,
    actualizarDonativo,
} from "../../services/donativosService";
import { obtenerPeriodos } from "../../services/periodoService";

const PAGE_SIZE = 2;

export default function useHistorialDonativos(data) {
    const [donativos, setDonativos] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [modalConf, setModalConf] = useState({ open: false, data: null });
    const [modalRes, setModalRes] = useState({
        open: false,
        type: "success",
        title: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [openId, setOpenId] = useState(null);
    const [pages, setPages] = useState({});
    const [searchByPeriodo, setSearchByPeriodo] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
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

    useEffect(() => {
        cargarDatos();
    }, []);

    useEffect(() => {
        if (periodos.length > 0) {
            const ordenados = [...periodos].sort(
                (a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio)
            );
            setOpenId(ordenados[0]?.id_periodo);
        }
    }, [periodos]);

    const cargarDatos = async () => {
        try {
            const [resDonativos, resPeriodos] = await Promise.all([
                obtenerDonativos(),
                obtenerPeriodos(),
            ]);

            const filtrados = (resDonativos || []).filter(
                (item) => Number(item.id_donador) === Number(data?.id_donador)
            );

            setDonativos(filtrados);
            setPeriodos(resPeriodos || []);
        } catch (error) {
        }
    };

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
        if (!form.concepto || !form.monto || !form.fecha) {
            setErrorForm("Todos los campos son obligatorios para registrar el donativo.");
            return;
        }
        setErrorForm("");
        setModalConf({ open: true, data: tipo });
    };

    const handleConfirmarGuardado = async () => {
        setLoading(true);
        try {
            if (modalConf.data === "CREAR") {
                await crearDonativo({
                    id_donador: form.id_donador,
                    id_periodo: form.id_periodo,
                    concepto: form.concepto,
                    monto: Number(Number(form.monto).toFixed(3)),
                    fecha: form.fecha,
                    moneda: form.moneda,
                });
                cerrarModal();
            } else {
                await actualizarDonativo(donativoEditando.id_donativo, {
                    concepto: form.concepto,
                    monto: Number(Number(form.monto).toFixed(3)),
                    fecha: form.fecha,
                    moneda: form.moneda,
                });
                setShowModalEditar(false);
            }

            await cargarDatos();

            setModalConf({ open: false, data: null });
            setModalRes({
                open: true,
                type: "success",
                title: "¡Éxito!",
                message: "El donativo se ha guardado correctamente.",
            });
        } catch {
            setModalConf({ open: false, data: null });
            setModalRes({
                open: true,
                type: "error",
                title: "Error",
                message: "No se pudo procesar la solicitud.",
            });
        } finally {
            setLoading(false);
        }
    };

    const periodosOrdenados = useMemo(() => {
        return [...periodos].sort(
            (a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio)
        );
    }, [periodos]);

    const changePage = (idPeriodo, page) => {
        setPages((prev) => ({ ...prev, [idPeriodo]: page }));
    };

    const handleSearchChange = (idPeriodo, value) => {
        setSearchByPeriodo((prev) => ({ ...prev, [idPeriodo]: value }));
    };

    return {
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
        saving,
        form,

        setOpenId,
        setModalConf,
        setModalRes,
        setShowModalEditar,
        setForm,

        abrirModal,
        abrirModalEditar,
        cerrarModal,
        handleSubmitClick,
        handleConfirmarGuardado,
        changePage,
        handleSearchChange,
        errorForm,
        setErrorForm
    };
}
