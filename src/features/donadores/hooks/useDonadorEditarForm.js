import { useEffect, useState } from "react";
import { useActualizarDonador } from "./useDonadores";
import { normalizeName } from "../../../utils/normalizeName";

export function useDonadorEditarForm(open, donador, onSuccess, onClose) {
  // estados
  const [fieldErrors, setFieldErrors] = useState({});
  const actualizarMutation = useActualizarDonador();
  const [loadingCP, setLoadingCP] = useState(false);
  const [cpEncontrado, setCpEncontrado] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    apellido_p: "",
    apellido_m: "",
    correo: "",
    telefono: "",
    tipo: "",
    calle: "",
    numero: "",
    cp: "",
    pais: "",
    municipio: "",
    estado: "",
    colonia: "",
    id_geografia: null,
  });

  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const [resultModal, setResultModal] = useState({
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
    console.log("reinicializando formulario");
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
      apellido_p: donador.apellido_paterno || "",
      apellido_m: donador.apellido_materno || "",
      correo: donador.correo || "",
      telefono: donador.telefono || "",
      tipo: donador.tipo_donador || "",
      calle: donador.domicilio_detalle?.calle || "",
      numero: donador.domicilio_detalle?.numero || "",
      cp: donador.domicilio_detalle?.geografia_detalle?.codigo_postal || "",
      pais: donador.domicilio_detalle?.geografia_detalle?.pais || "",
      municipio: donador.domicilio_detalle?.geografia_detalle?.municipio || "",
      estado: donador.domicilio_detalle?.geografia_detalle?.estado || "",
      colonia: donador.domicilio_detalle?.geografia_detalle?.colonia || "",
      id_geografia: donador.domicilio_detalle?.geografia_detalle?.id_geografia ?? null,
    });
  }, [open]);

  const validar = () => {
    const errors = {};

    if (!form.nombre.trim())
      errors.nombre = "El nombre es obligatorio";

    if (!form.apellido_p.trim())
      errors.apellido_p = "El apellido paterno es obligatorio";

    if (!form.correo.trim())
      errors.correo = "El correo es obligatorio";

    if (!form.telefono.trim())
      errors.telefono = "El teléfono es obligatorio";

    if (!form.tipo.trim())
      errors.tipo = "Selecciona un tipo";

    if (!form.fecha_ingreso.trim())
      errors.fecha_ingreso = "Selecciona una fecha";

    if (!form.pais.trim())
      errors.pais = "Selecciona un país";

    if (!form.cp.trim())
      errors.cp = "El código postal es obligatorio";

    if (!form.municipio.trim())
      errors.municipio = "La localidad es obligatoria";

    if (!form.estado.trim())
      errors.estado = "El estado es obligatorio";

    if (!form.calle.trim())
      errors.calle = "La calle es obligatoria";

    if (!form.numero.trim())
      errors.numero = "El número es obligatorio";
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
        estado: "Estado",
        municipio: "Localidad",
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
        setShowConfirm(false);
        const payload = {
          nombre: normalizeName(form.nombre),
          apellido_paterno: normalizeName(form.apellido_p),
          apellido_materno: normalizeName(form.apellido_m) || null,
          correo: form.correo,
          telefono: form.telefono,
          tipo_donador: form.tipo,
          domicilio: {
            calle: form.calle,
            numero_exterior: form.numero,
            geografia: {
              id_geografia: form.id_geografia,
              codigo_postal: form.cp,
              municipio: form.municipio,
              colonia: form.colonia || null,
              estado: form.estado,
              pais: form.pais,
            },
          },
        };
        await actualizarMutation.mutateAsync(
          {
            id: donador.id_donador,
            data: payload,
          }
        );

        setResultModal({
          open: true,
          type: "success",
          title: "Donador actualizado",
          message: "Los cambios se guardaron correctamente.",
        });
      } catch (err) {
        setShowConfirm(false);
        const backendErrors = err?.errors || err?.response?.data;
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
            pais: "País",
            cp: "Código postal",
            estado: "Estado",
            municipio: "Localidad",
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

  const handleFinalClose = () => {
    const fueExito = resultModal.type === "success";

    setResultModal((prev) => ({
      ...prev,
      open: false,
    }));

    if (fueExito) {
      onSuccess?.(form);
      onClose?.();
    }
  };

  return {
    form,
    setForm,
    fieldErrors,
    setFieldErrors,
    loading: actualizarMutation.isPending,
    error,
    showConfirm,
    setShowConfirm,
    resultModal,
    handlePreSubmit,
    handleConfirmSave,
    handleFinalClose,
    loadingCP,
    setLoadingCP,
    cpEncontrado,
    setCpEncontrado,
  };
}