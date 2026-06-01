import { useState, useRef, useEffect } from "react";
import { useActualizarFamilia } from "./useFamilia";
import { useQueryClient } from "@tanstack/react-query";
import { postulantesKeys } from "../../../features/postulantes/services/postulantesKeys";

export const useEditarFamiliar = (
  editando,
  onClose,
) => {

  const queryClient = useQueryClient();

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [resultOpen, setResultOpen] = useState(false);
  const [resultType, setResultType] = useState("success");
  const [resultTitle, setResultTitle] = useState("");
  const [resultMessage, setResultMessage] = useState("");

  const fieldRefs = useRef({});

  const editarMutation = useActualizarFamilia();

  useEffect(() => {
    setFieldErrors({});
    setGeneralError("");
  }, [editando?.id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let val = type === "checkbox" ? checked : value;

    if (name === "telefono") {
      val = value.replace(/\D/g, "").slice(0, 10);
    }

    editando[name] = val; // ⚠️ solo local mutation controlado por React state externo

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
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

    const errors = {};

    required.forEach((field) => {
      if (
        editando[field] === undefined ||
        editando[field] === null ||
        editando[field] === ""
      ) {
        errors[field] = "Este campo es obligatorio";
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setGeneralError("Completa los campos obligatorios.");

      const firstError = Object.keys(errors)[0];
      fieldRefs.current[firstError]?.focus();

      return false;
    }

    setGeneralError("");
    return true;
  };

  const handleConfirm = async () => {

    setConfirmOpen(false);

    try {

      const payload = {
        ...editando,
        edad: Number(editando.edad),
        vive_en_casa:
          String(editando.vive_en_casa) === "true",
      };

      await editarMutation.mutateAsync(payload);

      // 🔥 clave: refrescar expediente automáticamente
      queryClient.invalidateQueries({
        queryKey: postulantesKeys.detail(
          editando.id_postulante
        ),
      });

      setResultType("success");
      setResultTitle("Actualización exitosa");
      setResultMessage("El familiar fue actualizado correctamente.");
      setResultOpen(true);

    } catch (error) {

      setResultType("error");
      setResultTitle("Error");
      setResultMessage(
        error.message ||
          "No se pudo actualizar el familiar.",
      );
      setResultOpen(true);

      if (error.response?.data) {
        const backendErrors = {};

        Object.entries(error.response.data).forEach(
          ([key, val]) => {
            backendErrors[key] = Array.isArray(val)
              ? val[0]
              : val;
          }
        );

        setFieldErrors(backendErrors);
      }
    }
  };

  const handleCloseResult = () => {
    setResultOpen(false);

    if (resultType === "success") {
      onClose();
    }
  };

  return {
    handleChange,
    handleConfirm,
    validate,

    confirmOpen,
    setConfirmOpen,

    loading: editarMutation.isPending,

    fieldErrors,
    generalError,
    fieldRefs,

    resultOpen,
    resultType,
    resultTitle,
    resultMessage,
    handleCloseResult,
  };
};