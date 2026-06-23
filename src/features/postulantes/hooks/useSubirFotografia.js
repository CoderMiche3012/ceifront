import { useRef, useState } from "react";
import { useSubirFotografia as useSubirFotografiaMutation } from "../../expedientes/hooks/useFotografias";

export const useSubirFotografia = (idExpediente) => {
    const inputRef = useRef(null);
    const [descripcion, setDescripcion] = useState("");
    const [preview, setPreview] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const [resultado, setResultado] = useState({
        open: false,
        type: "success",
        title: "",
        message: "",
    });
    const { mutateAsync: subirFoto } =
        useSubirFotografiaMutation(idExpediente);
    const seleccionar = () => {
        inputRef.current?.click();
    };

    const subirFotos = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPreview(file);
    };

    const limpiar = () => {
        setPreview(null);
        setDescripcion("");
        setShowModal(false);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const confirmarSubida = async () => {
        if (!preview) return;

        if (!descripcion.trim()) {
            setShowConfirm(false);

            setResultado({
                open: true,
                type: "warning",
                title: "Descripción requerida",
                message: "Debes escribir una descripción.",
            });
            return;
        }
        setShowConfirm(false);
        try {
            setLoading(true);
            const formData = new FormData();

            formData.append("foto_archivo", preview);
            formData.append("id_expediente", idExpediente);
            formData.append("etapa", "Inicial");
            formData.append("descripcion", descripcion);

            await subirFoto(formData);

            setShowConfirm(false);

            setResultado({
                open: true,
                type: "success",
                title: "Fotografía guardada",
                message: "La fotografía se cargó correctamente.",
            });

            limpiar();
        } catch (error) {

            const mensaje =
                error?.errors?.foto_archivo?.[0] ||
                error?.original?.response?.data?.foto_archivo?.[0] ||
                error?.message ||
                "Error al subir fotografía";

            setShowConfirm(false);

            setResultado({
                open: true,
                type: "error",
                title: "Error al subir fotografía",
                message: mensaje,
            });
        } finally {
            setLoading(false);
        }
    };
    const cerrarResultado = () => {
        setResultado((prev) => ({
            ...prev,
            open: false,
        }));
    };

    return {
        inputRef,

        descripcion,
        setDescripcion,

        preview,
        showModal,
        setShowModal,

        seleccionar,
        subirFotos,
        confirmarSubida,
        limpiar,

        showConfirm,
        setShowConfirm,

        resultado,
        setResultado,

        cerrarResultado,
        loading
    };
};