import { useState, useEffect } from "react";
import { postulantesService } from "../../services/postulantesService";
import { crearEstudio } from "../../services/estudiosService";
import { crearFamilia } from "../../services/familiaService"; // <--- Importamos tu nuevo servicio

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
      },
      // Iniciamos con el primer integrante (Tutor obligatorio)
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
      } catch (e) { console.error("Error cargando user:", e); }
    }
  }, []);

  const handlePreSubmit = (e) => {
    if (e) e.preventDefault();
    setError(null);

    const { nombre, apellido_p, correo, fecha_nacimiento, genero, familia } = form.id_expediente;
    const { calle, municipio, cp } = form.id_expediente.id_direccion;
    
    // Validación del Tutor (Primer elemento del array)
    const tutor = familia[0];

    if (!nombre || !apellido_p || !correo || !fecha_nacimiento || !genero || !calle || !municipio || !cp || !form.nivel_escolar_inicial) {
      setError("Por favor, completa todos los campos obligatorios del postulante.");
      return;
    }

    // El primer familiar DEBE tener datos básicos
    if (!tutor.nombre || !tutor.apellido_p || !tutor.parentesco) {
      setError("Los datos del Tutor Principal son obligatorios (Primer familiar).");
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);
    setLoading(true);
    setError(null);

    let idPostulanteParaRevertir = null;

    try {
      // 1. Crear Postulante (Genera Expediente y Dirección)
      const resPostulante = await postulantesService.crearPostulante(form);
      const dataPostulante = resPostulante.data || resPostulante;
      idPostulanteParaRevertir = dataPostulante.id_postulante || dataPostulante.id;

      // Extraer ID del expediente
      const idExpedienteGenerado = dataPostulante.id_expediente?.id_expediente || dataPostulante.id_expediente;

      if (!idExpedienteGenerado) throw new Error("Error: No se recibió el ID del expediente.");

      // 2. Registrar cada familiar usando tu nuevo servicio 'crearFamilia'
      try {
        const promesasFamilia = form.id_expediente.familia.map(integrante => 
          crearFamilia({
            ...integrante,
            id_expediente: idExpedienteGenerado
          })
        );
        await Promise.all(promesasFamilia);
      } catch (fErr) {
        throw new Error(`Error en datos familiares: ${fErr.message}`);
      }

      // 3. Crear Historial Académico (Estudio)
      await crearEstudio({
        id_expediente: idExpedienteGenerado,
        nivel_escolar_inicial: form.nivel_escolar_inicial,
        grado_escolar_inicial: form.grado_escolar_inicial,
        estatus_estudio: "En revision"
      });

      setResultModal({
        open: true, type: "success", title: "¡Éxito!",
        message: "Se ha registrado al postulante y su familia correctamente."
      });

    } catch (err) {
      console.error(err);
      
      // BORRADO DE EMERGENCIA si algo falló después de crear el postulante
      if (idPostulanteParaRevertir) {
        try { await postulantesService.eliminarPostulante(idPostulanteParaRevertir); } 
        catch (e) { console.error("No se pudo revertir el registro."); }
      }

      setError(err.message);
      setResultModal({
        open: true, type: "error", title: "Error en el proceso",
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