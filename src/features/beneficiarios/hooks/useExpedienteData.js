import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { obtenerExpedientePorId, } from "../../expedientes/services/expedientesService";
import { obtenerBeneficiarioId } from "../services/beneficiariosService";
import { obtenerEstudios } from "../../postulantes/services/estudiosService";
import { obtenerVisitas } from "../../postulantes/services/visitasService";
import { calcularEdad } from "../../../utils/formatters";
import { useBeneficiario } from "./useBeneficiarios";
import { useVisitas } from "../../postulantes/hooks/useVisitas";
import { useExpediente } from "../../expedientes/hooks/useExpedientes";
import { useEstudios } from "../../postulantes/hooks/useEstudios";
const mapExpedienteData = ({expediente,beneficiario,estudio,visitas }) => {

  const familia = expediente?.familia ?? [];
  const fotografias = expediente?.fotografias ?? [];
  const tutor = familia.find(  (f) => f?.es_tutor_principal);
  return {
    ...expediente,

    direccion: {
      cp: expediente?.direccion?.geografia?.cp ?? "--",
      municipio: expediente?.direccion?.geografia?.municipio ?? "--",
      calle: expediente?.direccion?.calle ?? "--",
      numero: expediente?.direccion?.numero ?? "--",
      colonia: expediente?.id_direccion?.geografia?.colonia ?? "--",
    },

    familia,

    fotografias,

    visitas,

    tutor_nombre: tutor ? `${tutor.nombre} ${tutor.apellido_p} ${tutor.apellido_m || ""}`.trim(): "--",
    tutor_telefono: tutor?.telefono ?? "--",

    id_beneficiario:beneficiario?.id_beneficiario ??null,
    estatus_beneficiario: beneficiario?.estatus_beneficiario ?? beneficiario?.estatus ?? beneficiario?.estado ?? null,
    fecha_ingreso: beneficiario?.fecha_ingreso ?? "--",
    nota: beneficiario?.notas ?? "--",

    id_estudio: estudio?.id_estudio ?? null,
    fecha_realizacion: estudio?.fecha_realizacion ?? "--",

    estatus_estudio: estudio?.estatus_estudio ?? "--",
    nota_servicio: estudio?.nota_servicio ?? "--",
    prioridad_servicio: estudio?.prioridad_servicio ?? "--",
    link_documento: estudio?.link_documento ?? null,
    nivel_escolar_inicial: estudio?.nivel_escolar_inicial ?? "--",
    grado_escolar_inicial: estudio?.grado_escolar_inicial ?? "--",
    referencia_casa: estudio?.referencia_casa ?? "--",
    referencia_ingreso: estudio?.referencia_ingreso ?? "--",
  };
};
export const useExpedienteData = (id) => {
  const [tab, setTab] = useState("generales");

  // 1. Beneficiario
  const { data: beneficiario, isLoading: loadingBeneficiario } =
    useBeneficiario(id);
  console.log(beneficiario)

  // 2. Expediente
  const expedienteId = beneficiario?.expediente_resumen?.id_expediente;

  const { data: expediente, isLoading: loadingExpediente } =
    useExpediente(expedienteId);

  // 3. Estudios
  const { data: estudiosData } = useEstudios();

  const estudio = useMemo(() => {
    if (!estudiosData || !expediente?.id_expediente) return null;

    const lista = Array.isArray(estudiosData)
      ? estudiosData
      : estudiosData?.results ?? [];

    return lista.find(
      (e) => String(e.id_expediente) === String(expediente.id_expediente)
    );
  }, [estudiosData, expediente]);

  // 4. Visitas
  const { data: visitasData } = useVisitas();

  const visitas = useMemo(() => {
    if (!visitasData) return [];

    const lista = Array.isArray(visitasData)
      ? visitasData
      : visitasData?.results ?? [];

    return lista.filter((v) => String(v.id_postulante) === String(id));
  }, [visitasData, id]);

  // Loading global
  const isLoading = loadingBeneficiario || loadingExpediente;

  // Map final
  const data = useMemo(() => {
    if (!expediente || !beneficiario) return null;

    return mapExpedienteData({
      expediente,
      beneficiario,
      estudio,
      visitas,
    });
  }, [expediente, beneficiario, estudio, visitas]);

  return {
    data,
    loading: isLoading,
    tab,
    setTab,
  };
};