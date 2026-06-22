import { useState, useEffect, useRef } from "react";
import { formatErrorAnidado } from "../../../utils/errorHandlers";
import { useCrearBeneficiario } from "../hooks/useBeneficiarios";
import { normalizeName } from "../../../utils/normalizeName";

export const useBeneficiarioCrearForm = (onSuccess, onClose) => {

  const initialForm = {
    estatus: "Activo",
    fecha_ingreso: "",
    notas: " ",
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
  const crearBeneficiarioMutation = useCrearBeneficiario();
  const loading = crearBeneficiarioMutation.isPending;


  const validarFormulario = () => {
    const errors = {};

    // PRINCIPAL
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

    if (!form.fecha_ingreso) {
      errors.fecha_ingreso = "Selecciona fecha";
    }

    if (!form.cp.trim()) errors.cp = "CP obligatorio";
    if (!form.municipio.trim()) errors.municipio = "Municipio obligatorio";
    if (!form.colonia.trim()) errors.colonia = "Colonia obligatoria";
    if (!form.calle.trim()) errors.calle = "Calle obligatoria";
    if (!form.numero.trim()) errors.numero = "Número obligatorio";

    //FAMILIA
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
        const hoy = new Date();
        const nacimiento = new Date(fam.fecha_nacimiento);

        if (nacimiento > hoy) {
          errors[`familia.${idx}.fecha_nacimiento`] =
            "La fecha no puede ser futura";
        }
      }

      //TELEFONO
      if (fam.telefono && !/^\d{10}$/.test(fam.telefono)) {
        errors[`familia.${idx}.telefono`] =
          "El teléfono debe tener 10 dígitos";
      }

      if (!fam.salario)
        errors[`familia.${idx}.salario`] =
          "Salario o escuela obligatorio";

      if (!fam.actividad_principal?.trim())
        errors[`familia.${idx}.actividad_principal`] =
          "Actividad obligatoria";
    });

    // TUTOR
    const tutor = form.familia?.[0];

    if (tutor?.fecha_nacimiento) {
      const hoy = new Date();
      const nacimiento = new Date(tutor.fecha_nacimiento);

      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const m = hoy.getMonth() - nacimiento.getMonth();

      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }

      if (edad < 18) {
        errors["familia.0.fecha_nacimiento"] =
          "El tutor debe ser mayor o igual a 18 años";
      }
    }

    return errors;
  };

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
        estatus: "Activo",
        fecha_ingreso: form.fecha_ingreso,
        notas: "",
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


        familia: form.familia,
      };

      await crearBeneficiarioMutation.mutateAsync(payload);
      setResultModal({
        open: true,
        type: "success",
        title: "¡Éxito!",
        message: "Registro completado correctamente.",
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



