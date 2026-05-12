import { GraduationCap, PencilLine, FileText, Star, PlusCircle,} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { obtenerSeguimiento } from "../../../../../services/seguimientoService";
import ResumenEscolar from "./ResumenEscolar";
import ModalDatosEscolares from "./ModalDatosEscolares";
import ModalBoleta from "./ModalBoleta";

export default function DetalleSeguimiento({ idSeguimiento }) {
  const [openModal, setOpenModal] = useState(false);
  const [openBoleta, setOpenBoleta] = useState(false);
  const [boletaSeleccionada, setBoletaSeleccionada] = useState(null);
  const [indexPeriodo, setIndexPeriodo] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["seguimiento", idSeguimiento],
    queryFn: () => obtenerSeguimiento(idSeguimiento),
    enabled: !!idSeguimiento,
  });

  if (isLoading) {
    return <p className="text-sm text-slate-500">Cargando detalle...</p>;
  }

  const escolar = data?.datos_escolares;
  const grado = escolar?.id_escolaridad || null;
  const institucion = escolar?.id_institucion || null;
  const boletas = escolar?.boletas || [];
  //periodos
  const generarPeriodos = (periodicidad) => {
    if (!periodicidad) return [];

    const p = periodicidad.toUpperCase().trim();

    switch (p) {
      case "SEMESTRAL":
        return ["Semestre 1", "Semestre 2"];
      case "CUATRIMESTRAL":
        return ["Cuatrimestre 1", "Cuatrimestre 2", "Cuatrimestre 3"];
      case "TRIMESTRAL":
        return ["Trimestre 1", "Trimestre 2", "Trimestre 3", "Trimestre 4"];
      case "ANUAL":
        return ["Anual"];
      default:
        return [];
    }
  };

  const periodos = generarPeriodos(
    escolar?.periodicidad || escolar?.modalidad_educativa
  );

  const getBoleta = (periodo) =>
    boletas.find((b) => b.periodo_boleta === periodo);

  const periodoActual = periodos[indexPeriodo];
  const boleta = getBoleta(periodoActual);

  //promedio
  const promedioGeneral =
    boletas.length > 0
      ? (
        boletas.reduce(
          (acc, b) => acc + Number(b.promedio_boleta),
          0
        ) / boletas.length
      ).toFixed(2)
      : "--";

  return (
    <>
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">

          <div className="flex items-center justify-between mb-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <GraduationCap className="w-4 h-4 text-teal-600" />
              Información Escolar
            </h3>

            <button
              onClick={() => setOpenModal(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-teal-600"
            >
              <PencilLine className="w-4 h-4" />
              {escolar ? "Editar" : "Agregar"}
            </button>
          </div>

          {!escolar ? (
            <p className="text-slate-400 text-sm">
              No hay datos escolares registrados
            </p>
          ) : (
            <ResumenEscolar
              escolar={escolar}
              grado={grado}
              institucion={institucion}
              promedioGeneral={promedioGeneral}
            />
          )}
        </div>
        <div className="lg:col-span-1 rounded-2xl bg-white p-5 shadow-sm border border-slate-200">

          {!escolar || periodos.length === 0 ? (
            <p className="text-slate-400 text-sm">
              No hay periodos disponibles
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-800">
                  {periodoActual}
                </h4>

                <div className="flex items-center gap-2 text-sm">
                  <button
                    disabled={indexPeriodo === 0}
                    onClick={() => setIndexPeriodo((i) => i - 1)}
                    className="px-2 py-1 border rounded disabled:opacity-40"
                  >
                    ←
                  </button>

                  <span className="text-slate-500 text-xs">
                    {indexPeriodo + 1} de {periodos.length}
                  </span>

                  <button
                    disabled={indexPeriodo === periodos.length - 1}
                    onClick={() => setIndexPeriodo((i) => i + 1)}
                    className="px-2 py-1 border rounded disabled:opacity-40"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm mb-3">
                <span>Calificación:</span>
                <span className="font-semibold">
                  {boleta?.promedio_boleta ?? "Sin registrar"}
                </span>
              </div>
              {boleta?.link ? (
                <a
                  href={boleta.link}
                  target="_blank"
                  className="flex items-center gap-2 text-teal-600 text-sm mb-3"
                >
                  <FileText className="w-4 h-4" />
                  Ver boleta
                </a>
              ) : (
                <div className="border-dashed border rounded-lg p-4 text-center text-sm text-slate-400 mb-3">
                  Sin documento de boleta
                </div>
              )}
              <button
                onClick={() => {
                  setBoletaSeleccionada({
                    ...boleta,
                    periodo_boleta: periodoActual,
                    tipo_boleta: escolar?.periodicidad,
                    id_datos_escolares: escolar?.id_datos_escolares,
                  });
                  setOpenBoleta(true);
                }}
                className="w-full flex items-center justify-center gap-2 text-sm text-teal-600 border rounded-lg py-2 hover:bg-teal-50"
              >
                {boleta ? (
                  <>
                    <PencilLine className="w-4 h-4" />
                    Editar boleta
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    Agregar calificación
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <ModalDatosEscolares
        open={openModal}
        onClose={() => setOpenModal(false)}
        id_seguimiento={idSeguimiento}
        datosIniciales={escolar}
      />

      <ModalBoleta
        open={openBoleta}
        onClose={() => setOpenBoleta(false)}
        boleta={boletaSeleccionada}
      />
    </>
  );
}
