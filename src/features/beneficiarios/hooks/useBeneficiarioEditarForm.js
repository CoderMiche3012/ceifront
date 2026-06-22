import { useState, useEffect, useRef } from "react";
import { useActualizarBeneficiario } from "./useBeneficiarios";
import { normalizeName } from "../../../utils/normalizeName";

export const useBeneficiarioEditarForm = (open, data, onSuccess, onClose) => {

  const initialForm = {
    nombre: "",
    apellido_p: "",
    apellido_m: "",
    fecha_nacimiento: "",
    telefono: "",
    genero: "",
    correo: "",
    calle: "",
    numero: "",
    colonia: "",
    municipio: "",
    cp: "",
    id_geografia: null,
  };

  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingCP, setLoadingCP] = useState(false);
  const [cpEncontrado, setCpEncontrado] = useState(false);

  const [resultModal, setResultModal] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const isSubmitting = useRef(false);

  const actualizarMutation = useActualizarBeneficiario();
  const loading = actualizarMutation.isPending;
  useEffect(() => {
    if (Object.keys(fieldErrors).length === 0) {
      setError("");
    }
  }, [fieldErrors]);

  useEffect(() => {
    if (!data) return;

    setForm({
      nombre: data?.nombre || "",
      apellido_p: data?.apellido_p || "",
      apellido_m: data?.apellido_m || "",
      fecha_nacimiento: data?.fecha_nacimiento || "",
      telefono: data?.telefono || "",
      genero: data?.genero || "",
      correo: data?.correo || "",
      calle: data?.direccion?.calle || "",
      numero: data?.direccion?.numero || "",
      cp: data?.direccion?.cp || "",
      municipio: data?.direccion?.municipio || "",
      colonia: data?.direccion?.colonia || "",
    });
  }, [data]);

  const validarFormulario = () => {
    const errors = {};

    if (!form.nombre.trim()) errors.nombre = "Nombre obligatorio";
    if (!form.apellido_p.trim()) errors.apellido_p = "Apellido obligatorio";

    if (!form.correo.trim()) {
      errors.correo = "Correo obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      errors.correo = "Correo inválido";
    }

    if (!form.telefono.trim()) {
      errors.telefono = "Teléfono obligatorio";
    } else if (!/^\d{10}$/.test(form.telefono)) {
      errors.telefono = "El teléfono debe tener 10 dígitos";
    }

    if (!form.genero.trim()) errors.genero = "Selecciona género";

    if (!form.fecha_nacimiento) {
      errors.fecha_nacimiento = "Selecciona fecha";
    } else {
      const hoy = new Date();
      const nacimiento = new Date(form.fecha_nacimiento);

      if (nacimiento > hoy) {
        errors.fecha_nacimiento =
          "La fecha de nacimiento no puede ser futura";
      }
    }

    if (!form.cp.trim()) errors.cp = "CP obligatorio";
    if (!form.municipio.trim()) errors.municipio = "Municipio obligatorio";
    if (!form.colonia.trim()) errors.colonia = "Colonia obligatoria";
    if (!form.calle.trim()) errors.calle = "Calle obligatoria";
    if (!form.numero.trim()) errors.numero = "Número obligatorio";

    return errors;
  };

  const handlePreSubmit = (e) => {
    if (e) e.preventDefault();

    const errors = validarFormulario();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const labels = {
        nombre: "Nombre",
        apellido_p: "Apellido paterno",
        apellido_m: "Apellido materno",
        correo: "Correo",
        telefono: "Teléfono",
        genero: "Género",
        fecha_nacimiento: "Fecha de nacimiento",

        cp: "Código postal",
        municipio: "Municipio",
        colonia: "Colonia",
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

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));

    setFieldErrors(prev => {
      const n = { ...prev };
      delete n[field];
      return n;
    });
  };

  const handleConfirmSave = async () => {
    if (isSubmitting.current) return;

    isSubmitting.current = true;
    setShowConfirm(false);

    try {

      const payload = {
        expediente: {
          nombre: normalizeName(form.nombre),
          apellido_p: normalizeName(form.apellido_p),
          apellido_m: normalizeName(form.apellido_m),
          fecha_nacimiento: form.fecha_nacimiento,
          telefono: form.telefono,
          genero: form.genero,
          correo: form.correo,

          direccion: {
            calle: form.calle,
            numero: form.numero,
            codigo_postal: form.cp,
            municipio: form.municipio,
            colonia: form.colonia,
          },
        },
      };

      await actualizarMutation.mutateAsync({
        id: data.id_beneficiario,
        data: payload
      });

      setResultModal({
        open: true,
        type: "success",
        title: "Actualizado",
        message: "Beneficiario actualizado correctamente",
      });

    } catch (err) {

      const backendErrors = err?.errors || err?.response?.data;
      if (
        backendErrors &&
        typeof backendErrors === "object" &&
        !Array.isArray(backendErrors)
      ) {
        const parsedErrors = {};

        Object.entries(backendErrors).forEach(([section, fields]) => {
          if (
            fields &&
            typeof fields === "object" &&
            !Array.isArray(fields)
          ) {
            Object.entries(fields).forEach(([field, messages]) => {
              parsedErrors[field] = Array.isArray(messages)
                ? messages[0]
                : messages;
            });
          } else {
            parsedErrors[section] = Array.isArray(fields)
              ? fields[0]
              : fields;
          }
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
    finally {
      isSubmitting.current = false;
    }
  };

  const handleFinalClose = () => {
    const ok = resultModal.type === "success";

    setResultModal({ open: false, type: "", title: "", message: "" });

    if (ok) {
      onSuccess?.();
    }

    onClose?.();
  };

  return {
    form,
    setForm,
    handleChange,
    fieldErrors,
    error,
    loading,
    loadingCP,
    cpEncontrado,
    setLoadingCP,
    setCpEncontrado,
    showConfirm,
    setShowConfirm,
    resultModal,
    handlePreSubmit,
    handleConfirmSave,
    handleFinalClose,
  };
};


