import { useState, useEffect } from "react";
import { postulantesService } from "../../services/postulantesService";

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
    id_expediente: {
      nombre: "",
      apellido_p: "",
      apellido_m: "", // Opcional
      fecha_nacimiento: "",
      telefono: "",
      genero: "",
      correo: "",
      nota_situacion_familiar: "Registro manual desde panel",
      id_direccion: {
        calle: "",
        numero: "", // Opcional
        colonia: "",
        municipio: "",
        cp: ""
      }
    }
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const userId = user.id_usuario || user.id;
        if (userId) setForm(prev => ({ ...prev, id_usuario: userId }));
      } catch (e) { console.error("Error user:", e); }
    }
  }, []);

  const handlePreSubmit = (e) => {
    if (e) e.preventDefault();
    setError(null);

    const { nombre, apellido_p,apellido_m, correo, fecha_nacimiento, genero } = form.id_expediente;
    const { calle, municipio, cp,numero} = form.id_expediente.id_direccion;

    // Validación: Apellido Materno y Número NO están en esta lista
    if (!nombre || !apellido_p || !apellido_m || !correo || !fecha_nacimiento || !genero || !calle || !municipio || !cp|| !numero) {
      setError("Por favor, completa todos los campos obligatorios.");
      // Scroll al inicio del modal para ver el error
      const scrollContainer = document.querySelector(".custom-scrollbar");
      if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      await postulantesService.crearPostulante(form);
      setResultModal({
        open: true,
        type: "success",
        title: "¡Éxito!",
        message: `Postulante ${form.id_expediente.nombre} registrado.`
      });
    } catch (err) {
      setError(err.message);
      setResultModal({
        open: true,
        type: "error",
        title: "Error",
        message: err.message
      });
    } finally { setLoading(false); }
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