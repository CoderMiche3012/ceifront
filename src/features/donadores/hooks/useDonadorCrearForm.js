import { useState } from "react";
import { useCrearDonador } from "./useDonadores";
import { formatErrorAnidado } from "../../../utils/errorHandlers";
import { normalizeName } from "../../../utils/normalizeName";

export const useDonadorCrearForm = (onSuccess, onClose) => {

  const crearMutation = useCrearDonador();
  // formulario inicial
  const getInitialForm = () => ({
    nombre: "",
    apellido_p: "",
    apellido_m: "",
    telefono: "",
    correo: "",
    tipo: "",
    estatus: "Activo",
    fecha_ingreso: new Date().toISOString().split("T")[0],
    nota: "",
    calle: "",
    numero: "",
    cp: "",
    pais: "",
    municipio: "",
    estado: "",
    colonia: "",
    id_geografia: null,
  });
  // estados
  const [form, setForm] = useState(getInitialForm());
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingCP, setLoadingCP] = useState(false);
  const [cpEncontrado, setCpEncontrado] = useState(false);
  const [resultModal, setResultModal] =
    useState({
      open: false,
      type: "success",
      title: "",
      message: "",
    });

  const resetForm = () => {
    setForm(getInitialForm());
    setFieldErrors({});
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setError("");
  };

  const validarFormulario = () => {
    const errors = {};

    if (!form.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio";
    }

    if (!form.apellido_p.trim()) {
      errors.apellido_p = "El apellido paterno es obligatorio";
    }

    if (!form.correo.trim()) {
      errors.correo = "El correo es obligatorio";
    }

    if (!form.telefono.trim()) {
      errors.telefono = "El teléfono es obligatorio";
    }

    if (!form.tipo.trim()) {
      errors.tipo = "Selecciona un Origen";
    }

    if (!form.fecha_ingreso.trim()) {
      errors.fecha_ingreso = "Selecciona una fecha";
    }

    if (!form.pais.trim()) {
      errors.pais = "Selecciona un país";
    }

    if (!form.cp.trim()) {
      errors.cp = "El código postal es obligatorio";
    }

    if (!form.municipio.trim()) {
      errors.municipio = "La localidad es obligatoria";
    }

    if (!form.estado.trim()) {
      errors.estado = "El estado es obligatorio";
    }

    if (!form.calle.trim()) {
      errors.calle = "La calle es obligatoria";
    }

    if (!form.numero.trim()) {
      errors.numero = "El número es obligatorio";
    }

    return errors;
  };
  // para dar otra revisada a los datos
  const handlePreSubmit = () => {
    const errors = validarFormulario();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const labels = {
        nombre: "Nombre",
        apellido_p: "Apellido paterno",
        apellido_m: "Apellido materno",
        correo: "Correo",
        telefono: "Teléfono",
        tipo: "Origen de donador",
        fecha_ingreso: "Fecha de ingreso",
        pais: "País",
        cp: "Código postal",
        municipio: "Municipio",
        estado: "Estado",
        calle: "Calle",
        numero: "Número",
      };

      const campos =
        Object.keys(errors)
          .map((key) => labels[key] || key)
          .join(", ");

      setError(`Revisa los siguientes campos: ${campos}`);
      return;
    }

    setError("");
    setShowConfirm(true);
  };
  // mandar datos
  const handleConfirmSave =
    async () => {
      try {
        setShowConfirm(false);
        const payload = {
          nombre: normalizeName(form.nombre),
          apellido_paterno: normalizeName(form.apellido_p),
          apellido_materno: form.apellido_m ? normalizeName(form.apellido_m) : null,
          tipo_donador: form.tipo,
          correo: form.correo.trim().toLowerCase(),
          telefono: form.telefono,
          fecha_ingreso: form.fecha_ingreso,
          nota: form.nota || null,
          domicilio: {
            calle: normalizeName(form.calle),
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
        await crearMutation.mutateAsync(payload);
        setResultModal({
          open: true,
          type: "success",
          title: "Donador registrado",
          message: "El donador fue creado correctamente.",
        });
        onSuccess?.();
      } catch (err) {
        const backendErrors = err?.errors || err?.response?.data;
        if (
          backendErrors &&
          typeof backendErrors === "object" &&
          !Array.isArray(
            backendErrors
          )
        ) {
          const parsedErrors = {};
          Object.entries(backendErrors).forEach(
            ([key, value]) => {
              parsedErrors[key] =
                Array.isArray(
                  value
                )
                  ? value[0]
                  : value;
            }
          );
          setFieldErrors(parsedErrors);

          const labels = {
            nombre: "Nombre",
            apellido_p: "Apellido paterno",
            apellido_m: "Apellido materno",
            correo: "Correo",
            telefono: "Teléfono",
            tipo: "Origen de donador",
            fecha_ingreso: "Fecha de ingreso",
            pais: "País",
            cp: "Código postal",
            municipio: "Municipio",
            estado: "Estado",
            calle: "Calle",
            numero: "Número",
          };

          const campos =
            Object.keys(parsedErrors)
              .map(
                (key) =>
                  labels[key] ||
                  key
              )
              .join(", ");
          setError(`Revisa los siguientes campos: ${campos}`);
          return;
        }

        setResultModal({
          open: true,
          type: "error",
          title: "Error al guardar",
          message: formatErrorAnidado(err),
        });
      }
    };

  const handleFinalClose =
    () => {
      setResultModal(
        (prev) => ({
          ...prev,
          open: false,
        })
      );

      if (resultModal.type === "success") {
        resetForm();
        onClose?.();
      }
    };

  return {
    form,
    setForm,
    handleChange,
    fieldErrors,
    loading: crearMutation.isPending,
    loadingCP,
    setLoadingCP,
    cpEncontrado,
    setCpEncontrado,
    error,
    showConfirm,
    setShowConfirm,
    resultModal,
    handlePreSubmit,
    handleConfirmSave,
    handleFinalClose,
  };
};