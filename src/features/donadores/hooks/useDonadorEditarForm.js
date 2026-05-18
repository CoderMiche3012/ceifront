import { useEffect, useState } from "react";
import { actualizarDonador } from "../services/donadoresService";

export function useDonadorEditarForm(donador, onSuccess, onClose) {
  const [form, setForm] = useState({
    nombre: "",
    apellido_p: "",
    apellido_m: "",
    correo: "",
    telefono: "",
    tipo: "",
    fecha_ingreso: "",
    calle: "",
    numero: "",
    colonia: "",
    cp: "",
    localidad: "",
    pais: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const [resultModal, setResultModal] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  /* Cargar datos al abrir modal */
  useEffect(() => {
    if (donador) {
      setForm({
        nombre: donador.nombre || "",
        apellido_p: donador.apellido_p || "",
        apellido_m: donador.apellido_m || "",
        correo: donador.correo || "",
        telefono: donador.telefono || "",
        tipo: donador.tipo || "",
        fecha_ingreso: donador.fecha_ingreso
          ? donador.fecha_ingreso.slice(0, 10)
          : "",
        calle: donador.calle || "",
        numero: donador.numero || "",
        colonia: donador.colonia || "",
        cp: donador.cp || "",
        localidad: donador.localidad || "",
        pais: donador.pais || "",
      });
    }
  }, [donador]);

  const validar = () => {
    if (!form.nombre.trim()) return "El nombre es obligatorio.";
    if (!form.apellido_p.trim()) return "El apellido paterno es obligatorio.";
    if (!form.tipo.trim()) return "Seleccione el tipo de donador.";
    return "";
  };

  /* Abrir confirmacion */
  const handlePreSubmit = () => {
    const msg = validar();

    if (msg) {
      setError(msg);
      return;
    }

    setError("");
    setShowConfirm(true);
  };

  /* Guardar  */
  const handleConfirmSave = async () => {
    try {
      setLoading(true);
      setShowConfirm(false);
      setError("");

      await actualizarDonador(donador.id_donador, form);

      setResultModal({
        open: true,
        type: "success",
        title: "Donador actualizado",
        message: "Los cambios se guardaron correctamente.",
      });
    } catch (err) {
      setResultModal({
        open: true,
        type: "error",
        title: "Error al actualizar",
        message:
          err?.response?.data?.message ||
          "No se pudo actualizar el donador.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFinalClose = () => {
    const fueExito = resultModal.type === "success";

    setResultModal((prev) => ({ ...prev, open: false }));

    if (fueExito) {
      onSuccess?.(form);   
      onClose?.();
    }
  };

  return {
    form,
    setForm,
    loading,
    error,
    showConfirm,
    setShowConfirm,
    resultModal,
    handlePreSubmit,
    handleConfirmSave,
    handleFinalClose,
  };
}