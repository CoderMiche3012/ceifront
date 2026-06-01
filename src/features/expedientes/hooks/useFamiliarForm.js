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
    edad: "",
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

    const required = [
      "nombre",
      "apellido_p",
      "parentesco",
      "edad",
      "telefono",
      "actividad_principal",
      "salario",
      "vive_en_casa",
    ];

    const faltantes =
      required.filter((field) => {

        const value =
          formData[field];

        return (
          value === null ||
          value === undefined ||
          value
            .toString()
            .trim() === ""
        );
      });

    if (faltantes.length > 0) {

      setGeneralError(
        "Faltan campos obligatorios por completar",
      );

      return false;
    }

    // edad invalida
    if (
      Number(formData.edad) < 0
    ) {

      setGeneralError(
        "La edad no es válida",
      );

      return false;
    }

    // telefono invalido
    if (
      formData.telefono &&
      formData.telefono.length !== 10
    ) {

      setGeneralError(
        "El teléfono debe tener exactamente 10 dígitos",
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

        edad: Number(
          formData.edad,
        ),

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

      // cerrar modal
      onClose();

    } catch (error) {

      setResultadoModal({
        open: true,
        type: "error",
        title: "Error al guardar",
        message:
          error.message ||
          "No se pudo guardar el familiar.",
      });

      // errores backend
      if (error.response?.data) {

        const backendErrors = {};

        Object.entries(
          error.response.data,
        ).forEach(
          ([key, val]) => {

            backendErrors[key] =
              Array.isArray(val)
                ? val[0]
                : val;
          },
        );

        setFieldErrors(
          backendErrors,
        );
      }
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