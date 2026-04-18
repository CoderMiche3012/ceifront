import { useState, useEffect, useRef } from "react";
import { postulantesService } from "../../services/postulantesService";
import { crearBeneficiario } from "../../services/beneficiariosService";
import { crearEstudio } from "../../services/estudiosService";
import { crearExpediente } from "../../services/expedientesService";
export const useBeneficiarioCrearForm = (onSuccess, onClose) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({
    open: false,
    type: "success",
    title: "",
    message: ""
  });

  const isSubmitting = useRef(false);

  const [form, setForm] = useState({
    fecha_ingreso: "",
    id_expediente: {
      nombre: "",
      apellido_p: "",
      apellido_m: "",
      fecha_nacimiento: "",
      telefono: "",
      genero: "",
      correo: "",
      nota_situacion_familiar: "Registro manual desde panel",
      id_direccion: {
        calle: "",
        numero: "",
        colonia: "",
        municipio: "",
        cp: ""
      },
      familia: [
        {
          nombre: "",
          apellido_p: "",
          apellido_m: "",
          parentesco: "",
          edad: "",
          actividad_principal: "",
          area_laboral_escuela: "",
          salario: "",
          vive_en_casa: true,
          telefono: "",
          es_tutor_principal: true
        }
      ]
    }
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const userId = user.id_usuario || user.id;
        if (userId) setForm(prev => ({ ...prev, id_usuario: userId }));
      } catch (e) {
        console.error("Error cargando user:", e);
      }
    }
  }, []);

  const handlePreSubmit = (e) => {
    if (e) e.preventDefault();
    setError(null);

    const { nombre, apellido_p, correo, fecha_nacimiento, genero, familia } = form.id_expediente;
    const { calle, municipio, cp } = form.id_expediente.id_direccion;

    const tutor = familia[0];

    if (!nombre || !apellido_p || !correo || !fecha_nacimiento || !genero || !calle || !municipio || !cp) {
      setError("Por favor, completa todos los campos obligatorios");
      return;
    }

    if (!tutor.nombre || !tutor.apellido_p || !tutor.parentesco) {
      setError("Los datos del Tutor Principal son obligatorios.");
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    setLoading(true);
    setShowConfirm(false);
    setError(null);

    try {
      console.log("DATA QUE SE ENVÍA:", form.id_expediente);
      const resExpediente = await crearExpediente(form.id_expediente);
      const dataExpediente = resExpediente.data || resExpediente;
      const idExpedienteGenerado = dataExpediente.id_expediente;
      if (!idExpedienteGenerado) {
        throw new Error("No se recibió ID de expediente");
      }
      await crearBeneficiario({
        id_expediente: idExpedienteGenerado,
        fecha_ingreso: form.fecha_ingreso,
        notas: "",
        estatus: "Activo",
      });
      setResultModal({
        open: true,
        type: "success",
        title: "¡Éxito!",
        message: "Registro completado correctamente."
      });

    } catch (err) {
      console.error("Error al registrar:", err);
      setError(err.message);
      setResultModal({
        open: true,
        type: "error",
        title: "Error",
        message: err.message
      });
    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  const handleFinalClose = () => {
    if (resultModal.type === "success") {
      onSuccess?.();
      onClose();
    }
    setResultModal(p => ({ ...p, open: false }));
  };

  return {
    form,
    setForm,
    error,
    loading,
    showConfirm,
    setShowConfirm,
    resultModal,
    handlePreSubmit,
    handleConfirmSave,
    handleFinalClose
  };
};