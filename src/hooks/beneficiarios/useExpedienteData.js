import { useState, useEffect } from "react";
import { obtenerExpediente } from "../../services/expedientesService";
import { obtenerVisita } from "../../services/visitasService";
import { obtenerBeneficiario } from "../../services/beneficiariosService";

/**
 * @param {string} idBeneficiario - ID del beneficiario (viene de la URL)
 */
export const useExpedienteData = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("generales");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        //peticiones concurrentes para optimizar tiempo de carga
        const [beneficiariosData, expedientes] = await Promise.all([
          obtenerBeneficiario(),
          obtenerExpediente(),
        ]);

        //Listas
        const listaExp = Array.isArray(expedientes) ? expedientes : expedientes.results || [];
        const listaBeneficiarios = Array.isArray(beneficiariosData) ? beneficiariosData : beneficiariosData.results || [];

        const beneficiario = listaBeneficiarios.find(
          (b) => String(b.id_beneficiario) === String(id)
        );

        //busqueda de relaciones
        const expediente = listaExp.find(
          (e) => String(e.id_expediente) === String(beneficiario.id_expediente)
        );
        const familia = expediente?.familia || beneficiariosData.id_expediente?.familia || [];
        const tutor = familia.find((f) => f.es_tutor_principal);



        //estructura de datos
        setData({
          nombre: expediente?.nombre,
          genero: expediente?.genero,
          apellido_p: expediente?.apellido_p,
          apellido_m: expediente?.apellido_m,
          correo: expediente?.correo,
          telefono: expediente?.telefono,
          fecha_nacimiento: expediente?.fecha_nacimiento,
          nota_situacion_familiar: expediente?.nota_situacion_familiar,
          cp: expediente?.id_direccion?.cp,
          municipio: expediente?.id_direccion?.municipio,
          calle: expediente?.id_direccion?.calle,
          numero: expediente?.id_direccion?.numero,
          colonia: expediente?.id_direccion?.colonia,
          familia: familia,
          estatus_beneficiario: beneficiario.estatus || beneficiario.estado || beneficiario.estatus_beneficiario,
          fecha_ingreso:beneficiario.fecha_ingreso,
          nota:beneficiario.notas,
          id_expediente: expediente?.id_expediente,
          id_direccion: expediente?.id_direccion?.id_direccion,
          id_beneficiario: beneficiario.id_beneficiario,
          tutor_nombre: tutor
            ? `${tutor.nombre} ${tutor.apellido_p} ${tutor.apellido_m || ""}`
            : "--",
          tutor_telefono: tutor
            ? `${tutor.telefono || ""}`
            : "--",
        });
      } catch (error) {
        console.error("Error cargando datos del expediente:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const getEstatusInfo = () => {
    const estatus = data?.estatus_beneficiario?.toLowerCase();
    switch (estatus) {
      case "activo":
        return { text: "Activo", className: "bg-green-100 text-green-600" };
      case "inactivo":
        return { text: "Inactivo", className: "bg-red-100 text-red-600" };
      default:
        return { text: "Sin estatus", className: "bg-slate-100 text-slate-500" };
    }
  };
  //calcula la edad en base a la fecha de nacimiento
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return "--";
    const hoy = new Date();
    const cumple = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const m = hoy.getMonth() - cumple.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
      edad--;
    }
    return edad;
  };
  return {
    data,
    setData,
    loading,
    tab,
    setTab,
    estatusInfo: getEstatusInfo(),
    edad: calcularEdad(data?.fecha_nacimiento),
  };
};