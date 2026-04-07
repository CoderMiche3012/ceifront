import { useState, useEffect } from "react";
import { postulantesService } from "../../services/postulantesService";
import { crearEstudio } from "../../services/estudiosService";

export const usePostulanteCrearForm = (onSuccess, onClose) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({
    open: false, type: "success", title: "", message: ""
  });

  const [form, setForm] = useState({
    estatus: "En Revisión",
    id_usuario: null,
    nivel_escolar_inicial: "",
    grado_escolar_inicial: "",
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
      }
    }
  });

  // Cargar usuario de sesión
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const userId = user.id_usuario || user.id;
        if (userId) setForm(prev => ({ ...prev, id_usuario: userId }));
      } catch (e) { console.error("Error cargando user:", e); }
    }
  }, []);

  const handlePreSubmit = (e) => {
    if (e) e.preventDefault();
    setError(null);

    const { nombre, apellido_p, correo, fecha_nacimiento, genero } = form.id_expediente;
    const { calle, municipio, cp } = form.id_expediente.id_direccion;

    // Validación de campos requeridos
    if (!nombre || !apellido_p || !correo || !fecha_nacimiento || !genero || !calle || !municipio || !cp || !form.nivel_escolar_inicial) {
      setError("Por favor, completa todos los campos obligatorios.");
      document.querySelector(".custom-scrollbar")?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setLoading(true);
    setError(null);

    let idParaRevertir = null;

    try {
      // 1. Intentar crear el Postulante
      const res = await postulantesService.crearPostulante(form);
      const data = res.data || res;

      // IMPORTANTE: Verifica si tu API devuelve 'id' o 'id_postulante'
      idParaRevertir = data.id_postulante || data.id;

      console.log("Postulante creado temporalmente con ID:", idParaRevertir);

      // Extraer el ID del expediente para el siguiente paso
      const idExpedienteGenerado = typeof data.id_expediente === 'object'
        ? data.id_expediente.id
        : data.id_expediente;

      // Si no hay ID de expediente, forzamos el error para ir al catch de reversión
      if (!idExpedienteGenerado) {
        throw new Error("No se generó el expediente en la respuesta del servidor.");
      }

      // 2. Intentar crear el Estudio
      try {
        await crearEstudio({
          id_expediente: idExpedienteGenerado,
          nivel_escolar_inicial: form.nivel_escolar_inicial,
          grado_escolar_inicial: form.grado_escolar_inicial,
          estatus_estudio: "En revision"
        });
      } catch (estudioErr) {
        console.error("Fallo en Estudio. Iniciando borrado de emergencia...");

        // SI FALLA EL ESTUDIO, BORRAMOS EL POSTULANTE
        if (idParaRevertir) {
          try {
            await postulantesService.eliminarPostulante(idParaRevertir);
            console.log("Reversión exitosa: Postulante eliminado.");
          } catch (deleteErr) {
            console.error("ERROR CRÍTICO: No se pudo revertir el cambio.", deleteErr);
          }
        }

        // Propagamos el error original del estudio para que lo vea el usuario
        throw new Error(estudioErr.message || "Error al crear el historial académico.");
      }

      // Éxito Total
      setResultModal({
        open: true,
        type: "success",
        title: "¡Registro Completo!",
        message: `Postulante registrado correctamente.`
      });

    } catch (err) {
      console.error("Error en el proceso:", err);
      setError(err.message);
      setResultModal({
        open: true,
        type: "error",
        title: "Error en el registro",
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFinalClose = () => {
    if (resultModal.type === "success") {
      onSuccess?.();
      onClose();
    }
    setResultModal(prev => ({ ...prev, open: false }));
  };

  return {
    form, setForm, error, loading, showConfirm, setShowConfirm,
    resultModal, handlePreSubmit, handleConfirmSave, handleFinalClose
  };
};