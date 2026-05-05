import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {crearBeneficiario,eliminarBeneficiario, } from "../../services/beneficiariosService";
import {crearExpediente,eliminarExpediente,} from "../../services/expedientesService";

const getErrorMessage = (err) =>
  err?.response?.data?.message ||
  err?.message ||
  "Error inesperado";
const initialForm = {
  fecha_ingreso: new Date().toISOString().split("T")[0],
  id_usuario: null,
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
      cp: "",
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
        salario: 0,
        vive_en_casa: true,
        telefono: "",
        es_tutor_principal: true,
      },
    ],
  },
};

export const useBeneficiarioCrearForm = (onSuccess, onClose) => {
  const queryClient = useQueryClient();
  const isSubmitting = useRef(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resultModal, setResultModal] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return;

    try {
      const user = JSON.parse(raw);
      const id_usuario = user?.id_usuario || user?.id;

      if (id_usuario) {
        setForm((prev) => ({
          ...prev,
          id_usuario,
        }));
      }
    } catch (e) {
      console.error("Error parsing user:", e);
    }
  }, []);

  const mutation = useMutation({
    mutationFn: async (formData) => {
      let idExpediente = null;
      let idBeneficiario = null;
      try {
        //crear expediente
        const resExp = await crearExpediente(formData.id_expediente);
        const expediente = resExp?.data || resExp;
        idExpediente = expediente?.id_expediente;
        if (!idExpediente) {
          throw new Error("No se generó el ID del expediente");
        }
        //crear beneficiario
        const resBen = await crearBeneficiario({
          id_expediente: idExpediente,
          fecha_ingreso: formData.fecha_ingreso,
          notas: "Registro inicial",
          estatus: "Activo",
        });
        const beneficiario = resBen?.data || resBen;
        idBeneficiario = beneficiario?.id_beneficiario;
        return beneficiario;
      } catch (error) {
        try {
          if (idBeneficiario && eliminarBeneficiario) {
            await eliminarBeneficiario(idBeneficiario);
          }

          if (idExpediente) {
            await eliminarExpediente(idExpediente);
          }
        } catch (rollbackError) {
          console.error("Rollback falló:", rollbackError);
        }

        throw error;
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["beneficiarios"],
      });

      setResultModal({
        open: true,
        type: "success",
        title: "Registro exitoso",
        message: "Beneficiario y expediente creados correctamente",
      });
    },

    onError: (err) => {
      setResultModal({
        open: true,
        type: "error",
        title: "Error",
        message: getErrorMessage(err),
      });
    },

    onSettled: () => {
      isSubmitting.current = false;
    },
  });
  //validacion
  const validateForm = () => {
    const f = form.id_expediente;
    const dir = f.id_direccion;
    const tutor = f.familia?.[0];

    if (!f.nombre || !f.apellido_p || !f.fecha_nacimiento) {
      return "Faltan datos personales obligatorios";
    }

    if (!dir.calle || !dir.municipio) {
      return "Faltan datos de dirección";
    }

    if (!tutor?.nombre || !tutor?.parentesco) {
      return "Faltan datos del tutor principal";
    }

    return null;
  };

  const handlePreSubmit = (e) => {
    e?.preventDefault();

    const errorValidation = validateForm();
    if (errorValidation) {
      setError(errorValidation);
      return;
    }

    setError(null);
    setShowConfirm(true);
  };

  const handleConfirmSave = () => {
    if (isSubmitting.current) return;

    isSubmitting.current = true;
    setShowConfirm(false);

    mutation.mutate(form);
  };

  const handleFinalClose = () => {
    if (resultModal.type === "success") {
      onSuccess?.();
      onClose?.();
    }

    setResultModal((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return {
    form,
    setForm,
    error,
    loading: mutation.isPending,
    showConfirm,
    setShowConfirm,
    resultModal,
    handlePreSubmit,
    handleConfirmSave,
    handleFinalClose,
  };
};