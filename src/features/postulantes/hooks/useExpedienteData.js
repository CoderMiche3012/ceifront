import { useState, useMemo } from "react";

import { usePostulante } from "./usePostulantes";
import { useEstudios } from "./useEstudios";
import { useVisitas } from "./useVisitas";

export const useExpedienteData = (id) => {
  const [tab, setTab] = useState("generales");

  // queries
  const {
    data: postulante,
    isLoading: loadingPostulante,
  } = usePostulante(id);

  const {
    data: estudiosData,
    isLoading: loadingEstudios,
  } = useEstudios();

  const {
    data: visitasData,
    isLoading: loadingVisitas,
  } = useVisitas();

  // loading general
  const loading =
    loadingPostulante ||
    loadingEstudios ||
    loadingVisitas;

  // expediente
  const expediente = postulante?.id_expediente;

  // familia
  const familia = expediente?.familia || [];

  const fotografias = expediente?.fotografias || [];

  // tutor principal
  const tutor = familia.find(
    (f) => f.es_tutor_principal
  );

  // estudios
  const listaEstudios = Array.isArray(estudiosData)
    ? estudiosData
    : estudiosData?.results || [];

  const estudioExpediente = listaEstudios.find(
    (e) =>
      String(e.id_expediente) ===
      String(expediente?.id_expediente)
  );

  // visitas
  const listaVisitas = Array.isArray(visitasData)
    ? visitasData
    : visitasData?.results || [];

  const visitasFiltradas = listaVisitas.filter(
    (v) =>
      String(v.id_postulante) === String(id)
  );

  // data unificada
  const data = useMemo(() => ({
    nombre: expediente?.nombre,
    apellido_p: expediente?.apellido_p,
    apellido_m: expediente?.apellido_m,
    genero: expediente?.genero,
    correo: expediente?.correo,
    telefono: expediente?.telefono,
    fecha_nacimiento:
      expediente?.fecha_nacimiento,

    cp: expediente?.id_direccion?.cp,
    municipio:
      expediente?.id_direccion?.municipio,
    calle: expediente?.id_direccion?.calle,
    numero:
      expediente?.id_direccion?.numero,
    colonia:
      expediente?.id_direccion?.colonia,

    familia,
    fotografias,

    id_expediente:
      expediente?.id_expediente,

    id_direccion:
      expediente?.id_direccion
        ?.id_direccion,
    

    id_postulante:
      postulante?.id_postulante,

    estatus_postulante:
      postulante?.estatus,

    tutor_nombre: tutor
      ? `${tutor.nombre} ${tutor.apellido_p} ${
          tutor.apellido_m || ""
        }`
      : "--",

    // estudio
    id_estudio:
      estudioExpediente?.id_estudio,

    link_documento:
  estudioExpediente?.link_documento,

    nivel_escolar_inicial:
      estudioExpediente?.nivel_escolar_inicial,

    estatus_estudio:
      estudioExpediente?.estatus_estudio,

    prioridad_servicio:
      estudioExpediente?.prioridad_servicio,

    nota_servicio:
      estudioExpediente?.nota_servicio,

    grado_escolar_inicial:
      estudioExpediente?.grado_escolar_inicial,

    referencia_casa:
      estudioExpediente?.referencia_casa,

    referencia_ingreso:
      estudioExpediente?.referencia_ingreso,
  }), [
    expediente,
    familia,
    postulante,
    tutor,
    estudioExpediente,
  ]);

  // estatus UI
  const estatusInfo = useMemo(() => {
    const estatus =
      data?.estatus_postulante?.toLowerCase();

    switch (estatus) {
      case "aceptado":
        return {
          text: "Aceptado",
          className:
            "bg-green-100 text-green-600",
        };

      case "rechazado":
        return {
          text: "Rechazado",
          className:
            "bg-red-100 text-red-600",
        };

      case "en revisión":
        return {
          text: "En Revisión",
          className:
            "bg-amber-100 text-amber-600",
        };

      case "espera":
        return {
          text: "En Espera",
          className:
            "bg-teal-100 text-teal-600",
        };

      default:
        return {
          text: "Sin estatus",
          className:
            "bg-slate-100 text-slate-500",
        };
    }
  }, [data?.estatus_postulante]);

  // edad
  const edad = useMemo(() => {
    if (!data?.fecha_nacimiento)
      return "--";

    const hoy = new Date();

    const cumple = new Date(
      data.fecha_nacimiento
    );

    let edad =
      hoy.getFullYear() -
      cumple.getFullYear();

    const m =
      hoy.getMonth() -
      cumple.getMonth();

    if (
      m < 0 ||
      (m === 0 &&
        hoy.getDate() <
          cumple.getDate())
    ) {
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