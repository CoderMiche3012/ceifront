import React, { useState, useMemo, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import EncabezadoPagina from "../components/shared/EncabezadoPagina";
import PaginacionTabla from "../components/tablas/PaginacionTabla";
import { useAsistenciaData } from "../features/asistencias/hooks/useAsistencias";
import AsistenciasFiltros from "../features/asistencias/components/AsistenciaFiltros";
import AsistenciasTabla from "../features/asistencias/components/AsistenciaTabla";
import { usePeriodoActivo } from "../features/periodos/hooks/usePeriodos";
import { generarSemanasLaborales } from "../utils/dateHelpers";
import ModalResultado from "../components/shared/ModalResultado";
import ModalConfirmacion from "../components/shared/ModalConfirmacion";


const AsistenciasPagina = () => {
  const { data: periodoActivo = null, isLoading: loadingActivo, error: errorActivo } = usePeriodoActivo();
  console.log("PERIODO ACTIVO:", periodoActivo);
  const periodoId = periodoActivo?.id_periodo;
  console.log("PERIODO ID:", periodoId);
  console.log(periodoActivo)
  const [cambios, setCambios] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const statsCambios = useMemo(() => {
    const lista = Object.values(cambios);
    const creados = lista.filter(c => !c.id_asistencia_servicio).length;
    const editados = lista.filter(c => c.id_asistencia_servicio).length;
    return { creados, editados, total: lista.length };
  }, [cambios]);

  //mensaje dinámico 
  const mensajeConfirmacion = useMemo(() => {
    const parts = [];
    if (statsCambios.creados > 0) parts.push(`agregar ${statsCambios.creados} nuevas asistencias`);
    if (statsCambios.editados > 0) parts.push(`modificar ${statsCambios.editados} asistencias existentes`);

    return `¿Estás seguro de que deseas ${parts.join(" y ")}?`;
  }, [statsCambios]);
  const onGuardarClick = () => setShowConfirm(true);
  const { data, isLoading, isError, mutation } =
    useAsistenciaData(periodoId);
  const confirmarGuardado = () => {
    const listaCambios = Object.values(cambios);

    if (!listaCambios.length) return;

    setShowConfirm(false);

    mutation.mutate(listaCambios, {
      onSuccess: () => {
        setCambios({});
        setShowResult(true);
      },
      onError: (err) => {
        console.error("ERROR GUARDANDO:", err);

      },
    });
  };



  const [search, setSearch] = useState("");
  const [pagina, setPagina] = useState(1);
  const registrosPorPagina = 10;

  const [filters, setFilters] = useState({
    servicio: "comedor",
  });

  const [fechaSeleccionada, setFechaSeleccionada] =
    useState(null);

  const limitesFecha = useMemo(() => {
    const hoy = new Date().toLocaleDateString("en-CA");
    const fin = periodoActivo?.fecha_fin;

    return {
      min: periodoActivo?.fecha_inicio,
      max: fin && fin < hoy ? fin : hoy,
    };
  }, [periodoActivo]);
  const semanas = useMemo(() => {
    const inicio = periodoActivo?.fecha_inicio;
    const fin = periodoActivo?.fecha_fin;

    if (!inicio || !fin) return [];

    return generarSemanasLaborales(inicio, fin);
  }, [periodoActivo]);

  useEffect(() => {
    if (!semanas.length || fechaSeleccionada) return;

    const hoy = new Date();

    const semanaActual = semanas.find((s) => {
      const inicio = new Date(s.inicio);
      const fin = new Date(s.fin);

      return hoy >= inicio && hoy <= fin;
    });

    setFechaSeleccionada(
      semanaActual?.inicio || semanas[0]?.inicio
    );
  }, [semanas, fechaSeleccionada]);
  const semanaActiva = useMemo(() => {
    if (!fechaSeleccionada || semanas.length === 0) return null;

    // Creamos una fecha para evaluar el día de la semana
    const fechaEvaluar = new Date(fechaSeleccionada + "T12:00:00");
    const diaSemana = fechaEvaluar.getDay(); // 0 = Domingo, 6 = Sábado
    let fechaBusqueda = fechaSeleccionada;

    // Si es Domingo se restan 2 días para caer en viernes
    // Si es Sábado se resta 1 día para caer en viernes
    if (diaSemana === 0) {
      const d = new Date(fechaEvaluar);
      d.setDate(d.getDate() - 2);
      fechaBusqueda = d.toLocaleDateString("en-CA");
    } else if (diaSemana === 6) {
      const d = new Date(fechaEvaluar);
      d.setDate(d.getDate() - 1);
      fechaBusqueda = d.toLocaleDateString("en-CA");
    }
    //se busca la semana que contiene la fechaBusqueda
    const encontrada = semanas.find((s) => {
      return fechaBusqueda >= s.inicio && fechaBusqueda <= s.fin;
    });

    return encontrada || semanas[0];
  }, [fechaSeleccionada, semanas]);

  const dias = useMemo(() => {
    if (!semanaActiva) return [];
    const lunes = new Date(semanaActiva.inicio + "T00:00:00");
    return Array.from({ length: 5 }).map((_, i) => {
      const d = new Date(lunes);
      d.setDate(lunes.getDate() + i);

      return {
        id: d.toLocaleDateString("en-CA"),
        label: d.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
        }).toUpperCase(),
      };
    });
  }, [semanaActiva]);

  const beneficiariosFiltrados = useMemo(() => {
    if (!data?.beneficiarios) return [];

    return data.beneficiarios.filter((b) => {
      const nombre = b.nombreCompleto?.toLowerCase() || "";
      return nombre.includes(search.toLowerCase());
    });
  }, [data, search]);

  const beneficiariosPaginados = useMemo(() => {
    const inicio =
      (pagina - 1) * registrosPorPagina;

    return beneficiariosFiltrados.slice(
      inicio,
      inicio + registrosPorPagina
    );
  }, [beneficiariosFiltrados, pagina]);

  const handleLocalChange = (payload) => {
    const key = `${payload.id_beneficiario}-${payload.fecha_realizacion}`;


    setCambios((prev) => {
      const existente = prev[key] || {};

      return {
        ...prev,
        [key]: {
          ...existente,
          ...payload,
          id_beneficiario: payload.id_beneficiario,
          fecha_realizacion: payload.fecha_realizacion,
          tipo_servicio: filters.servicio,
        },
      };
    });
  };

  const onGuardar = () => {
    const listaCambios = Object.values(cambios);
    mutation.mutate(listaCambios);
  };

  if (isLoading)
    if (semanas.length > 0 && !semanaActiva) {
      return (
        <div className="flex justify-center p-10">
          <Loader2 className="animate-spin" />
        </div>
      );
    }

  if (isError)
    return (
      <div className="flex justify-center p-10 text-red-500">
        <AlertCircle />
      </div>
    ); console.log("DIAS:", dias);

  return (
    <section className="space-y-6">

      <EncabezadoPagina
        titulo="Gestión de Asistencias"
        descripcion={
          periodoActivo?.periodoActivo
            ? `Control de asistencias de comedor y psicología del periodo ${periodoActivo.periodoActivo.nombre || ""} (${periodoActivo.periodoActivo.ciclo_escolar || ""})`
            : "Control de asistencias de comedor y psicología"
        }
      />

      <div className="bg-white rounded-2xl shadow-sm">
        <AsistenciasFiltros
          search={search}
          filters={filters}
          onSearchChange={(v) =>
            setSearch(v)
          }
          onFilterChange={(k, v) =>
            setFilters((p) => ({
              ...p,
              [k]: v,
            }))
          }
          onClearFilters={() => {
            setSearch("");
            setFilters({
              servicio: "comedor",
            });
          }}
          fechaSeleccionada={
            fechaSeleccionada
          }
          onFechaChange={
            setFechaSeleccionada
          }
          min={limitesFecha.min}
          max={limitesFecha.max}
        />

        <AsistenciasTabla
          beneficiarios={beneficiariosPaginados}
          dias={dias}
          cambios={cambios}
          filters={filters}
          seguimientoMap={data?.seguimientoMap || {}}
          onCambio={handleLocalChange}
          onGuardar={onGuardarClick}
          guardando={mutation.isPending}
          hayCambios={statsCambios.total > 0}
        />

        {statsCambios.total > 0 && (
          <div className="fixed bottom-10 right-10 z-50">
            <button
              onClick={onGuardarClick}
              disabled={mutation.isPending}
              className="bg-teal-600 text-white shadow-2xl px-8 py-4 rounded-full font-bold hover:bg-teal-700 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              {mutation.isPending ? <Loader2 className="animate-spin" /> : null}
              Guardar {statsCambios.total} cambios
            </button>
          </div>
        )}

        <PaginacionTabla
          currentPage={pagina}
          totalPages={Math.ceil(
            beneficiariosFiltrados.length /
            registrosPorPagina
          )}
          totalItems={
            beneficiariosFiltrados.length
          }
          pageSize={registrosPorPagina}
          onPageChange={setPagina}
        />
      </div>
      <ModalConfirmacion
        open={showConfirm}
        title="Confirmar Cambios"
        description={mensajeConfirmacion}
        confirmText="Sí, guardar"
        loading={mutation.isPending}
        onConfirm={confirmarGuardado}
        onClose={() => setShowConfirm(false)}
        color="teal"
      />
      <ModalResultado
        open={showResult}
        type="success"
        title="¡Guardado con éxito!"
        message="Las asistencias han sido actualizadas correctamente."
        onClose={() => setShowResult(false)}
      />
    </section>
  );
};

export default AsistenciasPagina;

