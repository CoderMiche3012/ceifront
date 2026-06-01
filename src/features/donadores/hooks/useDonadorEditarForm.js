// por corregir

import {
  useEffect,
  useState,
} from "react";

import { useActualizarDonador } from "./useDonadores";

export function useDonadorEditarForm(
  open,
  donador,
  onSuccess,
  onClose
) {
  const [fieldErrors, setFieldErrors] = useState({});
  const actualizarMutation =
    useActualizarDonador();

  const [form, setForm] =
    useState({
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

  const [error, setError] =
    useState("");

  const [
    showConfirm,
    setShowConfirm,
  ] = useState(false);

  const [
    resultModal,
    setResultModal,
  ] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });
  useEffect(() => {
  if (Object.keys(fieldErrors).length === 0) {
    setError("");
  }
}, [fieldErrors]);

  // cargar datos al abrir modal
  
useEffect(() => {
  if (!open || !donador) return;

  setFieldErrors({});
  setError("");
  setShowConfirm(false);

  setResultModal({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

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

}, [open]);


  const validar = () => {
    const errors = {};

    if (!form.nombre.trim())
      errors.nombre =
        "El nombre es obligatorio";

    if (!form.apellido_p.trim())
      errors.apellido_p =
        "El apellido paterno es obligatorio";

    if (!form.correo.trim())
      errors.correo =
        "El correo es obligatorio";

    if (!form.telefono.trim())
      errors.telefono =
        "El teléfono es obligatorio";

    if (!form.tipo.trim())
      errors.tipo =
        "Selecciona un tipo";

    if (!form.fecha_ingreso.trim())
      errors.fecha_ingreso =
        "Selecciona una fecha";

    if (!form.pais.trim())
      errors.pais =
        "Selecciona un país";

    if (!form.cp.trim())
      errors.cp =
        "El código postal es obligatorio";

    if (!form.localidad.trim())
      errors.localidad =
        "La localidad es obligatoria";

    if (!form.calle.trim())
      errors.calle =
        "La calle es obligatoria";

    if (!form.numero.trim())
      errors.numero =
        "El número es obligatorio";

    return errors;
  };

  const handlePreSubmit = () => {
  const errors = validar();

  setFieldErrors(errors);

  if (Object.keys(errors).length > 0) {
    const labels = {
      nombre: "Nombre",
      apellido_p: "Apellido paterno",
      apellido_m: "Apellido materno",
      correo: "Correo",
      telefono: "Teléfono",
      tipo: "Tipo de donador",
      fecha_ingreso: "Fecha de ingreso",
      pais: "País",
      cp: "Código postal",
      localidad: "Localidad",
      calle: "Calle",
      numero: "Número",
    };

    const campos = Object.keys(errors)
      .map((key) => labels[key] || key)
      .join(", ");

    setError(`Revisa los siguientes campos: ${campos}`);
    return;
  }

  setError("");
  setShowConfirm(true);
};

  const handleConfirmSave =
    async () => {
      try {
        setShowConfirm(
          false
        );

        await actualizarMutation.mutateAsync(
          {
            id: donador.id_donador,
            data: form,
          }
        );

        setResultModal({
          open: true,
          type: "success",
          title:
            "Donador actualizado",
          message:
            "Los cambios se guardaron correctamente.",
        });
      } catch (err) {
  const backendErrors =
    err?.errors ||
    err?.response?.data;

  if (
    backendErrors &&
    typeof backendErrors === "object" &&
    !Array.isArray(backendErrors)
  ) {
    const parsedErrors = {};

    Object.entries(backendErrors).forEach(([key, value]) => {
      parsedErrors[key] = Array.isArray(value) ? value[0] : value;
    });

    setFieldErrors(parsedErrors);

    const labels = {
      nombre: "Nombre",
      apellido_p: "Apellido paterno",
      apellido_m: "Apellido materno",
      correo: "Correo",
      telefono: "Teléfono",
      tipo: "Tipo de donador",
      fecha_ingreso: "Fecha de ingreso",
      pais: "País",
      cp: "Código postal",
      localidad: "Localidad",
      calle: "Calle",
      numero: "Número",
    };

    const campos = Object.keys(parsedErrors)
      .map((key) => labels[key] || key)
      .join(", ");

    setError(`Revisa los siguientes campos: ${campos}`);

    return;
  }

  setResultModal({
    open: true,
    type: "error",
    title: "Error al actualizar",
    message: err.message || "No se pudo actualizar el donador.",
  });
}
    };

  const handleFinalClose =
    () => {
      const fueExito =
        resultModal.type ===
        "success";

      setResultModal(
        (
          prev
        ) => ({
          ...prev,
          open: false,
        })
      );

      if (fueExito) {
        onSuccess?.(
          form
        );
        onClose?.();
      }
    };

  return {
    form,
    setForm,
    fieldErrors,
    setFieldErrors,

    loading:
      actualizarMutation.isPending,

    error,

    showConfirm,
    setShowConfirm,

    resultModal,

    handlePreSubmit,
    handleConfirmSave,
    handleFinalClose,
  };
}
 