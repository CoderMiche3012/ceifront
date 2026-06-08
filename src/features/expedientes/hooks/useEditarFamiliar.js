import { useState, useRef, useEffect } from "react";
import { useActualizarFamilia } from "./useFamilia";

export const useEditarFamiliar = (
  editando,
  setEditando,
  onClose,
) => {

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
    const { name, value, type, checked } =
      e.target;

    let val =
      type === "checkbox"
        ? checked
        : value;

    if (name === "telefono") {
      val = value
        .replace(/\D/g, "")
        .slice(0, 10);
    }

    setEditando((prev) => ({
      ...prev,
      [name]: val,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (generalError) {
      setGeneralError("");
    }
  };

  const validate = () => {

    const errors = {};

    if (!editando.nombre?.trim()) {
      errors.nombre = "El nombre es obligatorio";
    }

    if (!editando.apellido_p?.trim()) {
      errors.apellido_p =
        "El apellido paterno es obligatorio";
    }

    if (!editando.parentesco?.trim()) {
      errors.parentesco =
        "Seleccione un parentesco";
    }

    if (!editando.fecha_nacimiento) {
      errors.fecha_nacimiento =
        "Seleccione una fecha";
    }

    if (!editando.telefono?.trim()) {
      errors.telefono =
        "El teléfono es obligatorio";
    } else if (
      editando.telefono.length !== 10
    ) {
      errors.telefono =
        "El teléfono debe tener 10 dígitos";
    }

    if (!editando.actividad_principal?.trim()) {
      errors.actividad_principal =
        "La ocupación es obligatoria";
    }

    if (
      editando.salario === "" ||
      editando.salario === null ||
      editando.salario === undefined
    ) {
      errors.salario =
        "El salario es obligatorio";
    }

    if (
      editando.vive_en_casa === "" ||
      editando.vive_en_casa === null ||
      editando.vive_en_casa === undefined
    ) {
      errors.vive_en_casa =
        "Seleccione una opción";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {

      const labels = {
        nombre: "Nombre",
        apellido_p: "Apellido paterno",
        parentesco: "Parentesco",
        fecha_nacimiento:
          "Fecha de nacimiento",
        telefono: "Teléfono",
        actividad_principal:
          "Ocupación / Grado escolar",
        salario: "Salario o escuela",
        vive_en_casa:
          "Habita en el mismo domicilio",
      };

      const campos = Object.keys(errors)
        .map(
          (key) => labels[key] || key
        )
        .join(", ");

      setGeneralError(
        `Revisa los siguientes campos: ${campos}`
      );

      const firstError =
        Object.keys(errors)[0];

      fieldRefs.current[
        firstError
      ]?.focus?.();

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
        vive_en_casa:
          String(
            editando.vive_en_casa
          ) === "true",
      };

      await editarMutation.mutateAsync({
        id: payload.id_familia,
        data: payload,
      });

      setResultType("success");
      setResultTitle(
        "Actualización exitosa"
      );
      setResultMessage(
        "El familiar fue actualizado correctamente."
      );
      setResultOpen(true);

    } catch (error) {

      const backendData =
        error?.errors ||
        error?.response?.data?.errors ||
        error?.response?.data;

      if (
        backendData &&
        typeof backendData === "object"
      ) {

        const parsedErrors = {};

        Object.entries(backendData).forEach(
          ([key, value]) => {
            parsedErrors[key] =
              Array.isArray(value)
                ? value[0]
                : value;
          }
        );

        setFieldErrors(parsedErrors);

        const labels = {
          nombre: "Nombre",
          apellido_p: "Apellido paterno",
          apellido_m: "Apellido materno",
          parentesco: "Parentesco",
          fecha_nacimiento: "Fecha de nacimiento",
          telefono: "Teléfono",
          actividad_principal:
            "Ocupación / Grado escolar",
          salario: "Salario o escuela",
          vive_en_casa:
            "Habita en el mismo domicilio",
        };

        const campos = Object.keys(parsedErrors)
          .map(
            (key) =>
              labels[key] || key
          )
          .join(", ");

        setGeneralError(
          `Revisa los siguientes campos: ${campos}`
        );

        return;
      }

      setResultType("error");
      setResultTitle("Error");
      setResultMessage(
        error?.message ||
        "No se pudo actualizar el familiar."
      );
      setResultOpen(true);
    }
  };

  const handleCloseResult = () => {

    setResultOpen(false);

    if (resultType === "success") {
      onClose?.();
    }
  };

  return {
    handleChange,
    handleConfirm,
    validate,

    confirmOpen,
    setConfirmOpen,

    loading:
      editarMutation.isPending,

    fieldErrors,
    generalError,
    setGeneralError,
    fieldRefs,

    resultOpen,
    resultType,
    resultTitle,
    resultMessage,
    handleCloseResult,
  };
};