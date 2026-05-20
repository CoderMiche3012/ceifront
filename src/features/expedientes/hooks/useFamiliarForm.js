import { useState, useRef } from "react";
import { crearFamilia } from "../services/familiaService";

export const useFamiliarForm = (
  expedienteId,
  onCreated,
  onClose,
  setResultadoModal
) => {
  const initialState = {
    nombre: "",
    apellido_p: "",
    apellido_m: "",
    parentesco: "",
    edad: "",
    telefono: "",
    actividad_principal: "",
    area_laboral_escuela: "",
    salario: "",
    vive_en_casa: "",
    es_tutor_principal: false,
    id_expediente: expedienteId
  };

  const [formData, setFormData] = useState(initialState);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const fieldRefs = useRef({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === "checkbox" ? checked : value;
    if (name === "telefono") val = value.replace(/\D/g, "").slice(0, 10);
    setFormData(prev => ({ ...prev, [name]: val }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: "" }));
    if (generalError) setGeneralError("");
  };

  const validate = () => {
    const required = [
      "nombre",
      "apellido_p",
      "parentesco",
      "edad",
      "telefono",
      "actividad_principal",
      "salario",
      "vive_en_casa"
    ];

    const faltantes = required.filter(
      field => !formData[field] || formData[field].toString().trim() === ""
    );

    if (faltantes.length > 0) {
      setGeneralError("Faltan campos obligatorios por completar");
      return false;
    }

    if (formData.telefono && formData.telefono.length !== 10) {
      setGeneralError("El teléfono debe tener exactamente 10 dígitos");
      return false;
    }

    setGeneralError("");
    return true;
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    setLoading(true);
    try {
      const dataFinal = {
        ...formData,
        edad: Number(formData.edad),
        vive_en_casa: formData.vive_en_casa === "true",
      };
      const res = await crearFamilia(dataFinal);
      onCreated(res);
      setFormData(initialState);

      setResultadoModal({
        open: true,
        type: "success",
        title: "Registro exitoso",
        message: "El familiar fue agregado correctamente."
      });
    } catch (error) {
      setResultadoModal({
        open: true,
        type: "error",
        title: "Error al guardar",
        message: error.message || "No se pudo guardar el familiar."
      });
      if (error.response?.data) {
        const backendErrors = {};
        Object.entries(error.response.data).forEach(([key, val]) => {
          backendErrors[key] = Array.isArray(val) ? val[0] : val;
        });
        setFieldErrors(backendErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData, handleChange, handleConfirm, validate,
    confirmOpen, setConfirmOpen, loading, fieldErrors,
    generalError, setGeneralError, fieldRefs
  };
};