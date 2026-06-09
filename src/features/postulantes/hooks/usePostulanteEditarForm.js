import { useState, useEffect, useRef } from "react";
import { useActualizarPostulante } from "../hooks/usePostulantes";
import { normalizeName } from "../../../utils/normalizeName";

export const usePostulanteEditarForm = (open, postulante, onSuccess, onClose) => {
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
    nivel_escolar_inicial: "",
    grado_escolar_inicial: "",
    referencia_ingreso: "",
    referencia_casa: "",
    gasto_alimentacion: "",
    gasto_alimentacion_id: null,
    gasto_transporte: "",
    gasto_transporte_id: null,
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

  const actualizarMutation = useActualizarPostulante();
  const loading = actualizarMutation.isPending;
  useEffect(() => {
    if (Object.keys(fieldErrors).length === 0) {
      setError("");
    }
  }, [fieldErrors]);

  useEffect(() => {
    if (!postulante) return;

    setForm({
      nombre: postulante.nombre || "",
      apellido_p: postulante.apellido_p || "",
      apellido_m: postulante.apellido_m || "",
      fecha_nacimiento: postulante.fecha_nacimiento || "",
      telefono: postulante.telefono || "",
      genero: postulante.genero || "",
      correo: postulante.correo || "",
      calle: postulante.calle || "",
      numero: postulante.numero || "",
      cp: postulante.cp || "",
      municipio: postulante.municipio || "",
      colonia: postulante.colonia || "",

      nivel_escolar_inicial: postulante.nivel_escolar_inicial || "",
      grado_escolar_inicial: postulante.grado_escolar_inicial || "",
      referencia_ingreso: postulante.referencia_ingreso || "",
      referencia_casa: postulante.referencia_casa || "",

      gasto_alimentacion: postulante.gastos?.find(g => g.nombre === "Alimentacion")?.monto || "",
      gasto_transporte: postulante.gastos?.find(g => g.nombre === "Transporte")?.monto || "",
      gasto_alimentacion_id: postulante.gastos?.find(g => g.nombre === "Alimentacion")?.id_gasto || "",
      gasto_transporte_id: postulante.gastos?.find(g => g.nombre === "Transporte")?.id_gasto || "",
    });
  }, [postulante]);

  const validarFormulario = () => {
    const errors = {};
    if (!form.nombre.trim()) errors.nombre = "Nombre obligatorio";
    if (!form.apellido_p.trim()) errors.apellido_p = "Apellido obligatorio";
    if (!form.correo.trim()) errors.correo = "Correo obligatorio";
    if (!form.telefono.trim()) errors.telefono = "Teléfono obligatorio";
    if (!form.genero.trim()) errors.genero = "Selecciona género";
    if (!form.fecha_nacimiento) errors.fecha_nacimiento = "Selecciona fecha";

    if (!form.cp.trim()) errors.cp = "CP obligatorio";
    if (!form.municipio.trim()) errors.municipio = "Municipio obligatorio";
    if (!form.colonia.trim()) errors.colonia = "Colonia obligatoria";
    if (!form.calle.trim()) errors.calle = "Calle obligatoria";
    if (!form.numero.trim()) errors.numero = "Número obligatorio";
    if (!form.referencia_casa.trim())
      errors.referencia_casa = "Referencia obligatoria";
    if (!form.referencia_ingreso.trim())
      errors.referencia_ingreso = "Referencia obligatoria";

    if (!form.nivel_escolar_inicial.trim())
      errors.nivel_escolar_inicial = "Nivel obligatorio";

    if (!form.grado_escolar_inicial.trim())
      errors.grado_escolar_inicial = "Grado obligatorio";
    if (
      form.gasto_alimentacion === null ||
      form.gasto_alimentacion === undefined ||
      form.gasto_alimentacion === ""
    ) {
      errors.gasto_alimentacion = "Gasto de alimentacion obligatorio";
    }

    if (
      form.gasto_transporte === null ||
      form.gasto_transporte === undefined ||
      form.gasto_transporte === ""
    ) {
      errors.gasto_transporte = "Gasto de transporte obligatorio";
    }
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

        nivel_escolar_inicial: "Nivel escolar inicial",
        grado_escolar_inicial: "Grado escolar inicial",

        referencia_ingreso: "Referencia de ingreso",
        referencia_casa: "Referencia de domicilio",

        gasto_alimentacion: "Gasto de alimentacion",
        gasto_transporte: "Gasto de transporte",
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

            geografia: {
              codigo_postal: form.cp,
              municipio: form.municipio,
              colonia: form.colonia,
            },
          },
        },

        estudio: {
          nivel_escolar_inicial: form.nivel_escolar_inicial,
          grado_escolar_inicial: form.grado_escolar_inicial,
          referencia_ingreso: form.referencia_ingreso,
          referencia_casa: form.referencia_casa,

          gastos: [
            {
              id_gasto: form.gasto_alimentacion_id, 
              nombre: "Alimentacion",
              monto: String(form.gasto_alimentacion || "0.00"),
            },
            {
              id_gasto: form.gasto_transporte_id, 
              nombre: "Transporte",
              monto: String(form.gasto_transporte || "0.00"),
            },
          ],
        },
      };

      await actualizarMutation.mutateAsync({
        id: postulante.id_expediente,
        data: payload
      });

      setResultModal({
        open: true,
        type: "success",
        title: "Actualizado",
        message: "Postulante actualizado correctamente",
      });

    } catch (err) {


      const backendErrors = err?.errors || err?.response?.data;
      console.log(backendErrors)
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


