import { useState, useEffect, useRef } from "react";
import { useCrearPostulante } from "../hooks/usePostulantes";
import { formatErrorAnidado } from "../../../utils/errorHandlers";
import { normalizeName } from "../../../utils/normalizeName";

export const usePostulanteCrearForm = (onSuccess, onClose) => {

  const initialForm = {
    id_usuario: null,
    nombre: "",
    apellido_p: "",
    apellido_m: "",
    fecha_nacimiento: "",
    telefono: "",
    genero: "",
    correo: "",
    calle: "",
    numero: "",
    id_geografia: null,
    colonia: "",
    municipio: "",
    cp: "",
    nivel_escolar_inicial: "",
    grado_escolar_inicial: "",
    referencia_ingreso: "",
    referencia_casa: "",
    prioridad_servicio: "Pendiente",
    gasto_alimentacion: "",
    gasto_transporte: "",
    familia: [
      {
        nombre: "",
        apellido_p: "",
        apellido_m: "",
        parentesco: "",
        fecha_nacimiento: "",
        actividad_principal: "",
        salario: "",
        vive_en_casa: true,
        telefono: "",
        es_tutor_principal: true,
      },
    ],
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
  const crearPostulanteMutation = useCrearPostulante();
  const loading = crearPostulanteMutation.isPending;

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const fecha = new Date(fechaNacimiento);

    let edad = hoy.getFullYear() - fecha.getFullYear();

    const mes = hoy.getMonth() - fecha.getMonth();

    if (
      mes < 0 ||
      (mes === 0 && hoy.getDate() < fecha.getDate())
    ) {
      edad--;
    }

    return edad;
  };

  const validarFormulario = () => {
    const errors = {};

    if (!form.nombre.trim()) errors.nombre = "Nombre obligatorio";
    if (!form.apellido_p.trim()) errors.apellido_p = "Apellido obligatorio";
    if (!form.correo.trim()) errors.correo = "Correo obligatorio";
    if (!form.telefono.trim()) errors.telefono = "Teléfono obligatorio";
    if (!form.genero.trim()) errors.genero = "Selecciona género";
    if (!form.fecha_nacimiento) {
      errors.fecha_nacimiento = "Selecciona fecha";
    } else {
      const edad = calcularEdad(form.fecha_nacimiento);

      if (edad < 1 || edad > 100) {
        errors.fecha_nacimiento =
          "La edad debe estar entre 1 y 100 años";
      }
    }

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
    if (!form.gasto_alimentacion.trim())
      errors.gasto_alimentacion = "Gasto de alimentacion obligatorio";
    if (!form.gasto_transporte.trim())
      errors.gasto_transporte = "Gasto de transporte";

    form.familia.forEach((fam, idx) => {
      if (!fam.nombre?.trim())
        errors[`familia.${idx}.nombre`] = "Nombre obligatorio";

      if (!fam.apellido_p?.trim())
        errors[`familia.${idx}.apellido_p`] = "Apellido obligatorio";

      if (!fam.apellido_m?.trim())
        errors[`familia.${idx}.apellido_m`] = "Apellido obligatorio";

      if (!fam.parentesco?.trim())
        errors[`familia.${idx}.parentesco`] = "Parentesco obligatorio";

      if (!fam.fecha_nacimiento) {
        errors[`familia.${idx}.fecha_nacimiento`] = "Fecha obligatoria";
      } else {
        const edad = calcularEdad(fam.fecha_nacimiento);

        if (idx === 0) {
          // Tutor principal
          if (edad < 18 || edad > 100) {
            errors[`familia.${idx}.fecha_nacimiento`] =
              "El tutor principal debe tener entre 18 y 100 años";
          }
        } else {
          // Resto de familiares
          if (edad > 100) {
            errors[`familia.${idx}.fecha_nacimiento`] =
              "La edad no puede ser mayor a 100 años";
          }
        }
      }

      if (!fam.salario)
        errors[`familia.${idx}.salario`] = "Salario o escuela Obligatorio";

      if (!fam.actividad_principal?.trim())
        errors[`familia.${idx}.actividad_principal`] =
          "Actividad obligatoria";
      if (fam.telefono) {
        const telefono = fam.telefono.replace(/\D/g, "");

        if (!/^\d{10}$/.test(telefono)) {
          errors[`familia.${idx}.telefono`] =
            "El teléfono debe contener exactamente 10 dígitos";
        }
      }
    });

    return errors;
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      const user = JSON.parse(userData);

      setForm((prev) => ({
        ...prev,
        id_usuario: user.id_usuario || user.id,
      }));
    }
  }, []);
  useEffect(() => {
    const campos = Object.keys(fieldErrors);

    if (campos.length > 0) {

      const etiquetas = {
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

      const etiquetasFamilia = {
        nombre: "Nombre",
        apellido_p: "Apellido paterno",
        apellido_m: "Apellido materno",
        parentesco: "Parentesco",
        fecha_nacimiento: "Fecha de nacimiento",
        actividad_principal: "Ocupación o grado escolar",
        salario: "Salario",
        telefono: "Teléfono",
      };

      const nombresBonitos = campos.map((campo) => {

        if (campo.startsWith("familia.")) {
          const partes = campo.split(".");
          const indice = Number(partes[1]) + 1;
          const campoFamilia = partes[2];

          return `${etiquetasFamilia[campoFamilia] || campoFamilia} (Familiar ${indice})`;
        }

        return etiquetas[campo] || campo;
      });

      setError(`Revisa los campos: ${nombresBonitos.join(", ")}`);

    } else {
      setError(null);
    }
  }, [fieldErrors]);
  const handlePreSubmit = (e) => {
    if (e) e.preventDefault();

    const errors = validarFormulario();

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError(null);
      return;
    }

    setError("");
    setShowConfirm(true);
  };

  const handleChange = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev };

      if (field.includes(".")) {
        const keys = field.split(".");
        let current = updated;

        for (let i = 0; i < keys.length - 1; i++) {
          const key = isNaN(keys[i]) ? keys[i] : Number(keys[i]);

          current[key] = Array.isArray(current[key])
            ? [...current[key]]
            : { ...current[key] };

          current = current[key];
        }

        current[keys[keys.length - 1]] = value;
      } else {
        updated[field] = value;
      }

      return updated;
    });

    setFieldErrors((prev) => {
      const nuevos = { ...prev };
      delete nuevos[field];
      return nuevos;
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

            ...(form.id_geografia
              ? {
                id_geografia: form.id_geografia,
              }
              : {
                codigo_postal: form.cp,
                municipio: form.municipio,
                colonia: form.colonia,
              }),
          },
        },

        estudio: {
          nivel_escolar_inicial: form.nivel_escolar_inicial,
          grado_escolar_inicial: form.grado_escolar_inicial,
          referencia_ingreso: form.referencia_ingreso,
          referencia_casa: form.referencia_casa,
          gastos: [
            {
              nombre: "Alimentacion",
              monto: String(form.gasto_alimentacion || "0.00"),
            },
            {
              nombre: "Transporte",
              monto: String(form.gasto_transporte || "0.00"),
            },
          ],
        },

        familia: form.familia,
      };

      await crearPostulanteMutation.mutateAsync(payload);
      setResultModal({
        open: true,
        type: "success",
        title: "¡Éxito!",
        message: "Registro completo correctamente.",
      });
    } catch (err) {

      const backendErrors =
        err?.errors ||
        err?.response?.data?.errors ||
        {};

      const parsedErrors = {};

      const flattenErrors = (obj, prefix = "") => {
        Object.entries(obj).forEach(([key, value]) => {
          let newKey = prefix
            ? `${prefix}.${key}`
            : key;

          newKey = newKey
            .replace(/^id_expediente\./, "")
            .replace(/^id_expediente\.id_direccion\./, "")
            .replace(/^id_direccion\./, "")
            .replace(/^expediente\./, "")
            .replace(/^estudio\./, "");

          if (
            Array.isArray(value) &&
            typeof value[0] === "string"
          ) {
            parsedErrors[newKey] = value[0];
          } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
              if (typeof item === "object") {
                flattenErrors(item, `${newKey}.${index}`);
              }
            });
          } else if (
            typeof value === "object" &&
            value !== null
          ) {
            flattenErrors(value, newKey);
          }
        });
      };

      flattenErrors(backendErrors);


      if (Object.keys(parsedErrors).length > 0) {
        setFieldErrors(parsedErrors);
        setError(null);
        return;
      }

      setResultModal({
        open: true,
        type: "error",
        title: "Error",
        message:
          formatErrorAnidado(err) ||
          err.message,
      });
    } finally {
      isSubmitting.current = false;
    }
  };

  const handleFinalClose = () => {
    const wasSuccess = resultModal.type === "success";

    setResultModal({
      open: false,
      type: "",
      title: "",
      message: "",
    });

    if (wasSuccess) {
      setForm(initialForm);
      setFieldErrors({});
      setError(null);
      setShowConfirm(false);
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



