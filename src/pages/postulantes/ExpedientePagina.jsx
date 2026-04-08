import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Calendar, Printer } from "lucide-react";
import AvatarGeneral from "../../components/shared/AvatarGeneral";
import { postulantesService } from "../../services/postulantesService";
import { obtenerExpediente } from "../../services/expedientesService";

export default function ExpedientePagina() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postulante = await postulantesService.obtenerPostulantePorId(id);
        const expedientes = await obtenerExpediente();

        const listaExp = Array.isArray(expedientes)
          ? expedientes
          : expedientes.results || [];

        const expediente = listaExp.find(
          (e) =>
            String(e.id_expediente) ===
            String(postulante.id_expediente?.id_expediente || postulante.id_expediente)
        );

        // 👇 obtener tutor igual que en tu hook
        const familia =
          expediente?.familia ||
          postulante.id_expediente?.familia ||
          [];

        const tutor = familia.find((f) => f.es_tutor_principal);

        setData({
          nombre: expediente?.nombre,
          apellido_p: expediente?.apellido_p,
          fecha_nacimiento: expediente?.fecha_nacimiento,
          tutor_nombre: tutor
            ? `${tutor.nombre} ${tutor.apellido_p} ${tutor.apellido_m || ""}`
            : "--",
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (!data) return <div>No encontrado</div>;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-slate-100 p-6 flex items-center justify-between">
        
        {/* IZQUIERDA */}
        <div className="flex items-center gap-4">
          
          <div className="relative">
            <AvatarGeneral
              nombre={data.nombre}
              apellidoP={data.apellido_p}
            />
            <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-teal-500 border-2 border-white"></div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-slate-800">
                {data.nombre} {data.apellido_p}
              </h2>

              <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-teal-100 text-teal-600">
                Estudio completo
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {calcularEdad(data.fecha_nacimiento)} años
              </span>

              <span>
                tutor: {data.tutor_nombre}
              </span>
            </div>
          </div>
        </div>

        {/* DERECHA */}
        <button className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-600 shadow hover:bg-slate-50">
          <Printer size={16} />
          Imprimir Expediente
        </button>

      </div>
    </section>
  );
}