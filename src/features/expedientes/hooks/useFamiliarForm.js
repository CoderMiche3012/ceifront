import { useState, useRef } from "react";
import { crearFamilia } from "../services/familiaService";

export const useFamiliarForm = (expedienteId, onCreated, onClose) => {
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
  };

  const validate = () => {
    const required = ["nombre", "apellido_p", "parentesco", "edad", "telefono", "actividad_principal", "salario", "vive_en_casa"];
    const errors = {};
    required.forEach(field => {
      if (!formData[field] || formData[field] === "") {
        errors[field] = "Este campo es obligatorio";
      }
    });
    if (formData.telefono && formData.telefono.length < 10) {
      errors.telefono = "Debe tener 10 dígitos";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setGeneralError("Por favor, revisa los campos marcados.");
      const firstError = Object.keys(errors)[0];
      fieldRefs.current[firstError]?.focus();
      return false;
    }
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
      onClose();
    } catch (error) {
      setGeneralError(error.message || "Error al guardar");
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