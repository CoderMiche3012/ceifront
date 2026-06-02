import { useMemo } from "react";
import { usePostulantes } from "../../postulantes/hooks/usePostulantes";
import { useVisitas } from "../../postulantes/hooks/useVisitas";

export function useReportePostulantes() {
    const { data: postulantes = [], isLoading: loadingPostulantes } = usePostulantes();
    const { data: visitasData, isLoading: loadingVisitas } = useVisitas();
    const visitas = Array.isArray(visitasData) ? visitasData : visitasData?.results || [];
    const data = useMemo(() => {
        return postulantes.map((postulante) => {
            const expediente = postulante?.id_expediente || {};
            const familia = expediente?.familia || [];
            const tutor = familia.find((f) => f.es_tutor_principal);
            const visita = visitas.find((v) => String(v.id_postulante) === String(postulante.id_postulante));
            const calcularEdad = (fechaNacimiento) => {

                if (!fechaNacimiento) return "--";

                const hoy = new Date();
                const nacimiento = new Date(fechaNacimiento);

                let edad = hoy.getFullYear() - nacimiento.getFullYear();

                const mes = hoy.getMonth() - nacimiento.getMonth();

                if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())
                ) {
                    edad--;
                }

                return edad;
            };
            console.log(expediente)
            return {
                id_postulante: postulante.id_postulante,
                nombre: expediente?.nombre || "",
                apellido_p: expediente?.apellido_p || "",
                apellido_m: expediente?.apellido_m || "",
                nombreCompleto: `${expediente?.nombre || ""} ${expediente?.apellido_p || ""} ${expediente?.apellido_m || ""}`.trim(),
                estatus: postulante?.estatus || "",
                prioridad: postulante?.prioridad || "Pendiente",
                edad: calcularEdad(expediente?.fecha_nacimiento),
                fechaNacimiento: expediente?.fecha_nacimiento || "",
                genero: expediente?.genero || "",
                telefono: expediente?.telefono || "",
                cp: expediente?.id_direccion?.cp || "",
                municipio: expediente?.id_direccion?.municipio || "",
                colonia: expediente?.id_direccion?.colonia || "",
                tutor: tutor ? `${tutor.nombre} ${tutor.apellido_p || ""}`.trim() : "--",
                telefonoTutor: tutor?.telefono || "--",
                familiares: familia.length,
                fechaVisita: visita?.estatus === "Cancelada" ? "Cancelada" : visita?.fecha_visita || "No programada",
            };
        });
    }, [postulantes, visitas]);

    return {
        data,
        loading: loadingPostulantes || loadingVisitas,
    };
}
