import { useMemo } from "react";
import { usePostulantes } from "../../postulantes/hooks/usePostulantes";

export function useReportePostulantes() {
    const { data: postulantes = [], isLoading } = usePostulantes();

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

    const data = useMemo(() => {
        return postulantes.map((postulante) => {
            const expediente = postulante?.expediente || {};
            const familia = expediente?.familia || [];
            const tutor = familia.find((f) => f.es_tutor_principal);
            const direccion = expediente?.direccion || {};
            const geografia = direccion?.geografia || {};
            const visita = postulante?.visita;
            const estudio = postulante?.estudio || {};
            return {
                id_postulante: postulante.id_postulante,
                nombre: expediente?.nombre || "",
                apellido_p: expediente?.apellido_p || "",
                apellido_m: expediente?.apellido_m || "",
                nombreCompleto: [
                    expediente?.nombre,
                    expediente?.apellido_p,
                    expediente?.apellido_m,
                ]
                    .filter(Boolean)
                    .join(" "),

                estatus: postulante?.estatus || "",
                prioridad: estudio?.prioridad_servicio || "Pendiente",
                edad: calcularEdad(expediente?.fecha_nacimiento),
                fechaNacimiento: expediente?.fecha_nacimiento || "",
                genero: expediente?.genero || "",
                telefono: expediente?.telefono || "",
                correo: expediente?.correo || "",
                cp: geografia?.codigo_postal || "",
                municipio: geografia?.municipio || "",
                colonia: geografia?.colonia || "",
                calle: direccion?.calle || "",
                numero: direccion?.numero || "",
                direccionCompleta: direccion?.calle
                    ? `${direccion.calle}, Col. ${geografia?.colonia || ""} #${direccion.numero || ""}`.trim()
                    : "Sin dirección",
                tutor: tutor
                    ? `${tutor.nombre} ${tutor.apellido_p || ""} ${tutor.apellido_m || ""}`.trim()
                    : "--",
                telefonoTutor: tutor?.telefono || "--",
                familiares: familia.length,
                fechaVisita: visita?.fecha_visita
                    ? new Date(visita.fecha_visita).toLocaleDateString("es-MX", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })
                    : "No programada",
                estadoVisita: visita?.estado_visita || "No programada",
                notaVisita: visita?.nota_visita || "",
                nota_familiar: expediente?.nota_situacion_familiar || "",
                referenciaIngreso: estudio?.referencia_ingreso || "",
                estatusEstudio: estudio?.estatus_estudio || "",
                nivelEscolar: estudio?.nivel_escolar_inicial || "",
                gradoEscolar: estudio?.grado_escolar_inicial || "",
                referenciaCasa: estudio?.referencia_casa || "",
                notaServicio: estudio?.nota_servicio || "",
                documentoEstudio: estudio?.link_documento || "",

                totalGastos:
                    estudio?.gastos?.reduce(
                        (acc, gasto) => acc + Number(gasto.monto || 0),
                        0
                    ) || 0,

                gastos: estudio?.gastos || [],
            };
        });
    }, [postulantes]);

    return {
        data,
        loading: isLoading,
    };
}

