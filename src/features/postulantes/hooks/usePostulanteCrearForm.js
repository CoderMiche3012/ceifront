import { useState, useEffect, useRef } from "react";
import { postulantesService } from "../services/postulantesService";
import { crearEstudio } from "../services/estudiosService";

export const usePostulanteCrearForm = (onSuccess, onClose) => {
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
    estatus: "En Revisión",
    id_usuario: null,
    nivel_escolar_inicial: "",
    grado_escolar_inicial: "",
    referencia_ingreso: "",
    referencia_casa: "",
    prioridad_servicio: "Pendiente",
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
          salario: "0.00",
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

    if (!nombre || !apellido_p || !correo || !fecha_nacimiento || !genero || !calle || !municipio || !cp || !form.nivel_escolar_inicial) {
      setError("Por favor, completa todos los campos obligatorios del nuevo ingreso.");
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
      const resPostulante = await postulantesService.crearPostulante(form);
      const dataPostulante = resPostulante.data || resPostulante;
      const idExpedienteGenerado =
        dataPostulante.id_expediente?.id_expediente ||
        dataPostulante.id_expediente;

      if (!idExpedienteGenerado) {
        throw new Error("No se recibió ID de expediente");
      }
      await crearEstudio({
        id_expediente: idExpedienteGenerado,
        nivel_escolar_inicial: form.nivel_escolar_inicial,
        grado_escolar_inicial: form.grado_escolar_inicial,
        referencia_ingreso: form.referencia_ingreso,
        referencia_casa: form.referencia_casa,
        prioridad_servicio: "Pendiente",
        estatus_estudio: "En revision"
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