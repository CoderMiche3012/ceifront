import { useState, useEffect } from "react";
import { obtenerExpediente } from "../../services/expedientesService";
import { obtenerVisita } from "../../services/visitasService";
import { obtenerBeneficiario } from "../../services/beneficiariosService";

/**
 * para gestionar la logica del expediente de un beneficiario
 * @param {string} id - ID del beneficiario 
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
        const [beneficiario, expedientes] = await Promise.all([
          obtenerExpediente(),
          obtenerBeneficiario(),
        ]);
        //Listas
        const listaExp = Array.isArray(expedientes) ? expedientes : expedientes.results || [];
        const listaBeneficiarios = Array.isArray(beneficiario) ? beneficiario : beneficiario.results || [];
        //busqueda de relaciones
        const expediente = listaExp.find(
          (e) =>
            String(e.id_expediente) ===
            String(beneficiario.id_expediente?.id_expediente || beneficiario.id_expediente)
        );
        const familia = expediente?.familia || beneficiario.id_expediente?.familia || [];
        const tutor = familia.find((f) => f.es_tutor_principal);

        //estructura de datos
        setData({
          nombre: expediente?.nombre,
          genero: beneficiario.id_expediente?.genero,
          apellido_p: expediente?.apellido_p,
          apellido_m: expediente?.apellido_m,
          correo: beneficiario.id_expediente?.correo,
          telefono: beneficiario.id_expediente?.telefono,
          fecha_nacimiento: beneficiario.id_expediente?.fecha_nacimiento,
          cp: beneficiario.id_expediente?.id_direccion?.cp,
          municipio: beneficiario.id_expediente?.id_direccion?.municipio,
          calle: beneficiario.id_expediente?.id_direccion?.calle,
          numero: beneficiario.id_expediente?.id_direccion?.numero,
          colonia: beneficiario.id_expediente?.id_direccion?.colonia,
          familia: familia,
          estatus_beneficiario: beneficiario.estatus || beneficiario.estado || beneficiario.estatus_beneficiario,
          id_expediente: expediente?.id_expediente,
          id_direccion: beneficiario.id_expediente?.id_direccion?.id_direccion,
          id_beneficiario: beneficiario.id_beneficiario,
          tutor_nombre: tutor
            ? `${tutor.nombre} ${tutor.apellido_p} ${tutor.apellido_m || ""}`
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
      case "aceptado":
        return { text: "Aceptado", className: "bg-green-100 text-green-600" };
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