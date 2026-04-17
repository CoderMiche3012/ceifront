import { useState, useEffect } from "react";
import { postulantesService } from "../../services/postulantesService";
import { obtenerExpediente } from "../../services/expedientesService";
import { obtenerEstudios } from "../../services/estudiosService";
import { obtenerVisita } from "../../services/visitasService";

/**
 * para gestionar la logica del expediente de un postulante
 * @param {string} id - ID del postulante 
 */
export const useExpedienteData = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visitas, setVisitas] = useState([]);
  const [tab, setTab] = useState("generales");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        //peticiones concurrentes para optimizar tiempo de carga
        const [postulante, expedientes, estudio, visitasData] = await Promise.all([
          postulantesService.obtenerPostulantePorId(id),
          obtenerExpediente(),
          obtenerEstudios(),
          obtenerVisita(),
        ]);
        //Visitas
        const listaVisitas = Array.isArray(visitasData) ? visitasData : visitasData.results || [];
        setVisitas(listaVisitas);
        //Listas
        const listaExp = Array.isArray(expedientes) ? expedientes : expedientes.results || [];
        const listaEstudios = Array.isArray(estudio) ? estudio : estudio.results || [];
        //busqueda de relaciones
        const expediente = listaExp.find(
          (e) =>
            String(e.id_expediente) ===
            String(postulante.id_expediente?.id_expediente || postulante.id_expediente)
        );
        const estudioExpediente = listaEstudios.find(
          (e) => String(e.id_expediente) === String(expediente?.id_expediente)
        );
        const familia = expediente?.familia || postulante.id_expediente?.familia || [];
        const tutor = familia.find((f) => f.es_tutor_principal);

        //estructura de datos
        setData({
          nombre: expediente?.nombre,
          genero: postulante.id_expediente?.genero,
          apellido_p: expediente?.apellido_p,
          apellido_m: expediente?.apellido_m,
          correo: postulante.id_expediente?.correo,
          telefono: postulante.id_expediente?.telefono,
          fecha_nacimiento: postulante.id_expediente?.fecha_nacimiento,
          cp: postulante.id_expediente?.id_direccion?.cp,
          municipio: postulante.id_expediente?.id_direccion?.municipio,
          calle: postulante.id_expediente?.id_direccion?.calle,
          numero: postulante.id_expediente?.id_direccion?.numero,
          colonia: postulante.id_expediente?.id_direccion?.colonia,
          nivel_escolar_inicial: estudioExpediente?.nivel_escolar_inicial,
          id_estudio: estudioExpediente?.id_estudio,
          estatus_estudio: estudioExpediente?.estatus_estudio,
          prioridad_servicio: estudioExpediente?.prioridad_servicio,
          nota_servicio: estudioExpediente?.nota_servicio,
          grado_escolar_inicial: estudioExpediente?.grado_escolar_inicial,
          referencia_casa: estudioExpediente?.referencia_casa,
          referencia_ingreso: estudioExpediente?.referencia_ingreso,
          postulante: postulante.estatus,
          familia: familia,
          estatus_postulante: postulante.estatus || postulante.estado || postulante.estatus_postulante,
          id_expediente: expediente?.id_expediente,
          id_direccion: postulante.id_expediente?.id_direccion?.id_direccion,
          id_postulante: postulante.id_postulante,
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

  //filtra las visitas que pertenecen a este postulante
  const visitasFiltradas = visitas.filter((v) => String(v.id_postulante) === String(id));
  //retorna el color y texto segun el estatus del postulante.
  const getEstatusInfo = () => {
    const estatus = data?.estatus_postulante?.toLowerCase();
    switch (estatus) {
      case "aceptado":
        return { text: "Aceptado", className: "bg-green-100 text-green-600" };
      case "rechazado":
        return { text: "Rechazado", className: "bg-red-100 text-red-600" };
      case "en revisión":
        return { text: "En Revisión", className: "bg-amber-100 text-amber-600" };
      case "espera":
        return { text: "En Espera", className: "bg-teal-100 text-teal-600" };
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
    visitasFiltradas,
    estatusInfo: getEstatusInfo(),
    edad: calcularEdad(data?.fecha_nacimiento),
  };
};