import { useState, useMemo } from "react";
import { usePostulante } from "./usePostulantes";

export const useExpedienteData = (id) => {
  const [tab, setTab] = useState("generales");

  const {
    data: postulante,
    isLoading: loadingPostulante,
  } = usePostulante(id);

  const loading = loadingPostulante;

  // -------------------------
  // BASE
  // -------------------------
  const expediente = postulante?.expediente;

  const familia = expediente?.familia || [];
  const fotografias = expediente?.fotografias || [];

  const tutor = familia.find(
    (f) => f.es_tutor_principal
  );

  // -------------------------
  // ESTUDIO (YA VIENE EN POSTULANTE)
  // -------------------------
  const estudio = postulante?.estudio;
  const gastos = postulante?.estudio?.gastos || [];

  // -------------------------
  // VISITA (YA VIENE EN POSTULANTE)
  // -------------------------
  const visitasFiltradas = postulante?.visita
    ? [postulante.visita]
    : [];

  // -------------------------
  // DATA UNIFICADA
  // -------------------------
  const data = useMemo(() => ({
    nombre: expediente?.nombre,
    apellido_p: expediente?.apellido_p,
    apellido_m: expediente?.apellido_m,
    genero: expediente?.genero,
    correo: expediente?.correo,
    telefono: expediente?.telefono,
    fecha_nacimiento: expediente?.fecha_nacimiento,

    cp: expediente?.direccion?.geografia?.codigo_postal,
    municipio: expediente?.direccion?.geografia?.municipio,
    colonia: expediente?.direccion?.geografia?.colonia,
    calle: expediente?.direccion?.calle,
    numero: expediente?.direccion?.numero,

    familia,
    fotografias,
    gastos,

    id_expediente: expediente?.id_expediente,
    id_direccion: expediente?.direccion?.id_direccion,

    id_postulante: postulante?.id_postulante,
    estatus_postulante: postulante?.estatus,

    tutor_nombre: tutor
      ? `${tutor.nombre} ${tutor.apellido_p} ${tutor.apellido_m || ""}`
      : "--",

    // estudio
    id_estudio: estudio?.id_estudio,
    link_documento: estudio?.link_documento,
    nivel_escolar_inicial: estudio?.nivel_escolar_inicial,
    estatus_estudio: estudio?.estatus_estudio,
    prioridad_servicio: estudio?.prioridad_servicio,
    nota_servicio: estudio?.nota_servicio,
    grado_escolar_inicial: estudio?.grado_escolar_inicial,
    referencia_casa: estudio?.referencia_casa,
    referencia_ingreso: estudio?.referencia_ingreso,
  }), [
    expediente,
    familia,
    fotografias,
    postulante,
    tutor,
    estudio,
  ]);

  // -------------------------
  // ESTATUS UI
  // -------------------------
  const estatusInfo = useMemo(() => {
    const estatus =
      data?.estatus_postulante?.toLowerCase();

    switch (estatus) {
      case "aceptado":
        return {
          text: "Aceptado",
          className: "bg-green-100 text-green-600",
        };
      case "rechazado":
        return {
          text: "Rechazado",
          className: "bg-red-100 text-red-600",
        };
      case "en revisión":
        return {
          text: "En Revisión",
          className: "bg-amber-100 text-amber-600",
        };
      default:
        return {
          text: "Pendiente",
          className: "bg-slate-100 text-slate-500",
        };
    }
  }, [data?.estatus_postulante]);

  // -------------------------
  // EDAD
  // -------------------------
  const edad = useMemo(() => {
    if (!data?.fecha_nacimiento) return "--";

    const hoy = new Date();
    const cumple = new Date(data.fecha_nacimiento);

    let edad = hoy.getFullYear() - cumple.getFullYear();

    const m = hoy.getMonth() - cumple.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
      edad--;
    }

    return edad;
  }, [data?.fecha_nacimiento]);

  return {
    data,
    loading,
    tab,
    setTab,
    visitasFiltradas,
    estatusInfo,
    edad,
  };
};