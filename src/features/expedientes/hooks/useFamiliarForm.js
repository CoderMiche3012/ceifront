import { useState, useRef } from "react";

import { useCrearFamilia } from "./useFamilia";

export const useFamiliarForm = (
  expedienteId,
  postulanteId,
  onClose,
  setResultadoModal,
) => {

  const initialState = {
    nombre: "",
    apellido_p: "",
    apellido_m: "",
    parentesco: "",
    fecha_nacimiento: "",
    telefono: "",
    actividad_principal: "",
    area_laboral_escuela: "",
    salario: "",
    vive_en_casa: "",
    es_tutor_principal: false,
    id_expediente: expedienteId,
  };

  const [formData, setFormData] =
    useState(initialState);

  const [fieldErrors, setFieldErrors] =
    useState({});

  const [generalError, setGeneralError] =
    useState("");

  const [confirmOpen, setConfirmOpen] =
    useState(false);

  const fieldRefs = useRef({});

  const crearMutation =
    useCrearFamilia(
      expedienteId,
      postulanteId,
    );

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    let val =
      type === "checkbox"
        ? checked
        : value;

    // telefono solo numeros
    if (name === "telefono") {

      val = value
        .replace(/\D/g, "")
        .slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    // limpia error del campo
    if (fieldErrors[name]) {

      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // limpia error general
    if (generalError) {
      setGeneralError("");
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.nombre?.trim()) {
      errors.nombre = "El nombre es obligatorio";
    }

    if (!formData.apellido_p?.trim()) {
      errors.apellido_p = "El apellido paterno es obligatorio";
    }

    if (!formData.parentesco?.trim()) {
      errors.parentesco = "Seleccione un parentesco";
    }

    if (!formData.fecha_nacimiento) {
      errors.fecha_nacimiento = "Seleccione una fecha";
    }

    if (!formData.telefono?.trim()) {
      errors.telefono = "El teléfono es obligatorio";
    } else if (formData.telefono.length !== 10) {
      errors.telefono = "El teléfono debe tener 10 dígitos";
    }

    if (!formData.actividad_principal?.trim()) {
      errors.actividad_principal = "La ocupación es obligatoria";
    }

    if (
      formData.salario === "" ||
      formData.salario === null ||
      formData.salario === undefined
    ) {
      errors.salario = "El salario es obligatorio";
    }

    if (
      formData.vive_en_casa === "" ||
      formData.vive_en_casa === null ||
      formData.vive_en_casa === undefined
    ) {
      errors.vive_en_casa = "Seleccione una opción";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const labels = {
        nombre: "Nombre",
        apellido_p: "Apellido paterno",
        parentesco: "Parentesco",
        fecha_nacimiento: "Fecha de nacimiento",
        telefono: "Teléfono",
        actividad_principal: "Ocupación / Grado escolar",
        salario: "Salario o escuela",
        vive_en_casa: "Habita en el mismo domicilio",
      };

      const campos = Object.keys(errors)
        .map((key) => labels[key] || key)
        .join(", ");

      setGeneralError(
        `Revisa los siguientes campos: ${campos}`
      );

      return false;
    }

    setGeneralError("");
    return true;
  };

  const handleConfirm = async () => {

    setConfirmOpen(false);

    try {

      const dataFinal = {
        ...formData,

        vive_en_casa:
          formData.vive_en_casa ===
          "true",
      };

      await crearMutation.mutateAsync(
        dataFinal,
      );

      // limpiar formulario
      setFormData(initialState);

      // modal success
      setResultadoModal({
        open: true,
        type: "success",
        title: "Registro exitoso",
        message:
          "El familiar fue agregado correctamente.",
      });

    } catch (error) {
  const backendData =
    error?.errors ||
    error?.response?.data?.errors ||
    error?.response?.data;

  if (
    backendData &&
    typeof backendData === "object" &&
    !Array.isArray(backendData)
  ) {
    const parsedErrors = {};

    Object.entries(backendData).forEach(([key, value]) => {
      parsedErrors[key] = Array.isArray(value)
        ? value[0]
        : value;
    });

    setFieldErrors(parsedErrors);

    const labels = {
      nombre: "Nombre",
      apellido_p: "Apellido paterno",
      parentesco: "Parentesco",
      fecha_nacimiento: "Fecha de nacimiento",
      telefono: "Teléfono",
      actividad_principal: "Ocupación / Grado escolar",
      salario: "Salario o escuela",
      vive_en_casa: "Habita en el mismo domicilio",
    };

    const campos = Object.keys(parsedErrors)
      .map((key) => labels[key] || key)
      .join(", ");

    setGeneralError(
      `Revisa los siguientes campos: ${campos}`
    );

    return;
  }

  // Solo errores inesperados
  setResultadoModal({
    open: true,
    type: "error",
    title: "Error al guardar",
    message: "No se pudo guardar el familiar.",
  });
}
  };

  return {

    formData,

    handleChange,

    handleConfirm,

    validate,

    confirmOpen,

    setConfirmOpen,

    loading:
      crearMutation.isPending,

    fieldErrors,

    generalError,

    setGeneralError,

    fieldRefs,
  };
};